import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  angFormE: FormGroup
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

  constructor(private fb: FormBuilder, public http: HttpClient, public appComponent: AppComponent, public dataService: ApiService, private router: Router) {
    this.defaut = true
    this.errGrandNbChar = false
    this.errPetitNbChar = false
    this.errSpChar = false
    this.errCodeIncorrect = false
    this.shake = false
    this.angFormE = this.fb.group({
      codeEquipe: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]]
    });
    this.defautE = true
    this.errGrandNbCharE = false
    this.errPetitNbCharE = false
    this.errSpCharE = false
    this.errCodeIncorrectE = false
    this.shakeE = false
    this.surveilleChampE()
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

  voirPageEquipe(){
    this.router.navigate(['team', this.dataService.user.teamName])
  }

  /**
   * Vérifie si l'utilisateur fait déjà partie d'une équipe,
   * prévient si c'est le cas,
   * sinon envoie vers la page de création d'une nouvelle équipe
   */
  creerNouvelleEquipe(){
    if (this.dataService.user.teamName == '') {
      this.router.navigate(['team', 'admin', 'creation'])
    } else {
      alert('Tu fais déjà partie d\'une équipe !\nTu dois d\'abord la quitter si tu veux en créer une autre.')
    }
  }

  /**
   * Ouvre la modale de confirmation pour quitter l'équipe
   */
  quitterEquipe() {
    this.ouvrirModale('confirmation')
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
    return `${jour[date.getDay()]} ${date.getDate()} ${mois[date.getMonth()]} ${date.getFullYear()} à ${date.getHours()}h${this.nb2chiffres(date.getMinutes())}min`
  }

  /**
   * Ajoute un 0 aux nombres à un chiffre
   * Convertir les nombres en string
   * @param nb 
   * @returns string
   */
  nb2chiffres(nb: number) {
    if (nb < 1) {
      return '01'
    } else if (nb < 10) {
      return '0' + Math.floor(nb)
    } else {
      return Math.floor(nb).toString()
    }
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
   * Surveille le champ pour rejoindre une équipe,
   * actualise les booléens sur lesquels s'appuie le formatage du champ
   */
   surveilleChampE() {
    this.angFormE.valueChanges.subscribe(x => {
      const str = x.codeEquipe
      this.defautE = true
      this.errSpCharE = false
      this.errPetitNbCharE = false
      this.errGrandNbCharE = false
      this.errCodeIncorrectE = false
      if (str.length != 0) this.defautE = false
      if (str.length < 5 && str.length != 0) this.errPetitNbCharE = true
      if (str.length > 5) this.errGrandNbCharE = true
      if (!/^[a-z]*$/.test(str)) this.errSpCharE = true
    })
  }

  /**
   * Ouvre la modale
   * @param type peut être pseudo ou confirmation
   */
  ouvrirModale(type: string) {
     if (type == 'pseudo') {
      this.pseudo = this.dataService.user.pseudo
      this.modalePseudo.style.display = "block"
    } else if (type == 'confirmation') {
      this.modaleConfirmation.style.display = "block"
      this.dataService.recupInfosEquipe(this.dataService.user.teamName)
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
