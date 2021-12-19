import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';

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

interface Parameters {
  emblem: Emblem,
  size: string,
  type: string
}

interface GuildEmblems {
  emblemBackgroundDefs: any,
  emblemDefs: any,
  flagTransforms: {
    background: {
      FlipbackgroundHorizontal: string,
      FlipbackgroundVertical: string
    },
    foreground: {
      FlipforegroundHorizontal: string,
      FlipforegroundVertical: string
    }
  }
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  foregroundId: number
  foregroundPrimaryColor: string
  foregroundSecondaryColor: string
  backgroundId: number
  backgroundColor: string
  emblemBackgroundDefs: any
  emblemDefs: any
  flagTransforms: any
  backgrounds!: HTMLElement
  foregrounds!: HTMLElement
  embleme!: HTMLElement
  flags: string[]

  constructor(private http: HttpClient) {
    this.foregroundId = 233
    this.backgroundId = 8
    this.backgroundColor = '#00FF00'
    this.foregroundPrimaryColor = '#0000FF'
    this.foregroundSecondaryColor = '#FF0000'
    this.flags = []
  }

  ngOnInit(): void {
    this.http.get<GuildEmblems>('assets/data/guildemblems-def.json').subscribe(guildEmblems => {
      this.emblemBackgroundDefs = guildEmblems.emblemBackgroundDefs
      this.emblemDefs = guildEmblems.emblemDefs
      this.flagTransforms = guildEmblems.flagTransforms
      this.initbackgrounds()
      this.initforegrounds()
      this.initEmbleme()
      this.majEmbleme()
      this.majHauteur()
    })
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
    const foregroundPrimaryColorDiv = document.getElementById("foregroundPrimaryColor")
    if (foregroundPrimaryColorDiv != null) foregroundPrimaryColorDiv.innerHTML = this.foregroundPrimaryColor.toString()
    const foregroundSecondaryColorDiv = document.getElementById("foregroundSecondaryColor")
    if (foregroundSecondaryColorDiv != null) foregroundSecondaryColorDiv.innerHTML = this.foregroundSecondaryColor.toString()
    const backgroundIdDiv = document.getElementById("backgroundId")
    if (backgroundIdDiv != null) backgroundIdDiv.innerHTML = this.backgroundId.toString()
    const backgroundColorDiv = document.getElementById("backgroundColor")
    if (backgroundColorDiv != null) backgroundColorDiv.innerHTML = this.backgroundColor.toString()
  }

  /**
   * Récupère les paramètres des div
   * Relance la création de l'emblème en cours de construction
   */
  majEmbleme() {
    const foregroundIdDiv = document.getElementById("foregroundId")
    if (foregroundIdDiv != null) this.foregroundId = parseInt(foregroundIdDiv.innerHTML)
    const foregroundPrimaryColorDiv = document.getElementById("foregroundPrimaryColor")
    if (foregroundPrimaryColorDiv != null) this.foregroundPrimaryColor = foregroundPrimaryColorDiv.innerHTML
    const foregroundSecondaryColorDiv = document.getElementById("foregroundSecondaryColor")
    if (foregroundSecondaryColorDiv != null) this.foregroundSecondaryColor = foregroundSecondaryColorDiv.innerHTML
    const backgroundIdDiv = document.getElementById("backgroundId")
    if (backgroundIdDiv != null) this.backgroundId = parseInt(backgroundIdDiv.innerHTML)
    const backgroundColorDiv = document.getElementById("backgroundColor")
    if (backgroundColorDiv != null) this.backgroundColor = backgroundColorDiv.innerHTML
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
    root.style.setProperty('--window-height', (window.innerHeight - 350).toString() + 'px');
  }

