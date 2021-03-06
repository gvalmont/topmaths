import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CalculMental, Objectif, QuestionFlash, Sequence } from '../services/modeles/sequences'
import { ViewportScroller } from '@angular/common'
import { GlobalConstants } from '../services/modeles/global-constants'
import { Title } from '@angular/platform-browser'
import { DataService } from '../services/data.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-sequence',
  templateUrl: './sequence.component.html',
  styleUrls: []
})
export class SequenceComponent implements OnInit, OnDestroy {
  reference: string
  niveau: string
  titre: string
  objectifs: Objectif[]
  calculsMentaux: CalculMental[]
  questionsFlash: QuestionFlash[]
  lienQuestionsFlash: string
  lienEval: string
  infosModale: [string[], string, Date]
  ancreDeRetour: string
  dataMAJSubscription: Subscription

  // eslint-disable-next-line no-unused-vars
  constructor (private activatedRoute: ActivatedRoute, private dataService: DataService, public router: Router, private viewportScroller: ViewportScroller, private titleService: Title) {
    this.reference = ''
    this.niveau = ''
    this.titre = ''
    this.objectifs = []
    this.calculsMentaux = []
    this.questionsFlash = []
    this.lienQuestionsFlash = ''
    this.lienEval = ''
    this.infosModale = [[], '', new Date()]
    this.ancreDeRetour = ''
    this.dataMAJSubscription = new Subscription
  }

  ngOnInit (): void {
    this.viewportScroller.scrollToAnchor('titre')
    this.surveillerChangementsDeSequence()
    this.surveillerLeChargementDesDonnees()
  }

  ngOnDestroy () {
    this.dataMAJSubscription.unsubscribe()
  }

  surveillerChangementsDeSequence () {
    this.activatedRoute.params.subscribe(params => {
      this.reference = params.reference
      if (this.lesDonneesSontChargees()) this.trouverSequence()
    })
  }

  surveillerLeChargementDesDonnees () {
    this.dataMAJSubscription = this.dataService.dataMAJ.subscribe(valeurModifiee => {
      if (valeurModifiee === 'niveauxObjectifs' || valeurModifiee === 'niveauxSequences') {
        if (this.lesDonneesSontChargees()) this.trouverSequence()
      }
    })
  }

  lesDonneesSontChargees () {
    return this.dataService.niveauxObjectifs.length > 0 && this.dataService.niveauxSequences.length > 0
  }

  trouverSequence () {
    this.dataService.niveauxSequences.find(niveau => {
      return niveau.sequences.find(sequence => {
        if (sequence.reference === this.reference) {
          this.niveau = niveau.nom
          this.MAJPage(sequence)
        }
        return sequence.reference === this.reference
      })
    })
  }

  MAJPage (sequence: Sequence) {
    const numero = parseInt(sequence.reference.slice(3))
    this.titre = `S??quence ${numero} :<br>${sequence.titre}`
    this.titleService.setTitle(this.titre.replace('<br>', ' '))
    this.MAJListeObjectifs(sequence)
    this.MAJListeQuestionsFlash(sequence)
    this.MAJListeCalculsMentaux(sequence)
    this.MAJInfosObjectifs()
    this.MAJLienTelechargement(sequence.reference, 'cours')
    this.MAJLienTelechargement(sequence.reference, 'resume')
    this.MAJLienTelechargement(sequence.reference, 'mission')
  }

  MAJListeObjectifs (sequence: Sequence) {
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

  MAJListeQuestionsFlash (sequence: Sequence) {
    this.questionsFlash = []
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

  MAJListeCalculsMentaux (sequence: Sequence) {
    this.calculsMentaux = []
    for (const calculMental of sequence.calculsMentaux) {
      const niveauxTemp = []
      for (const niveau of calculMental.niveaux) {
        niveauxTemp.push({
          commentaire: niveau.commentaire,
          lien: niveau.lien + '&embed=' + GlobalConstants.ORIGINE,
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

  MAJInfosObjectifs () {
    for (const niveau of this.dataService.niveauxObjectifs) {
      for (const theme of niveau.themes) {
        for (const sousTheme of theme.sousThemes) {
          for (const JSONobjectif of sousTheme.objectifs) {
            for (const thisObjectif of this.objectifs) {
              if (thisObjectif.reference === JSONobjectif.reference) {
                thisObjectif.titre = JSONobjectif.titre
                for (const exercice of JSONobjectif.exercices) {
                  thisObjectif.slugs.push(exercice.slug)
                }
              }
            }
            this.MAJPageExiste(JSONobjectif.reference)
          }
        }
      }
    }
    this.MAJLienQuestionsFlash()
    this.MAJLienEval()
  }

  MAJPageExiste (reference: string) {
    for (const questionFlash of this.questionsFlash) {
      if (questionFlash.reference === reference) {
        questionFlash.pageExiste = true
      }
    }
    for (const calculMental of this.calculsMentaux) {
      if (calculMental.reference === reference) {
        calculMental.pageExiste = true
      }
    }
  }

  MAJLienQuestionsFlash () {
    this.lienQuestionsFlash = 'https://coopmaths.fr/mathalea.html?'
    for (const questionFlash of this.questionsFlash) {
      if (questionFlash.slug !== '') {
        this.lienQuestionsFlash = this.lienQuestionsFlash.concat('ex=', questionFlash.slug, ',i=0&')
      }
    }
    this.lienQuestionsFlash = this.lienQuestionsFlash.concat('v=eval&z=1.5')
  }

  MAJLienEval () {
    this.lienEval = 'https://coopmaths.fr/mathalea.html?'
    for (const thisObjectif of this.objectifs) {
      for (const slug of thisObjectif.slugs) {
        if (slug.slice(0, 4) !== 'http' && slug !== '') {
          this.lienEval = this.lienEval.concat('ex=', slug, ',i=0&')
        }
      }
    }
    this.lienEval = this.lienEval.concat('v=eval&z=1.5')
  }

  MAJLienTelechargement (reference: string, type: string) {
    const lien = `assets/${type}/${reference.slice(1, 2)}e/${type.charAt(0).toUpperCase() + type.slice(1)}_${reference}.pdf`
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        majDivLigneTelechargement(type, lien)
        const divTelechargements = document.getElementById('divTelechargements')
        const divEvaluation = document.getElementById('divEvaluation')
        if (divTelechargements !== null && divEvaluation !== null) {
          divTelechargements.style.display = 'block'
          divEvaluation.classList.remove('is-fin')
        }
      }
    }
    xhttp.open("HEAD", lien, true)
    xhttp.send()

    function majDivLigneTelechargement (type: string, lien: string) {
      let divId = '', description
      switch (type) {
        case 'cours':
          divId = 'lienCours'
          description = 'le cours'
          break
        case 'resume':
          divId = 'lienResume'
          description = 'le r??sum??'
          break
        case 'mission':
          divId = 'lienMission'
          description = 'la mission'
          break
      }
      const div = document.getElementById(divId)
      if (div !== null) {
        div.innerHTML = `<a href=${lien}>
        T??l??charger ${description}
          &nbsp;
          <i class='image is-24x24 is-inline-block'>
            <img src='/assets/img/cc0/pdf-file-format-symbol-svgrepo-com.svg' />
          </i>
        </a>`
        div.style.display = 'block'
      }
    }
  }

  getStringNombreObjectifs (nombre: number) {
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

  ouvrirModaleExercices (lien: string, ancre: string) {
    this.infosModale = [[lien], '', new Date()]
    this.ancreDeRetour = ancre
  }

  scrollBack (): void {
    this.viewportScroller.scrollToAnchor(this.ancreDeRetour)
  }
}
