import { Component, isDevMode, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, Event as NavigationEvent, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ApiService } from './services/api.service';
import { GlobalConstants } from './services/global-constants';
import { Title } from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient, private router: Router, public dataService: ApiService, private activatedRoute: ActivatedRoute, private titleService: Title) {
    this.redirectionHTTPS()
    this.title = 'topmaths.fr - les maths au TOP !'
    this.dataService.set('premiereNavigation', null)
    this.ongletActif = 'accueil'
    this.recupereOngletActif()
    this.recupereProfil()
    this.observeChangementsDeRoute()
    this.mettreAJourLeTitreDeLaPage()
  }

  ngOnInit() {
    this.chargeLesDonnees()
  }

  ngOnDestroy() {
    this.event$.unsubscribe();
  }

  /**
   * Lance le téléchargement de sequences.json et de objectifs.json pour les mettre en cache
   */
  chargeLesDonnees() {
    this.http.get('assets/data/objectifs.json').subscribe()
    this.http.get('assets/data/sequences.json').subscribe()
  }

  /**
   * À chaque changement de route :
   * met à jour le lastAction
   * s'il y a une icône de compétition dans le menu, vérifie si elle est toujours d'actualité
   */
  observeChangementsDeRoute() {
    this.event$ = this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        if (event.url != '/accueil/dummy') { // Adresse de transition si je veux faire un aller retour pour reload une page
          this.majPremiereNavigation()
          this.majPseudoClique()
        }
      }
    });
  }

  mettreAJourLeTitreDeLaPage() {
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
   * Met à jour le token de premiereNavigation qui sert à déterminer si l'utilisateur est toujours sur sa landing page ou pas
   */
  majPremiereNavigation() {
    if (this.dataService.get('premiereNavigation') == null) {
      this.dataService.set('premiereNavigation', false)
    } else if (this.dataService.get('premiereNavigation') == false) {
      this.dataService.set('premiereNavigation', true)
    }
  }

  /**
   * Fait en sorte que le pseudoClique ne soit conservé qu'une seule navigation
   */
  majPseudoClique() {
    if (this.dataService.pseudoClique != '') {
      if (this.dataService.pseudoClique === this.dataService.ancienPseudoClique) {
        this.dataService.pseudoClique = ''
        this.dataService.ancienPseudoClique = ''
      } else {
        this.dataService.ancienPseudoClique = this.dataService.pseudoClique
      }
    }
  }
  /**
   * Redirige vers une version sécurisée du site si on n'est pas en mode développement
   */
  redirectionHTTPS() {
    if (!isDevMode()) {
      let location = window.location.href
      if (location.slice(0, 5) == 'http:') {
        location = location.replace('http:', 'https:')
      }
      if (location.slice(0, 23) == 'https://www.topmaths.fr') {
        location = location.replace('https://www.topmaths.fr', 'https://topmaths.fr')
      }
      if (location != window.location.href) window.location.href = location
    }
  }

  /**
   * Vérifie la présence d'un token de connexion et récupère le profil utilisateur le cas échéant
   */
  recupereProfil() {
    const identifiant = this.dataService.getToken('identifiant')
    const version = this.dataService.getToken('version')
    if (identifiant != null && version == this.dataService.derniereVersionToken) {
      setTimeout(() => {
        this.dataService.login(identifiant, false, false)
      }, 0);
    }
  }
  /**
   * Récupère l'onglet actif à partir de l'url pour le mettre en surbrillance.
   */
  recupereOngletActif() {
    this.event$ = this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        this.ongletActif = event.url.split('/')[1]
        if (this.ongletActif == '') {
          this.ongletActif = 'accueil'
        }
      }
    });
  }
}
