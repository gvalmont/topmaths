import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Module, Niveau, Objectif } from '../services/modules';
import { Niveau as NiveauObjectif } from '../services/objectifs';
import { ViewportScroller } from '@angular/common';
import { GlobalConstants } from '../services/global-constants';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css']
})
export class ModuleComponent implements OnInit {
  categorieA = 'avancé'
  categorieB = 'de base'
  niveau: string
  categorie: string
  reference: string
  numero: number
  titre: string
  objectifs: Objectif[]
  lienEval: string
  lienCours: string
  lienResume: string
  lienMission: string
  lienAnki: string
  presenceCalculMental: boolean
  messagePasDeCalculMental: string
  derniereUrl: string
  derniereGraine: string
  dernierSlider: number
  messageScore: string
  dateDerniereReponse: Date
  infosModale: [string[], string, Date, number[]]
  bonneReponse: boolean
  ancre: string
  description: string

  constructor(public http: HttpClient, private route: ActivatedRoute, public dataService: ApiService, public router: Router, private viewportScroller: ViewportScroller, private titleService: Title) {
    this.reference = ''
    this.categorie = ''
    this.numero = 0
    this.titre = ''
    this.objectifs = []
    this.lienEval = ''
    this.lienCours = ''
    this.lienResume = ''
    this.lienMission = ''
    this.lienAnki = ''
    this.presenceCalculMental = true
    this.messagePasDeCalculMental = ''
    this.derniereUrl = ''
    this.derniereGraine = ''
    this.dernierSlider = 0
    this.messageScore = ''
    this.dateDerniereReponse = new Date()
    this.infosModale = [[], '', new Date(), []]
    this.bonneReponse = false
    this.ancre = ''
    this.niveau = ''
    this.description = ''
  }

  ngOnInit(): void {
    this.observeChangementsDeRoute()
  }

  /**
   * Scroll vers l'ancre de l'exercice qui a été cliqué pour ouvrir la modale exercices
   */
   scrollBack(): void {
    this.viewportScroller.scrollToAnchor(this.ancre)
  }

  /**
   * Observe les changements de route,
   * modifie ensuite les paramètres selon la référence
   */
  observeChangementsDeRoute() {
    this.route.params.subscribe(params => {
      this.reference = params.ref
      this.modificationDesAttributs()
    })
  }

  /**
   * Ouvre modules.json,
   * cherche le module qui a pour référence this.reference,
   * une fois trouvé, lance this.recupereAttributsModule(niveau, module)
   */
  modificationDesAttributs() {
    const nomNiveau = this.reference.slice(0, 1) + 'e'
    let sortir = false
    this.http.get<Niveau[]>('assets/data/modules.json').subscribe(niveaux => {
      for (const niveau of niveaux) {
        if (niveau.nom === nomNiveau) {
            for (const module of niveau.modules) {
              if (module.reference === this.reference) {
                this.niveau = niveau.nom
                if (this.reference.slice(-1) === 'A') this.categorie = this.categorieA
                else if (this.reference.slice(-1) === 'B') this.categorie = this.categorieB
                this.description = module.description
                this.recupereAttributsModule(niveau, module)
                sortir = true
                break
              }
            }
            if (sortir) break
          }
        if (sortir) break
      }
    })
  }

  /**
   * Copie tous les module.attribut dans les this.attribut après les avoir retravaillés
   * @param niveau 
   * @param module 
   */
  recupereAttributsModule(niveau: Niveau, module: Module) {
    this.titre = `Module ${this.categorie} :<br>${module.titre}`
    this.titleService.setTitle(this.titre.replace('<br>', ' '))
    this.dataService.user.dernierModule = this.reference + '!' + this.titre
    this.dataService.majProfil(['dernierModule'])
    this.recupereObjectifsModule(module)
    this.recupereDetailsObjectifs()
  }

