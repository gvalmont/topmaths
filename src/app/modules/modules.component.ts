import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Niveau } from '../services/modules';

interface Ligne {
  niveau: string
  reference: string
  titre: string
  description: string
}

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css']
})
export class ModulesComponent implements OnInit {
  lignes: Ligne[]

  constructor(public http: HttpClient) {
    this.lignes = []
  }

  ngOnInit(): void {
    this.recupereContenuLignesAAfficher()
  }

  recupereContenuLignesAAfficher() {
    this.http.get<Niveau[]>('assets/data/modules.json').subscribe(niveaux => {
      this.lignes = []
      for (const niveau of niveaux) {
        this.lignes.push({
          niveau: niveau.nom,
          reference: '',
          titre: '',
          description: ''
        })
          for (const module of niveau.modules) {
            this.lignes.push({
              niveau: '',
              reference: module.reference,
              titre: module.titre,
              description: module.description
            })
        }
      }
    })
  }

}
