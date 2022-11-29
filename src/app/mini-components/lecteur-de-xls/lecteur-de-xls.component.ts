import { Component, OnInit } from '@angular/core'
import { environment } from 'src/environments/environment'
import { ScriptService } from '../../services/script.service'
import { Eleve } from '../../services/modeles/eleves'
declare let XLSX: any

@Component({
  selector: 'app-lecteur-de-xls',
  templateUrl: './lecteur-de-xls.component.html',
  styleUrls: ['./lecteur-de-xls.component.css']
})
export class LecteurDeXlsComponent implements OnInit {
  reader: FileReader
  public static INTITULE_COLONNE_PRENOM = 'Prénom'
  public static INTITULE_COLONNE_NOM = 'Nom'
  public static INTITULE_FEUILLE_A_IMPRIMER = 'A imprimer'
  public static NOTE_MIN_VALIDATION = 3
  public static NOTE_MIN_MAITRISE = 4
  modale!: HTMLDivElement

  constructor (private scriptService: ScriptService) {
    this.reader = new FileReader()
    scriptService.load('sheetJs')
  }

  ngOnInit (): void {
    const modale = document.getElementById('modale-lecteur-de-xls')
    if (modale !== null) this.modale = <HTMLDivElement> modale
  }

  UploadProcess () {
    const INTITULE_COLONNE_PRENOM = LecteurDeXlsComponent.INTITULE_COLONNE_PRENOM
    const INTITULE_COLONNE_NOM = LecteurDeXlsComponent.INTITULE_COLONNE_NOM
    const INTITULE_FEUILLE_A_IMPRIMER = LecteurDeXlsComponent.INTITULE_FEUILLE_A_IMPRIMER
    const NOTE_MIN_VALIDATION = LecteurDeXlsComponent.NOTE_MIN_VALIDATION
    const NOTE_MIN_MAITRISE = LecteurDeXlsComponent.NOTE_MIN_MAITRISE
    const fileUpload = <HTMLInputElement> document.getElementById("fileUpload")
    const regex = /(.xls|.xlsx|.ods|.numbers)$/
    if (fileUpload !== null && fileUpload.files !== null && regex.test(fileUpload.value.toLowerCase())) {
      recupererDonnesEleves (fileUpload)
    } else {
      alert("Un fichier ayant pour extension .xls, .xlsx, .ods ou .numbers est attendu.")
    }
    async function recupererDonnesEleves (e: any) {
      const file = e.files[0]
      const data = await file.arrayBuffer()
      const classeur = XLSX.read(data)
      const feuilleCompetences = classeur.Sheets[classeur.SheetNames[0]]
      const elevesFeuilleCompetences = XLSX.utils.sheet_to_json(feuilleCompetences)
      const feuilleAImprimer = classeur.Sheets[INTITULE_FEUILLE_A_IMPRIMER]
      const elevesFeuilleAImprimer = XLSX.utils.sheet_to_json(feuilleAImprimer)
      const eleves = modifierEleves(elevesFeuilleCompetences, elevesFeuilleAImprimer)
      window.postMessage({ type: 'donneesTableur', data: eleves }, environment.origine)
    }

    const modifierEleves = function (elevesFeuilleCompetences: any, elevesFeuilleAImprimer: any) {
      const elevesAvecPrenom = ajouterPrenom(elevesFeuilleCompetences)
      const elevesAvecPrenomCompetences = ajouterCompetencesValideesMaitrisees(elevesAvecPrenom)
      const elevesAvecPrenomCompetencesEvaluationsDemandees = ajouterEvaluationsDemandees(elevesAvecPrenomCompetences, elevesFeuilleAImprimer)
      const eleves = <Eleve[]> ajouterNeVeutPasAider(elevesAvecPrenomCompetencesEvaluationsDemandees)
      return eleves
    }

    const ajouterPrenom = function (eleves: any) {
      for (const eleve of eleves) {
        eleve.prenom = eleve[INTITULE_COLONNE_PRENOM]
      }
      for (const eleve1 of eleves) {
        for (const eleve2 of eleves) {
          if (eleve1[INTITULE_COLONNE_PRENOM] === eleve2[INTITULE_COLONNE_PRENOM] && eleve1[INTITULE_COLONNE_NOM] !== eleve2[INTITULE_COLONNE_NOM]) {
            eleve1.prenom = eleve1[INTITULE_COLONNE_PRENOM] + ' ' + eleve1[INTITULE_COLONNE_NOM].slice(0, 1) + '.'
            eleve2.prenom = eleve2[INTITULE_COLONNE_PRENOM] + ' ' + eleve2[INTITULE_COLONNE_NOM].slice(0, 1) + '.'
          }
        }
      }
      return eleves
    }

    const ajouterCompetencesValideesMaitrisees = function (eleves: any) {
      for (const eleve of eleves) {
        const competencesValidees = []
        const competencesMaitrisees = []
        const keys = Object.keys(eleve)
        const values = <string[]>Object.values(eleve)
        for (let i = 0; i < keys.length; i++) {
          if (Number(values[i]) >= NOTE_MIN_VALIDATION) competencesValidees.push(keys[i].split(' ')[0])
          if (Number(values[i]) >= NOTE_MIN_MAITRISE) competencesMaitrisees.push(keys[i].split(' ')[0])
        }
        eleve.competencesValidees = competencesValidees
        eleve.competencesMaitrisees = competencesMaitrisees
      }
      return eleves
    }

    const ajouterEvaluationsDemandees = function (elevesFeuilleCompetences: any, elevesFeuilleAImprimer: any) {
      for (const eleveFeuilleCompetences of elevesFeuilleCompetences) {
        const evaluationsDemandees = []
        for (const eleveFeuilleAImprimer of elevesFeuilleAImprimer) {
          const keysFeuilleAImprimer = Object.keys(eleveFeuilleAImprimer)
          const valuesFeuilleAImprimer = <string[]>Object.values(eleveFeuilleAImprimer)
          if (eleveFeuilleCompetences[INTITULE_COLONNE_NOM] === eleveFeuilleAImprimer[INTITULE_COLONNE_NOM] && eleveFeuilleCompetences[INTITULE_COLONNE_PRENOM] === eleveFeuilleAImprimer[INTITULE_COLONNE_PRENOM]) {
            for (let i = 0; i < keysFeuilleAImprimer.length; i++) {
              if (keysFeuilleAImprimer[i].slice(0, 7) === '__EMPTY') {
                evaluationsDemandees.push(valuesFeuilleAImprimer[i])
              }
            }
          }
        }
        eleveFeuilleCompetences.evaluationsDemandees = evaluationsDemandees
      }
      return elevesFeuilleCompetences
    }

    const ajouterNeVeutPasAider = function (eleves: any) {
      for (const eleve of eleves) {
        eleve.veutAider = false
      }
      return eleves
    }
  }

  cacherModale () {
    this.modale.classList.add('cache')
  }

  afficherModale () {
    this.modale.classList.remove('cache')
  }
}
