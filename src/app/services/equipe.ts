export class Equipe {
  teamName: string
  codeEquipe: string
  lienEmbleme: string
  foregroundId: number
  foregroundPrimaryColor: string
  foregroundSecondaryColor: string
  backgroundId: number
  backgroundColor: string
  leader: string

  constructor(teamName: string, codeEquipe: string, lienEmbleme: string,
    foregroundId: number, foregroundPrimaryColor: string, foregroundSecondaryColor: string,
    backgroundId: number, backgroundColor: string, leader: string) {
      this.teamName = teamName
      this.codeEquipe = codeEquipe
      this.lienEmbleme = lienEmbleme
      this.foregroundId = foregroundId
      this.foregroundPrimaryColor = foregroundPrimaryColor
      this.foregroundSecondaryColor = foregroundSecondaryColor
      this.backgroundId = backgroundId
      this.backgroundColor = backgroundColor
      this.leader = leader
  }
}
