import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-bouton-imprimer',
  templateUrl: './bouton-imprimer.component.html',
  styleUrls: ['./bouton-imprimer.component.css']
})
export class BoutonImprimerComponent {
  @Input() lien: string
  @Input() size: number

  constructor () {
    this.lien = ''
    this.size = 2
  }

}
