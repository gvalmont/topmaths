
export class Annee {
  public annee: number
  public heureEte: HeureEte
  public periodes: Periode[]

  constructor(annee: number, heureEte: HeureEte, periodes: Periode[]) {
    this.annee = annee
    this.heureEte = heureEte
    this.periodes = periodes
  }
}

export class Periode {
  public numero: number
  public debut: number
  public fin: number
  public type: string

  constructor(numero: number, debut: number, fin: number, type: string) {
    this.numero = numero
    this.debut = debut
    this.fin = fin
    this.type = type
  }
}

export class HeureEte {
  public debut: number
  public fin: number

  constructor(debut: number, fin: number) {
    this.debut = debut
    this.fin = fin
  }
}
