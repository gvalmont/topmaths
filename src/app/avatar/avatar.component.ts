import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router, NavigationStart, Event as NavigationEvent } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { ApiService } from '../services/api.service'

interface AvatarsDef {
  baliseOuverture: string
  visage: string
  visageBlanc: string
  baliseFermeture: string
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
export class AvatarComponent implements OnInit, OnDestroy {
  codeHTMLduSVG: string
  skinColor: string
  hairColor: string
  avatarsDef!: AvatarsDef // Variable stockant toutes les possibilités d'avatar présentes dans avatars-def.json
  eyes: number
  eyebrows: number
  mouth: number
  accessoires: number[]
  hair: number
  panneauPrincipal!: HTMLElement
  divAvatarEnCreation!: HTMLElement
  event$: any
  ongletActif: string
  modaleConfirmation!: HTMLElement
  modaleConfirmationDivAvatarEnCreation!: HTMLElement
  empecherNavigation: boolean
  redirection: string

  // eslint-disable-next-line no-unused-vars
  constructor(private httpClient: HttpClient, public apiService: ApiService, private router: Router) {
    this.skinColor = 'rgba(243, 237, 232, 1)'
    this.hairColor = 'rgba(172, 101, 17, 1)'
    this.codeHTMLduSVG = ''
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
    this.MAJDiv()
    this.surveillerLaNavigation()
    this.MAJParametresAvatarActuel()
    this.MAJPage()
  }

  ngOnDestroy() {
    this.event$.unsubscribe()
  }

  MAJDiv() {
    let div = document.getElementById("panneauPrincipal")
    if (div != null) this.panneauPrincipal = div
    div = document.getElementById('divAvatarEnCreation')
    if (div != null) this.divAvatarEnCreation = div
    div = document.getElementById("modaleConfirmation")
    if (div != null) this.modaleConfirmation = div
    div = document.getElementById("modaleConfirmationDivAvatarEnCreation")
    if (div != null) this.modaleConfirmationDivAvatarEnCreation = div
  }

