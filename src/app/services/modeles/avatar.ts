export class AvatarsDef {
  public baliseOuverture: string
  public visage: string
  public visageBlanc: string
  public baliseFermeture: string
  public eyes: Trait[]
  public eyebrows: Trait[]
  public mouth: Trait[]
  public accessoires: Trait[]
  public hair: Trait[]
  public skinColor: Color[]
  public hairColor: Color[]

  constructor (baliseOuverture: string, visage: string, visageBlanc: string, baliseFermeture: string, eyes: Trait[], eyebrows: Trait[], mouth: Trait[], accessoires: Trait[], hair: Trait[], skinColor: Color[], hairColor: Color[]) {
    this.baliseOuverture = baliseOuverture
    this.visage = visage
    this.visageBlanc = visageBlanc
    this.baliseFermeture = baliseFermeture
    this.eyes = eyes
    this.eyebrows = eyebrows
    this.mouth = mouth
    this.accessoires = accessoires
    this.hair = hair
    this.skinColor = skinColor
    this.hairColor = hairColor
  }
}

export class Trait {
  public id: number
  public originalId: string
  public path: string
  public length?: string
  public emplacement?: string

  constructor (id: number, originalId: string, path: string, length?: string, emplacement?: string) {
    this.id = id
    this.originalId = originalId
    this.length = length
    this.emplacement = emplacement
    this.path = path
  }
}

export class Color {
  public id: number
  public originalId: string
  public color: string

  constructor (id: number, originalId: string, color: string) {
    this.id = id
    this.originalId = originalId
    this.color = color
  }
}
