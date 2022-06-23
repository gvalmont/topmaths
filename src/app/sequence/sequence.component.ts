import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ApiService } from '../services/api.service'
import { CalculMental, Niveau, NiveauCM, Objectif, QuestionFlash, Sequence } from '../services/sequences'
import { Niveau as NiveauObjectif } from '../services/objectifs'
import { ViewportScroller } from '@angular/common'
import { GlobalConstants } from '../services/global-constants'
import { Title } from '@angular/platform-browser'

@Component({
  selector: 'app-sequence',
  templateUrl: './sequence.component.html',
  styleUrls: []
})
export class SequenceComponent implements OnInit {
  titre: string
  objectifs: Objectif[]
  calculsMentaux: CalculMental[]
  questionsFlash: QuestionFlash[]
  lienQuestionsFlash: string
  lienEval: string
  infosModale: [string[], string, Date]
  ancreDeRetour: string
  niveau: string

  // eslint-disable-next-line no-unused-vars
  constructor(public httpClient: HttpClient, private activatedRoute: ActivatedRoute, public apiService: ApiService, public router: Router, private viewportScroller: ViewportScroller, private titleService: Title) {
    this.titre = ''
    this.objectifs = []
    this.calculsMentaux = [new CalculMental('', '', [new NiveauCM('', '')], false)]
    this.questionsFlash = []
    this.lienQuestionsFlash = ''
    this.lienEval = ''
    this.infosModale = [[], '', new Date()]
    this.ancreDeRetour = ''
    this.niveau = ''
  }

  ngOnInit(): void {
    this.surveillerChangementsDeSequence()
  }

  surveillerChangementsDeSequence() {
    this.activatedRoute.params.subscribe(params => {
      this.trouverSequence(params.reference)
    })
  }

  trouverSequence(reference: string) {
    this.httpClient.get<Niveau[]>('assets/data/sequences.json').subscribe(niveaux => {
      niveaux.find(niveau => {
        return niveau.sequences.find(sequence => {
          if (sequence.reference === reference) {
            this.niveau = niveau.nom
            this.MAJProprietes(sequence)
          }
          return sequence.reference === reference
        })
      })
    })
  }

  /**
   * Copie tous les sequence.attribut dans les this.attribut après les avoir retravaillés
   * @param niveau 
   * @param sequence 
   */
  MAJProprietes(sequence: Sequence) {
    const numero = parseInt(sequence.reference.slice(3))
    this.titre = `Séquence ${numero} :<br>${sequence.titre}`
    this.titleService.setTitle(this.titre.replace('<br>', ' '))
    this.apiService.user.derniereSequence = sequence.reference + '!' + this.titre
    this.apiService.majProfil(['derniereSequence'])
    this.recupereObjectifsSequence(sequence)
    this.recupereQuestionsFlash(sequence)
    this.recupereCalculsMentaux(sequence)
    this.recupereDetailsObjectifs()
    this.creerLienTelechargement(sequence.reference, 'cours')
    this.creerLienTelechargement(sequence.reference, 'resume')
    this.creerLienTelechargement(sequence.reference, 'mission')
  }

