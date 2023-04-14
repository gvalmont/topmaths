import { Component, OnDestroy, OnInit, ViewEncapsulation, isDevMode } from '@angular/core'
import { Router, NavigationStart, Event as NavigationEvent, ActivatedRoute, NavigationEnd } from '@angular/router'
import { Title } from '@angular/platform-browser'
import { filter, map } from 'rxjs/operators'
import { Subscription } from 'rxjs'
import { StorageService } from './services/storage.service'
import { environment } from 'src/environments/environment'
import { DataService } from './services/data.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './bulma.css', './bulma-extension.css', './app.component.css' ],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  annee = environment.annee
  title: string
  ongletActif: string
  navigationEventSubscription: Subscription
  presencePanier: boolean
  panierMAJSubscription: Subscription
  heureInterval!: ReturnType<typeof setInterval>
  heureDerniereAlarme: { heure: string, minute: string }
  afficherTelechargerJson: boolean

  // eslint-disable-next-line no-unused-vars
  constructor (private router: Router, public storageService: StorageService, private dataService: DataService, private activatedRoute: ActivatedRoute, private titleService: Title) {
    this.title = 'topmaths.fr - Les maths au TOP !'
    this.ongletActif = 'accueil'
    this.navigationEventSubscription = new Subscription
    this.presencePanier = false
    this.panierMAJSubscription = new Subscription
    this.heureDerniereAlarme = { heure: '', minute: '' }
    this.afficherTelechargerJson = isDevMode()
    this.MAJOngletActif()
    this.MAJTitreDeLaPage()
    this.surveillerMAJPanier()
  }

  ngOnInit (): void {
    this.lancerHeureInterval()
  }

  ngOnDestroy () {
    this.navigationEventSubscription.unsubscribe()
    this.panierMAJSubscription.unsubscribe()
    clearInterval(this.heureInterval)
  }

  lancerHeureInterval () {
    this.MAJHeure()
    this.heureInterval = setInterval( () => {
      this.MAJHeure()
    }
    , 1000)
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

  alternerTailleOverlayHeure () {
    const overlayHeureDiv = document.getElementById('overlayHeure')
    if (overlayHeureDiv !== null) {
      if (overlayHeureDiv.style.width === '240px') {
        overlayHeureDiv.style.width = '60px'
        overlayHeureDiv.style.height = '30px'
        overlayHeureDiv.style.fontSize = '18px'
      } else {
        overlayHeureDiv.style.width = '240px'
        overlayHeureDiv.style.height = '120px'
        overlayHeureDiv.style.fontSize = '72px'
      }
    }
  }

  telechargerJSON () {
    this.dataService.telechargerJSON()
    for (let i = 0; i <= this.dataService.delaiAvantTelechargement; i++) {
      setTimeout(() => {
        const compteurAvantTelechargement = document.getElementById('compteurAvantTelechargement')
        if (compteurAvantTelechargement !== null) {
          if (i === this.dataService.delaiAvantTelechargement) {
            compteurAvantTelechargement.innerHTML = '<img src="assets/img/cc0/check-circle-svgrepo-com.svg" alt="Téléchargé" width="18" height="18">'
            setTimeout(() => {
              compteurAvantTelechargement.innerHTML = ''
            }, 3000)
          } else {
            compteurAvantTelechargement.innerHTML = (this.dataService.delaiAvantTelechargement - i).toString()
          }
        }
      }, i * 1000)
    }
  }

  MAJHeure () {
    const divOverlayHeure = document.getElementById("overlayHeure")
    if (divOverlayHeure !== null) {
      const date = new Date()
      let hh = date.getHours().toString()
      let mm = date.getMinutes().toString()

      hh = (hh.length === 1) ? "0" + hh : hh
      mm = (mm.length === 1) ? "0" + mm : mm

      divOverlayHeure.innerHTML = hh + ":" + mm
      if (environment.perso) {
        if (this.estHeureDuJournalDeBord(parseInt(hh), parseInt(mm)) && this.heureDerniereAlarme.heure !== hh && this.heureDerniereAlarme.minute !== mm) {
          this.heureDerniereAlarme = { heure: hh, minute: mm }
          const audioElement = <HTMLAudioElement> document.getElementById('audioElement')
          if (audioElement !== null) audioElement.play()
          setTimeout(() => {
            alert('C\'est l\'heure d\'écrire dans son journal de bord !')
          }, 2000)
        }
      }
    }
  }

  estHeureDuJournalDeBord (heures: number, minutes: number) {
    for (const heure of this.heuresDuJournalDeBord) {
      if (heure.heure === heures && heure.minute === minutes) return true
    }
    return false
  }

  heuresDuJournalDeBord = [
    {
      heure: 8,
      minute: 40
    },
    {
      heure: 9,
      minute: 40
    },
    {
      heure: 10,
      minute: 50
    },
    {
      heure: 11,
      minute: 50
    },
    {
      heure: 14,
      minute: 15
    },
    {
      heure: 15,
      minute: 15
    },
    {
      heure: 16,
      minute: 20
    }
  ]
}
