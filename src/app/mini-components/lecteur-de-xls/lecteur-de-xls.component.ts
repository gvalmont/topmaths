import { Component, Input, OnInit } from '@angular/core'
import { environment } from 'src/environments/environment'
import { ScriptService } from '../../services/script.service'
declare let XLSX: any

@Component({
  selector: 'app-lecteur-de-xls',
  templateUrl: './lecteur-de-xls.component.html',
  styleUrls: ['./lecteur-de-xls.component.css']
})
export class LecteurDeXlsComponent implements OnInit {
  @Input() label: string
  reader: FileReader
  modale!: HTMLDivElement

  constructor (private scriptService: ScriptService) {
    this.label = ''
    this.reader = new FileReader()
    scriptService.load('sheetJs')
  }

  ngOnInit (): void {
    const modale = document.getElementById('modale-container')
    if (modale !== null) this.modale = <HTMLDivElement> modale
  }

  UploadProcess () {
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
      const eleves = XLSX.utils.sheet_to_json(worksheet)
      window.postMessage({ type: 'donneesTableur', data: eleves }, environment.origine)
    }
  }

  cacherModale () {
    this.modale.className = 'cache'
  }

  afficherModale () {
    this.modale.className = ''
  }
}
