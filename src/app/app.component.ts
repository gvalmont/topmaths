import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { Router, NavigationStart, Event as NavigationEvent, ActivatedRoute, NavigationEnd } from '@angular/router'
import { ApiService } from './services/api.service'
import { Title } from '@angular/platform-browser'
import { filter, map } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./bulma.css', './bulma-extension.css', './app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  title: string
  ongletActif: string
  navigationEventSubscription: Subscription

  // eslint-disable-next-line no-unused-vars
  constructor(private httpClient: HttpClient, private router: Router, public apiService: ApiService, private activatedRoute: ActivatedRoute, private titleService: Title) {
    this.title = 'topmaths.fr - Les maths au TOP !'
    this.ongletActif = 'accueil'
    this.navigationEventSubscription = new Subscription
    this.MAJOngletActif()
    this.MAJProfil()
    this.MAJTitreDeLaPage()
  }

  ngOnInit() {
    this.miseEnCacheDesDonnees()
  }

  ngOnDestroy() {
    this.navigationEventSubscription.unsubscribe()
  }

  MAJOngletActif() {
    this.navigationEventSubscription = this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        this.ongletActif = event.url.split('/')[1]
        if (this.ongletActif === '') this.ongletActif = 'accueil'
      }
    })
  }

  /**
   * Vérifie la présence d'un token de connexion et récupère le profil utilisateur le cas échéant
   */
  MAJProfil() {
    const identifiant = this.apiService.getToken('identifiant')
    const version = this.apiService.getToken('version')
    if (identifiant !== null && version === this.apiService.derniereVersionToken) {
      setTimeout(() => {
        this.apiService.login(identifiant, true, false)
      }, 0)
    }
  }

  MAJTitreDeLaPage() {
    // Fonction de https://blog.bitsrc.io/dynamic-page-titles-in-angular-98ce20b5c334
    const appTitle = this.titleService.getTitle()
    this.router
      .events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          const child = this.activatedRoute.firstChild
          if (child !== null && child.snapshot.data['title']) { // Ce data['title'] est défini dans le app-routing.module.ts
            return child.snapshot.data['title']
          }
          return appTitle
        })
      ).subscribe((ttl: string) => {
        this.titleService.setTitle(ttl)
      })
  }

  miseEnCacheDesDonnees() {
    this.httpClient.get('assets/data/objectifs.json').subscribe()
    this.httpClient.get('assets/data/sequences.json').subscribe()
  }
}