  /**
   * Récupère les références des objectifs du module,
   * les push à this.objectifs
   * @param module 
   */
  recupereObjectifsModule(module: Module) {
    this.objectifs = []
    for (const objectif of module.objectifs) {
      if (objectif != '') {
        this.objectifs.push( {
          reference: objectif,
          slugs: []
        })
      }
    }
  }
  /**
   * Ouvre le json des objectifs,
   * cherche les différents objectifs pour récupérer leur titre (pour l'afficher) ainsi que leurs slugs (pour s'entraîner pour l'évaluation),
   * crée le lien pour s'entraîner pour l'évaluation.
   * Modifie les this.objectifs.titre, les this.objectifs.slugs et le this.lienEval
   */
  recupereDetailsObjectifs() {
    this.http.get<NiveauObjectif[]>('assets/data/objectifs.json').subscribe(niveaux => {
      for (const niveau of niveaux) {
        for (const theme of niveau.themes) {
          for (const sousTheme of theme.sousThemes) {
            for (const JSONobjectif of sousTheme.objectifs) {
              //On complète le titre et les slugs des objectifs du module
              for (const thisObjectif of this.objectifs) {
                if (thisObjectif.reference == JSONobjectif.reference) {
                  thisObjectif.titre = JSONobjectif.titre
                  for (const exercice of JSONobjectif.exercices) {
                    thisObjectif.slugs.push(exercice.slug)
                  }
                }
              }
            }
          }
        }
      }
      // On crée le lien pour s'entraîner pour l'évaluation
      this.lienEval = 'https://coopmaths.fr/mathalea.html?'
      for (const thisObjectif of this.objectifs) {
        for (const slug of thisObjectif.slugs) {
          if (slug.slice(0, 4) != 'http' && slug != '') {
            this.lienEval = this.lienEval.concat('ex=', slug, ',i=1&')
          }
        }
      }
      this.lienEval = this.lienEval.concat('v=eval&z=1.5')
    }
    )
  }

  /**
   * Donne l'écriture en lettres d'un nombre
   * @param nombre 
   * @returns string
   */
  nombreObjectifs(nombre: number) {
    switch (nombre) {
      case 1:
        return 'un objectif'

      case 2:
        return 'deux objectifs'

      case 3:
        return 'trois objectifs'

      case 4:
        return 'quatre objectifs'

      case 5:
        return 'cinq objectifs'

      case 6:
        return 'six objectifs'

      default:
        return ''
    }
  }

  /**
   * Vérifie si le fichier assets/type/niveau/Type_reference.extension existe et renvoie le lien si c'est le cas
   * @param type peut être cours, resume, mission ou anki
   * le niveau peut être 6e, 5e, 4e ou 3e
   * la référence correspond à this.reference
   * l'extension est apkg si le type est anki, pdf sinon
   * @returns lien de téléchargement du fichier s'il existe, une chaîne vide sinon
   */
  creerLienTelechargement(type: string) {
    let extension: string
    if (type == 'anki') {
      extension = 'apkg'
    } else {
      extension = 'pdf'
    }
    let lien = `assets/${type}/${this.reference.slice(1, 2)}e/${type.charAt(0).toUpperCase() + type.slice(1)}_${this.reference}.${extension}`
    this.verifieExistence(type, lien)
    return lien
  }

  /**
   * Paramètre la modale exercice avec l'url de l'exercice et l'ancre pour le retour puis l'affiche
   * @param lien
   * @param ancre
   */
   ouvrirModaleExercices(lien: string | undefined, ancre: string) {
    if (typeof(lien) != 'undefined') {
      this.infosModale = [[lien], '', new Date(), []]
      this.ancre = ancre
    }
  }

  /**
   * Vérifie si un fichier existe ou pas
   * S'il existe, on modifie le innerHTML du div concerné et on affiche le div des téléchargements
   * @param urlToFile url du fichier
   * @returns true s'il existe, false sinon
   */
  verifieExistence(type: string, urlToFile: string) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let divId = '', description
        switch (type) {
          case 'cours':
            divId = 'lienCours'
            description = 'le cours'
            break
          case 'resume':
            divId = 'lienResume'
            description = 'le résumé'
            break
          case 'mission':
            divId = 'lienMission'
            description = 'la mission'
            break
          case 'anki':
            divId = 'lienAnki'
            description = 'le paquet Anki du module'
            break
        }
        const div = document.getElementById(divId)
        if (div != null) {
          div.innerHTML = `<a href=${urlToFile}>Télécharger ${description}</a>`
          div.style.display = 'block'
        }
        const divTelechargements = document.getElementById('divTelechargements')
        const divEvaluation = document.getElementById('divEvaluation')
        if (divTelechargements != null && divEvaluation != null) {
          divTelechargements.style.display = 'block'
          divEvaluation.classList.remove('is-fin')
        }
      }
    };
    xhttp.open("HEAD", urlToFile, true);
    xhttp.send();
  }
}
