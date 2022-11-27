export class Eleve {
  public prenom: string
  public competencesValidees: string[]
  public competencesMaitrisees: string[]
  public veutAider: boolean

  constructor (prenom: string, competencesValidees: string[], competencesMaitrisees: string[], veutAider: boolean) {
    this.prenom = prenom
    this.competencesValidees = competencesValidees
    this.competencesMaitrisees = competencesMaitrisees
    this.veutAider = veutAider
  }
}