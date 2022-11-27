import { Component } from '@angular/core'
import { environment } from 'src/environments/environment'
import { Eleve } from 'src/app/services/modeles/eleves'

@Component({
  selector: 'app-tableau-d-aide',
  templateUrl: './tableau-d-aide.component.html',
  styleUrls: ['./tableau-d-aide.component.css']
})
export class TableauDAideComponent {
  description = `Lors des séances de travail en autonomie, les élèves qui veulent signaler aux autres qu'ils sont disposés à les aider peuvent s'inscrire sur le "Tableau d'aide".<br>
  L'enseignant⸱e peut utiliser cet outil pour rapidement projeter au tableau la liste des élèves disposés à aider les autres ainsi que la liste des compétences qu'ils⸱elles ont déjà validées.`
  eleves: Eleve[]
  parametresAffiches: boolean
  affichageCompetencesValidees: boolean

  constructor () {
    this.eleves = []
    this.parametresAffiches = true
    this.affichageCompetencesValidees = false
    this.recupererListeDejaUploadee()
    this.creerListenerMessagesPost()
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
          this.eleves = event.data.data
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
}
