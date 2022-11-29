export class Eleve {
  public prenom: string
  public competencesValidees: string[]
  public competencesMaitrisees: string[]
  public evaluationsDemandees: string[]
  public veutAider: boolean

  constructor (prenom: string, competencesValidees: string[], competencesMaitrisees: string[], evaluationsDemandees: string[], veutAider: boolean) {
    this.prenom = prenom
    this.competencesValidees = competencesValidees
    this.competencesMaitrisees = competencesMaitrisees
    this.evaluationsDemandees = evaluationsDemandees
    this.veutAider = veutAider
  }
}