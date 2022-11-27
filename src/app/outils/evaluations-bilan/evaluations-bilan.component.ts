import { Component, OnInit } from '@angular/core'
import { environment } from 'src/environments/environment'
import { LecteurDeXlsComponent } from 'src/app/mini-components/lecteur-de-xls/lecteur-de-xls.component'
import { DataService } from 'src/app/services/data.service'
import { Exercice } from 'src/app/services/modeles/objectifs'
import { Eleve } from 'src/app/services/modeles/eleves'

@Component({
  selector: 'app-evaluations-bilan',
  templateUrl: './evaluations-bilan.component.html',
  styleUrls: ['./evaluations-bilan.component.css']
})
export class EvaluationsBilanComponent implements OnInit {
  description = `Afin de pouvoir évaluer les élèves plusieurs fois sur les mêmes compétences de façon espacée,
  je peux utiliser cette page pour imprimer des évaluations individuelles sur toutes les compétences déjà réussies une fois
  (note d'au moins ${LecteurDeXlsComponent.NOTE_MIN_VALIDATION}) mais pas encore réussie une deuxième fois
  (note d'au moins ${LecteurDeXlsComponent.NOTE_MIN_MAITRISE}).`
  explications = [ 'Copier le texte', 'Aller sur le module d\'évaluation personnalisée de MathALÉA', 'Sélectionner la deuxième ligne "Nom;item1;item2;item3..."', 'Coller', 'Valider (ça peut prendre du temps 🤩)', 'Complier avec Overleaf ou télécharger le code LateX' ]
  parametresAffiches: boolean
  affichageCompetencesValidees: boolean
  chaineACopier: string
  texteBoutonCopier: string

  // eslint-disable-next-line no-unused-vars
  constructor (public dataService: DataService) {
    this.parametresAffiches = true
    this.affichageCompetencesValidees = false
    this.chaineACopier = ''
    this.texteBoutonCopier = 'Copier'
    this.creerListenerMessagesPost()
  }

  ngOnInit (): void {
    this.recupererListeDejaUploadee()
  }

  recupererListeDejaUploadee () {
    const chaineACopier = sessionStorage.getItem('chaineACopierEvaluationsBilan')
    if (chaineACopier !== null) this.chaineACopier = JSON.parse(chaineACopier)
  }

  creerListenerMessagesPost () {
    const divListenerExistant = document.getElementById('evaluationsBilanListener')
    if (divListenerExistant === null) {
      this.creerDivPresenceListener()
      window.addEventListener('message', (event) => {
        if (event.origin === environment.origine && event.data.type === 'donneesTableur') {
          this.MAJPage(event.data.data)
          sessionStorage.setItem('chaineACopierEvaluationsBilan', JSON.stringify(this.chaineACopier)) // Pour éviter un bug si l'utilisateur utilise les boutons page précédente/suivante
        }
      })
    }
  }

  creerDivPresenceListener () {
    const divListener = document.createElement('div')
    divListener.id = 'evaluationsBilanListener'
    document.body.appendChild(divListener)
  }

  MAJPage (eleves: Eleve[]) {
    let str = ''
    for (const eleve of eleves) {
      if (eleve.competencesValidees.length > 0 && eleve.competencesValidees.length > eleve.competencesMaitrisees.length) {
        str += eleve.prenom + ';'
        for (const competenceValidee of eleve.competencesValidees) {
          let competenceEstMaitrisee = false
          for (const competenceMaitrisee of eleve.competencesMaitrisees) {
            if (competenceValidee === competenceMaitrisee) {
              competenceEstMaitrisee = true
              break
            }
          }
          if (!competenceEstMaitrisee) {
            str += this.getSlug(competenceValidee)
          }
        }
        str += '<br>'
      }
    }
    this.chaineACopier = str
  }

  getSlug (reference: string) {
    let str = ''
    const exercices = this.getExercices(reference)
    for (const exercice of exercices) {
      if (exercice.slug.slice(0, 4) !== 'http') str += exercice.slug + ';'
    }
    str.replace(/&ex=/g, ';')
    return str
  }

  getExercices (reference: string) {
    let exercices: Exercice[] = []
    this.dataService.niveauxObjectifs.find(niveau => {
      return niveau.themes.find(theme => {
        return theme.sousThemes.find(sousTheme => {
          return sousTheme.objectifs.find(objectif => {
            if (objectif.reference === reference) {
              exercices = objectif.exercices
            }
            return objectif.reference === reference
          })
        })
      })
    })
    return exercices
  }

  copier () {
    const chaineACopier = this.chaineACopier.replace(/<br>/g, '\n')
    navigator.clipboard.writeText(chaineACopier)
    this.texteBoutonCopier = 'Copié !'
  }
}
