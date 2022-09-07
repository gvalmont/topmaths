import { Component, OnDestroy, OnInit } from '@angular/core'

interface Possibilite {
  nombres: number[],
  signes: string[],
  calcul: string
}

interface Solution {
  calculs: string[],
  redaction: string
}

@Component({
  selector: 'app-mathador',
  templateUrl: './mathador.component.html',
  styleUrls: ['./mathador.component.css']
})
export class MathadorComponent implements OnInit, OnDestroy {
  nombreCible: number
  donnee1: number
  donnee2: number
  donnee3: number
  donnee4: number
  donnee5: number
  stringSolutions: string
  nombreDeSolutions: number
  solutionsAffichees: boolean
  durees: number[]
  minuteurInterval!: ReturnType<typeof setInterval>
  minuteurEnFonctionnement: boolean | undefined
  tempsRestant: number
  audioDejaJoue: boolean

  constructor () {
    this.nombreCible = 0
    this.donnee1 = 0
    this.donnee2 = 0
    this.donnee3 = 0
    this.donnee4 = 0
    this.donnee5 = 0
    this.stringSolutions = ''
    this.nombreDeSolutions = -1
    this.solutionsAffichees = false
    this.durees = []
    for (let i = 1; i < 61; i++) {
      this.durees.push(i)
    }
    this.tempsRestant = -1
    this.audioDejaJoue = false
  }

  ngOnInit (): void {
    this.relancer()
    this.lancerMinuteurInterval()
  }

  ngOnDestroy () : void {
    clearInterval(this.minuteurInterval)
  }

  lancerMinuteurInterval () {
    this.minuteurInterval = setInterval( () => {
      const audioElement = <HTMLAudioElement> document.getElementById('audioElement')
      const divTempsAffiche = document.getElementById('divTempsAffiche')
      if (audioElement !== null && divTempsAffiche !== null) {
        if (this.minuteurEnFonctionnement) {
          if (this.tempsRestant > 0) {
            this.tempsRestant--
            this.MAJTempsAffiche()
          } else {
            divTempsAffiche.classList.add('shake', 'rouge')
            this.minuteurEnFonctionnement = undefined
            if (!this.audioDejaJoue) {
              audioElement.play()
              this.audioDejaJoue = true
            }
          }
        }
      }
    }
    , 1000)
  }

  relancer () {
    this.nombreCible = this.randint(0, 99)
    this.donnee1 = this.randint(1, 4)
    this.donnee2 = this.randint(1, 6)
    this.donnee3 = this.randint(1, 8)
    this.donnee4 = this.randint(1, 12)
    this.donnee5 = this.randint(1, 20)
    this.stringSolutions = ''
    this.nombreDeSolutions = -1
    this.solutionsAffichees = false
    this.resoudreMathador()
  }

  /**
   * Renvoie un nombre entier entre min et max inclus
   * @param min
   * @param max
   * @returns nombre entier entre min et max inclus
   */
  randint (min: number, max: number) {
    return Math.floor(Math.random() * (max + 1 - min) + min)
  }

