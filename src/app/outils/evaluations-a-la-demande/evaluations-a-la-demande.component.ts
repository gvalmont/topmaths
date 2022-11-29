import { Component, OnInit } from '@angular/core'
import { LecteurDeXlsComponent } from 'src/app/mini-components/lecteur-de-xls/lecteur-de-xls.component'
import { DataService } from 'src/app/services/data.service'
import { Eleve } from 'src/app/services/modeles/eleves'
import { Exercice } from 'src/app/services/modeles/objectifs'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-evaluations-a-la-demande',
  templateUrl: './evaluations-a-la-demande.component.html',
  styleUrls: ['./evaluations-a-la-demande.component.css']
})
export class EvaluationsALaDemandeComponent implements OnInit {
  description = `Cette page permet d'imprimer des évaluations à la demande des élèves.<br>
  Pour cela, elle récupère les noms et prénoms des élèves dans les colonnes "${LecteurDeXlsComponent.INTITULE_COLONNE_NOM}"
  et "${LecteurDeXlsComponent.INTITULE_COLONNE_PRENOM}" du premier onglet puis en cherche une correspondance dans l'onglet
  "${LecteurDeXlsComponent.INTITULE_FEUILLE_A_IMPRIMER}" (qui peut être le même onglet).<br>
  Ensuite, pour chaque ligne, on récupère le contenu des cellules dont la colonne n'a pas de nom et on en cherche une
  correspondance sur le site pour en tirer la liste des exercices.<br>
  Vous pouvez télécharger un exemple <a href="/assets/telechargements/evaluation-a-la-demande.ods">ici</a>`
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
    const chaineACopier = sessionStorage.getItem('chaineACopierEvaluationsALaDemande')
    if (chaineACopier !== null) this.chaineACopier = JSON.parse(chaineACopier)
  }

  creerListenerMessagesPost () {
    const divListenerExistant = document.getElementById('evaluationsALaDemandeListener')
    if (divListenerExistant === null) {
      this.creerDivPresenceListener()
      window.addEventListener('message', (event) => {
        if (event.origin === environment.origine && event.data.type === 'donneesTableur') {
          this.MAJPage(event.data.data)
          sessionStorage.setItem('chaineACopierEvaluationsALaDemande', JSON.stringify(this.chaineACopier)) // Pour éviter un bug si l'utilisateur utilise les boutons page précédente/suivante
        }
      })
    }
  }

  creerDivPresenceListener () {
    const divListener = document.createElement('div')
    divListener.id = 'evaluationsALaDemandeListener'
    document.body.appendChild(divListener)
  }

  MAJPage (eleves: Eleve[]) {
    let chaineACopier = ''
    for (const eleve of eleves) {
      let chaineEleve = ''
      for (const evaluationDemandee of eleve.evaluationsDemandees) {
        chaineEleve += this.getSlug(evaluationDemandee)
      }
      if (chaineEleve !== '') {
        chaineACopier += eleve.prenom + ';' + chaineEleve + '<br>'
      }
    }
    this.chaineACopier = chaineACopier
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
