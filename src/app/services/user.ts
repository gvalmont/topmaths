export class User {
  public id: number
  public identifiant: string;
  public codeAvatar: string;
  public lastLogin: string;
  public lastAction: string;
  public visible: string;
  public pseudo: string;
  public score: number;
  public codeTrophees: string;
  public tropheesVisibles: string;
  public cleScore: string
  public classement: number
  public teamName: string
  public scoreEquipe: number
  public derniereSequence: string
  public dernierObjectif: string
  public question: number
  public lienAvatar?: string

  constructor(id: number, identifiant: string, codeAvatar: string, lastLogin: string, lastAction: string, visible: string, pseudo: string, score: number,
        codeTrophees: string, tropheesVisibles: string, cleScore: string, classement: number, teamName: string, scoreEquipe: number, derniereSequence: string,
        dernierObjectif: string, question: number) {
    this.id = id
    this.identifiant = identifiant
    this.codeAvatar = codeAvatar
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
    this.derniereSequence = derniereSequence
    this.dernierObjectif = dernierObjectif
    this.question = question
  }
}
export class UserSimplifie {
  public id: number
  public pseudo: string;
  public codeAvatar: string
  public score: number
  public lienTrophees: string
  public classement: number
  public teamName: string
  public scoreEquipe: number
  public lienAvatar?: string
  public styleAvatar?: string
  public aRepondu?: number
  public points?: number
  public flamme?: number
  public question?: number

  constructor(id: number, codeAvatar: string, pseudo: string, score: number, lienTrophees: string, classement: number, teamName: string, scoreEquipe: number, styleAvatar?: string, aRepondu?: number, points?: number) {
    this.id = id
    this.pseudo = pseudo
    this.codeAvatar = codeAvatar
    this.score = score
    this.lienTrophees = lienTrophees
    this.classement = classement
    this.styleAvatar = styleAvatar
    this.teamName = teamName
    this.scoreEquipe = scoreEquipe
    this.aRepondu = aRepondu
    this.points = points
  }
}
