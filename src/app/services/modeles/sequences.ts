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
  public slugEvalBrevet: string

  constructor (reference: string, titre: string, periode: number, objectifs: Objectif[], calculsMentaux: CalculMental[], questionsFlash: QuestionFlash[], slugEvalBrevet: string) {
    this.reference = reference
    this.titre = titre
    this.periode = periode
    this.objectifs = objectifs
    this.calculsMentaux = calculsMentaux
    this.questionsFlash = questionsFlash
    this.slugEvalBrevet = slugEvalBrevet
  }
}

export class Objectif {
  public reference: string
  public titre?: string
  public slugs: string[]

  constructor (reference: string, titre: string, slugs: string[]) {
    this.reference = reference
    this.titre = titre
    this.slugs = slugs
  }
}

export class CalculMental {
  public reference: string
  public titre: string
  public niveaux: NiveauCM[]
  public pageExiste: boolean

  constructor (reference: string, titre: string, niveaux: NiveauCM[], pageExiste: boolean) {
    this.reference = reference
    this.titre = titre
    this.niveaux = niveaux
    this.pageExiste = pageExiste
  }
}

export class NiveauCM {
  public commentaire: string
  public lien: string

  constructor (commentaire: string, lien: string) {
    this.commentaire = commentaire
    this.lien = lien
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

export class SequenceParticuliere {
  public reference: string
  public titre: string

  constructor (reference: string, titre: string) {
    this.reference = reference
    this.titre = titre
  }
}