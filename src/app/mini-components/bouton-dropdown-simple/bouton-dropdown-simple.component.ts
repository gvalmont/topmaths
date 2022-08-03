import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-bouton-dropdown-simple',
  templateUrl: './bouton-dropdown-simple.component.html',
  styleUrls: ['./bouton-dropdown-simple.component.css']
})
export class BoutonDropdownSimpleComponent {
  @Input() bouton: string
  @Input() dropdown: string
  @Input() size: number

  constructor () {
    this.bouton = ''
    this.dropdown = ''
    this.size = 2
  }

}
