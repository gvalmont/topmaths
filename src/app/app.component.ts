import { Component, isDevMode, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, Event as NavigationEvent } from '@angular/router';
import { Competition } from './competitions/competitions.component';
import { ApiService } from './services/api.service';
import { GlobalConstants } from './services/global-constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./bulma.css', './bulma-extension.css', './app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  ongletActif: string
  event$: any
  competition: Competition
  modaleInformationsCompetitions!: HTMLElement

  constructor(private router: Router, public dataService: ApiService) {
    this.redirectionHTTPS()
    this.dataService.set('CompetitionenTrainDePingCompetitionActuelle', false)
    this.ongletActif = 'accueil'
    this.recupereOngletActif()
    this.recupereProfil()
    this.observeChangementsDeRoute()
    this.competition = { type: '', niveaux: [], sequences: [], listeDesUrl: [], listeDesTemps: [], minParticipants: 0, maxParticipants: 0, participants: [] }
    this.observeParticipationCompetitions()
  }

  ngOnInit() {
    this.ecouteMessagesPost()
    const modale = document.getElementById('modaleInformationsCompetitions')
    if (modale != null) this.modaleInformationsCompetitions = modale
  }

  ngOnDestroy() {
    this.event$.unsubscribe();
  }

  /**
   * Attend les messages contenant une demande de vérification de présence de l'organisateur d'une compétition
   * Lorsqu'on le reçoit, on vérifie si l'id de la compétition correspond toujours à la compétition actuelle
   * Si c'est le cas, on vérifie si l'utilisateur a effectué une action entre temps
   * si oui, envoie un message signalant sa présence
   * si non, affiche la modale pour lui demander de signaler sa présence
   */
  ecouteMessagesPost() {
    const divListenerExistant = document.getElementById('appListener')
    if (divListenerExistant == null) {
      const divListener = document.createElement('div')
      divListener.id = 'appListener'
      document.body.appendChild(divListener)
      window.addEventListener('message', (event) => {
        const informationOrganisateurCompetition = event.data.informationOrganisateurCompetition
        const competitionId = event.data.competitionId
        if (informationOrganisateurCompetition != null) {
          if (informationOrganisateurCompetition == 'checkPresenceOrganisateur' && this.dataService.get('CompetitioncompetitionActuelle').id == competitionId) {
            if (this.dataService.get('CompetitionorganisationEnCours') && this.dataService.competitionActuelleToujoursEnCours()) {
              if (this.dataService.get('CompetitionautoCheckPresenceOrganisateur')) {
                this.cacherModale()
                this.dataService.set('CompetitionautoCheckPresenceOrganisateur', false)
              } else {
                const modale = document.getElementById('modaleInformationsCompetitions')
                if (modale != null) {
                  modale.style.display = 'block'
                }
              }
            }
          }
        }
      })
    }
  }

  /**
   * Observe les changements de route,
   * met ensuite à jour le lastAction
   */
  observeChangementsDeRoute() {
    this.event$ = this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        this.majPseudoClique()
        if (this.dataService.isloggedIn) {
          this.dataService.majLastAction() // le whosOnline est compris dans le majLastAction
        } else {
          this.dataService.recupWhosOnline()
        }
      }
    });
  }

  /**
   * Surveille la participation à une compétition pour afficher une icone dans le bandeau principal
   * Surveille aussi s'il y a besoin de vérifier si l'organisateur d'une compétition n'est pas afk
   */
  observeParticipationCompetitions() {
    this.dataService.participationCompetition.subscribe(competition => {
      this.competition = competition
    })
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
    if (!isDevMode() && window.location.protocol == 'http:') {
      window.location.href = window.location.href.replace('http:', 'https:');
    }
  }

  /**
   * Vérifie la présence d'un token de connexion et récupère le profil utilisateur le cas échéant
   */
  recupereProfil() {
    const identifiant = this.dataService.getToken('identifiant')
    const version = this.dataService.getToken('version')
    if (identifiant != null && version == this.dataService.derniereVersionToken) {
      this.dataService.login(identifiant, false, false)
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

  /**
   * Affiche la modale
   */
  afficherModale() {
    this.modaleInformationsCompetitions.style.display = 'block'
  }

  /**
   * Cache la modale
   * Envoie un message signalant que l'organisateur d'une compétition n'est pas afk
   */
  cacherModale() {
    window.frames.postMessage({ informationOrganisateurCompetition: 'presenceOrganisateurOk' }, GlobalConstants.origine)
    this.modaleInformationsCompetitions.style.display = 'none'
  }
}
