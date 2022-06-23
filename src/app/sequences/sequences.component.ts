import { HttpClient } from '@angular/common/http'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router, ActivatedRoute, NavigationStart, Event as NavigationEvent } from '@angular/router'
import { Subscription } from 'rxjs'
import { Niveau, SequenceParticuliere } from '../services/sequences'

interface Ligne {
  niveau?: string;
  numero?: number;
  reference?: string;
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
  navigationEventSubscription: Subscription
  ongletActif: string

  // eslint-disable-next-line no-unused-vars
  constructor(public httpClient: HttpClient, private activatedRoute: ActivatedRoute, private router: Router) {
    this.lignesSequencesNormales = []
    this.lignesSequencesParticulieres = []
    this.filtre = {}
    this.navigationEventSubscription = new Subscription
    this.ongletActif = 'tout'
    this.MAJOngletActif()
  }

  ngOnInit(): void {
    this.MAJFiltre()
    this.MAJLignesSequencesParticulieres()
    this.MAJLignesSequencesNormales()
  }

  ngOnDestroy() {
    this.navigationEventSubscription.unsubscribe()
  }

  MAJOngletActif() {
    this.navigationEventSubscription = this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        this.ongletActif = event.url.split('/')[2]
      }
    })
  }

  MAJFiltre() {
    this.activatedRoute.params.subscribe(params => {
      this.filtre.niveau = params.niveau
    })
  }

  MAJLignesSequencesParticulieres() {
    this.lignesSequencesParticulieres = []
    this.httpClient.get<SequenceParticuliere[]>('assets/data/sequencesParticulieres.json').subscribe(sequencesParticulieres => {
      this.lignesSequencesParticulieres.push({ niveau: 'Séquences particulières' })
      for (const sequence of sequencesParticulieres) {
        this.lignesSequencesParticulieres.push({ niveau: 'Séquences particulières', reference: sequence.reference, titre: sequence.titre, numero: 0 })
      }
      this.lignesSequencesParticulieres.push({ niveau: 'fin' })
    })
  }

  MAJLignesSequencesNormales() {
    this.lignesSequencesNormales = []
    this.httpClient.get<Niveau[]>('assets/data/sequences.json').subscribe(niveaux => {
      for (const niveau of niveaux) {
        this.lignesSequencesNormales.push({ niveau: niveau.nom })
        for (const sequence of niveau.sequences) {
          this.lignesSequencesNormales.push({ niveau: niveau.nom, reference: sequence.reference, titre: sequence.titre, numero: parseInt(sequence.reference.slice(3)) })
        }
        this.lignesSequencesNormales.push({ niveau: 'fin' })
      }
    })
  }
}
