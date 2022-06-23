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

  constructor (nom: string, sousThemes: SousTheme[]) {
    this.nom = nom
    this.sousThemes = sousThemes
  }
}

export class SousTheme {
  public nom: string
  public objectifs: Objectif[]

  constructor (nom: string, objectifs: Objectif[]) {
    this.nom = nom
    this.objectifs = objectifs
  }
}

export class Objectif {
  public reference: string
  public titre: string
  public rappelDuCoursHTML: string
  public rappelDuCoursImage: string
  public rappelDuCoursInstrumenpoche: string
  public videos: Video[]
  public exercices: Exercice[]

  constructor (reference: string, titre: string, rappelDuCoursHTML: string, rappelDuCoursImage: string, rappelDuCoursInstrumenpoche: string, videos: Video[], exercices: Exercice[]) {
    this.reference = reference
    this.titre = titre
    this.rappelDuCoursHTML = rappelDuCoursHTML
    this.rappelDuCoursImage = rappelDuCoursImage
    this.rappelDuCoursInstrumenpoche = rappelDuCoursInstrumenpoche
    this.videos = videos
    this.exercices = exercices
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
  public id: number
  public slug: string
  public lien: string
  public isInteractif: boolean

  constructor (id: number, slug: string, lien: string, isInteractif: boolean) {
    this.id = id
    this.slug = slug
    this.lien = lien
    this.isInteractif = isInteractif
  }
}
