import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { DataService } from '../services/data.service'

interface Ligne {
  niveau?: string,
  periode?: number,
  numero?: number,
  reference?: string,
  titre?: string
}
@Component({
  selector: 'app-sequences',
  templateUrl: './sequences.component.html',
  styleUrls: []
})
export class SequencesComponent implements OnInit, OnDestroy {
  lignesSequencesNormales: Ligne[]
  lignesSequencesParticulieres: Ligne[]
  filtre: Ligne
  texteRecherche: string
  navigationEventSubscription: Subscription
  dataMAJSubscription: Subscription
  ongletActif: string

  // eslint-disable-next-line no-unused-vars
  constructor (private dataService: DataService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.lignesSequencesNormales = []
    this.lignesSequencesParticulieres = []
    this.filtre = {}
    this.texteRecherche = ''
    this.navigationEventSubscription = new Subscription
    this.dataMAJSubscription = new Subscription
    this.ongletActif = 'tout'
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

  MAJOngletActif () {
    this.activatedRoute.params.subscribe(params => {
      this.ongletActif = params.niveau
      this.filtre.niveau = params.niveau
      if (params.periode !== undefined) this.filtre.periode = Number(params.periode)
    })
  }

  surveillerLeChargementDesDonnees () {
    this.dataMAJSubscription = this.dataService.dataMAJ.subscribe(valeurModifiee => {
      if (valeurModifiee === 'sequencesParticulieres' || valeurModifiee === 'niveauxSequences') {
        if (this.lesDonneesSontChargees()) this.MAJPage()
      }
    })
  }

  lesDonneesSontChargees () {
    return this.dataService.sequencesParticulieres.length > 0 && this.dataService.niveauxSequences.length > 0
  }

  MAJPage () {
    this.MAJLignesSequencesParticulieres()
    this.MAJLignesSequencesNormales()
  }

  MAJLignesSequencesParticulieres () {
    this.lignesSequencesParticulieres = []
    this.lignesSequencesParticulieres.push({ niveau: 'Séquences particulières' })
    for (const sequence of this.dataService.sequencesParticulieres) {
      this.lignesSequencesParticulieres.push({ niveau: 'Séquences particulières', reference: sequence.reference, titre: sequence.titre, numero: 0 })
    }
    this.lignesSequencesParticulieres.push({ niveau: 'fin' })
  }

  MAJLignesSequencesNormales () {
    this.lignesSequencesNormales = []
    for (const niveau of this.dataService.niveauxSequences) {
      this.lignesSequencesNormales.push({ niveau: niveau.nom })
      for (const sequence of niveau.sequences) {
        this.lignesSequencesNormales.push({ niveau: niveau.nom, reference: sequence.reference, titre: sequence.titre, periode: sequence.periode, numero: parseInt(sequence.reference.slice(3)) })
      }
      this.lignesSequencesNormales.push({ niveau: 'fin' })
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
    window.history.pushState('', '', `/#/sequences/${this.filtre.niveau}${this.filtre.periode ? '/' + this.filtre.periode : ''}`)
  }
}
