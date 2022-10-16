import { Component, OnInit } from '@angular/core'
import { environment } from 'src/environments/environment'

interface Eleve {
  prenom: string,
  competencesValidees: string[]
  veutAider: boolean
}

@Component({
  selector: 'app-tableau-d-aide',
  templateUrl: './tableau-d-aide.component.html',
  styleUrls: ['./tableau-d-aide.component.css']
})
export class TableauDAideComponent implements OnInit {
  eleves: Eleve[]
  parametresAffiches: boolean
  affichageCompetencesValidees: boolean
  modale!: HTMLDivElement

  constructor () {
    this.eleves = []
    this.parametresAffiches = true
    this.affichageCompetencesValidees = false
    this.recupererListeDejaUploadee()
    this.creerListenerMessagesPost()
  }

  ngOnInit (): void {
    const modale = document.getElementById('modale-container')
    if (modale !== null) this.modale = <HTMLDivElement> modale
  }

  recupererListeDejaUploadee () {
    const eleves = sessionStorage.getItem('listeElevesTableauDAide')
    if (eleves !== null) this.eleves = JSON.parse(eleves)
  }

  creerListenerMessagesPost () {
    const divListenerExistant = document.getElementById('tableauDAideListener')
    if (divListenerExistant === null) {
      this.creerDivPresenceListener()
      window.addEventListener('message', (event) => {
        if (event.origin === environment.origine) {
          this.eleves = this.modifierEleves(event.data)
          sessionStorage.setItem('listeElevesTableauDAide', JSON.stringify(this.eleves)) // Pour éviter un bug si l'utilisateur utilise les boutons page précédente/suivante
        }
      })
    }
  }

  creerDivPresenceListener () {
    const divListener = document.createElement('div')
    divListener.id = 'tableauDAideListener'
    document.body.appendChild(divListener)
  }

  modifierEleves (eleves: any) {
    const elevesModifies: Eleve[] = []
    for (const eleve of eleves) {
      const keys = Object.keys(eleve)
      const values = <string[]>Object.values(eleve)
      if (values[0] !== '') {
        const competencesValidees = this.getCompetencesValidees(keys, values)
        const presenceDoublonsPrenoms = this.getPresenceDoublonsPrenoms(eleves, values)
        let prenom: string
        presenceDoublonsPrenoms ? prenom = values[1] + ' ' + values[0].slice(0, 1) + '.' : prenom = values[1]
        prenom = prenom.replace(/ /g, '\u00a0')
        const eleveModifie: Eleve = { prenom, competencesValidees, veutAider: false }
        elevesModifies.push(eleveModifie)
      }
    }
    return elevesModifies
  }

  getCompetencesValidees (keys: string[], values: string[]) {
    const competencesValidees = []
    for (let i = 0; i < keys.length; i++) {
      if (Number(values[i]) >= 3) {
        competencesValidees.push(keys[i].normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ')[0])
      }
    }
    return competencesValidees
  }

  getPresenceDoublonsPrenoms (eleves: any, values: string[]) {
    let compteurPrenomsIdentiques = 0
    for (const eleve2 of eleves) {
      const values2 = <string[]>Object.values(eleve2)
      if (values2[1] === values[1]) {
        compteurPrenomsIdentiques++
      }
    }
    if (compteurPrenomsIdentiques > 1) {
      return true
    } else {
      return false
    }
  }

  veutAider (index: number, veutAider: boolean) {
    this.eleves[index].veutAider = veutAider
  }

  modifAffichageCompetencesValidees (event: Event) {
    const checkbox = <HTMLInputElement> event.target
    this.affichageCompetencesValidees = checkbox.checked
  }

  toggleAffichageParametres () {
    this.parametresAffiches ? this.parametresAffiches = false : this.parametresAffiches = true
  }

  cacherModale () {
    this.modale.className = 'cache'
  }

  afficherModale () {
    this.modale.className = ''
  }
}
