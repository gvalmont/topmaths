import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { DataService } from '../services/data.service'

interface Ligne {
  niveau?: string,
  periode?: number,
  theme?: Theme,
  sousTheme?: Theme,
  reference?: string,
  titre?: string
}

interface Theme {
  nom: string,
  nbObjectifsParPeriode: number[]
}
@Component({
  selector: 'app-objectifs',
  templateUrl: './objectifs.component.html',
  styleUrls: []
})
export class ObjectifsComponent implements OnInit, OnDestroy {
  lignes: Ligne[]
  filtre: Ligne
  ongletActif: string
  texteRecherche: string
  navigationEventSubscription: Subscription
  dataMAJSubscription: Subscription

  // eslint-disable-next-line no-unused-vars
  constructor (private dataService: DataService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.lignes = []
    this.filtre = {}
    this.ongletActif = 'tout'
    this.texteRecherche = ''
    this.navigationEventSubscription = new Subscription
    this.dataMAJSubscription = new Subscription
    this.MAJOngletActif()
    this.surveillerLeChargementDesDonnees()
  }

  ngOnInit (): void {
    if (this.lesDonneesSontChargees()) this.MAJPage()
  }

  ngOnDestroy () {
    this.navigationEventSubscription.unsubscribe()
    this.dataMAJSubscription.unsubscribe()
  }

  surveillerLeChargementDesDonnees () {
    this.dataMAJSubscription = this.dataService.dataMAJ.subscribe(valeurModifiee => {
      if (valeurModifiee === 'niveauxObjectifs') {
        if (this.lesDonneesSontChargees()) this.MAJPage()
      }
    })
  }

  lesDonneesSontChargees () {
    return this.dataService.niveauxObjectifs.length > 0
  }

  MAJOngletActif () {
    this.activatedRoute.params.subscribe(params => {
      this.ongletActif = params.niveau
      this.filtre.niveau = params.niveau
      if (params.periode !== undefined) this.filtre.periode = Number(params.periode)
    })
  }

  MAJPage () {
    this.MAJFiltre()
    this.MAJLignes()
  }

  MAJFiltre () {
    this.activatedRoute.params.subscribe(params => {
      this.filtre.niveau = params.niveau
      this.filtre.theme = params.theme
      this.filtre.sousTheme = params.sousTheme
    })
  }

  MAJLignes () {
    this.lignes = []
    for (const niveau of this.dataService.niveauxObjectifs) {
      this.lignes.push({ niveau: niveau.nom })
      for (const theme of niveau.themes) {
        this.lignes.push({ niveau: niveau.nom, theme: { nom: theme.nom, nbObjectifsParPeriode: theme.nbObjectifsParPeriode } })
        for (const sousTheme of theme.sousThemes) {
          this.lignes.push({ niveau: niveau.nom, theme: { nom: theme.nom, nbObjectifsParPeriode: theme.nbObjectifsParPeriode }, sousTheme: { nom: sousTheme.nom, nbObjectifsParPeriode: sousTheme.nbObjectifsParPeriode } })
          for (const objectif of sousTheme.objectifs) {
            this.lignes.push({ niveau: niveau.nom, theme: { nom: theme.nom, nbObjectifsParPeriode: theme.nbObjectifsParPeriode }, sousTheme: { nom: sousTheme.nom, nbObjectifsParPeriode: sousTheme.nbObjectifsParPeriode }, reference: objectif.reference, titre: objectif.titre, periode: objectif.periode })
          }
        }
      }
      this.lignes.push({ niveau: 'fin' })
    }
  }

  clicFiltre (niveau: string, periode?: number) {
    if (niveau !== '') {
      this.ongletActif = niveau
      this.filtre.niveau = niveau
    }
    if (periode !== undefined) {
      this.filtre.periode === periode ? this.filtre.periode = 0 : this.filtre.periode = periode
    }
    window.history.pushState('', '', `/#/objectifs/${this.filtre.niveau}${this.filtre.periode ? '/' + this.filtre.periode : ''}`)
  }
}
