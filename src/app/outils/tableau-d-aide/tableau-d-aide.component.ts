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
  INTITULE_COLONNE_PRENOM = 'Prénom'
  INTUTULE_COLONNE_NOM = 'Nom'
  NOTE_MIN_VALIDATION = 3
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
        if (event.origin === environment.origine && event.data.type === 'donneesTableur') {
          const elevesBruts = event.data.data
          this.eleves = this.modifierEleves(elevesBruts)
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

  modifierEleves (elevesBruts: any) {
    const elevesAvecCompetencesVaidees = this.ajouterCompetencesValidees(elevesBruts)
    const elevesAvecPrenomEtCompetences = this.ajouterPrenom(elevesAvecCompetencesVaidees)
    const eleves = <Eleve[]> this.ajouterNeVeutPasAider(elevesAvecPrenomEtCompetences)
    return eleves
  }

  ajouterCompetencesValidees (eleves: any) {
    for (const eleve of eleves) {
      const competencesValidees = []
      const keys = Object.keys(eleve)
      const values = <string[]>Object.values(eleve)
      for (let i = 0; i < keys.length; i++) {
        if (Number(values[i]) >= this.NOTE_MIN_VALIDATION) competencesValidees.push(keys[i].split(' ')[0])
      }
      eleve.competencesValidees = competencesValidees
    }
    return eleves
  }

  ajouterPrenom (eleves: any) {
    for (const eleve of eleves) {
      eleve.prenom = eleve[this.INTITULE_COLONNE_PRENOM]
    }
    for (const eleve1 of eleves) {
      for (const eleve2 of eleves) {
        if (eleve1[this.INTITULE_COLONNE_PRENOM] === eleve2[this.INTITULE_COLONNE_PRENOM] && eleve1[this.INTUTULE_COLONNE_NOM] !== eleve2[this.INTUTULE_COLONNE_NOM]) {
          eleve1.prenom = eleve1[this.INTITULE_COLONNE_PRENOM] + ' ' + eleve1[this.INTUTULE_COLONNE_NOM].slice(0, 1) + '.'
          eleve2.prenom = eleve2[this.INTITULE_COLONNE_PRENOM] + ' ' + eleve2[this.INTUTULE_COLONNE_NOM].slice(0, 1) + '.'
        }
      }
    }
    return eleves
  }

  ajouterNeVeutPasAider (eleves: any) {
    for (const eleve of eleves) {
      eleve.veutAider = false
    }
    return eleves
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
