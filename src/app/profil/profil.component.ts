import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Options } from '@angular-slider/ngx-slider';
import { User } from '../services/user'
import { ApiService } from '../services/api.service';
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
  lienAvatar: string
  yeux: Slider
  sourcils: Slider
  bouche: Slider
  accessoire: Slider
  cheveux: Slider
  couleurPeau: Slider
  couleurCheveux: Slider
  modaleAvatar: any
  derniereConnexion: string

  constructor(public appComponent: AppComponent, public dataService: ApiService) {
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
    this.lienAvatar = this.dataService.user.lienAvatar
    this.derniereConnexion = this.dateDeDerniereConnexion()
  }

  ngOnInit(): void {
    this.modaleAvatar = document.getElementById("modaleAvatar")
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
   * Foncion servant à activer ou désactiver les scores en :
   * modifiant le token ;
   * modifiant la colonne dans la base de données (à coder)
   * @param activer true pour activer les scores, false pour les désactiver
   */
  scores(activer: boolean) {
    if (activer) {
      this.dataService.majScores('actives')
    } else {
      this.dataService.majScores('desactives')
    }
  }

  /**
   * Place les sliders aléatoirement pour créer un avatar aléatoire
   */
  avatarAleatoire() {
    let yeux = 1
    let sourcils = 1
    let bouche = 1
    let accessoire = 1
    let cheveux = 1
    let couleurPeau = 1
    let couleurCheveux = 1
    if (typeof (this.yeux.options.ceil) != 'undefined') yeux = Math.random() * this.yeux.options.ceil
    this.yeux.value = yeux
    if (typeof (this.sourcils.options.ceil) != 'undefined') sourcils = Math.random() * this.sourcils.options.ceil
    this.sourcils.value = sourcils
    if (typeof (this.bouche.options.ceil) != 'undefined') bouche = Math.random() * this.bouche.options.ceil
    this.bouche.value = bouche
    if (typeof (this.accessoire.options.ceil) != 'undefined') accessoire = Math.random() * this.accessoire.options.ceil
    this.accessoire.value = accessoire
    if (typeof (this.cheveux.options.ceil) != 'undefined') cheveux = Math.random() * this.cheveux.options.ceil
    this.cheveux.value = cheveux
    if (typeof (this.couleurPeau.options.ceil) != 'undefined') couleurPeau = Math.random() * this.couleurPeau.options.ceil
    this.couleurPeau.value = couleurPeau
    if (typeof (this.couleurCheveux.options.ceil) != 'undefined') couleurCheveux = Math.random() * this.couleurCheveux.options.ceil
    this.couleurCheveux.value = couleurCheveux
    this.majLienAvatar()
  }

  /**
   * Met à jour le lien de l'avatar à partir des données des sliders.
   * @param event non utilisé
   */
  majLienAvatar(event?: any) {
    this.lienAvatar = `https://avatars.dicebear.com/api/adventurer/topmaths.svg?scale=90&eyes=${this.format(this.yeux)}&eyebrows=${this.format(this.sourcils)}&mouth=${this.format(this.bouche)}&accessoires=${this.format(this.accessoire, 'accessoire')}&hair=${this.format(this.cheveux, 'cheveux')}&skinColor=${this.format(this.couleurPeau)}&hairColor=${this.format(this.couleurCheveux, 'couleurCheveux')}`
  }

  /**
   * Enregistre le lienAvatar dans le localStorage et ferme la modale
   */
  enregistrerAvatar() {
    this.dataService.majAvatar(this.lienAvatar)
    this.modaleAvatar.style.display = "none";
  }

  /**
   * Récupère le lienAvatar de this.dataService.user,
   * Récupère les paramètres de l'url,
   * Ajuste les valeurs des sliders.
   */
  deconstruitLienAvatar() {
    const parametres = this.dataService.user.lienAvatar.split('&')
    this.yeux.value = parseInt(parametres[1].split('variant')[1])
    this.sourcils.value = parseInt(parametres[2].split('variant')[1])
    this.bouche.value = parseInt(parametres[3].split('variant')[1])
    switch (parametres[4].split('=')[1]) {
      case 'sunglasses':
        if (parametres[5].split('=')[1] == '0') this.accessoire.value = 1
        else this.accessoire.value = 2
        break;
      case 'glasses':
        this.accessoire.value = 3
        break
      case 'smallGlasses':
        this.accessoire.value = 4
        break
      case 'mustache':
        this.accessoire.value = 5
        break
      case 'blush':
        this.accessoire.value = 6
        break
      case 'birthmark':
        this.accessoire.value = 7
        break
      default:
        this.accessoire.value = 1
        break;
    }
    const longueurCheveux = parametres[6].split('=')[1].slice(0, parametres[6].split('=')[1].length - 2)
    if (longueurCheveux == 'long') {
      this.cheveux.value = parseInt(parametres[6].split('=')[1].slice(parametres[6].split('=')[1].length - 2))
    } else {
      this.cheveux.value = parseInt(parametres[6].split('=')[1].slice(parametres[6].split('=')[1].length - 2)) + 20
    }
    this.couleurPeau.value = parseInt(parametres[7].split('variant')[1])
    switch (parametres[8].split('=')[1]) {
      case 'red01':
        this.couleurCheveux.value = 1
        break
      case 'red02':
        this.couleurCheveux.value = 2
        break
      case 'red03':
        this.couleurCheveux.value = 3
        break
      case 'blonde01':
        this.couleurCheveux.value = 4
        break
      case 'blonde02':
        this.couleurCheveux.value = 5
        break
      case 'blonde03':
        this.couleurCheveux.value = 6
        break
      case 'brown01':
        this.couleurCheveux.value = 7
        break
      case 'brown02':
        this.couleurCheveux.value = 8
        break
      case 'black':
        this.couleurCheveux.value = 9
        break
      case 'gray':
        this.couleurCheveux.value = 10
        break
      case 'green':
        this.couleurCheveux.value = 11
        break
      case 'blue':
        this.couleurCheveux.value = 12
        break
      case 'pink':
        this.couleurCheveux.value = 13
        break
      case 'purple':
        this.couleurCheveux.value = 14
        break
      default:
        this.couleurCheveux.value = 1
        break
    }
  }

  /**
   * Formate correctement les différentes variables pour la mettre dans l'url de dicebear
   * Par défaut, le formatage est de la forme 'variant' + this.nb2chiffres(trait.value)
   * Certains traits ne respectent pas ce formatage et sont signalés via le paramètre special
   * @param trait peut être le slider correspondant aux yeux, sourcils, bouche, accessoire, cheveux, couleurPeau ou couleurCheveux
   * @param special peut être 'accessoire', 'cheveux' ou 'couleurCheveux'
   * @returns string correctement formaté pour insertion dans l'url de dicebear
   */
  format(trait: Slider, special?: string) {
    if (special === 'accessoire') {
      switch (trait.value) {
        case 1:
          return 'sunglasses&accessoiresProbability=0'
        case 2:
          return 'sunglasses&accessoiresProbability=100'
        case 3:
          return 'glasses&accessoiresProbability=100'
        case 4:
          return 'smallGlasses&accessoiresProbability=100'
        case 5:
          return 'mustache&accessoiresProbability=100'
        case 6:
          return 'blush&accessoiresProbability=100'
        case 7:
          return 'birthmark&accessoiresProbability=100'
        default:
          return 'sunglasses&accessoiresProbability=0'
      }
    } else if (special === 'cheveux') {
      if (trait.value <= 20) {
        return 'long' + this.nb2chiffres(trait.value)
      } else {
        return 'short' + this.nb2chiffres(trait.value - 20)
      }
    } else if (special === 'couleurCheveux') {
      switch (trait.value) {
        case 1:
          return 'red01'
        case 2:
          return 'red02'
        case 3:
          return 'red03'
        case 4:
          return 'blonde01'
        case 5:
          return 'blonde02'
        case 6:
          return 'blonde03'
        case 7:
          return 'brown01'
        case 8:
          return 'brown02'
        case 9:
          return 'black'
        case 10:
          return 'gray'
        case 11:
          return 'green'
        case 12:
          return 'blue'
        case 13:
          return 'pink'
        case 14:
          return 'purple'
        default:
          return 'red01'
      }
    } else {
      return 'variant' + this.nb2chiffres(trait.value)
    }
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
   * Ouvre la modale
   * @param type peut être avatar ou pseudo
   */
  ouvrirModale(type: string) {
    if (type == 'avatar') {
      this.deconstruitLienAvatar()
      this.modaleAvatar.style.display = "block"
    }
  }

  /**
   * Ferme la modale
   * @param type peut être avatar ou pseudo
   */
  fermerModale(type: string) {
    if (type == 'avatar') {
      // fermerModale est utilisée pour quitter la création d'avatar sans enregistrer
      // on récupère donc l'avatar de this.dataService.user
      this.lienAvatar = this.dataService.user.lienAvatar
      this.modaleAvatar.style.display = "none"
    }
  }

}