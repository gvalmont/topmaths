import { EventEmitter, Injectable, OnDestroy, Output } from '@angular/core'
import { Subscription } from 'rxjs'
import { DataService } from './data.service'

@Injectable({
  providedIn: 'root'
})
export class CalendrierService implements OnDestroy {
  @Output() calendrierMAJ: EventEmitter<boolean> = new EventEmitter()

  annee: number
  jourNumero: number
  periodeNumero: number
  semaineDansLaPeriode: number
  typeDePeriode: string // Peut être 'cours' ou 'vacances'
  estHeureEte: boolean
  dataMAJSubscription: Subscription

  // eslint-disable-next-line no-unused-vars
  constructor (private dataService: DataService) {
    this.annee = 0
    this.jourNumero = 0
    this.periodeNumero = 0
    this.semaineDansLaPeriode = 0
    this.typeDePeriode = ''
    this.estHeureEte = false
    this.dataMAJSubscription = new Subscription
    if (this.lesDonneesSontChargees()) this.MAJProprietes()
    this.surveillerLeChargementDesDonnees()
  }

  ngOnDestroy () {
    this.dataMAJSubscription.unsubscribe()
  }

  surveillerLeChargementDesDonnees () {
    this.dataMAJSubscription = this.dataService.dataMAJ.subscribe(valeurModifiee => {
      if (valeurModifiee === 'calendrierAnnees') {
        if (this.lesDonneesSontChargees()) this.MAJProprietes()
      }
    })
  }

  lesDonneesSontChargees () {
    return this.dataService.calendrierAnnees.length > 0
  }

  MAJProprietes () {
    this.annee = new Date().getFullYear()
    this.jourNumero = this.getDayOfYear()
    for (const annee of this.dataService.calendrierAnnees) {
      if (annee.annee === this.annee) {
        if (this.jourNumero >= annee.heureEte.debut && this.jourNumero <= annee.heureEte.fin) {
          this.estHeureEte = true
        } else {
          this.estHeureEte = false
        }
        for (const periode of annee.periodes) {
          if (this.jourNumero >= periode.debut && this.jourNumero <= periode.fin) {
            this.periodeNumero = periode.numero
            this.typeDePeriode = periode.type
            this.semaineDansLaPeriode = Math.floor((this.jourNumero - periode.debut) / 7) + 1
            break
          }
        }
      }
    }
    this.calendrierMAJ.emit(true)
  }

  getDayOfYear () {
    const now = new Date()
    const begin = new Date(now.getFullYear(), 0, 0)
    const diff = (now.getTime() - begin.getTime()) + ((begin.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000)
    const oneDay = 1000 * 60 * 60 * 24
    return Math.floor(diff / oneDay)
  }
}