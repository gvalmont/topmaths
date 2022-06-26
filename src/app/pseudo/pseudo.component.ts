import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core'
import { ProfilService } from '../services/profil.service'

@Component({
  selector: 'app-pseudo',
  templateUrl: './pseudo.component.html',
  styleUrls: ['./pseudo.component.css']
})
export class PseudoComponent implements OnInit, OnChanges {
  @Input() infosModale: Date
  @Output() modaleFermee = new EventEmitter<string>()

  pseudo: string
  modalePseudo!: HTMLElement
  feminin: boolean

  // eslint-disable-next-line no-unused-vars
  constructor (public profilService: ProfilService) {
    this.pseudo = ''
    this.infosModale = new Date()
    this.feminin = false
  }

  ngOnInit (): void {
    const modalePseudo = document.getElementById("modalePseudo")
    if (modalePseudo !== null) this.modalePseudo = modalePseudo
  }

  ngOnChanges (changes: SimpleChanges) {
    if (typeof (changes.infosModale) !== 'undefined') {
      if (!changes.infosModale.isFirstChange()) {
        this.pseudo = this.profilService.user.pseudo
        this.ouvrirModalePseudo()
      }
    }
  }

  MAJFeminin (feminin: boolean) {
    this.feminin = feminin
  }

  enregistrerPseudo () {
    this.modaleFermee.emit(this.pseudo)
    this.modalePseudo.style.display = "none"
  }

  ouvrirModalePseudo () {
    this.modalePseudo.style.display = "block"
  }

  fermerModalePseudo () {
    this.modalePseudo.style.display = "none"
  }

}
