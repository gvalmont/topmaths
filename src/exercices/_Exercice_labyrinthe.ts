import { Labyrinthe, mountLabyrintheElement } from 'labyrinthe'
import type LabyrintheElement from 'labyrinthe/src/LabyrintheElement'
import { context } from '../modules/context'
import { listeQuestionsToContenu } from '../modules/outils'
import Exercice from './Exercice'

/**
 * @author Rémi Angot
 */
export default class ExerciceLabyrinthe extends Exercice {
  labyrinthe!: Labyrinthe
  labyrintheElement!: LabyrintheElement
  cols = 6
  rows = 6
  orientation?: 'horizontal' | 'vertical'
  goodAnswers: string[] = []
  badAnswers: string[] = []

  constructor() {
    super()
    this.nbQuestions = 1
    this.interactifObligatoire = true
    this.nbQuestionsModifiable = false
    this.exoCustomResultat = true
  }

  init() {}

  nouvelleVersion() {
    this.init()
    this.goodAnswers = []
    this.badAnswers = []

    this.labyrinthe = new Labyrinthe({
      seed: this.seed,
      rows: this.rows,
      cols: this.cols,
      orientation: this.orientation,
    })
    this.labyrinthe.regenerate()

    if (this.labyrintheElement) {
      this.labyrintheElement.remove()
    }

    // if (this.goodAnswers.length > 0) return
    const goodCount = this.labyrinthe.numberOfGoodAnswers() ?? 0
    const badCount = this.labyrinthe.numberOfIncorrectAnswers() ?? 0
    let attempts = 0
    for (let i = 0; i < goodCount; ) {
      const candidate = String(this.generateGoodAnswers())
      if (this.goodAnswers.indexOf(candidate) === -1) {
        this.goodAnswers[i] = candidate
        attempts = 0
        i++
      } else {
        attempts++
        if (attempts >= 50) {
          this.goodAnswers[i] = candidate
          attempts = 0
          i++
        }
      }
    }
    attempts = 0
    for (let i = 0; i < badCount; ) {
      const candidate = String(this.generateBadAnswers())
      if (this.badAnswers.indexOf(candidate) === -1) {
        this.badAnswers[i] = candidate
        attempts = 0
        i++
      } else {
        attempts++
        if (attempts >= 50) {
          this.badAnswers[i] = candidate
          attempts = 0
          i++
        }
      }
    }
    this.labyrinthe.setValues(this.goodAnswers, this.badAnswers)

    let texte = ''
    let texteCorr = ''
    if (context.isHtml) {
      texte = `<div
        id="containerLabyrintheEx${this.numeroExercice}Q${0}">
      </div>
      <div id=${`feedbackEx${this.numeroExercice}Q${0}`}
        class="ml-2 py-2 text-coopmaths-warn-darkest dark:text-coopmathsdark-warn-darkest"
        >
      </div>`

      texteCorr = `<div
        id="containerLabyrintheCorrectionEx${this.numeroExercice}Q${0}">
      </div>`
      document.addEventListener('exercicesAffiches', async () => {
        const container = document.querySelector(
          `#containerLabyrintheEx${this.numeroExercice}Q${0}`,
        )
        const containerCorrection = document.querySelector(
          `#containerLabyrintheCorrectionEx${this.numeroExercice}Q${0}`,
        )
        if (container) {
          if (!this.labyrintheElement?.isConnected) {
            container.innerHTML = ''
            this.labyrintheElement = await mountLabyrintheElement(
              this.labyrinthe,
              container,
            )
          }
          this.labyrintheElement.id = `labyrintheEx${this.numeroExercice}`
          if (!this.interactif) {
            this.labyrintheElement.disabled = true
          }
          this.labyrintheElement.addEventListener(
            'labyrinthe:gameend',
            (e: Event) => {
              const btnScore = document.querySelector(
                `#buttonScoreEx${this.numeroExercice}`,
              )
              ;(btnScore as HTMLButtonElement)?.click()
            },
          )
        }
        if (containerCorrection) {
          containerCorrection.innerHTML = ''
          const elementCorrection = await mountLabyrintheElement(
            this.labyrinthe,
            containerCorrection,
          )
          elementCorrection.showCorrection()
        }
      })

      setTimeout(() => {
        // Gestion particulière du bouton score
        const btnScore = document.querySelector(
          `#buttonScoreEx${this.numeroExercice}`,
        )
        if (btnScore) {
          ;(btnScore as HTMLButtonElement).style.display = 'none'
        }
      }, 500)
    } else {
      texte = `\n\n\\bigskip\n${this.labyrinthe.generateLatex()}`
      texteCorr = this.labyrinthe.generateLatexCorrection()
    }

    this.listeQuestions[0] = texte
    this.listeCorrections[0] = texteCorr
    listeQuestionsToContenu(this)
  }

  generateGoodAnswers(): number | string {
    return 1
  }

  generateBadAnswers(): number | string {
    return 0
  }

  correctionInteractive = (i: number) => {
    if (this.answers == null) this.answers = {}
    this.answers[`labyrintheEx${this.numeroExercice}`] =
      this.labyrintheElement.state
    const divFeedback = document.querySelector(
      `#feedbackEx${this.numeroExercice}Q${i}`,
    )
    const isValid = this.labyrintheElement.win
    if (divFeedback != null) {
      if (isValid) {
        divFeedback.innerHTML = 'Bravo !'
        return ['OK', 'OK', 'OK', 'OK']
      }
      const ratio =
        this.labyrintheElement.correctClicks / this.labyrintheElement.totalGood
      if (ratio <= 0.25) {
        return ['KO', 'KO', 'KO', 'KO']
      } else if (ratio <= 0.5) {
        return ['OK', 'KO', 'KO', 'KO']
      } else if (ratio <= 0.75) {
        return ['OK', 'OK', 'KO', 'KO']
      }
      return ['OK', 'OK', 'KO', 'KO']
    }
    throw new Error('Feedback not found')
  }
}