  /**
   * Teste toutes les possibilités de calcul utilisant les 5 nombres et les 4 opérations
   * Sélectionne les possibilités qui aboutissent au bon résultat
   * Filtre les possibilités équivalentes (mêmes calculs mais pas dans le même ordre)
   * Modifie le nombre de solutions et le contenu du div des solutions
   */
  resoudreMathador () {
    const solutions: Solution[] = []
    const possibilites0: Possibilite = { nombres: [ this.donnee1, this.donnee2, this.donnee3, this.donnee4, this.donnee5 ], signes: [ '+', '-', '*', '/' ], calcul: '' }
    const possibilites1 = this.determinerPossibilites(possibilites0.nombres, possibilites0.signes)
    for (const possibilite1 of possibilites1) {
      if (this.lesNombresPassentLeFiltre(possibilite1)) {
        const possibilites2 = this.determinerPossibilites(possibilite1.nombres, possibilite1.signes)
        for (const possibilite2 of possibilites2) {
          if (this.lesNombresPassentLeFiltre(possibilite2)) {
            const possibilites3 = this.determinerPossibilites(possibilite2.nombres, possibilite2.signes)
            for (const possibilite3 of possibilites3) {
              if (this.lesNombresPassentLeFiltre(possibilite3)) {
                const possibilites4 = this.determinerPossibilites(possibilite3.nombres, possibilite3.signes)
                for (const possibilite4 of possibilites4) {
                  if (possibilite4.nombres[0] === this.nombreCible) {
                    const calculs = [ possibilite1.calcul, possibilite2.calcul, possibilite3.calcul, possibilite4.calcul ]
                    const redaction = ' $ ' + possibilite1.calcul + ' \\\\ ' + possibilite2.calcul + ' \\\\ ' + possibilite3.calcul + ' \\\\ ' + possibilite4.calcul + ' $ '
                    const solutionCandidate = { calculs, redaction }
                    if (!this.solutionPresente(solutionCandidate, solutions)) {
                      solutions.push(solutionCandidate)
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    this.stringSolutions = ''
    this.nombreDeSolutions = solutions.length
    for (const solution of solutions) {
      this.stringSolutions += solution.redaction + ' <br><br> '
    }
  }

  /**
   * Coeur de la recherche de solutions.
   * Fait tous les calculs possibles à partir des nombres de poolDeNombres et des signes de signesDisponibles.
   * Dans chaque cas, reconstitue un nouveau pool de nombres en regroupant les nombres inutilisés et le résultat obtenu
   * Renvoie tous ces nouveaux pool de nombres ainsi que les signes disponibles restants dans une liste d'objets possibilités
   * @param poolDeNombres
   * @param signesDisponibles
   * @returns possibilites
   */
  determinerPossibilites (poolDeNombres: number[], signesDisponibles: string[]) {
    const possibilites: Possibilite[] = []
    for (const premierNombre of poolDeNombres) {
      for (const premierSigne of signesDisponibles) {
        const nombresSaufPremier = poolDeNombres.filter(function (value) {
          return value !== premierNombre
        })
        while (nombresSaufPremier.length < poolDeNombres.length - 1) nombresSaufPremier.push(premierNombre) // Si le même nombre apparaissait plusieurs fois on les a tous enlevés. Si c'est le cas, on renfloue nombres1
        const signesSaufLePremier = signesDisponibles.filter(function (value) {
          return value !== premierSigne
        })
        for (const deuxiemeNombre of nombresSaufPremier) {
          const resultatPremierCalcul = this.calculer(premierNombre, deuxiemeNombre, premierSigne)
          const nombresSauf1et2 = nombresSaufPremier.filter(function (value) {
            return value !== deuxiemeNombre
          })
          while (nombresSauf1et2.length < nombresSaufPremier.length - 1) nombresSauf1et2.push(deuxiemeNombre)
          const nombresSauf1et2AvecResultat1 = nombresSauf1et2
          nombresSauf1et2AvecResultat1.push(resultatPremierCalcul.resultat)
          possibilites.push({
            nombres: nombresSauf1et2AvecResultat1,
            signes: signesSaufLePremier,
            calcul: resultatPremierCalcul.calcul
          })
        }
      }
    }
    return possibilites
  }

  /**
   * Effectue l'opération entre le max de nombre1 et nombre2 et leur min
   * @param nombre1
   * @param nombre2
   * @param operation
   * @returns {resultat: number, calcul: string} resultat est un nombre servant pour la suite des calculs et calcul est une version LateX du calcul servant plus tard pour l'affichage des solutions.
   */
  calculer (nombre1: number, nombre2: number, operation: string) {
    const max = Math.max(nombre1, nombre2)
    const min = Math.min(nombre1, nombre2)
    switch (operation) {
      case '+':
        return { resultat: max + min, calcul: `${max} + ${min} = ${max + min}` }
      case '-':
        return { resultat: max - min, calcul: `${max} - ${min} = ${max - min}` }
      case '*':
        return { resultat: max * min, calcul: `${max} \\times ${min} = ${max * min}` }
      case '/':
        if (max === 0 || min === 0) {
          return { resultat: -1000, calcul: 'Erreur : signe d\'opération inconnu' }
        } else {
          return { resultat: max / min, calcul: `${max} \\div ${min} = ${max / min}` }
        }
      default:
        console.error('Signe d\'opération inconnu')
        return { resultat: -1000, calcul: 'Erreur : signe d\'opération inconnu' }
    }
  }

  /**
   * Renvoie false si :
   * - un nombre n'est pas positif
   * - un nombre n'est pas entier
   * Renvoie true sinon
   * @param possibilite
   * @returns
   */
  lesNombresPassentLeFiltre (possibilite: Possibilite) {
    for (const nombre of possibilite.nombres) {
      if (nombre < 0) { // On vérifie si les nombres sont positifs
        return false
      }
      if (nombre !== Math.floor(nombre)) { // On vérifie si les nombres sont entiers
        return false
      }
    }
    return true
  }

  /**
   * Vérifie si une solutionCandidate existe déja dans les solutions
   * @param solutionCandidate
   * @param solutions
   * @returns true si la solutionCandidate existe déjà dans les solutions
   */
  solutionPresente (solutionCandidate: Solution, solutions: Solution[]) {
    for (const solution of solutions) {
      let nombreDeCalculsIdentiques = 0
      for (const calculCandidat of solutionCandidate.calculs) {
        if (solution.calculs.indexOf(calculCandidat) !== -1) nombreDeCalculsIdentiques++
      }
      if (nombreDeCalculsIdentiques === 4) return true
    }
    return false
  }

  setupMinuteur (dureeEnMin: number) {
    const divTempsAffiche = document.getElementById('divTempsAffiche')
    if (divTempsAffiche !== null) {
      this.tempsRestant = dureeEnMin * 60
      this.MAJTempsAffiche()
      this.minuteurEnFonctionnement = false
      this.audioDejaJoue = false
      divTempsAffiche.classList.remove('shake', 'rouge')
    }
  }

  lancerMinuteur () {
    this.minuteurEnFonctionnement = true
  }

  arreterMinuteur () {
    this.minuteurEnFonctionnement = false
  }

  MAJTempsAffiche () {
    const divTempsAffiche = document.getElementById('divTempsAffiche')
    if (divTempsAffiche !== null) {
      divTempsAffiche.innerHTML = `${Math.floor(this.tempsRestant / 60)} : ${(this.tempsRestant % 60) < 10 ? '0' : ''}${this.tempsRestant % 60}`
    }
  }

}
