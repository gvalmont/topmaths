import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router, ActivatedRoute, NavigationStart, Event as NavigationEvent } from '@angular/router'
import { Subscription } from 'rxjs'
import { DataService } from '../services/data.service'

interface Ligne {
  niveau?: string;
  theme?: string;
  sousTheme?: string;
  reference?: string;
  titre?: string
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
    this.navigationEventSubscription = this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        this.ongletActif = event.url.split('/')[2]
      }
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
        this.lignes.push({ niveau: niveau.nom, theme: theme.nom })
        for (const sousTheme of theme.sousThemes) {
          this.lignes.push({ niveau: niveau.nom, theme: theme.nom, sousTheme: sousTheme.nom })
          for (const objectif of sousTheme.objectifs) {
            this.lignes.push({ niveau: niveau.nom, theme: theme.nom, sousTheme: sousTheme.nom, reference: objectif.reference, titre: objectif.titre })
          }
        }
      }
      this.lignes.push({ niveau: 'fin' })
    }
  }
}
