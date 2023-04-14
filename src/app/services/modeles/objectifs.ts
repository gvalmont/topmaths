
export class Niveau {
  public nom: string
  public themes: Theme[]

  constructor (nom: string, themes: Theme[]) {
    this.nom = nom
    this.themes = themes
  }
}

export class Theme {
  public nom: string
  public sousThemes: SousTheme[]
  public nbObjectifsParPeriode: number[]

  constructor (nom: string, sousThemes: SousTheme[], nbObjectifsParPeriode: number[]) {
    this.nom = nom
    this.sousThemes = sousThemes
    this.nbObjectifsParPeriode = nbObjectifsParPeriode
  }
}

export class SousTheme {
  public nom: string
  public objectifs: Objectif[]
  public nbObjectifsParPeriode: number[]

  constructor (nom: string, objectifs: Objectif[], nbObjectifsParPeriode: number[]) {
    this.nom = nom
    this.objectifs = objectifs
    this.nbObjectifsParPeriode = nbObjectifsParPeriode
  }
}

export class Objectif {
  public reference: string
  public titre: string
  public periode: number
  public rappelDuCoursHTML: string
  public rappelDuCoursImage: string
  public rappelDuCoursInstrumenpoche: string
  public videos: Video[]
  public exercices: Exercice[]
  public sequences: Sequence[]
  public lienExercices: string
  public telechargementsDisponibles: TelechargementsDisponibles

  constructor (reference: string, titre: string, periode: number, rappelDuCoursHTML: string, rappelDuCoursImage: string,
    rappelDuCoursInstrumenpoche: string, videos: Video[], exercices: Exercice[], sequences: Sequence[], lienExercices: string,
    telechargementsDisponibles: TelechargementsDisponibles) {
    this.reference = reference
    this.titre = titre
    this.periode = periode
    this.rappelDuCoursHTML = rappelDuCoursHTML
    this.rappelDuCoursImage = rappelDuCoursImage
    this.rappelDuCoursInstrumenpoche = rappelDuCoursInstrumenpoche
    this.videos = videos
    this.exercices = exercices
    this.sequences = sequences
    this.lienExercices = lienExercices
    this.telechargementsDisponibles = telechargementsDisponibles
  }
}

export class Video {
  public titre: string
  public slug: string
  public auteur: string
  public lienAuteur: string
  public lienVideo: string

  constructor (titre: string, slug: string, auteur: string, lienAuteur: string, lienVideo: string) {
    this.titre = titre
    this.slug = slug
    this.auteur = auteur
    this.lienAuteur = lienAuteur
    this.lienVideo = lienVideo
  }
}

export class Exercice {
  public id: string
  public slug: string
  public lien: string
  public isInteractif: boolean
  public description: string
  public estDansLePanier?: boolean

  constructor (id: string, slug: string, lien: string, isInteractif: boolean, description: string) {
    this.id = id
    this.slug = slug
    this.lien = lien
    this.isInteractif = isInteractif
    this.description = description
  }
}

export class Sequence {
  public reference: string
  public titre: string

  constructor (reference: string, titre: string) {
    this.reference = reference
    this.titre = titre
  }
}

export class TelechargementsDisponibles {
  public entrainement: boolean
  public test: boolean

  constructor (entrainement: boolean, test: boolean) {
    this.entrainement = entrainement
    this.test = test
  }
}
