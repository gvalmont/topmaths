import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bouton-imprimer',
  templateUrl: './bouton-imprimer.component.html',
  styleUrls: ['./bouton-imprimer.component.css']
})
export class BoutonImprimerComponent implements OnInit {
  @Input() lien: string

  constructor() {
    this.lien = ""
  }

  ngOnInit(): void {
  }

}
