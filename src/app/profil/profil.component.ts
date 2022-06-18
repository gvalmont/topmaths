import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { estHeureEte } from '../services/outils'

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  defaut: boolean
  errGrandNbChar: boolean
  errPetitNbChar: boolean
  errSpChar: boolean
  errCodeIncorrect: boolean
  shake: boolean
  defautE: boolean
  errGrandNbCharE: boolean
  errPetitNbCharE: boolean
  errSpCharE: boolean
  errCodeIncorrectE: boolean
  shakeE: boolean
  pseudo: string
  modaleAvatar!: HTMLElement
  derniereConnexion: string
  modalePseudo!: HTMLElement
  modaleConfirmation!: HTMLElement
  enCoursDeModif: string
  modifTerminee: string

  constructor(public http: HttpClient, public appComponent: AppComponent, public dataService: ApiService, private router: Router) {
    this.defaut = true
    this.errGrandNbChar = false
    this.errPetitNbChar = false
    this.errSpChar = false
    this.errCodeIncorrect = false
    this.shake = false
    this.defautE = true
    this.errGrandNbCharE = false
    this.errPetitNbCharE = false
    this.errSpCharE = false
    this.errCodeIncorrectE = false
    this.shakeE = false
    this.pseudo = dataService.user.pseudo
    this.derniereConnexion = this.dateDeDerniereConnexion()
    this.enCoursDeModif = ''
    this.modifTerminee = ''
  }

  ngOnInit(): void {
    let modale = document.getElementById("modalePseudo")
    if (modale != null) this.modalePseudo = modale
    modale = document.getElementById("modaleConfirmation")
    if (modale != null) this.modaleConfirmation = modale
  }

  /**
   * Récupère la date de connexion et la formate pour un affichage en français
   * @returns string
   */
  dateDeDerniereConnexion() {
    let date = new Date(this.dataService.user.lastLogin);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset() - 60); //Le serveur mysql est en UTC + 1 ?
    if (estHeureEte()) date.setMinutes(date.getMinutes() - 60)
    const jour = new Array(7);
    jour[0] = 'Dimanche'
    jour[1] = 'Lundi'
    jour[2] = 'Mardi'
    jour[3] = 'Mercredi'
    jour[4] = 'Jeudi'
    jour[5] = 'Vendredi'
    jour[6] = 'Samedi'
    const mois = new Array();
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

  /**
   * Met à jour la variable pseudo temporaire avec un nouveau pseudo aléatoire
   */
  pseudoAleatoire() {
    this.pseudo = this.dataService.pseudoAleatoire()
  }

  /**
   * Enregistre le pseudo dans la bdd et ferme la modale
   */
  enregistrerPseudo() {
    this.dataService.majPseudo(this.pseudo)
    this.modalePseudo.style.display = "none";
  }

  /**
   * Ouvre la modale
   * @param type peut être pseudo ou confirmation
   */
  ouvrirModale(type: string) {
     if (type == 'pseudo') {
      this.pseudo = this.dataService.user.pseudo
      this.modalePseudo.style.display = "block"
    }
  }

  /**
   * Ferme la modale
   * @param type peut être pseudo ou confirmation
   */
  fermerModale(type: string) {
     if (type == 'pseudo') {
      this.modalePseudo.style.display = "none"
    } else if (type == 'confirmation') {
      this.modaleConfirmation.style.display = "none"
    }
  }

}
