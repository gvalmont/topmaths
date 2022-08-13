import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-bouton-imprimer',
  templateUrl: './bouton-imprimer.component.html',
  styleUrls: ['./bouton-imprimer.component.css']
})
export class BoutonImprimerComponent {
  @Input() lien: string
  @Input() size: number
  COEF_MULTIPLICATEUR_IMPRESSION_ENTRAINEMENT = 3

  constructor () {
    this.lien = ''
    this.size = 2
  }

  lienTraitePourImpression () {
    const parts = this.lien.replace('v=e','v=latex').split(',n=')
    let lien = ''
    for (let i = 0; i < parts.length; i++) {
      if (i === 0) {
        lien = parts[i]
      } else {
        lien += (parseInt(parts[i].slice(0, 1)) * this.COEF_MULTIPLICATEUR_IMPRESSION_ENTRAINEMENT).toString() + parts[i].slice(1)
      }
      if (i < parts.length - 1) lien += ',n='
    }
    console.log(this.lien)
    console.log(lien)
    return lien
  }
}
