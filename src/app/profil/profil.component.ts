import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Options } from '@angular-slider/ngx-slider';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
interface Slider {
  value: number,
  options: Options
}

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  angForm: FormGroup
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
  yeux: Slider
  sourcils: Slider
  bouche: Slider
  accessoire: Slider
  cheveux: Slider
  couleurPeau: Slider
  couleurCheveux: Slider
  modaleAvatar!: HTMLElement
  derniereConnexion: string
  modalePseudo!: HTMLElement
  modaleConfirmation!: HTMLElement
  enCoursDeModif: string
  modifTerminee: string

  constructor(private fb: FormBuilder, public http: HttpClient, public appComponent: AppComponent, public dataService: ApiService, private router: Router) {
    this.angForm = this.fb.group({
      codeTrophee: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
    this.defaut = true
    this.errGrandNbChar = false
    this.errPetitNbChar = false
    this.errSpChar = false
    this.errCodeIncorrect = false
    this.shake = false
    this.surveilleChamp()
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
    this.yeux = {
      value: 1,
      options: {
        floor: 1,
        ceil: 26,
        hidePointerLabels: true,
        hideLimitLabels: true,
        showTicks: true
      }
    }
    this.sourcils = {
      value: 1,
      options: {
        floor: 1,
        ceil: 10,
        hidePointerLabels: true,
        hideLimitLabels: true,
        showTicks: true
      }
    }
    this.bouche = {
      value: 1,
      options: {
        floor: 1,
        ceil: 30,
        hidePointerLabels: true,
        hideLimitLabels: true,
        showTicks: true
      }
    }
    this.accessoire = {
      value: 1,
      options: {
        floor: 1,
        ceil: 7,
        hidePointerLabels: true,
        hideLimitLabels: true,
        showTicks: true
      }
    }
    this.cheveux = {
      value: 1,
      options: {
        floor: 1,
        ceil: 32,
        hidePointerLabels: true,
        hideLimitLabels: true,
        showTicks: true
      }
    }
    this.couleurPeau = {
      value: 1,
      options: {
        floor: 1,
        ceil: 5,
        hidePointerLabels: true,
        hideLimitLabels: true,
        showTicks: true
      }
    }
    this.couleurCheveux = {
      value: 1,
      options: {
        floor: 1,
        ceil: 14,
        hidePointerLabels: true,
        hideLimitLabels: true,
        showTicks: true
      }
    }
    this.pseudo = dataService.user.pseudo
    this.derniereConnexion = this.dateDeDerniereConnexion()
    this.enCoursDeModif = ''
    this.modifTerminee = ''
    this.dataService.profilModifie.subscribe(valeursModifiees => {
      if (valeursModifiees.includes('visible') || valeursModifiees.includes('tropheesVisibles')) {
        this.modifTerminee = this.enCoursDeModif
        this.enCoursDeModif = ''
      }
      if (valeursModifiees.includes('codeTrophees')) {
        this.shake = false
        this.errCodeIncorrect = false
      }
    })
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
   * Surveille le champ de lien trophées,
   * actualise les booléens sur lesquels s'appuie le formatage du champ
   */
  surveilleChamp() {
    this.angForm.valueChanges.subscribe(x => {
      const str = x.codeTrophee
      this.defaut = true
      this.errSpChar = false
      this.errPetitNbChar = false
      this.errGrandNbChar = false
      this.errCodeIncorrect = false
      if (str.length != 0) this.defaut = false
      if (str.length < 6 && str.length != 0) this.errPetitNbChar = true
      if (str.length > 6) this.errGrandNbChar = true
      if (!/^[a-z]*$/.test(str)) this.errSpChar = true
    })
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
   * Vérifie si le codeTrophee saisi se trouve dans les trophees.json
   * Met à jour le codeTrophees dans le profil local et de la bdd si c'est le cas
   * Affiche un message d'erreur sinon
   * @param codeTrophee 
   */
  lierTrophees(codeTrophee: string) {
    this.shake = true
    this.errCodeIncorrect = true
    this.dataService.user.codeTrophees = ''
    this.dataService.getTrophees('', codeTrophee)
    setTimeout(() => {
      this.shake = false
    }, 1000);
  }

  /**
   * Supprime le codeTrophees local et de la bdd
   */
  supprimerLienTrophees() {
    this.dataService.user.codeTrophees = ''
    this.dataService.majCodeTrophees('')
  }

  /**
   * Envoie l'utilisateur sur la page de trophées et indique que ce sont les trophées de user.pseudo
   * @param user 
   */
  voirTropheesPerso() {
    this.dataService.pseudoClique = this.dataService.user.pseudo
    this.router.navigate(['trophees', this.dataService.user.codeTrophees])
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
