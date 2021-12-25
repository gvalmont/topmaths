import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-modale-exercices',
  templateUrl: './modale-exercices.component.html',
  styleUrls: ['./modale-exercices.component.css']
})
export class ModaleExercicesComponent implements OnInit {
  @Input() url: string
  @Output() modaleFermee = new EventEmitter<boolean>();
  modale!: HTMLElement
  modaleUrl!: HTMLElement
  boutonRetour!: HTMLElement
  boutonFermer!: HTMLElement
  boutonCopier!: HTMLElement

  constructor() {
    this.url = ''
  }

  ngOnInit(): void {
    this.recupereElementsHTML()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.url.currentValue.toString().slice(0, 25) == 'https://mathsmentales.net') {
      this.parametrage('mathsmentales')
    } else if (changes.url.currentValue.toString().slice(0, 34) == 'https://coopmaths.fr/mathalea.html') {
      this.parametrage('mathalea')
    }
  }

  /**
   * Récupère les différents éléments HTML pour les mettre dans les variables appropriées
   */
  recupereElementsHTML() {
    let element = document.getElementById("modaleExercices")
    if (element != null) this.modale = element
    element = document.getElementById("modaleExercicesUrl")
    if (element != null) this.modaleUrl = element
    element = document.getElementById("modal-back")
    if (element != null) this.boutonRetour = element
    element = document.getElementById("modal-copy")
    if (element != null) this.boutonCopier = element
    element = document.getElementById("modal-cross")
    if (element != null) this.boutonFermer = element
  }

  /**
   * Positionne les boutons pour être en accord avec le site en plein écran
   * @param site Peut être mathalea ou mathsmentales
   */
  parametrage(site: string) {
    switch (site) {
      case 'mathalea':
        this.boutonRetour.style.left = '20px'
        this.boutonRetour.style.right = ''
        this.boutonRetour.style.top = '35px'
        this.boutonRetour.style.width = '30px'

        this.boutonCopier.style.left = ''
        this.boutonCopier.style.right = '80px'
        this.boutonCopier.style.top = '35px'
        this.boutonCopier.style.width = '30px'

        this.boutonFermer.style.left = ''
        this.boutonFermer.style.right = '20px'
        this.boutonFermer.style.top = '35px'
        this.boutonFermer.style.width = '30px'
        break;
      case 'mathsmentales':
        this.boutonRetour.style.left = '20px'
        this.boutonRetour.style.right = ''
        this.boutonRetour.style.top = '80px'
        this.boutonRetour.style.width = '30px'

        this.boutonCopier.style.left = ''
        this.boutonCopier.style.right = '80px'
        this.boutonCopier.style.top = '80px'
        this.boutonCopier.style.width = '30px'

        this.boutonFermer.style.left = ''
        this.boutonFermer.style.right = '20px'
        this.boutonFermer.style.top = '80px'
        this.boutonFermer.style.width = '30px'
        break;
    }
  }

  /**
   * Cache la modale
   */
  fermerModale() {
    this.modaleFermee.emit(true)
    this.modale.style.display = "none"
  }

  /**
   * Copie dans le presse papier le lien vers un exercice
   */
  copierLien() {
    navigator.clipboard.writeText(this.url);
    alert('Le lien vers l\'exercice a été copié')
  }
}
