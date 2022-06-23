import { Injectable } from '@angular/core'
import { DataService } from './data.service'

@Injectable({
  providedIn: 'root'
})
export class CalendrierService {
  annee: number
  jourNumero: number
  periodeNumero: number
  semaineDansLaPeriode: number
  typeDePeriode: string // Peut être 'cours' ou 'vacances'
  estHeureEte: boolean

  // eslint-disable-next-line no-unused-vars
  constructor(private dataService: DataService) {
    this.annee = 0
    this.jourNumero = 0
    this.periodeNumero = 0
    this.semaineDansLaPeriode = 0
    this.typeDePeriode = ''
    this.estHeureEte = false
    this.MAJProprietes()
  }

  MAJProprietes() {
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
  }

  getDayOfYear() {
    const now = new Date()
    const begin = new Date(now.getFullYear(), 0, 0)
    const diff = (now.getTime() - begin.getTime()) + ((begin.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000)
    const oneDay = 1000 * 60 * 60 * 24
    return Math.floor(diff / oneDay)
  }
}