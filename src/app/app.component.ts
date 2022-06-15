import { Component, isDevMode, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, Event as NavigationEvent, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Competition } from './competitions/competitions.component';
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
  competition: Competition
  modaleInformationsCompetitions!: HTMLElement
  title: string

  constructor(private http: HttpClient, private router: Router, public dataService: ApiService, private activatedRoute: ActivatedRoute, private titleService: Title) {
    this.redirectionHTTPS()
    this.title = 'topmaths.fr - les maths au TOP !'
    this.dataService.set('CompetitionorganisationEnCours', false)
    this.dataService.set('CompetitionenTrainDePingCompetitionActuelle', false)
    this.dataService.set('premiereNavigation', null)
    this.ongletActif = 'accueil'
    this.recupereOngletActif()
    this.recupereProfil()
    this.observeChangementsDeRoute()
    this.mettreAJourLeTitreDeLaPage()
    this.competition = { id: 0, statut: '', profilOrganisateur: { id: 0, pseudo: '', codeAvatar: '', score: 0, scoreEquipe: 0, teamName: '' }, dernierSignal: '', type: '', niveaux: [], sequences: [], listeDesUrl: [], listeDesTemps: [], minParticipants: 0, maxParticipants: 0, participants: [], coef: 0, url: '', temps: 0, question: 0 }
    this.observeParticipationCompetitions()
  }

  ngOnInit() {
    this.ecouteMessagesPost()
    const modale = document.getElementById('modaleInformationsCompetitions')
    if (modale != null) this.modaleInformationsCompetitions = modale
    this.chargeLesDonnees()
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
          if (this.dataService.isloggedIn) {
            if (this.competition != null && this.competition.type != '' && event.url != '/competitions') {
              if (this.dataService.competitionActuelleToujoursEnCours() && (this.competition.statut == 'recrutement' || this.competition.statut == 'preparation')) {
                this.majCompetitionActuelle()
              } else {
                this.resetCompetitionActuelle()
              }
            }
          }
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
   * Récupère les infos de la compétition actuelle la met à jour
   * Si l'utilisateur est organisateur de compétition, auto-check sa présence
   */
  majCompetitionActuelle() {
    this.dataService.http.post<{ question: number, competition: Competition }>(GlobalConstants.apiUrl + 'getCompetition.php', { identifiant: this.dataService.user.identifiant, id: this.dataService.get('CompetitioncompetitionActuelle').id }).subscribe(
      retour => {
        this.dataService.set('CompetitioncompetitionActuelle', retour.competition)
        if (this.dataService.competitionActuelleToujoursEnCours() && (retour.competition.statut == 'recrutement' || retour.competition.statut == 'preparation')) {
          this.dataService.participationCompetition.emit(retour.competition)
          if (retour.competition.statut == 'preparation') {
            this.afficherModalePreparation()
          }
        } else {
          this.competition = retour.competition
          this.resetCompetitionActuelle()
        }
      })
    if (this.dataService.get('CompetitionorganisationEnCours')) {
      this.dataService.set('CompetitionautoCheckPresenceOrganisateur', true)
    }
  }

  /**
   * Réinitialise la compétition actuelle
   */
  resetCompetitionActuelle() {
    if (this.competition.statut == 'recrutement' || this.competition.statut == 'preparation') alert("La compétition en cours a été annulée")
    const competitionActuelle = { id: 0, statut: '', profilOrganisateur: { id: 0, pseudo: '', codeAvatar: '', score: 0, scoreEquipe: 0, teamName: '' }, dernierSignal: '', type: '', niveaux: [], sequences: [], listeDesUrl: [], listeDesTemps: [], minParticipants: 0, maxParticipants: 0, participants: [], coef: 0, url: '', temps: 0, question: 0 }
    this.dataService.set('CompetitioncompetitionActuelle', competitionActuelle)
    this.dataService.set('CompetitionorganisationEnCours', false)
    this.dataService.participationCompetition.emit(competitionActuelle)
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

  /**
   * Affiche la modale qui prévient d'un appel de préparation pour une compétition
   */
  afficherModalePreparation() {
    const modalePreparation = document.getElementById('modalePreparation')
    if (modalePreparation != null) modalePreparation.style.display = 'block'
  }

  /**
   * Cache la modale qui prévient d'un appel de préparation pour une compétition
   */
  cacherModalePreparation() {
    const modalePreparation = document.getElementById('modalePreparation')
    if (modalePreparation != null) modalePreparation.style.display = 'none'
  }

  /**
   * Vérifie si la compétition est toujours en cours d'appel de préparation
   * Si oui, déplace l'utilisateur vers l'onglet compétitions
   * Sinon, le prévient que la compétition a déjà commencé et reset la compétition actuelle
   */
  allerCompetition() {
    const boutonAller = <HTMLButtonElement>document.getElementById('boutonAller')
    if (boutonAller != null) {
      boutonAller.disabled = true
      this.dataService.http.post<{ question: number, competition: Competition }>(GlobalConstants.apiUrl + 'getCompetition.php', { identifiant: this.dataService.user.identifiant, id: this.dataService.get('CompetitioncompetitionActuelle').id }).subscribe(
        retour => {
          boutonAller.disabled = false
          if (this.dataService.competitionActuelleToujoursEnCours() && (retour.competition.statut == 'recrutement' || retour.competition.statut == 'preparation')) {
            this.cacherModalePreparation()
            this.router.navigate(['/competitions'])
          } else {
            alert('La compétition a déjà commencé')
            this.competition = retour.competition
            this.resetCompetitionActuelle()
            this.cacherModalePreparation()
          }
        })
    }
  }
}
