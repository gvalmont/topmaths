import { Component, OnDestroy, ViewEncapsulation } from '@angular/core'
import { Router, NavigationStart, Event as NavigationEvent, ActivatedRoute, NavigationEnd } from '@angular/router'
import { Title } from '@angular/platform-browser'
import { filter, map } from 'rxjs/operators'
import { Subscription } from 'rxjs'
import { StorageService } from './services/storage.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './bulma.css', './bulma-extension.css', './app.component.css' ],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnDestroy {
  title: string
  ongletActif: string
  navigationEventSubscription: Subscription
  presencePanier: boolean
  panierMAJSubscription: Subscription

  // eslint-disable-next-line no-unused-vars
  constructor (private router: Router, private storageService: StorageService, private activatedRoute: ActivatedRoute, private titleService: Title) {
    this.title = 'topmaths.fr - Les maths au TOP !'
    this.ongletActif = 'accueil'
    this.navigationEventSubscription = new Subscription
    this.presencePanier = false
    this.panierMAJSubscription = new Subscription
    this.MAJOngletActif()
    this.MAJTitreDeLaPage()
    this.surveillerMAJPanier()
  }

  ngOnDestroy () {
    this.navigationEventSubscription.unsubscribe()
    this.panierMAJSubscription.unsubscribe()
  }

  MAJOngletActif () {
    this.navigationEventSubscription = this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        this.ongletActif = event.url.split('/')[1]
        if (this.ongletActif === '') this.ongletActif = 'accueil'
      }
    })
  }

  MAJTitreDeLaPage () {
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

  surveillerMAJPanier () {
    const panier = this.storageService.get('panier')
    this.MAJPanier(panier)
    this.panierMAJSubscription = this.storageService.MAJPanier.subscribe(panier => {
      this.MAJPanier(panier)
    })
  }

  MAJPanier (panier: string[]) {
    if (Array.isArray(panier) && panier.length > 0) {
      this.presencePanier = true
    } else {
      this.presencePanier = false
    }
  }
}
