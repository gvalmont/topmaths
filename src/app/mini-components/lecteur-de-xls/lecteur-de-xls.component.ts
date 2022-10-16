import { Component, Input } from '@angular/core'
import { environment } from 'src/environments/environment'
import { ScriptService } from '../../services/script.service'
declare let XLS: any

@Component({
  selector: 'app-lecteur-de-xls',
  templateUrl: './lecteur-de-xls.component.html',
  styleUrls: ['./lecteur-de-xls.component.css']
})
export class LecteurDeXlsComponent {
  @Input() label: string
  reader: FileReader

  constructor (private scriptService: ScriptService) {
    this.label = ''
    this.reader = new FileReader()
    scriptService.load('xls')
  }

  /**
   * Adapted from https://qawithexperts.com/article/javascript/read-excel-file-using-javascript-xlsx-or-xls/239
   */
  UploadProcess () {
    // Reference the FileUpload element.
    const fileUpload = <HTMLInputElement> document.getElementById("fileUpload")

    // Validate whether File is valid Excel file.
    const regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/
    if (fileUpload !== null && fileUpload.files !== null && regex.test(fileUpload.value.toLowerCase())) {
      this.reader.onload = function (e) {
        if (e.target !== null) GetTableFromExcel(e.target.result)
      }

      this.reader.readAsBinaryString(fileUpload.files[0])

      const GetTableFromExcel = function (data: any) {
        // Read the Excel File data in binary
        const cfb = XLS.CFB.read(data, { type: 'binary' })
        const workbook = XLS.parse_xlscfb(cfb)

        // get the name of First Sheet.
        const Sheet = workbook.SheetNames[0]

        // Read all rows from First Sheet into an JSON array.
        const eleves = XLS.utils.sheet_to_row_object_array(workbook.Sheets[Sheet])
        window.postMessage(eleves, environment.origine)
      }
    } else {
      alert("Il faut d'abord charger un fichier")
    }
  }

}
