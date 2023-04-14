import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Sequence } from '../services/modeles/sequences'
import { ViewportScroller } from '@angular/common'
import { Title } from '@angular/platform-browser'
import { DataService } from '../services/data.service'
import { Subscription } from 'rxjs'
import { StorageService } from '../services/storage.service'
import { OutilsService } from '../services/outils.service'

@Component({
  selector: 'app-sequence',
  templateUrl: './sequence.component.html',
  styleUrls: []
})
export class SequenceComponent implements OnInit, OnDestroy {
  niveau: string
  reference: string
  sequence: Sequence
  infosModale: [string[], string, Date]
  ancreDeRetour: string
  dataMAJSubscription: Subscription

  // eslint-disable-next-line no-unused-vars
  constructor (private activatedRoute: ActivatedRoute, private dataService: DataService, public router: Router, private viewportScroller: ViewportScroller, private titleService: Title, public storageService: StorageService, private outilsService: OutilsService) {
    this.niveau = ''
    this.reference = ''
    this.sequence = new Sequence('', '', 0, [], [], [], '', '', '', '', { cours: false, resume: false, mission: false })
    this.infosModale = [[], '', new Date() ]
    this.ancreDeRetour = ''
    this.dataMAJSubscription = new Subscription
  }

  ngOnInit (): void {
    this.viewportScroller.scrollToAnchor('titre')
    this.surveillerChangementsDeSequence()
    this.surveillerLeChargementDesDonnees()
  }

  ngOnDestroy () {
    this.dataMAJSubscription.unsubscribe()
  }

  surveillerChangementsDeSequence () {
    this.activatedRoute.params.subscribe(params => {
      this.reference = params.reference
      if (this.lesDonneesSontChargees()) this.trouverSequence()
    })
  }

  surveillerLeChargementDesDonnees () {
    this.dataMAJSubscription = this.dataService.dataMAJ.subscribe(valeurModifiee => {
      if (valeurModifiee === 'niveauxObjectifs' || valeurModifiee === 'niveauxSequences') {
        if (this.lesDonneesSontChargees()) this.trouverSequence()
      }
    })
  }

  lesDonneesSontChargees () {
    return this.dataService.niveauxObjectifs.length > 0 && this.dataService.niveauxSequences.length > 0
  }

  trouverSequence () {
    this.dataService.niveauxSequences.find(niveau => {
      return niveau.sequences.find(sequence => {
        if (sequence.reference === this.reference) {
          this.niveau = niveau.nom
          this.sequence = sequence
          this.titleService.setTitle(sequence.titre.replace('<br>', ' '))
        }
        return sequence.reference === this.reference
      })
    })
  }

  ouvrirModaleExercices (lien: string, ancre: string) {
    this.infosModale = [[lien], '', new Date() ]
    this.ancreDeRetour = ancre
  }

  scrollBack (): void {
    this.viewportScroller.scrollToAnchor(this.ancreDeRetour)
  }
}