  /**
   * Récupère les références des objectifs de la séquence,
   * les push à this.objectifs
   * @param sequence 
   */
  recupereObjectifsSequence(sequence: Sequence) {
    this.objectifs = []
    for (const objectif of sequence.objectifs) {
      if (objectif.reference !== '') {
        this.objectifs.push({
          reference: objectif.reference,
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
    this.httpClient.get<NiveauObjectif[]>('assets/data/objectifs.json').subscribe(niveaux => {
      for (const niveau of niveaux) {
        for (const theme of niveau.themes) {
          for (const sousTheme of theme.sousThemes) {
            for (const JSONobjectif of sousTheme.objectifs) {
              // On complète le titre et les slugs des objectifs de la séquence
              for (const thisObjectif of this.objectifs) {
                if (thisObjectif.reference === JSONobjectif.reference) {
                  thisObjectif.titre = JSONobjectif.titre
                  for (const exercice of JSONobjectif.exercices) {
                    thisObjectif.slugs.push(exercice.slug)
                  }
                }
              }
              // On vérifie si la page existe pour les objectifs des questions flash
              // On en profite pour créer le lien pour s'entraîner aux questions flash
              this.lienQuestionsFlash = 'https://coopmaths.fr/mathalea.html?'
              for (const questionFlash of this.questionsFlash) {
                if (questionFlash.slug !== '') {
                  this.lienQuestionsFlash = this.lienQuestionsFlash.concat('ex=', questionFlash.slug, ',i=1&')
                }
                if (questionFlash.reference === JSONobjectif.reference) {
                  questionFlash.pageExiste = true
                }
              }
              this.lienQuestionsFlash = this.lienQuestionsFlash.concat('v=eval&z=1.5')
              // On vérifie si la page existe pour les objectifs des calculs mentaux
              for (const calculMental of this.calculsMentaux) {
                if (calculMental.reference === JSONobjectif.reference) {
                  calculMental.pageExiste = true
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
          if (slug.slice(0, 4) !== 'http' && slug !== '') {
            this.lienEval = this.lienEval.concat('ex=', slug, ',i=1&')
          }
        }
      }
      this.lienEval = this.lienEval.concat('v=eval&z=1.5')
    }
    )
  }

  /**
   * Récupère les calculs mentaux de la séquence,
   * les push à this.calculsMentaux
   * @param sequence 
   */
  recupereCalculsMentaux(sequence: Sequence) {
    this.calculsMentaux = []
    for (const calculMental of sequence.calculsMentaux) {
      const niveauxTemp = []
      for (const niveau of calculMental.niveaux) {
        niveauxTemp.push({
          commentaire: niveau.commentaire,
          lien: niveau.lien + '&embed=' + GlobalConstants.origine,
          lienACopier: niveau.lien
        })
      }
      this.calculsMentaux.push({
        reference: calculMental.reference,
        titre: calculMental.titre,
        niveaux: niveauxTemp,
        pageExiste: false
      })
    }
  }

  /**
   * Récupère la liste des questions flash de la séquence,
   * les push à this.questionsFlash
   * @param sequence 
   */
  recupereQuestionsFlash(sequence: Sequence) {
    this.questionsFlash = [] // Au cas où l'attribut ne serait pas réinitialisé lors d'un changement de référence
    for (const questionFlash of sequence.questionsFlash) {
      if (questionFlash.reference !== '') {
        this.questionsFlash.push({
          reference: questionFlash.reference,
          titre: questionFlash.titre,
          slug: questionFlash.slug,
          pageExiste: false
        })
      }
    }
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
   * @param type peut être cours, resume ou mission
   * le niveau peut être 6e, 5e, 4e ou 3e
   * la référence correspond à this.reference
   * @returns lien de téléchargement du fichier s'il existe, une chaîne vide sinon
   */
  creerLienTelechargement(reference: string, type: string) {
    const lien = `assets/${type}/${reference.slice(1, 2)}e/${type.charAt(0).toUpperCase() + type.slice(1)}_${reference}.pdf`
    this.verifieExistence(type, lien)
    return lien
  }

  /**
   * Paramètre la modale exercice avec l'url de l'exercice et l'ancre pour le retour puis l'affiche
   * @param lien
   * @param ancre
   */
  ouvrirModaleExercices(lien: string | undefined, ancre: string) {
    if (typeof (lien) !== 'undefined') {
      this.infosModale = [[lien], '', new Date()]
      this.ancreDeRetour = ancre
    }
  }

  /**
   * Vérifie si un fichier existe ou pas
   * S'il existe, on modifie le innerHTML du div concerné et on affiche le div des téléchargements
   * @param urlToFile url du fichier
   * @returns true s'il existe, false sinon
   */
  verifieExistence(type: string, urlToFile: string) {
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
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
        }
        const div = document.getElementById(divId)
        if (div !== null) {
          div.innerHTML = `<a href=${urlToFile}>
          Télécharger ${description}
            &nbsp;
            <i class='image is-24x24 is-inline-block'>
              <img src='/assets/img/cc0/pdf-file-format-symbol-svgrepo-com.svg' />
            </i>
          </a>`
          div.style.display = 'block'
        }
        const divTelechargements = document.getElementById('divTelechargements')
        const divEvaluation = document.getElementById('divEvaluation')
        if (divTelechargements !== null && divEvaluation !== null) {
          divTelechargements.style.display = 'block'
          divEvaluation.classList.remove('is-fin')
        }
      }
    }
    xhttp.open("HEAD", urlToFile, true)
    xhttp.send()
  }

  scrollBack(): void {
    this.viewportScroller.scrollToAnchor(this.ancreDeRetour)
  }
}
