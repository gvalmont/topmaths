import { Component, OnDestroy, OnInit } from '@angular/core'
import { ProfilService } from '../services/profil.service'
import { CalendrierService } from '../services/calendrier.service'
import { DataService } from '../services/data.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit, OnDestroy {
  pseudo: string
  dateDeDerniereConnexion: string
  modalePseudo!: HTMLElement
  calendrierMAJSubscription: Subscription
  profilMAJSubscription: Subscription

  // eslint-disable-next-line no-unused-vars
  constructor (public profilService: ProfilService, public dataService: DataService, private calendrierService: CalendrierService) {
    this.pseudo = profilService.user.pseudo
    this.dateDeDerniereConnexion = ''
    this.calendrierMAJSubscription = new Subscription
    this.profilMAJSubscription = new Subscription
  }

  ngOnInit (): void {
    const modalePseudo = document.getElementById("modalePseudo")
    if (modalePseudo !== null) this.modalePseudo = modalePseudo
    if (this.leCalendrierEstCharge() && this.leProfilEstCharge()) this.MAJDateDeDerniereConnexion()
    this.surveillerLeChargementDuCalendrier()
    this.surveillerLeChargementDuProfil()
  }

  ngOnDestroy () {
    this.calendrierMAJSubscription.unsubscribe()
    this.profilMAJSubscription.unsubscribe()
  }

  surveillerLeChargementDuCalendrier () {
    this.calendrierMAJSubscription = this.calendrierService.calendrierMAJ.subscribe(() => {
      if (this.leProfilEstCharge()) this.MAJDateDeDerniereConnexion()
    })
  }

  surveillerLeChargementDuProfil () {
    this.profilMAJSubscription = this.profilService.profilMAJ.subscribe(valeursModifiees => {
      if (valeursModifiees.includes('lastLogin')) {
        if (this.leCalendrierEstCharge()) this.MAJDateDeDerniereConnexion()
      }
      if (valeursModifiees.includes('pseudo')) {
        this.pseudo = this.profilService.user.pseudo
      }
    })
  }

  leCalendrierEstCharge () {
    return this.calendrierService.annee !== 0
  }

  leProfilEstCharge () {
    return this.profilService.user.lastLogin !== ''
  }

  MAJDateDeDerniereConnexion () {
    const date = new Date(this.profilService.user.lastLogin)
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset() - 60) // Le serveur mysql est en UTC + 1 ?
    if (this.calendrierService.estHeureEte) date.setMinutes(date.getMinutes() - 60)
    const jour = new Array(7)
    jour[0] = 'Dimanche'
    jour[1] = 'Lundi'
    jour[2] = 'Mardi'
    jour[3] = 'Mercredi'
    jour[4] = 'Jeudi'
    jour[5] = 'Vendredi'
    jour[6] = 'Samedi'
    const mois = new Array()
    mois[0] = 'Janvier'
    mois[1] = 'Février'
    mois[2] = 'Mars'
    mois[3] = 'Avril'
    mois[4] = 'Mai'
    mois[5] = 'Juin'
    mois[6] = 'Juillet'
    mois[7] = 'Août'
    mois[8] = 'Septembre'
    mois[9] = 'Octobre'
    mois[10] = 'Novembre'
    mois[11] = 'Décembre'
    this.dateDeDerniereConnexion = `${jour[date.getDay()]} ${date.getDate()} ${mois[date.getMonth()]} ${date.getFullYear()} entre ${date.getHours()}h et ${date.getHours() + 1}h`
  }

  enregistrerPseudo () {
    this.profilService.user.pseudo = this.pseudo
    this.profilService.majProfil(['pseudo'])
    this.modalePseudo.style.display = "none"
  }

  ouvrirModalePseudo () {
    this.pseudo = this.profilService.user.pseudo
    this.modalePseudo.style.display = "block"
  }

  fermerModalePseudo () {
    this.modalePseudo.style.display = "none"
  }

}
