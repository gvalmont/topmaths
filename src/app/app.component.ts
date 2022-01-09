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
    this.dataService.set('premiereNavigation', null)
    this.ongletActif = 'accueil'
    this.recupereOngletActif()
    this.recupereProfil()
    this.observeChangementsDeRoute()
    this.competition = { id: 0, statut: '', profilOrganisateur: { id: 0, pseudo: '', codeAvatar: '', lienTrophees: '', score: 0, classement: 0, scoreEquipe: 0, teamName: '' }, dernierSignal: '', type: '', niveaux: [], sequences: [], listeDesUrl: [], listeDesTemps: [], minParticipants: 0, maxParticipants: 0, participants: [], coef: 0, url: '', temps: 0, question: 0 }
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
   * Lorsqu'on le reçoit, on vérifie si l'id de la compétition correspond toujours à la compétition actuelle et si elle est toujours d'actualité
   * Si ce n'est pas le cas, envoie un message signalant que l'organisateur est afk
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
        const competitionActuelle = this.dataService.get('CompetitioncompetitionActuelle')
        if (informationOrganisateurCompetition != null && this.competition.statut == 'recrutement') {
          if (informationOrganisateurCompetition == 'checkPresenceOrganisateur' && competitionActuelle.id == competitionId) {
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
            } else {
              window.frames.postMessage({ informationOrganisateurCompetition: 'presenceOrganisateurKO' }, GlobalConstants.origine)
            }
          }
        }
      })
    }
  }

  /**
   * À chaque changement de route :
   * met à jour le lastAction
   * s'il y a une icône de compétition dans le menu, vérifie si elle est toujours d'actualité
   */
  observeChangementsDeRoute() {
    this.event$ = this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        if (this.dataService.get('premiereNavigation') == null) {
          this.dataService.set('premiereNavigation', false)
        } else if (this.dataService.get('premiereNavigation') == false) {
          this.dataService.set('premiereNavigation', true)
        }
        this.majPseudoClique()
        if (this.dataService.isloggedIn) {
          this.dataService.majLastAction() // le whosOnline est compris dans le majLastAction
        } else {
          this.dataService.recupWhosOnline()
        }
        if (this.competition != null && this.competition.type != '') {
          if (!this.dataService.competitionActuelleToujoursEnCours()) {
            const competitionActuelle = { id: 0, statut: '', profilOrganisateur: { id: 0, pseudo: '', codeAvatar: '', lienTrophees: '', score: 0, classement: 0, scoreEquipe: 0, teamName: '' }, dernierSignal: '', type: '', niveaux: [], sequences: [], listeDesUrl: [], listeDesTemps: [], minParticipants: 0, maxParticipants: 0, participants: [], coef: 0, url: '', temps: 0, question: 0 }
            this.dataService.set('CompetitioncompetitionActuelle', competitionActuelle)
            this.dataService.set('CompetitionorganisationEnCours', false)
            this.dataService.participationCompetition.emit(competitionActuelle)
          }
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
    if (this.dataService.competitionActuelleToujoursEnCours()) {
      window.frames.postMessage({ informationOrganisateurCompetition: 'presenceOrganisateurOK' }, GlobalConstants.origine)
    } else {
      window.frames.postMessage({ informationOrganisateurCompetition: 'presenceOrganisateurKO' }, GlobalConstants.origine)
    }
    this.modaleInformationsCompetitions.style.display = 'none'
  }
}
