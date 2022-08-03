import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-bouton-dropdown-simple',
  templateUrl: './bouton-dropdown-simple.component.html',
  styleUrls: ['./bouton-dropdown-simple.component.css']
})
export class BoutonDropdownSimpleComponent {
  @Input() bouton: string
  @Input() dropdown: string
  @Input() big: boolean

  constructor () {
    this.bouton = ''
    this.dropdown = ''
    this.big = false
  }

}
