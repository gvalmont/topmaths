import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { GlobalConstants } from 'src/app/services/global-constants';
import { Niveau, SequenceParticuliere } from '../../services/sequences';

/**
 * Type d'objet de toutes les lignes qui seront affichées
 * Si c'est un niveau (5e, 4e...), l'attribut niveau sera complété et les autres seront null
 * Si c'est un thème (Nombres et Calculs, Géométrie...), l'attribut theme sera complété et les autres seront null etc.
 * De cette façon, les *ngIf du html sauront comment les afficher
 */
interface Ligne {
  niveau?: string;
  numero?: number;
  reference?: string;
  titre?: string
}
@Component({
  selector: 'app-liste-sequences',
  templateUrl: './liste-sequences.component.html',
  styleUrls: ['./liste-sequences.component.css']
})
export class ListeSequencesComponent implements OnInit {
  @Input() modeSelection: boolean
  @Input() reactiveBoutonsEnvoi!: Date
  @Output() selection = new EventEmitter<{niveaux: string[], sequences: string[]}>();
  lignes: Ligne[]
  lignesParticulieres: Ligne[]
  filtre: Ligne
  event$: any
  ongletActif: string

  constructor(public http: HttpClient) {
    this.modeSelection = false
    this.lignes = []
    this.lignesParticulieres = []
    this.filtre = { niveau: 'tout'}
    this.ongletActif = 'tout'
  }