  /**
   * Surveille la navigation pour éventuellement la bloquer si l'utilisateur veut quitter la page sans enregistrer son avatar
   */
  surveillerLaNavigation() {
    this.event$ = this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        if (this.empecherNavigation) {
          this.router.navigate(['/profil/avatar'])
          this.redirection = event.url
          this.afficherModaleConfirmation()
          this.empecherNavigation = false
        }
      }
    })
  }

  MAJParametresAvatarActuel() {
    if (this.apiService.user.codeAvatar != '') {
      const parametres = this.apiService.user.codeAvatar.split('&')
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

  MAJPage() {
    if (typeof (this.avatarsDef) == 'undefined') {
      this.httpClient.get<AvatarsDef>('assets/data/avatars-def.json').subscribe(avatarsDef => {
        this.avatarsDef = avatarsDef
        this.MAJMenu()
        this.MAJPanneauPrincipal()
        this.sauvegarderDonneesAvatar()
        this.recupererDonneesAvatar()
      })
    } else {
      this.MAJMenu()
      this.MAJPanneauPrincipal()
      this.sauvegarderDonneesAvatar()
      this.recupererDonneesAvatar()
    }
  }

  MAJMenu() {
    const skinColorMenu = document.getElementById("skinColorMenu")
    if (skinColorMenu != null) this.ajouterSVG(skinColorMenu, { skinColor: this.skinColor })
    const eyesMenu = document.getElementById("eyesMenu")
    if (eyesMenu != null) this.ajouterSVG(eyesMenu, { eyes: this.eyes })
    const eyebrowsMenu = document.getElementById("eyebrowsMenu")
    if (eyebrowsMenu != null) this.ajouterSVG(eyebrowsMenu, { eyebrows: this.eyebrows })
    const mouthMenu = document.getElementById("mouthMenu")
    if (mouthMenu != null) this.ajouterSVG(mouthMenu, { mouth: this.mouth })
    const accessoiresMenu = document.getElementById("accessoiresMenu")
    if (accessoiresMenu != null) this.ajouterSVG(accessoiresMenu, { accessoires: this.accessoires })
    const hairMenu = document.getElementById("hairMenu")
    if (hairMenu != null) this.ajouterSVG(hairMenu, { hair: this.hair })
    const hairColorMenu = document.getElementById("hairColorMenu")
    if (hairColorMenu != null) this.ajouterSVG(hairColorMenu, { hairColor: this.hairColor })
  }

  MAJPanneauPrincipal() {
    this.panneauPrincipal.textContent = ''
    switch (this.ongletActif) {
      case 'couleur':
        for (const element of this.avatarsDef.skinColor) {
          this.ajouterSVG(this.panneauPrincipal, { skinColor: element.color })
        }
        break
      case 'yeux':
        for (const element of this.avatarsDef.eyes) {
          this.ajouterSVG(this.panneauPrincipal, { eyes: element.id })
        }
        break
      case 'sourcils':
        for (const element of this.avatarsDef.eyebrows) {
          this.ajouterSVG(this.panneauPrincipal, { eyebrows: element.id })
        }
        break
      case 'bouche':
        for (const element of this.avatarsDef.mouth) {
          this.ajouterSVG(this.panneauPrincipal, { mouth: element.id })
        }
        break
      case 'accessoires':
        for (const element of this.avatarsDef.accessoires) {
          this.ajouterSVG(this.panneauPrincipal, { accessoires: [element.id] })
        }
        break
      case 'cheveux':
        for (const element of this.avatarsDef.hair) {
          this.ajouterSVG(this.panneauPrincipal, { hair: element.id })
        }
        break
      case 'couleurCheveux':
        for (const element of this.avatarsDef.hairColor) {
          this.ajouterSVG(this.panneauPrincipal, { hairColor: element.color })
        }
        break
      default:
        break
    }
    this.divAvatarEnCreation.innerHTML = this.codeHTMLduSVG
  }

  sauvegarderDonneesAvatar() {
    const skinColorDiv = document.getElementById("skinColor")
    if (skinColorDiv != null) skinColorDiv.innerText = this.skinColor
    const eyesDiv = document.getElementById("eyes")
    if (eyesDiv != null) eyesDiv.innerText = this.eyes.toString()
    const eyebrowsDiv = document.getElementById("eyebrows")
    if (eyebrowsDiv != null) eyebrowsDiv.innerText = this.eyebrows.toString()
    const mouthDiv = document.getElementById("mouth")
    if (mouthDiv != null) mouthDiv.innerText = this.mouth.toString()
    const accessoiresDiv = document.getElementById("accessoires")
    if (accessoiresDiv != null) accessoiresDiv.innerText = this.accessoires.toString()
    const hairDiv = document.getElementById("hair")
    if (hairDiv != null) hairDiv.innerText = this.hair.toString()
    const hairColorDiv = document.getElementById("hairColor")
    if (hairColorDiv != null) hairColorDiv.innerText = this.hairColor
  }

  recupererDonneesAvatar() {
    const skinColorDiv = document.getElementById("skinColor")
    if (skinColorDiv != null) this.skinColor = skinColorDiv.innerText
    const eyesDiv = document.getElementById("eyes")
    if (eyesDiv != null) this.eyes = parseInt(eyesDiv.innerText)
    const eyebrowsDiv = document.getElementById("eyebrows")
    if (eyebrowsDiv != null) this.eyebrows = parseInt(eyebrowsDiv.innerText)
    const mouthDiv = document.getElementById("mouth")
    if (mouthDiv != null) this.mouth = parseInt(mouthDiv.innerText)
    const accessoiresDiv = document.getElementById("accessoires")
    if (accessoiresDiv != null) this.accessoires = [parseInt(accessoiresDiv.innerText)]
    const hairDiv = document.getElementById("hair")
    if (hairDiv != null) this.hair = parseInt(hairDiv.innerText)
    const hairColorDiv = document.getElementById("hairColor")
    if (hairColorDiv != null) this.hairColor = hairColorDiv.innerText
    this.ajouterSVG(this.divAvatarEnCreation, { eyes: this.eyes, eyebrows: this.eyebrows, mouth: this.mouth, accessoires: this.accessoires, hair: this.hair })
    this.MAJMenu()
  }

  ajouterSVG(cibleAAttacher: HTMLElement, parametres: { skinColor?: string, eyes?: number, eyebrows?: number, mouth?: number, accessoires?: number[], hair?: number, hairColor?: string }) {
    this.genererCodeHTMLduSVG(cibleAAttacher, parametres)
    const divSVG = this.genererDivSVG(cibleAAttacher, parametres)
    this.attacherDivSVG(cibleAAttacher, divSVG)
  }

  genererCodeHTMLduSVG(cibleAAttacher: HTMLElement, parametres: { skinColor?: string, eyes?: number, eyebrows?: number, mouth?: number, accessoires?: number[], hair?: number, hairColor?: string }) {
    this.codeHTMLduSVG = this.avatarsDef.baliseOuverture
    if (cibleAAttacher.id == 'panneauPrincipal' || cibleAAttacher.id == 'divAvatarEnCreation') { // Panneau principal ou avatar en cours de création
      this.codeHTMLduSVG += "<g transform=\"translate(38.1 38.1) scale(0.9)\">"
      this.codeHTMLduSVG += this.avatarsDef.visage
      if (typeof (parametres.skinColor) != 'undefined') this.codeHTMLduSVG = this.codeHTMLduSVG.replace(/colorsSkinValue/g, parametres.skinColor)
      this.ajouterTrait(this.avatarsDef.eyes[typeof (parametres.eyes) != 'undefined' ? parametres.eyes : this.eyes], 'yeux')
      this.ajouterTrait(this.avatarsDef.eyebrows[typeof (parametres.eyebrows) != 'undefined' ? parametres.eyebrows : this.eyebrows], 'sourcils')
      this.ajouterTrait(this.avatarsDef.mouth[typeof (parametres.mouth) != 'undefined' ? parametres.mouth : this.mouth], 'bouche')
      for (const accessoire of typeof (parametres.accessoires) != 'undefined' ? parametres.accessoires : this.accessoires) {
        this.ajouterTrait(this.avatarsDef.accessoires[accessoire], 'accessoire')
      }
      this.ajouterTrait(this.avatarsDef.hair[typeof (parametres.hair) != 'undefined' ? parametres.hair : this.hair], 'cheveux')
      if (typeof (parametres.hairColor) != 'undefined') this.codeHTMLduSVG = this.codeHTMLduSVG.replace(/colorsHairValue/g, parametres.hairColor)
    } else { // Menu
      this.codeHTMLduSVG += "<g transform=\"translate(38.1 38.1) scale(0.9)\">"
      this.codeHTMLduSVG += this.avatarsDef.visageBlanc
      if (typeof (parametres.skinColor) == 'undefined') {
        this.codeHTMLduSVG += this.avatarsDef.visageBlanc
      } else {
        this.codeHTMLduSVG += this.avatarsDef.visage
      }
      if (typeof (parametres.eyes) != 'undefined') this.ajouterTrait(this.avatarsDef.eyes[parametres.eyes], 'yeux')
      if (typeof (parametres.eyebrows) != 'undefined') this.ajouterTrait(this.avatarsDef.eyebrows[parametres.eyebrows], 'sourcils')
      if (typeof (parametres.mouth) != 'undefined') this.ajouterTrait(this.avatarsDef.mouth[parametres.mouth], 'bouche')
      if (typeof (parametres.accessoires) != 'undefined') for (const accessoire of parametres.accessoires) {
        this.ajouterTrait(this.avatarsDef.accessoires[accessoire], 'accessoires')
      }
      if (typeof (parametres.hair) != 'undefined') this.ajouterTrait(this.avatarsDef.hair[parametres.hair], 'cheveux')
      if (typeof (parametres.hairColor) != 'undefined') this.ajouterTrait(this.avatarsDef.hair[this.hair], 'cheveux')
      if (typeof (parametres.hairColor) == 'undefined') this.codeHTMLduSVG = this.codeHTMLduSVG.replace(/colorsHairValue/g, '#000')
    }
    this.codeHTMLduSVG = this.codeHTMLduSVG.replace(/colorsSkinValue/g, this.skinColor)
    this.codeHTMLduSVG = this.codeHTMLduSVG.replace(/colorsHairValue/g, this.hairColor)
    this.codeHTMLduSVG += this.avatarsDef.baliseFermeture
  }

  /**
   * Ajoute un groupe contenant les infos du trait passé en paramètre
   * @param trait yeux, cheveux etc.
   * @param id id du groupe si on veut pouvoir y accéder plus tard
   */
  ajouterTrait(trait: Trait, id: string) {
    this.codeHTMLduSVG += `<g class="${id}" transform="translate(-161 -83)">`
    this.codeHTMLduSVG += trait.path
    this.codeHTMLduSVG += '</g>'
  }

  genererDivSVG(cibleAAttacher: HTMLElement, parametres: { skinColor?: string, eyes?: number, eyebrows?: number, mouth?: number, accessoires?: number[], hair?: number, hairColor?: string }) {
    const divSVG = document.createElement('div')
    divSVG.innerHTML = this.codeHTMLduSVG
    if (cibleAAttacher.id == 'panneauPrincipal') { // Stocker le type de paramètre et sa valeur dans l'id du div
      divSVG.id = typeof (parametres.skinColor) != 'undefined' ? 'skin' + parametres.skinColor : typeof (parametres.eyes) != 'undefined' ? 'eyes' + parametres.eyes :
        typeof (parametres.eyebrows) != 'undefined' ? 'eyeb' + parametres.eyebrows : typeof (parametres.mouth) != 'undefined' ? 'mout' + parametres.mouth :
          typeof (parametres.accessoires) != 'undefined' ? 'acce' + this.getAccessoiresId(parametres.accessoires) :
            typeof (parametres.hair) != 'undefined' ? 'hair' + parametres.hair : typeof (parametres.hairColor) != 'undefined' ? 'hcol' + parametres.hairColor : 'inconnu'
    }
    divSVG.onclick = (function () { // onclick, stocker la valeur du div cliqué dans le div de stockage correspondant
      let div: HTMLElement | null = null
      switch (divSVG.id.slice(0, 4)) {
        case 'skin':
          div = document.getElementById('skinColor')
          break
        case 'eyes':
          div = document.getElementById('eyes')
          break
        case 'eyeb':
          div = document.getElementById('eyebrows')
          break
        case 'mout':
          div = document.getElementById('mouth')
          break
        case 'acce':
          div = document.getElementById('accessoires')
          break
        case 'hair':
          div = document.getElementById('hair')
          break
        case 'hcol':
          div = document.getElementById('hairColor')
          break
      }
      if (div != null) {
        div.innerHTML = divSVG.id.slice(4)
      }
    })
    divSVG.className = 'is-width-130 is-inline-block'
    return divSVG
  }

  /**
   * Renvoie un string contenant les différents éléments de l'array séparés par des tirets
   * @param accessoires 
   * @returns string
   */
  getAccessoiresId(accessoires: number[]) {
    let str = ''
    for (const accessoire of accessoires) {
      str += this.avatarsDef.accessoires[accessoire].id + '-'
    }
    return str.slice(0, str.length - 1)
  }

  attacherDivSVG(cibleAAttacher: HTMLElement, divSVG: HTMLDivElement) {
    if (cibleAAttacher.id == 'panneauPrincipal') {
      cibleAAttacher.appendChild(divSVG)
    } else if (cibleAAttacher.id == 'divAvatarEnCreation') {
      divSVG.className = 'is-inline-block'
      cibleAAttacher.replaceChild(divSVG.childNodes[0], cibleAAttacher.childNodes[0])
    } else {
      cibleAAttacher.textContent = ''
      cibleAAttacher.appendChild(divSVG)
    }
  }

  MAJAvatar(redirection: string = '/profil') {
    this.modaleConfirmation.style.display = 'none'
    this.apiService.MAJAvatar(this.getAvatarFichierSVG(), `${this.skinColor}&${this.eyes}&${this.eyebrows}&${this.mouth}&${this.getAccessoiresId(this.accessoires)}&${this.hair}&${this.hairColor}`)
    this.router.navigate([redirection])
  }

  getAvatarFichierSVG() {
    const divAvatarEnCreation = document.getElementById("divAvatarEnCreation")
    let svgData = ''
    if (divAvatarEnCreation != null) svgData = new XMLSerializer().serializeToString(divAvatarEnCreation.childNodes[0])
    return "data:image/codeHTMLduSVG+xml;base64," + btoa(svgData)
  }

  avatarAleatoire() {
    this.skinColor = this.avatarsDef.skinColor[Math.floor(Math.random() * this.avatarsDef.skinColor.length)].color
    this.hairColor = this.avatarsDef.hairColor[Math.floor(Math.random() * this.avatarsDef.hairColor.length)].color
    this.eyes = this.avatarsDef.eyes[Math.floor(Math.random() * this.avatarsDef.eyes.length)].id
    this.eyebrows = this.avatarsDef.eyebrows[Math.floor(Math.random() * this.avatarsDef.eyebrows.length)].id
    this.mouth = this.avatarsDef.mouth[Math.floor(Math.random() * this.avatarsDef.mouth.length)].id
    this.accessoires = [this.avatarsDef.accessoires[Math.floor(Math.random() * this.avatarsDef.accessoires.length)].id]
    this.hair = this.avatarsDef.hair[Math.floor(Math.random() * this.avatarsDef.hair.length)].id
    this.MAJPage()
  }

  afficherModaleConfirmation() {
    this.modaleConfirmationDivAvatarEnCreation.textContent = ''
    this.modaleConfirmationDivAvatarEnCreation.appendChild(this.divAvatarEnCreation.cloneNode(true))
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
}
