import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-bouton-imprimer',
  templateUrl: './bouton-imprimer.component.html',
  styleUrls: ['./bouton-imprimer.component.css']
})
export class BoutonImprimerComponent {
  @Input() lien: string
  @Input() big: boolean

  constructor () {
    this.lien = ''
    this.big = false
  }

}
