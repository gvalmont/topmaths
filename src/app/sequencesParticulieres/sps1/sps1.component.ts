import { Component } from '@angular/core'

@Component({
  selector: 'app-sps1',
  templateUrl: './sps1.component.html',
  styleUrls: ['./sps1.component.css']
})
export class SPS1Component {
  seances: string[]

  constructor () {
    this.seances = [
      'Séquences d\'instructions',
      'Boucles simples',
      'Boucles à motif',
      'Boucles imbriquées',
      'Conditions',
      'Variables',
      'Boucles conditionnelles',
      'Procédures' ]
  }

}
