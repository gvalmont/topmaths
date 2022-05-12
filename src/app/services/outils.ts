interface Periode {
  annee: number,
  debut: number,
  fin: number
}
  export function estHeureEte() {
    const annee = new Date().getFullYear()
    const jour = getDayOfYear()
    for (const heureEte of heuresEte) {
      if (heureEte.annee === annee) {
        if (heureEte.debut <= jour && jour <= heureEte.fin) {
          return true
        }
      }
    }
    return false
  }

  const heuresEte: Periode[] = [
    {
      annee: 2022,
      debut: 86,
      fin: 302
    },
    {
      annee: 2023,
      debut: 85,
      fin: 300
    },
    {
      annee: 2024,
      debut: 91,
      fin: 299
    },
    {
      annee: 2025,
      debut: 89,
      fin: 297
    },
    {
      annee: 2026,
      debut: 88,
      fin: 296
    }
  ]

  /**
   * @returns le numéro du jour de l'année
   */
  function getDayOfYear() {
    const now = new Date();
    const begin = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - begin.getTime()) + ((begin.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }