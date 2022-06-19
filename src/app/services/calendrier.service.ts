import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Annee {
  annee: number
  heureEte: {
    debut: number
    fin: number
  }
  periodes: Periode[]
}

interface Periode {
  debut: number
  fin: number
  type: string
}

@Injectable({
  providedIn: 'root'
})
export class CalendrierService {
  annees!: Annee[]

  constructor(public http: HttpClient) {
    this.http.get<Annee[]>('assets/data/calendrier.json').subscribe(annees => {
      this.annees = annees
    })
  }

  estHeureEte() {
    if (typeof this.annees != 'undefined') {
      const anneeActuelle = new Date().getFullYear()
      const jour = this.getDayOfYear()
      for (const annee of this.annees) {
        if (annee.annee === anneeActuelle) {
          if (annee.heureEte.debut <= jour && jour <= annee.heureEte.fin) {
            return true
          }
        }
      }
      return false
    } else {
      console.log('Erreur : le calendrier n\'est pas chargé')
      return false
    }
  }

  getDayOfYear() {
    const now = new Date();
    const begin = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - begin.getTime()) + ((begin.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }
}