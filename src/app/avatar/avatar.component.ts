import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, Event as NavigationEvent } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';

interface AvatarsDef {
  debut: string,
  visage: string,
  visageBlanc: string,
  fin: string
  eyes: Trait[]
  eyebrows: Trait[]
  mouth: Trait[]
  accessoires: Trait[]
  hair: Trait[]
  skinColor: Color[]
  hairColor: Color[]
}

interface Trait {
  id: number
  originalId: string
  length?: string
  emplacement?: string
  path: string
}

interface Color {
  id: number
  originalId: string
  color: string
}

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit {
  svg: string
  skinColor: string
  hairColor: string
  avatarsDef!: AvatarsDef
  eyes: number
  eyebrows: number
  mouth: number
  accessoires: number[]
  hair: number
  panel!: HTMLElement
  svgDiv!: HTMLElement
  event$: any
  ongletActif: string
  modaleConfirmation!: HTMLElement
  confirmationSvgDiv!: HTMLElement
  empecherNavigation: boolean
  redirection: string

  constructor(private http: HttpClient, public dataService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.skinColor = 'rgba(243, 237, 232, 1)'
    this.hairColor = 'rgba(172, 101, 17, 1)'
    this.svg = ''
    this.eyes = 0
    this.eyebrows = 0
    this.mouth = 0
    this.accessoires = [0]
    this.hair = 0
    this.ongletActif = 'couleur'
    this.empecherNavigation = true
    this.redirection = '/profil'
  }

  ngOnInit(): void {
    let div = document.getElementById("panel")
    if (div != null) this.panel = div
    div = document.getElementById('svgDiv')
    if (div != null) this.svgDiv = div
    this.recupereOngletActif()
    this.recupereParametresActuels()
    this.initPage()
    div = document.getElementById("modaleConfirmation")
    if (div != null) this.modaleConfirmation = div
    div = document.getElementById("confirmationSvgDiv")
    if (div != null) this.confirmationSvgDiv = div
  }

  ngOnDestroy() {
    this.event$.unsubscribe();
  }

  /**
   * Récupère l'onglet actif à partir de l'url pour le mettre en surbrillance
   */
  recupereOngletActif() {
    this.event$ = this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        if (this.empecherNavigation) {
          this.router.navigate(['/profil/avatar'])
          this.redirection = event.url
          this.afficherModaleConfirmation()
          this.empecherNavigation = false
        }
      }
    });
  }

  /**
   * Lance l'initialisation des différents paramètres de la page en récupérant au préalable les paramètres des avatars si besoin
   */
  initPage() {
    if (typeof (this.avatarsDef) == 'undefined') {
      this.http.get<AvatarsDef>('assets/data/avatars-def.json').subscribe(avatarsDef => {
        this.avatarsDef = avatarsDef
        this.initMenu()
        this.initPanel()
        this.initAvatar()
        this.majAvatar()
      })
    } else {
      this.initMenu()
      this.initPanel()
      this.initAvatar()
      this.majAvatar()
    }
  }

  /**
   * Récupère les infos de l'avatar actuel pour partir de l'avatar actuel
   */
  recupereParametresActuels() {
    if (this.dataService.user.codeAvatar != '') {
      const parametres = this.dataService.user.codeAvatar.split('&')
      this.skinColor = parametres[0]
      this.eyes = parseInt(parametres[1])
      this.eyebrows = parseInt(parametres[2])
      this.mouth = parseInt(parametres[3])
      this.accessoires = []
      for (const accessoire of parametres[4].split('-')) {
        this.accessoires.push(parseInt(accessoire))
      }
      this.hair = parseInt(parametres[5])
      this.hairColor = parametres[6]
    }
  }

  /**
   * Crée les images pour le menu
   */
  initMenu() {
    const skinColorMenu = document.getElementById("skinColorMenu")
    if (skinColorMenu != null) this.ajouteSvg(skinColorMenu, { skinColor: this.skinColor })
    const eyesMenu = document.getElementById("eyesMenu")
    if (eyesMenu != null) this.ajouteSvg(eyesMenu, { eyes: this.eyes })
    const eyebrowsMenu = document.getElementById("eyebrowsMenu")
    if (eyebrowsMenu != null) this.ajouteSvg(eyebrowsMenu, { eyebrows: this.eyebrows })
    const mouthMenu = document.getElementById("mouthMenu")
    if (mouthMenu != null) this.ajouteSvg(mouthMenu, { mouth: this.mouth })
    const accessoiresMenu = document.getElementById("accessoiresMenu")
    if (accessoiresMenu != null) this.ajouteSvg(accessoiresMenu, { accessoires: this.accessoires })
    const hairMenu = document.getElementById("hairMenu")
    if (hairMenu != null) this.ajouteSvg(hairMenu, { hair: this.hair })
    const hairColorMenu = document.getElementById("hairColorMenu")
    if (hairColorMenu != null) this.ajouteSvg(hairColorMenu, { hairColor: this.hairColor })
  }

  /**
   * Crée les images pour présenter les options
   */
  initPanel() {
    this.panel.textContent = ''
    switch (this.ongletActif) {
      case 'couleur':
        for (const element of this.avatarsDef.skinColor) {
          this.ajouteSvg(this.panel, { skinColor: element.color })
        }
        break;
      case 'yeux':
        for (const element of this.avatarsDef.eyes) {
          this.ajouteSvg(this.panel, { eyes: element.id })
        }
        break;
      case 'sourcils':
        for (const element of this.avatarsDef.eyebrows) {
          this.ajouteSvg(this.panel, { eyebrows: element.id })
        }
        break;
      case 'bouche':
        for (const element of this.avatarsDef.mouth) {
          this.ajouteSvg(this.panel, { mouth: element.id })
        }
        break;
      case 'accessoires':
        for (const element of this.avatarsDef.accessoires) {
          this.ajouteSvg(this.panel, { accessoires: [element.id] })
        }
        break;
      case 'cheveux':
        for (const element of this.avatarsDef.hair) {
          this.ajouteSvg(this.panel, { hair: element.id })
        }
        break;
      case 'couleurCheveux':
        for (const element of this.avatarsDef.hairColor) {
          this.ajouteSvg(this.panel, { hairColor: element.color })
        }
        break;
      default:
        break;
    }
    this.svgDiv.innerHTML = this.svg
  }

  /**
   * Met dans des div les paramètres de l'avatar actuel
   * (div qui seront modifiés par des onclick des différentes options)
   */
  initAvatar() {
    const skinColor = document.getElementById("skinColor")
    if (skinColor != null) skinColor.innerText = this.skinColor
    const eyes = document.getElementById("eyes")
    if (eyes != null) eyes.innerText = this.eyes.toString()
    const eyebrows = document.getElementById("eyebrows")
    if (eyebrows != null) eyebrows.innerText = this.eyebrows.toString()
    const mouth = document.getElementById("mouth")
    if (mouth != null) mouth.innerText = this.mouth.toString()
    const accessoires = document.getElementById("accessoires")
    if (accessoires != null) accessoires.innerText = this.accessoires.toString()
    const hair = document.getElementById("hair")
    if (hair != null) hair.innerText = this.hair.toString()
    const hairColor = document.getElementById("hairColor")
    if (hairColor != null) hairColor.innerText = this.hairColor
  }

  /**
   * Récupère les paramètres depuis les div
   */
  majAvatar() {
    const skinColor = document.getElementById("skinColor")
    if (skinColor != null) this.skinColor = skinColor.innerText
    const eyes = document.getElementById("eyes")
    if (eyes != null) this.eyes = parseInt(eyes.innerText)
    const eyebrows = document.getElementById("eyebrows")
    if (eyebrows != null) this.eyebrows = parseInt(eyebrows.innerText)
    const mouth = document.getElementById("mouth")
    if (mouth != null) this.mouth = parseInt(mouth.innerText)
    const accessoires = document.getElementById("accessoires")
    if (accessoires != null) this.accessoires = [parseInt(accessoires.innerText)]
    const hair = document.getElementById("hair")
    if (hair != null) this.hair = parseInt(hair.innerText)
    const hairColor = document.getElementById("hairColor")
    if (hairColor != null) this.hairColor = hairColor.innerText
    this.ajouteSvg(this.svgDiv, { eyes: this.eyes, eyebrows: this.eyebrows, mouth: this.mouth, accessoires: this.accessoires, hair: this.hair })
    this.initMenu()
  }

  /**
   * Fixe des paramètres aléatoires et relance l'initialisation de la page
   */
  avatarAleatoire() {
    this.skinColor = this.avatarsDef.skinColor[Math.floor(Math.random() * this.avatarsDef.skinColor.length)].color
    this.hairColor = this.avatarsDef.hairColor[Math.floor(Math.random() * this.avatarsDef.hairColor.length)].color
    this.eyes = this.avatarsDef.eyes[Math.floor(Math.random() * this.avatarsDef.eyes.length)].id
    this.eyebrows = this.avatarsDef.eyebrows[Math.floor(Math.random() * this.avatarsDef.eyebrows.length)].id
    this.mouth = this.avatarsDef.mouth[Math.floor(Math.random() * this.avatarsDef.mouth.length)].id
    this.accessoires = [this.avatarsDef.accessoires[Math.floor(Math.random() * this.avatarsDef.accessoires.length)].id]
    this.hair = this.avatarsDef.hair[Math.floor(Math.random() * this.avatarsDef.hair.length)].id
    this.initPage()
  }

  /**
   * Fonction principale qui sert à créer un svg à partir des données de avatars-def.json et des paramètres qui lui sont passés
   * @param cibleAAttacher HTMLElement à qui on va append le svg
   * @param el Paramètres de l'avatar à générer
   */
  ajouteSvg(cibleAAttacher: HTMLElement, el: { skinColor?: string, eyes?: number, eyebrows?: number, mouth?: number, accessoires?: number[], hair?: number, hairColor?: string }) {
    this.svg = this.avatarsDef.debut
    if (cibleAAttacher.id == 'panel' || cibleAAttacher.id == 'svgDiv') { // Panneau avec tous les choix et avatar en cours de création
      this.svg += "<g transform=\"translate(38.1 38.1) scale(0.9)\">"
      this.svg += this.avatarsDef.visage
      if (typeof (el.skinColor) != 'undefined') this.svg = this.svg.replace(/colorsSkinValue/g, el.skinColor)
      this.ajouteTrait(this.avatarsDef.eyes[typeof (el.eyes) != 'undefined' ? el.eyes : this.eyes], 'yeux')
      this.ajouteTrait(this.avatarsDef.eyebrows[typeof (el.eyebrows) != 'undefined' ? el.eyebrows : this.eyebrows], 'sourcils')
      this.ajouteTrait(this.avatarsDef.mouth[typeof (el.mouth) != 'undefined' ? el.mouth : this.mouth], 'bouche')
      for (const accessoire of typeof (el.accessoires) != 'undefined' ? el.accessoires : this.accessoires) {
        this.ajouteTrait(this.avatarsDef.accessoires[accessoire], 'accessoire')
      }
      this.ajouteTrait(this.avatarsDef.hair[typeof (el.hair) != 'undefined' ? el.hair : this.hair], 'cheveux')
      if (typeof (el.hairColor) != 'undefined') this.svg = this.svg.replace(/colorsHairValue/g, el.hairColor)
    } else { // Menu
      this.svg += "<g transform=\"translate(38.1 38.1) scale(0.9)\">"
      this.svg += this.avatarsDef.visageBlanc
      if (typeof (el.skinColor) == 'undefined') {
        this.svg += this.avatarsDef.visageBlanc
      } else {
        this.svg += this.avatarsDef.visage
      }
      if (typeof (el.eyes) != 'undefined') this.ajouteTrait(this.avatarsDef.eyes[el.eyes], 'yeux')
      if (typeof (el.eyebrows) != 'undefined') this.ajouteTrait(this.avatarsDef.eyebrows[el.eyebrows], 'sourcils')
      if (typeof (el.mouth) != 'undefined') this.ajouteTrait(this.avatarsDef.mouth[el.mouth], 'bouche')
      if (typeof (el.accessoires) != 'undefined') for (const accessoire of el.accessoires) {
        this.ajouteTrait(this.avatarsDef.accessoires[accessoire], 'accessoires')
      }
      if (typeof (el.hair) != 'undefined') this.ajouteTrait(this.avatarsDef.hair[el.hair], 'cheveux')
      if (typeof (el.hairColor) != 'undefined') this.ajouteTrait(this.avatarsDef.hair[this.hair], 'cheveux')
      if (typeof (el.hairColor) == 'undefined') this.svg = this.svg.replace(/colorsHairValue/g, '#000')
    }
    this.svg = this.svg.replace(/colorsSkinValue/g, this.skinColor)
    this.svg = this.svg.replace(/colorsHairValue/g, this.hairColor)
    this.svg += this.avatarsDef.fin
    let svg = document.createElement('div')
    svg.innerHTML = this.svg
    if (cibleAAttacher.id == 'panel') {
      svg.id = typeof (el.skinColor) != 'undefined' ? 'skin' + el.skinColor : typeof (el.eyes) != 'undefined' ? 'eyes' + el.eyes :
        typeof (el.eyebrows) != 'undefined' ? 'eyeb' + el.eyebrows : typeof (el.mouth) != 'undefined' ? 'mout' + el.mouth :
          typeof (el.accessoires) != 'undefined' ? 'acce' + this.accessoiresId(el.accessoires) :
            typeof (el.hair) != 'undefined' ? 'hair' + el.hair : typeof (el.hairColor) != 'undefined' ? 'hcol' + el.hairColor : 'inconnu'
    }
    svg.onclick = (function () {
      let div: HTMLElement | null = null
      switch (svg.id.slice(0, 4)) {
        case 'skin':
          div = document.getElementById('skinColor')
          break;
        case 'eyes':
          div = document.getElementById('eyes')
          break;
        case 'eyeb':
          div = document.getElementById('eyebrows')
          break;
        case 'mout':
          div = document.getElementById('mouth')
          break;
        case 'acce':
          div = document.getElementById('accessoires')
          break;
        case 'hair':
          div = document.getElementById('hair')
          break;
        case 'hcol':
          div = document.getElementById('hairColor')
          break;
      }
      if (div != null) {
        div.innerHTML = svg.id.slice(4)
      }
    })
    svg.className = 'is-width-130 is-inline-block'
    if (cibleAAttacher.id == 'panel') {
      cibleAAttacher.appendChild(svg)
    } else if (cibleAAttacher.id == 'svgDiv') {
      svg.className = 'is-inline-block'
      cibleAAttacher.replaceChild(svg.childNodes[0], cibleAAttacher.childNodes[0])
    } else {
      cibleAAttacher.textContent = ''
      cibleAAttacher.appendChild(svg)
    }
  }

  /**
   * Ferme la modale de confirmation
   * Envoie les données de l'avatar au controlleur de l'api
   * redirige vers le profil
   */
  majProfil(redirection: string = '/profil') {
    this.modaleConfirmation.style.display = 'none'
    this.dataService.majAvatar(this.lienImage(), `${this.skinColor}&${this.eyes}&${this.eyebrows}&${this.mouth}&${this.accessoiresId(this.accessoires)}&${this.hair}&${this.hairColor}`)
    this.router.navigate([redirection])
  }

  /**
   * Crée un lien permettant de construire l'emblème actuel
   * @returns lien image
   */
  lienImage() {
    const emblemeSVG = document.getElementById("svgDiv")
    let svgData = ''
    if (emblemeSVG != null) svgData = new XMLSerializer().serializeToString(emblemeSVG.childNodes[0]);
    return "data:image/svg+xml;base64," + btoa(svgData)
  }

  /**
   * append une copie de l'avatar à la modale de confirmation et l'affiche
   */
  afficherModaleConfirmation() {
    this.confirmationSvgDiv.textContent = ''
    this.confirmationSvgDiv.appendChild(this.svgDiv.cloneNode(true))
    this.modaleConfirmation.style.display = 'block'
  }

  /**
   * Ferme la modale de confirmation
   * Si la modale s'est affichée lorsque l'utilisateur voulait quitter la page, redirige vers là où il voulait aller
   */
  fermerModaleConfirmation(redirection?: string) {
    this.modaleConfirmation.style.display = 'none'
    if (!this.empecherNavigation) {
      if (redirection) this.router.navigate([redirection])
      else this.empecherNavigation = true
    }
  }

  /**
   * Ajoute un groupe contenant les infos du trait passé en paramètre
   * @param trait yeux, cheveux etc.
   * @param id id du groupe si on veut pouvoir y accéder plus tard
   */
  ajouteTrait(trait: Trait, id: string) {
    this.svg += `<g class="${id}" transform="translate(-161 -83)">`
    this.svg += trait.path
    this.svg += '</g>'
  }

  /**
   * Renvoie un string contenant les différents éléments de l'array séparés par des tirets
   * @param accessoires 
   * @returns string
   */
  accessoiresId(accessoires: number[]) {
    let str = ''
    for (const accessoire of accessoires) {
      str += this.avatarsDef.accessoires[accessoire].id + '-'
    }
    return str.slice(0, str.length - 1)
  }
}
