export class User {
  public id: number
  public identifiant: string;
  public codeAvatar: string;
  public scores: string;
  public lastLogin: string;
  public lastAction: string;
  public visible: string;
  public pseudo: string;
  public score: string;
  public codeTrophees: string;
  public tropheesVisibles: string;
  public cleScore: string
  public classement: number
  public teamName: string
  public scoreEquipe: number

  constructor(id: number, identifiant: string, codeAvatar: string, scores: string, lastLogin: string, lastAction: string, visible: string, pseudo: string, score: string,
        codeTrophees: string, tropheesVisibles: string, cleScore: string, classement: number, teamName: string, scoreEquipe: number) {
    this.id = id
    this.identifiant = identifiant
    this.codeAvatar = codeAvatar
    this.scores = scores
    this.lastLogin = lastLogin
    this.lastAction = lastAction
    this.visible = visible
    this.pseudo = pseudo
    this.score = score
    this.codeTrophees = codeTrophees
    this.tropheesVisibles = tropheesVisibles
    this.cleScore = cleScore
    this.classement = classement
    this.teamName = teamName
    this.scoreEquipe = scoreEquipe
  }
}
export class UserSimplifie {
  public id: number
  public pseudo: string;
  public codeAvatar: string
  public score: string
  public lienTrophees: string
  public classement: number
  public teamName: string
  public scoreEquipe: number
  public styleAvatar?: string

  constructor(id: number, codeAvatar: string, pseudo: string, score: string, lienTrophees: string, classement: number, teamName: string, scoreEquipe: number, styleAvatar?: string) {
    this.id = id
    this.pseudo = pseudo
    this.codeAvatar = codeAvatar
    this.score = score
    this.lienTrophees = lienTrophees
    this.classement = classement
    this.styleAvatar = styleAvatar
    this.teamName = teamName
    this.scoreEquipe = scoreEquipe
  }
}
