import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
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
  @Input() reactiveBoutonsEnvoi!: Date
  @Output() selection = new EventEmitter<{niveaux: string[], sequences: string[]}>();
  lignes: Ligne[]
  lignesParticulieres: Ligne[]
  filtre: Ligne
  event$: any
  ongletActif: string

  constructor(public http: HttpClient) {
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
