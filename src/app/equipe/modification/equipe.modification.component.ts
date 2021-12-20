import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

interface GuildEmblems {
  emblemBackgroundDefs: SVGPathElement[][]
  emblemDefs: EmblemDef[]
  flagTransforms: FlagTransforms
}

interface EmblemDef {
  size: number
  pto2: SVGPathElement[]
  pt1: SVGPathElement[]
  p1: SVGPathElement[]
  p2: SVGPathElement[]
}

interface FlagTransforms {
  background: {
    FlipBackgroundHorizontal: string
    FlipBackgroundVertical: string
  },
  foreground: {
    FlipForegroundHorizontal: string
    FlipForegroundVertical: string
  }
}
interface Parameters {
  emblem: Emblem
  size: string
  type: string
}

interface Emblem {
  foreground: {
    id: number
    colors: [string, string]
  }
  background: {
    id: number
    colors: [string]
  }
}

@Component({
  selector: 'app-admin',
  templateUrl: './equipe.modification.component.html',
  styleUrls: ['./equipe.modification.component.css']
})
export class EquipeModificationComponent implements OnInit {
  foregroundId: number
  foregroundPrimaryColor: string
  foregroundSecondaryColor: string
  backgroundId: number
  backgroundColor: string
  emblemBackgroundDefs: SVGPathElement[][]
  emblemDefs: EmblemDef[]
  flagTransforms!: FlagTransforms
  backgrounds!: HTMLElement
  foregrounds!: HTMLElement
  embleme!: HTMLElement
  flags: string[]
  modaleNom!: HTMLElement
  creation: boolean
  modification: boolean
  angForm: FormGroup
  defaut: boolean
  errGrandNbChar: boolean
  errPetitNbChar: boolean
  errSpChar: boolean
  errNomInterdit: boolean
  errDejaPris: boolean
  shake: boolean
  teamName: string

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute, public dataService: ApiService) {
    this.emblemBackgroundDefs = []
    this.emblemDefs = []
    this.foregroundId = Math.floor(Math.random() * 243 + 1)
    this.backgroundId = Math.floor(Math.random() * 27 + 2)
    this.backgroundColor = '#00FF00'
    this.foregroundPrimaryColor = '#0000FF'
    this.foregroundSecondaryColor = '#FF0000'
    this.flags = []
    this.modification = false
    this.creation = false
    this.teamName = ''
    this.angForm = new FormGroup({
      teamName: new FormControl('', [Validators.required])
    })
    this.defaut = true
    this.errGrandNbChar = false
    this.errPetitNbChar = false
    this.errSpChar = false
    this.errNomInterdit = false
    this.errDejaPris = false
    this.shake = false
    this.surveilleChamp()
    this.route.params.subscribe(params => {
      if (params.ref == 'modification') {
        this.modification = true
        this.creation = false
      } else {
        this.modification = false
        this.creation = true
      }
    })
  }

  ngOnInit(): void {
    this.http.get<GuildEmblems>('assets/data/guildemblems-def.json').subscribe(guildEmblems => {
      this.emblemBackgroundDefs = guildEmblems.emblemBackgroundDefs
      this.emblemDefs = guildEmblems.emblemDefs
      this.flagTransforms = guildEmblems.flagTransforms
      this.initCouleurs()
      this.initbackgrounds()
      this.initforegrounds()
      this.initEmbleme()
      this.majHauteur()
    })
  }

  /**
   * Surveille le champ de connexion,
   * lance l'actualisation des booléens sur lesquels s'appuie le formatage du champ
   */
  surveilleChamp() {
    this.angForm.valueChanges.subscribe(x => {
      this.teamName = x.teamName
      this.inputOk()
    })
  }

  /**
   * Actualise les booléens sur lesquels s'appuie le formatage du champ
   * @return true si tout est Ok, false sinon
   */
  inputOk() {
    this.defaut = true
    this.errSpChar = false
    this.errPetitNbChar = false
    this.errGrandNbChar = false
    this.errNomInterdit = false
    this.errDejaPris = false
    if (this.teamName.length != 0) this.defaut = false
    if (this.teamName.length < 3 && this.teamName.length != 0) this.errPetitNbChar = true
    if (this.teamName.length > 3) this.errGrandNbChar = true
    if (!this.dataService.onlyLettersAndNumbers(this.teamName)) this.errSpChar = true
    const listeDesNomsInterdits = ['6KB', 'KBO', 'KB0', 'BIT', 'CAB', 'PEN', 'PUT', 'SLP']
    if (listeDesNomsInterdits.includes(this.teamName.toUpperCase())) this.errNomInterdit = true
    return (!this.defaut && !this.errSpChar && !this.errPetitNbChar && !this.errGrandNbChar && !this.errNomInterdit)
  }

  /**
   * Secoue le champ si la saisie est incorrecte,
   * vérifie si le nom n'est pas encore pris,
   * effectue la modification le cas échéant
   * @param teamName
   */
  envoi(teamName: string) {
    if (this.inputOk()) {
      this.dataService.creationEquipe(teamName.toUpperCase(), this.lienImage(),
        this.foregroundId, this.foregroundPrimaryColor, this.foregroundSecondaryColor,
        this.backgroundId, this.backgroundColor)
    } else {
      if (this.defaut) {
        alert("Il faut choisir le nom de l'équipe !")
        this.defaut = false
        this.errPetitNbChar = true
      }
      this.shake = true
      setTimeout(() => this.shake = false, 500)
    }
  }

  /**
   * Crée un lien permettant de construire l'emblème actuel
   * @returns lien image
   */
  lienImage() {
    const emblemeSVG = document.getElementById("emblemeSVG")
    let svgData = ''
    if (emblemeSVG != null) svgData = new XMLSerializer().serializeToString(emblemeSVG.childNodes[0]);
    svgData = svgData.replace(/var\(--foreground-primary-color\)/g, this.foregroundPrimaryColor)
    svgData = svgData.replace(/var\(--foreground-secondary-color\)/g, this.foregroundSecondaryColor)
    svgData = svgData.replace(/var\(--background-color\)/g, this.backgroundColor)
    // let img = new Image();
    // img.src = "data:image/svg+xml;base64," + btoa(svgData);
    // document.body.appendChild(img);
    return "data:image/svg+xml;base64," + btoa(svgData)
  }

  /**
   * Met des couleurs aléatoires aux emblèmes
   */
  initCouleurs() {
    this.foregroundPrimaryColor = this.couleurAleatoire()
    this.foregroundSecondaryColor = this.couleurAleatoire()
    this.backgroundColor = this.couleurAleatoire()
    this.majCouleurs()
  }

  /**
   * Aléatoirise un paramètre
   * @param cible peut être 'foregroundPrimaryColor', 'foregroundSecondaryColor', 'backgroundColor', 'backgroundId' ou 'foregroundId'
   */
  majAleatoire(cible: string) {
    switch (cible) {
      case 'foregroundPrimaryColor':
        this.majForegroundPrimaryColor(this.couleurAleatoire())
        break;
      case 'foregroundSecondaryColor':
        this.majForegroundSecondaryColor(this.couleurAleatoire())
        break;
      case 'backgroundColor':
        this.majBackgroundColor(this.couleurAleatoire())
        break;
      case 'backgroundId':
        this.backgroundId = Math.floor(Math.random() * 27 + 2)
        this.initEmbleme()
        break;
      case 'foregroundId':
        this.foregroundId = Math.floor(Math.random() * 243 + 1)
        this.initEmbleme()
        break;
    }
  }

  /**
   * Met à jour la couleur principale
   * @param event couleur
   */
  majForegroundPrimaryColor(event: string) {
    this.foregroundPrimaryColor = event
    this.majCouleurs()
  }

  /**
   * Met à jour la couleur secondaire
   * @param event couleur
   */
  majForegroundSecondaryColor(event: string) {
    this.foregroundSecondaryColor = event
    this.majCouleurs()
  }

  /**
   * Met à jour la couleur de l'arriève plan
   * @param event couleur
   */
  majBackgroundColor(event: string) {
    this.backgroundColor = event
    this.majCouleurs()
  }

  /**
   * Ajoute les images de tous les backgrounds
   */
  initbackgrounds() {
    const backgrounds = <HTMLElement>document.getElementById("backgrounds")
    if (backgrounds != null) this.backgrounds = backgrounds
    for (let i = 2; i < 28; i++) {
      const backgroundId = i
      this.createEmblemImage({
        emblem: {
          foreground: {
            id: 0,
            colors: [this.foregroundPrimaryColor, this.foregroundSecondaryColor]
          },
          background: {
            id: backgroundId,
            colors: [this.backgroundColor]
          }
        },
        size: "100px",
        type: 'backgrounds'
      })
    }
  }

  /**
   * Ajoute les images de tous les foregrounds
   */
  initforegrounds() {
    const foregrounds = document.getElementById("foregrounds")
    if (foregrounds != null) this.foregrounds = foregrounds
    for (let i = 1; i < 243; i++) {
      const foregroundId = i
      this.createEmblemImage({
        emblem: {
          foreground: {
            id: foregroundId,
            colors: [this.foregroundPrimaryColor, this.foregroundSecondaryColor]
          },
          background: {
            id: 0,
            colors: [this.backgroundColor]
          }
        },
        size: "100px",
        type: 'foregrounds'
      })
    }
  }

  /**
   * Met les paramètres des emblèmes dans des div (pour pouvoir les mettre à jour avec des onclick)
   */
  initEmbleme() {
    const embleme = document.getElementById("embleme")
    if (embleme != null) this.embleme = embleme
    const foregroundIdDiv = document.getElementById("foregroundId")
    if (foregroundIdDiv != null) foregroundIdDiv.innerHTML = this.foregroundId.toString()
    const backgroundIdDiv = document.getElementById("backgroundId")
    if (backgroundIdDiv != null) backgroundIdDiv.innerHTML = this.backgroundId.toString()
    this.majEmbleme()
  }

  /**
   * Récupère les paramètres des div
   * Relance la création de l'emblème en cours de construction
   */
  majEmbleme() {
    const foregroundIdDiv = document.getElementById("foregroundId")
    if (foregroundIdDiv != null) this.foregroundId = parseInt(foregroundIdDiv.innerHTML)
    const backgroundIdDiv = document.getElementById("backgroundId")
    if (backgroundIdDiv != null) this.backgroundId = parseInt(backgroundIdDiv.innerHTML)
    this.createEmblemImage({
      emblem: {
        foreground: {
          id: this.foregroundId,
          colors: [this.foregroundPrimaryColor, this.foregroundSecondaryColor]
        },
        background: {
          id: this.backgroundId,
          colors: [this.backgroundColor]
        }
      },
      size: "300px",
      type: 'embleme'
    })
  }

  /**
   * On détecte les changements de taille de fenêtre,
   * et on ajuste la largeur des cartes en conséquence.
   * @param event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.majHauteur()
  }

  /**
   * Modifie la hauteur de la fenêtre pour enlever le scroll général et n'avoir des scrolls que pour les foregrounds
   */
  majHauteur() {
    const root = <HTMLElement>document.querySelector(':root');
    root.style.setProperty('--window-height', (window.innerHeight - 100).toString() + 'px');
  }

  /**
   * Fonction principale qui crée un emblème et l'append (backgrounds et foregrounds) ou le remplace (embleme)
   * @param parameters 
   */
  createEmblemImage(parameters: Parameters) {
    const emblem = parameters.emblem;

    // Shortcut function for creating svg elements (without having to append them to the document)
    const createSVG = function (tagName: string, parameters: Object) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", tagName)
      let property: keyof typeof parameters;
      for (property in parameters) {
        const tesh = parameters[property].toString()
        svg.setAttribute(property, tesh)
      }
      return svg
    };
    const createGroup = function (paths: SVGPathElement[], groupAttributes: Object) {
      const grp = createSVG("g", groupAttributes);

      for (let i = 0; i < paths.length; i++) {
        const attributes = { "d": paths[i] };
        grp.append(createSVG("path", attributes));
      }
      return grp;
    };

    let bg: SVGPathElement[] | null = null;
    let fg: EmblemDef | null = null;

    if (emblem.background) {
      bg = this.emblemBackgroundDefs[emblem.background.id];
      //if (!bg) console.log("Unexisting or unsupported emblem background ID." + (emblem.background.id ? " (id=" + emblem.background.id + ")" : ""));
    }
    if (emblem.foreground) {
      fg = this.emblemDefs[emblem.foreground.id];
      //if (!fg) console.log("Unexisting or unsupported emblem foreground ID." + (emblem.foreground.id ? " (id=" + emblem.foreground.id + ")" : ""));
    }
    // Apply transforms depending on flags. Example flag: FlipbackgroundVertical
    let bgTransform = "", fgTransform = "";
    if (this.flags) {
      for (let i = 0; i < this.flags.length; i++) {
        if (this.flags[i] == 'FlipbackgroundHorizontal') bgTransform += this.flagTransforms.background.FlipBackgroundHorizontal
        if (this.flags[i] == 'FlipbackgroundVertical') bgTransform += this.flagTransforms.background.FlipBackgroundVertical
        if (this.flags[i] == 'FlipforegroundHorizontal') bgTransform += this.flagTransforms.foreground.FlipForegroundHorizontal
        if (this.flags[i] == 'FlipforegroundVertical') bgTransform += this.flagTransforms.foreground.FlipForegroundVertical
      }
    }

    // replace "100%" with actual size
    fgTransform = fgTransform.replace(/100%/g, parameters.size);
    bgTransform = bgTransform.replace(/100%/g, parameters.size);

    // Create main SVG container
    const svg = createSVG("svg", { width: parameters.size, height: parameters.size, "shape-rendering": "geometricPrecision" });

    // background path
    if (bg) {
      const bgColor = 'var(--background-color)'
      const bgScaling = parseInt(parameters.size) / 256

      const bgGroup = createSVG("g", { "transform": bgTransform + "scale(" + bgScaling + "," + bgScaling + ")", "stroke-width": ".05%" });
      bgGroup.append(createGroup(bg, { "fill": bgColor }))

      svg.append(bgGroup);
    }

    // foreground paths
    if (fg) {
      const primaryFgColor = 'var(--foreground-primary-color)'
      const secondaryFgColor = 'var(--foreground-secondary-color)'
      const fgScaling = parseInt(parameters.size) / (fg && fg.size ? fg.size : 256);

      // Fixing some issues with some of the svg defs (this is some very dirty code)
      let extraTransforms = "";
      if (emblem.foreground.id == 234 || emblem.foreground.id == 238)
        extraTransforms = " translate(0, " + fg.size + ") scale(0.1, -0.1)";
      if (emblem.foreground.id == 236 || emblem.foreground.id == 239 || emblem.foreground.id == 240 || emblem.foreground.id == 241 || emblem.foreground.id == 243)
        extraTransforms = " translate(0, " + fg.size + ") scale(0.05, -0.05)";
      if (emblem.foreground.id == 235 || emblem.foreground.id == 237)
        extraTransforms = " translate(0, " + fg.size + ") scale(0.033, -0.033)";

      const fgGroup = createSVG("g", { "transform": fgTransform + "scale(" + fgScaling + "," + fgScaling + ")" + extraTransforms, "stroke-width": ".05%" });

      const shadeColor = function (color: string, percent: number) {
        const f = parseInt(color.slice(1), 16), t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
        return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
      }

      if (fg.p1 && fg.p1.length > 0)
        fgGroup.append(createGroup(fg.p1, { "fill": primaryFgColor }));
      if (fg.pto2 && fg.pto2.length > 0)
        fgGroup.append(createGroup(fg.pto2, { "fill": "rgb(0, 0, 0)", "opacity": 0.3 }));
      if (fg.pt1 && fg.pt1.length > 0)
        fgGroup.append(createGroup(fg.pt1, { "fill": primaryFgColor ? shadeColor(primaryFgColor, 0.25) : "" }));
      if (fg.p2 && fg.p2.length > 0)
        fgGroup.append(createGroup(fg.p2, { "fill": secondaryFgColor }));

      svg.append(fgGroup);
    }
    let cibleAAttacher: HTMLElement | null = null
    const svgElement = document.createElement("svg")
    switch (parameters.type) {
      case 'backgrounds':
        svgElement.id = parameters.type + emblem.background.id
        cibleAAttacher = this.backgrounds
        break;
      case 'foregrounds':
        svgElement.id = parameters.type + emblem.foreground.id
        cibleAAttacher = this.foregrounds
        break;
      case 'embleme':
        svgElement.id = parameters.type + 'SVG'
        cibleAAttacher = this.embleme
        break;
    }

    svgElement.onclick = (function () {
      if (svgElement.id.slice(0, 11) == 'foregrounds') {
        const foregroundDiv = document.getElementById('foregroundId')
        if (foregroundDiv != null) foregroundDiv.innerHTML = svgElement.id.slice(11)
      }
      if (svgElement.id.slice(0, 11) == 'backgrounds') {
        const foregroundDiv = document.getElementById('backgroundId')
        if (foregroundDiv != null) foregroundDiv.innerHTML = svgElement.id.slice(11)
      }
    })
    if (svgElement != null) svgElement.appendChild(svg);
    if (cibleAAttacher != null) {
      cibleAAttacher.appendChild(svgElement)
      if (parameters.type == 'embleme') cibleAAttacher.replaceChild(svgElement, cibleAAttacher.childNodes[0])
    }
  }

  /**
   * Renvoie une couleur aléatoire de type rgba
   * @returns rgba( , , , )
   */
  couleurAleatoire() {
    const o = Math.round, r = Math.random, s = 255
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')'
  }

  /**
   * Change la couleur de tous les emblèmes
   */
  majCouleurs() {
    const backgrounds = <HTMLElement>document.querySelector('.backgrounds');
    const foregrounds = <HTMLElement>document.querySelector('.foregrounds');
    const embleme = <HTMLElement>document.querySelector('.embleme');
    if (backgrounds != null) backgrounds.style.setProperty('--background-color', this.backgroundColor);
    if (foregrounds != null) {
      foregrounds.style.setProperty('--foreground-primary-color', this.foregroundPrimaryColor);
      foregrounds.style.setProperty('--foreground-secondary-color', this.foregroundSecondaryColor);
    }
    if (embleme != null) {
      embleme.style.setProperty('--background-color', this.backgroundColor);
      embleme.style.setProperty('--foreground-primary-color', this.foregroundPrimaryColor);
      embleme.style.setProperty('--foreground-secondary-color', this.foregroundSecondaryColor);
    }
  }
}
