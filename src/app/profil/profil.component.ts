import { Component, OnInit } from '@angular/core'
import { ApiService } from '../services/api.service'
import { CalendrierService } from '../services/calendrier.service'

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  pseudo: string
  derniereConnexion: string
  modalePseudo!: HTMLElement

  // eslint-disable-next-line no-unused-vars
  constructor(public apiService: ApiService, private calendrierService: CalendrierService) {
    this.pseudo = apiService.user.pseudo
    this.derniereConnexion = this.getDateDeDerniereConnexion()
  }

  ngOnInit(): void {
    const modalePseudo = document.getElementById("modalePseudo")
    if (modalePseudo !== null) this.modalePseudo = modalePseudo
  }

  getDateDeDerniereConnexion() {
    const date = new Date(this.apiService.user.lastLogin)
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
    return `${jour[date.getDay()]} ${date.getDate()} ${mois[date.getMonth()]} ${date.getFullYear()} entre ${date.getHours()}h et ${date.getHours() + 1}h`
  }

  enregistrerPseudo() {
    this.apiService.user.pseudo = this.pseudo
    this.apiService.majProfil(['pseudo'])
    this.modalePseudo.style.display = "none"
  }

  ouvrirModalePseudo() {
    this.pseudo = this.apiService.user.pseudo
    this.modalePseudo.style.display = "block"
  }

  fermerModalePseudo() {
    this.modalePseudo.style.display = "none"
  }

}
