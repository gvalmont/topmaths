export class User {
  public id: number
  public identifiant: string
  public codeAvatar: string
  public lastLogin: string
  public pseudo: string
  public derniereSequence: string
  public dernierObjectif: string
  public question: number
  public lienAvatar?: string

  constructor(id: number, identifiant: string, codeAvatar: string, lastLogin: string, pseudo: string,
    derniereSequence: string, dernierObjectif: string, question: number) {
    this.id = id
    this.identifiant = identifiant
    this.codeAvatar = codeAvatar
    this.lastLogin = lastLogin
    this.pseudo = pseudo
    this.derniereSequence = derniereSequence
    this.dernierObjectif = dernierObjectif
    this.question = question
  }
}
export class UserSimplifie {
  public id: number
  public pseudo: string;
  public codeAvatar: string
  public lienAvatar?: string
  public styleAvatar?: string
  public aRepondu?: number
  public points?: number
  public flamme?: number
  public question?: number

  constructor(id: number, codeAvatar: string, pseudo: string, styleAvatar?: string, aRepondu?: number, points?: number) {
    this.id = id
    this.pseudo = pseudo
    this.codeAvatar = codeAvatar
    this.styleAvatar = styleAvatar
    this.aRepondu = aRepondu
    this.points = points
  }
}
