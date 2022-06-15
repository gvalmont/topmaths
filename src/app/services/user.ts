export class User {
  public id: number
  public identifiant: string
  public codeAvatar: string
  public lastLogin: string
  public pseudo: string
  public derniereSequence: string
  public dernierObjectif: string
  public lienAvatar?: string

  constructor(id: number, identifiant: string, codeAvatar: string, lastLogin: string, pseudo: string,
    derniereSequence: string, dernierObjectif: string) {
    this.id = id
    this.identifiant = identifiant
    this.codeAvatar = codeAvatar
    this.lastLogin = lastLogin
    this.pseudo = pseudo
    this.derniereSequence = derniereSequence
    this.dernierObjectif = dernierObjectif
  }
}
