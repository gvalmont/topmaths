import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';

interface Vacance {
  annee: number,
  debut: number,
  fin: number
}

@Injectable({
  providedIn: 'root'
})

export class TimeguardGuard implements CanActivate {
  constructor(private router: Router) { }

  /**
   * Fonction qui sert à déterminer si l'utilisateur a le droit d'emprunter une route
   * @param route 
   * @param state 
   * @returns true s'il peut l'emprunter, false sinon
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.estPendantLesVacances()) return true
    if (this.estPendantLesCours()) {
      alert('Tu n\'as pas le droit d\'accéder à cette page pendant les cours !')
      return false
    } else {
      return true
    }
  }

  /**
   * @returns true si on est pendant les vacances, false sinon
   */
  estPendantLesVacances() {
    const date = new Date()
    const jour = this.getDayOfYear()
    for (const vacance of this.vacances) {
      if (vacance.annee === date.getFullYear()) {
        if (vacance.debut <= jour && jour <= vacance.fin) {
          return true
        }
      }
    }
    return false
  }

  /**
   * @returns le numéro du jour de l'année
   */
  getDayOfYear() {
    const now = new Date();
    const begin = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - begin.getTime()) + ((begin.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  /**
   * Récupère l'heure locale pour vérifier si on est pendant les cours.
   * Les cours sont de 8h à 16h30 Lundi, Mardi, Jeudi et Vendredi et de 8h à 12h et Mercredi.
   * Il n'y a pas de cours Samedi et Dimanche.
   * @returns true si on est pendant les cours
   */
  estPendantLesCours() {
    const heureDebutLundiMardiJeudiVendredi = 8
    const heureFinLundiMardiJeudiVendredi = 16.5
    const heureDebutMercredi = 8
    const heureFinMercredi = 12
    const date = new Date()
    const jourActuel = date.getDay()
    const heureActuelle = date.getHours() + date.getMinutes()/60
    if ((jourActuel === 1 || jourActuel === 2 || jourActuel === 4 || jourActuel === 5) && (heureDebutLundiMardiJeudiVendredi < heureActuelle && heureActuelle < heureFinLundiMardiJeudiVendredi)) {
      return true
    } else if ((jourActuel === 3) && (heureDebutMercredi < heureActuelle && heureActuelle < heureFinMercredi)) {
      return true
    } else {
      return false
    }
  }
  
  vacances: Vacance[] = [
    {
      annee: 2022,
      debut: 71,
      fin: 87
    },
    {
      annee: 2022,
      debut: 134,
      fin: 150
    },
    {
      annee: 2022,
      debut: 190,
      fin: 228
    },
    {
      annee: 2022,
      debut: 281,
      fin: 297
    },
    {
      annee: 2022,
      debut: 351,
      fin: 365
    },
    {
      annee: 2023,
      debut: 1,
      fin: 23
    },
    {
      annee: 2023,
      debut: 70,
      fin: 86
    },
    {
      annee: 2023,
      debut: 133,
      fin: 150
    },
    {
      annee: 2023,
      debut: 189,
      fin: 228
    }
  ]
}