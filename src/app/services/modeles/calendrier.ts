
export class Annee {
  public annee: number
  public periodes: Periode[]

  constructor (annee: number, periodes: Periode[]) {
    this.annee = annee
    this.periodes = periodes
  }
}

export class Periode {
  public numero: number
  public debut: number
  public fin: number
  public type: string

  constructor (numero: number, debut: number, fin: number, type: string) {
    this.numero = numero
    this.debut = debut
    this.fin = fin
    this.type = type
  }
}