  ngOnInit(): void {
    this.recupereContenuLignesAAfficher()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.reactiveBoutonsEnvoi) {
      const boutonsEnvoi = <HTMLButtonElement[]><unknown> document.getElementsByClassName('boutonEnvoi')
      if (boutonsEnvoi != null) {
        for (const boutonEnvoi of boutonsEnvoi) {
          boutonEnvoi.disabled = false
        }
      }
    }
  }


  /**
   * Récupère les niveaux, thèmes, sous-thèmes et références de objectifs.json et les ajoute à this.lignes pour pouvoir les afficher
   */
  recupereContenuLignesAAfficher() {
    this.lignes = [] // va contenir toutes les lignes à afficher.
    this.lignesParticulieres = []
    this.http.get<SequenceParticuliere[]>('assets/data/sequencesParticulieres.json').subscribe(sequencesParticulieres => {
      this.lignesParticulieres.push({ niveau: 'Séquences particulières' })
      for (const sequence of sequencesParticulieres) {
        this.lignesParticulieres.push({ niveau: 'Séquences particulières', reference: sequence.reference, titre: sequence.titre, numero: 0 })
      }
      this.lignesParticulieres.push({ niveau: 'fin' })
    }
    )
    this.http.get<Niveau[]>('assets/data/sequences.json').subscribe(niveaux => {
      for (const niveau of niveaux) {
        this.lignes.push({ niveau: niveau.nom })
        for (const sequence of niveau.sequences) {
          this.lignes.push({ niveau: niveau.nom, reference: sequence.reference, titre: sequence.titre, numero: parseInt(sequence.reference.slice(3)) })
        }
        this.lignes.push({ niveau: 'fin' })
      }
    }
    )
  }

  /**
   * Click listener attaché aux checkbox
   * Comme lorsqu'on clique sur une checkbox ça inverse son statut,
   * alors on l'inverse à nouveau puis on lance le click listener attaché aux noms des séquences: check(id)
   * @param id 
   */
  coche(id: string) {
    const checkbox = <HTMLInputElement>document.getElementById(id)
    if (checkbox != null) {
      checkbox.checked = !checkbox.checked
      this.check(id)
    }
  }

  /**
   * Click listener attaché aux noms des séquences
   * Toggle la checkbox qui a l'id passée en paramètre
   * Si elle correspond à un niveau, coche toutes les cases correspondant aux séquences vues en classe et affiche que les points sont doublés
   * Si elle correspond à une séquence, décoche la case du niveau
   * @param id de la checkbox
   */
  check(id: string) {
    const checkbox = <HTMLInputElement>document.getElementById(id)
    if (checkbox != null) {
      checkbox.checked = !checkbox.checked
      if (/^[0-9]*$/.test(id.slice(0, 1))) { // Si c'est un niveau, on coche ou décoche toutes ses séquences
        let derniereSequence = 0
        switch (id) {
          case '6e':
            derniereSequence = GlobalConstants.derniereSequence6e
            break;
          case '5e':
            derniereSequence = GlobalConstants.derniereSequence5e
            break;
          case '4e':
            derniereSequence = GlobalConstants.derniereSequence4e
            break;
          case '3e':
            derniereSequence = GlobalConstants.derniereSequence3e
            break;
        }
        for (const ligne of this.lignes) { // On décoche toutes les lignes du niveau
          if (ligne.reference != null) {
            if (ligne.reference.slice(1,2) == id.slice(0, 1)) {
              const chkbox = <HTMLInputElement>document.getElementById(ligne.reference)
              if (chkbox != null) chkbox.checked = false
            }
          }
        }
        if (checkbox.checked) { // S'il est coché, on coche les lignes jusqu'à la dernière séquence et on affiche que les points sont doublés
          for (let i = 0; i <= derniereSequence; i++) {
            const chkbox = <HTMLInputElement>document.getElementById(`S${id.slice(0, 1)}S${i}`)
            if (chkbox != null) chkbox.checked = checkbox.checked
          }
          const divBonus = document.getElementById('divBonus')
          if (divBonus != null) {
            divBonus.style.transition = ''
            divBonus.innerHTML = '&nbsp; Points doublés ! &nbsp;'
            divBonus.style.opacity = '0.8'
            divBonus.style.display = 'block'
            divBonus.classList.add('booboom')
            setTimeout(() => {
              divBonus.style.transition = '0.5s'
              divBonus.style.opacity = '0'
              setTimeout(() => {
                divBonus.style.display = 'none'
              }, 500);
              divBonus.classList.remove('booboom')
            }, 1000);
          }
        } else {
          const divBonus = document.getElementById('divBonus')
          if (divBonus != null) {
            divBonus.style.display = 'none'
          }
        }
      } else { // Si c'est une séquence, on décoche le titre
        const chkbox = <HTMLInputElement>document.getElementById(`${id.slice(1, 2)}e`)
        if (chkbox != null) {
          chkbox.checked = false
          const divBonus = document.getElementById('divBonus')
          if (divBonus != null) {
            divBonus.style.display = 'none'
          }
        }
      }
    }
  }

  /**
   * Récupère les niveaux complets et les séquences individuelles sélectionnées et les envoie au module parent
   */
  envoiSelection() {
    let niveaux: string[] = []
    let sequences: string[] = []
    // On désactive les boutons d'envoi
    const boutonsEnvoi = <HTMLButtonElement[]><unknown> document.getElementsByClassName('boutonEnvoi')
    if (boutonsEnvoi != null) {
      for (const boutonEnvoi of boutonsEnvoi) {
        boutonEnvoi.disabled = true
      }
    }
    // On vérifie les niveaux complets
    for (const ligne of this.lignes) {
      if (ligne.niveau != 'fin' && ligne.reference == null && ligne.niveau != null) {
        const chkbox = <HTMLInputElement>document.getElementById(ligne.niveau)
        if (chkbox != null && chkbox.checked === true) niveaux.push(ligne.niveau)
      }
    }
    // On vérifie les séquences individuelles
    for (const ligne of this.lignes) {
      if (ligne.reference != null && ligne.niveau != null && !niveaux.includes(ligne.niveau)) {
        const chkbox = <HTMLInputElement>document.getElementById(ligne.reference)
        if (chkbox != null && chkbox.checked === true) sequences.push(ligne.reference)
      }
    }
    if (niveaux.length + sequences.length == 0) {
      alert('Il faut choisir au moins une séquence !')
      if (boutonsEnvoi != null) {
        for (const boutonEnvoi of boutonsEnvoi) {
          boutonEnvoi.disabled = false
        }
      }
    }
    else this.selection.emit({niveaux: niveaux, sequences: sequences})
  }
}