  /**
   * Fonction principale qui crée un emblème et l'append (backgrounds et foregrounds) ou le remplace (embleme)
   * @param parameters 
   */
  createEmblemImage(parameters: Parameters) {
    let emblem = parameters.emblem;

    // Shortcut function for creating svg elements (without having to append them to the document)
    let createSVG = function (tagName: string, parameters: Object) {
      let svg = document.createElementNS("http://www.w3.org/2000/svg", tagName)
      let property: keyof typeof parameters;
      for (property in parameters) {
        const tesh = parameters[property].toString()
        svg.setAttribute(property, tesh)
      }
      return svg
    };
    let createGroup = function (paths: any, groupAttributes: any) {
      var grp = createSVG("g", groupAttributes);

      for (var i = 0; i < paths.length; i++) {
        var attributes = { "d": paths[i] };
        grp.append(createSVG("path", attributes));
      }
      return grp;
    };

    let bg: any = null;
    let fg: any = null;

    if (emblem.background) {
      bg = this.emblemBackgroundDefs[emblem.background.id];
      if (!bg)
        console.log("Unexisting or unsupported emblem background ID." + (emblem.background.id ? " (id=" + emblem.background.id + ")" : ""));
    }
    if (emblem.foreground) {
      fg = this.emblemDefs[emblem.foreground.id];
      if (!fg)
        console.log("Unexisting or unsupported emblem foreground ID." + (emblem.foreground.id ? " (id=" + emblem.foreground.id + ")" : ""));
    }
    // Apply transforms depending on flags. Example flag: FlipbackgroundVertical
    let bgTransform = "", fgTransform = "";
    if (this.flags) {
      for (let i = 0; i < this.flags.length; i++) {
        if (this.flags[i] == 'FlipbackgroundHorizontal') bgTransform += this.flagTransforms.background.FlipbackgroundHorizontal
        if (this.flags[i] == 'FlipbackgroundVertical') bgTransform += this.flagTransforms.background.FlipbackgroundVertical
        if (this.flags[i] == 'FlipforegroundHorizontal') bgTransform += this.flagTransforms.foreground.FlipforegroundHorizontal
        if (this.flags[i] == 'FlipforegroundVertical') bgTransform += this.flagTransforms.foreground.FlipforegroundVertical
      }
    }

    // replace "100%" with actual size
    fgTransform = fgTransform.replace(/100%/g, parameters.size);
    bgTransform = bgTransform.replace(/100%/g, parameters.size);

    // Create main SVG container
    let svg = createSVG("svg", { width: parameters.size, height: parameters.size, "shape-rendering": "geometricPrecision" });

    // background path
    if (bg) {
      let bgColor = 'var(--background-color)'
      let bgScaling = parseInt(parameters.size) / (bg && bg.size ? bg.size : 256);

      let bgGroup = createSVG("g", { "transform": bgTransform + "scale(" + bgScaling + "," + bgScaling + ")", "stroke-width": ".05%" });
      bgGroup.append(createGroup(bg, { "fill": bgColor }));

      svg.append(bgGroup);
    }

    // foreground paths
    if (fg) {
      let primaryFgColor = 'var(--foreground-primary-color)'
      let secondaryFgColor = 'var(--foreground-secondary-color)'
      let fgScaling = parseInt(parameters.size) / (fg && fg.size ? fg.size : 256);

      // Fixing some issues with some of the svg defs (this is some very dirty code)
      let extraTransforms = "";
      if (emblem.foreground.id == 234 || emblem.foreground.id == 238)
        extraTransforms = " translate(0, " + fg.size + ") scale(0.1, -0.1)";
      if (emblem.foreground.id == 236 || emblem.foreground.id == 239 || emblem.foreground.id == 240 || emblem.foreground.id == 241 || emblem.foreground.id == 243)
        extraTransforms = " translate(0, " + fg.size + ") scale(0.05, -0.05)";
      if (emblem.foreground.id == 235 || emblem.foreground.id == 237)
        extraTransforms = " translate(0, " + fg.size + ") scale(0.033, -0.033)";

      let fgGroup = createSVG("g", { "transform": fgTransform + "scale(" + fgScaling + "," + fgScaling + ")" + extraTransforms, "stroke-width": ".05%" });

      function shadeColor(color: any, percent: number) {
        let f = parseInt(color.slice(1), 16), t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
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
    let svgElement = document.createElement("svg")
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
   * Change la couleur de tous les emblèmes
   */
  changerCouleur() {
    const backgroundColor = 'blue'
    const foregroundPrimaryColor = 'red'
    const foregroundSecondaryColor = 'green'
    const backgrounds = <HTMLElement>document.querySelector('.backgrounds');
    const foregrounds = <HTMLElement>document.querySelector('.foregrounds');
    const embleme = <HTMLElement>document.querySelector('.embleme');
    if (backgrounds != null) backgrounds.style.setProperty('--background-color', backgroundColor);
    if (foregrounds != null) {
      foregrounds.style.setProperty('--foreground-primary-color', foregroundPrimaryColor);
      foregrounds.style.setProperty('--foreground-secondary-color', foregroundSecondaryColor);
    }
    if (embleme != null) {
      embleme.style.setProperty('--background-color', backgroundColor);
      embleme.style.setProperty('--foreground-primary-color', foregroundPrimaryColor);
      embleme.style.setProperty('--foreground-secondary-color', foregroundSecondaryColor);
    }
  }
}
