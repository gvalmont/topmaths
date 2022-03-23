export class Niveau {
  public nom: string
  public modules: Module[]

  constructor (nom: string, modules: Module[]) {
    this.nom = nom
    this.modules = modules
  }
}

export class Module {
  public reference: string
  public titre: string
  public description: string
  public prerequis: string[]
  public objectifs: string[]

  constructor (reference: string, titre: string, description: string, prerequis: string[], objectifs: string[]) {
    this.reference = reference
    this.titre = titre
    this.description = description
    this.prerequis = prerequis
    this.objectifs = objectifs
  }
}

export class Objectif {
  public reference: string
  public titre?: string
  public slugs: string[]

  constructor(reference: string, titre: string, slugs: string[]) {
    this.reference = reference
    this.titre = titre
    this.slugs = slugs
  }
}
