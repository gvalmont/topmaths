import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, Event as NavigationEvent, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ApiService } from './services/api.service';
import { Title } from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { CalendrierService } from './services/calendrier.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./bulma.css', './bulma-extension.css', './app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  ongletActif: string
  event$: any
  title: string

  constructor(private http: HttpClient, private router: Router, public dataService: ApiService, private activatedRoute: ActivatedRoute, private titleService: Title, private calendrier: CalendrierService) {
    this.title = 'topmaths.fr - les maths au TOP !'
    this.dataService.set('premiereNavigation', null)
    this.ongletActif = 'accueil'
    this.MAJOngletActif()
    this.MAJProfil()
    this.MAJLeTitreDeLaPage()
  }

  ngOnInit() {
    this.prechargerLesDonnees()
  }

  ngOnDestroy() {
    this.event$.unsubscribe();
  }

  /**
   * Récupère l'onglet actif à partir de l'url pour le mettre en surbrillance.
   */
  MAJOngletActif() {
    this.event$ = this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        this.ongletActif = event.url.split('/')[1]
        if (this.ongletActif == '') {
          this.ongletActif = 'accueil'
        }
      }
    });
  }

  /**
   * Vérifie la présence d'un token de connexion et récupère le profil utilisateur le cas échéant
   */
  MAJProfil() {
    const identifiant = this.dataService.getToken('identifiant')
    const version = this.dataService.getToken('version')
    if (identifiant != null && version == this.dataService.derniereVersionToken) {
      setTimeout(() => {
        this.dataService.login(identifiant, false, false)
      }, 0);
    }
  }

  MAJLeTitreDeLaPage() {
    // Fonction de https://blog.bitsrc.io/dynamic-page-titles-in-angular-98ce20b5c334
    const appTitle = this.titleService.getTitle();
    this.router
      .events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          const child = this.activatedRoute.firstChild;
          if (child != null && child.snapshot.data['title']) { // Ce data['title'] est défini dans le app-routing.module.ts
            return child.snapshot.data['title'];
          }
          return appTitle;
        })
      ).subscribe((ttl: string) => {
        this.titleService.setTitle(ttl);
      });
  }

  /**
   * Lance le téléchargement de objectifs.json et de sequences.json pour les mettre en cache
   */
  prechargerLesDonnees() {
    this.http.get('assets/data/objectifs.json').subscribe()
    this.http.get('assets/data/sequences.json').subscribe()
  }
}
