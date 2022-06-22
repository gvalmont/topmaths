import { HttpClient } from '@angular/common/http'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router, ActivatedRoute, NavigationStart, Event as NavigationEvent } from '@angular/router'
import { Niveau } from '../services/objectifs'

interface Ligne {
  niveau?: string;
  theme?: string;
  sousTheme?: string;
  reference?: string;
  titre?: string
}
@Component({
  selector: 'app-objectifs',
  templateUrl: './objectifs.component.html',
  styleUrls: []
})
export class ObjectifsComponent implements OnInit, OnDestroy {
  lignes: Ligne[]
  filtre: Ligne
  event$: any
  ongletActif: string

  // eslint-disable-next-line no-unused-vars
  constructor(public httpClient: HttpClient, private activatedRoute: ActivatedRoute, private router: Router) {
    this.lignes = []
    this.filtre = {}
    this.ongletActif = 'tout'
    this.recupererOngletActif()
  }

  ngOnInit(): void {
    this.recupererParametresUrl()
    this.recupererContenuLignesAAfficher()
  }

  ngOnDestroy() {
    this.event$.unsubscribe()
  }

  recupererOngletActif() {
    this.event$ = this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        this.ongletActif = event.url.split('/')[2]
      }
    })
  }

  recupererParametresUrl() {
    this.activatedRoute.params.subscribe(params => {
      this.filtre.niveau = params.niveau
      this.filtre.theme = params.theme
      this.filtre.sousTheme = params.sousTheme
    })
  }

  recupererContenuLignesAAfficher() {
    this.httpClient.get<Niveau[]>('assets/data/objectifs.json').subscribe(niveaux => {
      this.lignes = []
      for (const niveau of niveaux) {
        this.lignes.push({ niveau: niveau.nom })
        for (const theme of niveau.themes) {
          this.lignes.push({ niveau: niveau.nom, theme: theme.nom })
          for (const sousTheme of theme.sousThemes) {
            this.lignes.push({ niveau: niveau.nom, theme: theme.nom, sousTheme: sousTheme.nom })
            for (const objectif of sousTheme.objectifs) {
              this.lignes.push({ niveau: niveau.nom, theme: theme.nom, sousTheme: sousTheme.nom, reference: objectif.reference, titre: objectif.titre })
            }
          }
        }
        this.lignes.push({ niveau: 'fin' })
      }
    }
    )
  }
}
