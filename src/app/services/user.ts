export class User {
  public identifiant: string;
  public lienAvatar: string;
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
  public equipe: string

  constructor(identifiant: string, lienAvatar: string, scores: string, lastLogin: string, lastAction: string, visible: string, pseudo: string, score: string,
        codeTrophees: string, tropheesVisibles: string, cleScore: string, classement: number, equipe: string) {
    this.identifiant = identifiant
    this.lienAvatar = lienAvatar
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
    this.equipe = equipe
  }
}
export class UserSimplifie {
  public id: string
  public pseudo: string;
  public lienAvatar: string;
  public score: string;
  public lienTrophees: string;
  public classement: number
  public equipe: string
  public styleAvatar?: string;

  constructor(id: string, lienAvatar: string, pseudo: string, score: string, lienTrophees: string, classement: number, equipe: string, styleAvatar?: string) {
    this.id = id
    this.pseudo = pseudo
    this.lienAvatar = lienAvatar
    this.score = score
    this.lienTrophees = lienTrophees
    this.classement = classement
    this.styleAvatar = styleAvatar
    this.equipe = equipe
  }
}
