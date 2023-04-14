import { Exercice, Objectif } from "./objectifs"

export class Niveau {
  public nom: string
  public sequences: Sequence[]

  constructor (nom: string, sequences: Sequence[]) {
    this.nom = nom
    this.sequences = sequences
  }
}

export class Sequence {
  public reference: string
  public titre: string
  public periode: number
  public objectifs: Objectif[]
  public calculsMentaux: CalculMental[]
  public questionsFlash: QuestionFlash[]
  public lienQuestionsFlash: string
  public slugEvalBrevet: string
  public lienEval: string
  public lienEvalBrevet: string
  public telechargementsDisponibles: TelechargementsDisponibles

  constructor (reference: string, titre: string, periode: number, objectifs: Objectif[], calculsMentaux: CalculMental[],
    questionsFlash: QuestionFlash[], lienQuestionsFlash: string, slugEvalBrevet: string, lienEval: string,
    lienEvalBrevet: string, telechargementsDisponibles: TelechargementsDisponibles) {
    this.reference = reference
    this.titre = titre
    this.periode = periode
    this.objectifs = objectifs
    this.calculsMentaux = calculsMentaux
    this.questionsFlash = questionsFlash
    this.lienQuestionsFlash = lienQuestionsFlash
    this.slugEvalBrevet = slugEvalBrevet
    this.lienEval = lienEval
    this.lienEvalBrevet = lienEvalBrevet
    this.telechargementsDisponibles = telechargementsDisponibles
  }
}

export class CalculMental {
  public reference: string
  public titre: string
  public exercices: Exercice[]
  public pageExiste: boolean

  constructor (reference: string, titre: string, exercices: Exercice[], pageExiste: boolean) {
    this.reference = reference
    this.titre = titre
    this.exercices = exercices
    this.pageExiste = pageExiste
  }
}

export class QuestionFlash {
  public reference: string
  public titre: string
  public slug: string
  public pageExiste: boolean

  constructor (reference: string, titre: string, slug: string, pageExiste: boolean) {
    this.reference = reference
    this.titre = titre
    this.slug = slug
    this.pageExiste = pageExiste
  }
}

export class TelechargementsDisponibles {
  public cours: boolean
  public resume: boolean
  public mission: boolean

  constructor (cours: boolean, resume: boolean, mission: boolean) {
    this.cours = cours
    this.resume = resume
    this.mission = mission
  }
}

export class SequenceParticuliere {
  public reference: string
  public titre: string

  constructor (reference: string, titre: string) {
    this.reference = reference
    this.titre = titre
  }
}