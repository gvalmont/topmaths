import { Component, OnInit, Input } from '@angular/core'
import { DataService } from 'src/app/services/data.service'
import { ScriptService } from 'src/app/services/script.service'
import { LecteurDeXlsComponent } from 'src/app/mini-components/lecteur-de-xls/lecteur-de-xls.component'
declare let XLSX: any

@Component({
  selector: 'app-modale-tuto-xls',
  templateUrl: './modale-tuto-xls.component.html',
  styleUrls: ['./modale-tuto-xls.component.css']
})
export class ModaleTutoXlsComponent implements OnInit {
  @Input() description: string
  @Input() explications: string[]
  INTITULE_COLONNE_PRENOM = LecteurDeXlsComponent.INTITULE_COLONNE_PRENOM
  INTUTULE_COLONNE_NOM = LecteurDeXlsComponent.INTITULE_COLONNE_NOM
  NOTE_MIN_VALIDATION = LecteurDeXlsComponent.NOTE_MIN_VALIDATION
  NOTE_MIN_MAITRISE = LecteurDeXlsComponent.NOTE_MIN_MAITRISE
  modale!: HTMLDivElement

  // eslint-disable-next-line no-unused-vars
  constructor (private dataService: DataService, private scriptService: ScriptService) {
    this.description = ''
    this.explications = []
    scriptService.load('sheetJs')
  }

  ngOnInit (): void {
    const modale = document.getElementById('modale-tuto-xls')
    if (modale !== null) this.modale = <HTMLDivElement> modale
  }

  cacherModale () {
    this.modale.classList.add('cache')
  }

  afficherModale () {
    this.modale.classList.remove('cache')
  }

  telechargerFichier (niveau: string) {
    const references = this.getListeDesReferences(niveau)
    const donnees = this.getListeDesIntitules(references)
    donnees.unshift('Nom', 'Prénom', ' ')

    /* Create worksheet */
    const ws_data = [donnees]
    const ws = XLSX.utils.aoa_to_sheet(ws_data)

    /* Create workbook */
    const wb = XLSX.utils.book_new()

    /* Add the worksheet to the workbook */
    XLSX.utils.book_append_sheet(wb, ws, 'Compétences validées')

    /* Write to file */
    XLSX.writeFile(wb, 'Compétences ' + niveau + '.ods')
  }

  getListeDesReferences (nomNiveau: string) {
    const references = []
    for (const niveau of this.dataService.niveauxSequences) {
      if (niveau.nom === nomNiveau) {
        for (const sequence of niveau.sequences) {
          for (const objectif of sequence.objectifs) {
            references.push(objectif.reference)
          }
        }
      }
    }
    return references
  }

  getListeDesIntitules (references: string[]) {
    const intitules: string[] = []
    for (const reference of references) {
      this.dataService.niveauxObjectifs.find(niveau => {
        return niveau.themes.find(theme => {
          return theme.sousThemes.find(sousTheme => {
            return sousTheme.objectifs.find(objectif => {
              if (objectif.reference === reference) {
                intitules.push(objectif.reference + ' : ' + objectif.titre)
              }
              return objectif.reference === reference
            })
          })
        })
      })
    }
    return intitules
  }
}
