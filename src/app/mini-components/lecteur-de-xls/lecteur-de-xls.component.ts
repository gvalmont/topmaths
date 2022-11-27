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
  public static INTUTULE_COLONNE_NOM = 'Nom'
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
    const INTUTULE_COLONNE_NOM = LecteurDeXlsComponent.INTUTULE_COLONNE_NOM
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
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const elevesBruts = XLSX.utils.sheet_to_json(worksheet)
      const eleves = modifierEleves(elevesBruts)
      window.postMessage({ type: 'donneesTableur', data: eleves }, environment.origine)
    }

    const modifierEleves = function (elevesBruts: any) {
      const elevesAvecCompetencesVaidees = ajouterCompetencesValideesMaitrisees(elevesBruts)
      const elevesAvecPrenomEtCompetences = ajouterPrenom(elevesAvecCompetencesVaidees)
      const eleves = <Eleve[]> ajouterNeVeutPasAider(elevesAvecPrenomEtCompetences)
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

    const ajouterPrenom = function (eleves: any) {
      for (const eleve of eleves) {
        eleve.prenom = eleve[INTITULE_COLONNE_PRENOM]
      }
      for (const eleve1 of eleves) {
        for (const eleve2 of eleves) {
          if (eleve1[INTITULE_COLONNE_PRENOM] === eleve2[INTITULE_COLONNE_PRENOM] && eleve1[INTUTULE_COLONNE_NOM] !== eleve2[INTUTULE_COLONNE_NOM]) {
            eleve1.prenom = eleve1[INTITULE_COLONNE_PRENOM] + ' ' + eleve1[INTUTULE_COLONNE_NOM].slice(0, 1) + '.'
            eleve2.prenom = eleve2[INTITULE_COLONNE_PRENOM] + ' ' + eleve2[INTUTULE_COLONNE_NOM].slice(0, 1) + '.'
          }
        }
      }
      return eleves
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
