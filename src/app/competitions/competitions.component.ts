import { ViewportScroller } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalConstants } from 'src/app/services/global-constants';
import { Niveau as NiveauObjectif } from 'src/app/services/objectifs';
import { Niveau as NiveauSequence } from 'src/app/services/sequences';
import { ApiService } from '../services/api.service';
import { UserSimplifie } from '../services/user';

interface Reponse {
  reponse: string
}

export interface Competition {
  id: number
  profilOrganisateur: UserSimplifie
  dernierSignal: string
  type: string
  niveaux: string[]
  sequences: string[]
  listeDesUrl: string[]
  listeDesTemps: number[]
  minParticipants: number
  maxParticipants: number
  participants: UserSimplifie[]
}

export interface CompetitionSimplifiee {
  id: number
  profilOrganisateur: UserSimplifie
  type: string
  niveaux: string[]
  sequences: string[]
  minParticipants: number
  maxParticipants: number
  nbParticipants: number
}

interface Exercice {
  id: number
  slug: string
  lien: string
  score: number
}

@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.css']
})
export class CompetitionsComponent implements OnInit, OnDestroy {
  infosModale: [string[], string, Date, number[]]
  type: string
  organisation: boolean
  event$: any
  redirection: string
  actualisationCompetitionsEnCours: any
  actualisationCompetitionActuelle: any
  intervalTroisPetitsPoints: any
  competitionsEnCours: CompetitionSimplifiee[]
  enCoursDeMaj: boolean
  enCoursDeMajCompetitionActuelle: boolean
  reactiveBoutonsEnvoi: Date
  troisPetitsPoints: string
  competitionActuelle: Competition
  participationEnCours: boolean

  constructor(public http: HttpClient, private route: ActivatedRoute, private router: Router, public dataService: ApiService, private viewportScroller: ViewportScroller) {
    this.infosModale = [[], '', new Date(), []]
    this.type = ''
    this.organisation = false
    this.redirection = ''
    this.reactiveBoutonsEnvoi = new Date()
    this.competitionsEnCours = []
    this.enCoursDeMaj = false
    this.enCoursDeMajCompetitionActuelle = false
    this.participationEnCours = false
    this.troisPetitsPoints = '...'
    this.competitionActuelle = { id: 0, profilOrganisateur: { id: 0, pseudo: '', codeAvatar: '', lienTrophees: '', score: 0, classement: 0, scoreEquipe: 0, teamName: '' }, dernierSignal: '', type: '', niveaux: [], sequences: [], listeDesUrl: [], listeDesTemps: [], minParticipants: 0, maxParticipants: 0, participants: [] }
    this.lanceAnimationTroisPetitsPoints()
    this.lanceActualisationCompetitionsEnCours()
    setTimeout(() => {
      this.verifieCompetitionEnCours()
    }, 1); // Pour passer après api.service qui vérifie si la compétition est toujours d'actualité
  }

  ngOnInit(): void {
    this.observeChangementsDeRoute()
    this.observeParticipationCompetitions()
    this.ecouteMessagesPost()
    setTimeout(() => {
      const competitionActuelle = this.get('competitionActuelle')
      if (competitionActuelle != null && competitionActuelle.participants.length > 0) this.toggleCompetitionsEnCours()
    }, 0);
  }

  ngOnDestroy(): void {
    this.arreteActualisationCompetitionsEnCours()
    this.arreteAnimationTroisPetitsPoints()
    this.arreteActualisationCompetitionActuelle()
  }

  /**
   * Attend les messages qui signalent la présence de l'organisateur d'une compétition
   * S'il est toujours l'organisateur d'une compétition, on ping la bdd
   * S'il ne l'est plus, annule la compétition
   */
  ecouteMessagesPost() {
    const divListenerExistant = document.getElementById('competitionsListener')
    if (divListenerExistant == null) {
      const divListener = document.createElement('div')
      divListener.id = 'competitionsListener'
      document.body.appendChild(divListener)
      window.addEventListener('message', (event) => {
        const informationOrganisateurCompetition = event.data.informationOrganisateurCompetition
        if (informationOrganisateurCompetition != null) {
          if (informationOrganisateurCompetition == 'presenceOrganisateurOK') {
            if (this.dataService.get('CompetitionorganisationEnCours') && this.dataService.competitionActuelleToujoursEnCours()) {
              this.lancePingCompetitionActuelle()
            } else {
              this.annulerCompetition(true, '/accueil')
            }
          } else if (informationOrganisateurCompetition == 'presenceOrganisateurKO') {
            this.annulerCompetition(false)
          }
        }
      })
    }
  }

  /**
   * Surveille les modifications de la compétition en cours pour mettre à jour le markup
   */
  observeParticipationCompetitions() {
    this.dataService.participationCompetition.subscribe(competition => {
      this.competitionActuelle = competition
    })
  }

  /**
   * Récupère la compétition actuelle
   * Vérifie si elle est toujours d'actualité
   * Si ce n'est pas le cas, annule la compétition en local
   * Si c'est le cas, vérifie si l'utilisateur en est l'organisateur ou un participant
   * Lance le listener approprié
   */
  verifieCompetitionEnCours() {
    if (this.dataService.competitionActuelleToujoursEnCours()) { // Si on participe à une compétition
      this.participationEnCours = true
      this.lanceActualisationCompetitionActuelle()
      const competitionActuelle = this.get('competitionActuelle')
      this.competitionActuelle = competitionActuelle
      if (competitionActuelle.participants[0] != null && competitionActuelle.participants[0].id == this.dataService.user.id) { // Si on est le chef
        this.set('organisationEnCours', true)
        if (!this.get('enTrainDePingCompetitionActuelle')) {
          this.set('enTrainDePingCompetitionActuelle', true)
          this.lancePingCompetitionActuelle()
        }
      } else {
        this.set('organisationEnCours', false)
      }
    } else {
      this.annulerCompetition(false)
    }
  }

  /**
   * Lance le timeout qui assure que l'organisateur d'une compétition n'est pas afk
   */
  lancePingCompetitionActuelle() {
    const competitionId = this.get('competitionActuelle').id
    this.pingCompetition()
    setTimeout(() => {
      if (this.dataService.get('CompetitionorganisationEnCours') && this.dataService.competitionActuelleToujoursEnCours()) {
        window.frames.postMessage({ informationOrganisateurCompetition: 'checkPresenceOrganisateur', competitionId: competitionId }, GlobalConstants.origine)
      }
    }, 270000); // Ce qui lui laisse 30 secondes pour répondre avant que la compétition ne soit désactivée
  }

  /**
   * Lance l'interval qui gère l'actualisation de la compétition actuelle
   */
  lanceActualisationCompetitionActuelle() {
    this.getCompetitionActuelle()
    this.actualisationCompetitionActuelle = setInterval(() => {
      this.getCompetitionActuelle()
    }, 3000);
  }

  /**
   * Lance l'interval qui gère l'actualisation des compétitions en cours
   */
  lanceActualisationCompetitionsEnCours() {
    this.getCompetitionsEnCours()
    this.actualisationCompetitionsEnCours = setInterval(() => {
      this.getCompetitionsEnCours()
    }, 3000);
  }

  /**
   * Arrête l'interval qui gère l'actualisation des compétitions en cours
   */
  arreteActualisationCompetitionsEnCours() {
    clearInterval(this.actualisationCompetitionsEnCours)
  }

  /**
   * Arrête l'interval qui gère l'actualisation de la compétition actuelle
   */
  arreteActualisationCompetitionActuelle() {
    clearInterval(this.actualisationCompetitionActuelle)
  }

  /**
   * Lance l'interval qui anime les trois petits points
   */
  lanceAnimationTroisPetitsPoints() {
    this.intervalTroisPetitsPoints = setInterval(() => {
      switch (this.troisPetitsPoints) {
        case '.':
          this.troisPetitsPoints = '..'
          break;
        case '..':
          this.troisPetitsPoints = '...'
          break;
        case '...':
          this.troisPetitsPoints = '.'
          break;
      }
    }, 500);
  }

  /**
   * Arrête l'interval qui anime les trois petits points
   */
  arreteAnimationTroisPetitsPoints() {
    clearInterval(this.intervalTroisPetitsPoints)
  }

  /**
   * Remonte jusqu'au menu au retour de la modale d'exercice
   */
  scrollBack() {
    this.viewportScroller.scrollToPosition([0, 0])
  }

  /**
   * Observe les changements de route,
   * modifie en fonction les booléens qui déterminent l'agencement de la page
   */
  observeChangementsDeRoute() {
    this.route.params.subscribe(params => {
      if (params.type) this.type = params.type
      if (params.action == 'organiser') this.organisation = true
    })
  }

  /**
   * Récupère les références liées aux niveaux et aux séquences sélectionnés
   * Récupère les url et les temps des exercices liés à ces références
   * Détermine le minimum et le maximum de participants selon le type de compétition en cours d'organisation
   * Vérifie s'il y a suffisamment d'exercices :
   * si oui, lance l'organisation de la compétition
   * si non, alerte l'utilisateur et réactive les boutons d'envoi de la liste des séquences
   * @param selection de niveaux et de séquences 
   */
  recupererExercices(selection: { niveaux: string[], sequences: string[] }) {
    let derniereSequence: number
    let listeReferences: string[] = []
    this.http.get<NiveauSequence[]>('assets/data/sequences.json').subscribe(niveaux => {
      for (const niveau of niveaux) {
        if (selection.niveaux.includes(niveau.nom)) {
          switch (niveau.nom) {
            case '6e':
              derniereSequence = GlobalConstants.derniereSequence6e
              break;
            case '5e':
              derniereSequence = GlobalConstants.derniereSequence5e
              break;
            case '4e':
              derniereSequence = GlobalConstants.derniereSequence4e
              break;
            case '3e':
              derniereSequence = GlobalConstants.derniereSequence3e
              break;
          }
          for (const sequence of niveau.sequences) {
            if (parseInt(sequence.reference.slice(3)) <= derniereSequence) {
              for (const objectif of sequence.objectifs) {
                listeReferences.push(objectif.reference)
              }
            }
          }
        } else {
          for (const sequence of niveau.sequences) {
            if (selection.sequences.includes(sequence.reference)) {
              for (const objectif of sequence.objectifs) {
                listeReferences.push(objectif.reference)
              }
            }
          }
        }
      }
      let listeExercices: Exercice[] = []
      let listeDesUrl: string[] = []
      let listeDesTemps: number[] = []
      this.http.get<NiveauObjectif[]>('assets/data/objectifs.json').subscribe(niveaux => {
        for (const niveau of niveaux) {
          for (const theme of niveau.themes) {
            for (const sousTheme of theme.sousThemes) {
              for (const objectif of sousTheme.objectifs) {
                for (const reference of listeReferences) {
                  if (reference == objectif.reference) {
                    for (const exercice of objectif.exercices) {
                      if (exercice.isInteractif) {
                        const temps = '&duree=' + exercice.temps / 2
                        listeExercices.push({
                          id: exercice.id,
                          slug: exercice.slug,
                          lien: `https://coopmaths.fr/mathalea.html?ex=${exercice.slug},i=1&v=can&z=1.5${temps}`,
                          score: exercice.score
                        })
                        listeExercices[listeExercices.length - 1].lien = listeExercices[listeExercices.length - 1].lien.replace(/&ex=/g, ',i=1&ex=') // dans le cas où il y aurait plusieurs exercices dans le même slug
                        if (exercice.slug.slice(0, 25) == 'https://mathsmentales.net') {
                          listeExercices[listeExercices.length - 1].lien = exercice.slug + '&embed=' + GlobalConstants.origine
                        } else if (exercice.slug.slice(0, 4) == 'http') {
                          listeExercices[listeExercices.length - 1].lien = exercice.slug
                        }
                        listeDesUrl.push(listeExercices[listeExercices.length - 1].lien)
                        listeDesTemps.push(exercice.temps / 2)
                      }
                    }
                  }
                }
              }
            }
          }
        }
        let minParticipants = 0, maxParticipants = 0
        switch (this.type) {
          case 'bestOf10':
            minParticipants = 2
            maxParticipants = 32
            break;
          case 'battleRoyale':
            minParticipants = 2
            maxParticipants = 100
            break;
        }
        if (listeDesUrl.length <= 0) {
          alert("Il n'y a pas assez d'exercices !")
          this.reactiveBoutonsEnvoi = new Date()
        } else {
          const profilOrganisateur: UserSimplifie = {
            id: this.dataService.user.id,
            pseudo: this.dataService.user.pseudo,
            codeAvatar: this.dataService.user.codeAvatar,
            score: this.dataService.user.score,
            lienTrophees: '',
            classement: this.dataService.user.classement,
            teamName: this.dataService.user.teamName,
            scoreEquipe: this.dataService.user.scoreEquipe
          }
          this.organiserCompetition({
            id: 0,
            profilOrganisateur: profilOrganisateur,
            dernierSignal: '',
            type: this.type,
            niveaux: selection.niveaux,
            sequences: selection.sequences,
            listeDesUrl: listeDesUrl,
            listeDesTemps: listeDesTemps,
            minParticipants: minParticipants,
            maxParticipants: maxParticipants,
            participants: [{
              id: this.dataService.user.id,
              pseudo: this.dataService.user.pseudo,
              codeAvatar: this.dataService.user.codeAvatar,
              score: this.dataService.user.score,
              lienTrophees: '',
              classement: this.dataService.user.classement,
              teamName: this.dataService.user.teamName,
              scoreEquipe: this.dataService.user.scoreEquipe
            }]
          })
        }
      })
    })
  }

  /**
   * Ecrit la compétition passée en paramètre dans le localStorage et dans la variable this.competitionActuelle
   * Déplace l'utilisateur vers la page Competitions
   * Ecrit dans le localStore que l'utilisateur est en train d'organiser une compétition
   * @param competition 
   */
  organiserCompetition(competition: Competition) {
    if (isDevMode()) {
      this.set('competitionActuelle', competition)
      this.router.navigate(['/competitions'])
      this.set('organisationEnCours', 'true')
      this.dataService.participationCompetition.emit(competition)
    } else {
      this.http.post<Competition>(GlobalConstants.apiUrl + 'organiserCompetition.php', JSON.stringify({
        identifiant: this.dataService.user.identifiant,
        profilOrganisateur: competition.profilOrganisateur,
        type: competition.type,
        niveaux: competition.niveaux,
        sequences: competition.sequences,
        listeDesUrl: competition.listeDesUrl,
        listeDesTemps: competition.listeDesTemps,
        minParticipants: competition.minParticipants,
        maxParticipants: competition.maxParticipants,
      })).subscribe(competition => {
        if (competition.id == 0) {
          alert("Tu fais déjà partie d'une compétition.\nTu dois d'abord la quitter si tu veux en organiser une autre")
          this.router.navigate(['/competitions'])
        } else {
          let cpt = competition
          cpt.participants = [<UserSimplifie><unknown>this.dataService.user]
          this.set('competitionActuelle', cpt)
          this.router.navigate(['/competitions'])
          this.set('organisationEnCours', 'true')
          this.dataService.participationCompetition.emit(cpt)
        }
      },
        error => {
          console.log(error)
        });
    }
  }

  /**
   * Efface la compétition actuelle de la variable this.competitionActuelle et du localStorage
   * Ecrit dans le localStorage que l'utilisateur n'est pas en train d'organiser une compétition
   * Si l'utilisateur était en train de se déplacer, le déplace vers là où il voulait aller
   * Sinon, le déplace vers la page Compétitions
   * @param redirection 
   */
  annulerCompetition(enLigne: boolean, redirection?: string) {
    this.set('enTrainDePingCompetitionActuelle', false)
    if (isDevMode() || !enLigne) {
      const competitionActuelle = { id: 0, profilOrganisateur: { id: 0, pseudo: '', codeAvatar: '', lienTrophees: '', score: 0, classement: 0, scoreEquipe: 0, teamName: '' }, dernierSignal: '', type: '', niveaux: [], sequences: [], listeDesUrl: [], listeDesTemps: [], minParticipants: 0, maxParticipants: 0, participants: [] }
      this.set('competitionActuelle', competitionActuelle)
      this.set('organisationEnCours', false)
      this.participationEnCours = false
      this.arreteActualisationCompetitionActuelle()
      this.dataService.participationCompetition.emit(competitionActuelle)
      if (redirection) this.router.navigate([redirection])
    } else {
      this.http.post<Reponse>(GlobalConstants.apiUrl + 'annulerCompetition.php', { identifiant: this.dataService.user.identifiant, id: this.get('competitionActuelle').id }).subscribe(
        data => {
          if (data.reponse == "OK") {
            const competitionActuelle = { id: 0, profilOrganisateur: { id: 0, pseudo: '', codeAvatar: '', lienTrophees: '', score: 0, classement: 0, scoreEquipe: 0, teamName: '' }, dernierSignal: '', type: '', niveaux: [], sequences: [], listeDesUrl: [], listeDesTemps: [], minParticipants: 0, maxParticipants: 0, participants: [] }
            this.set('competitionActuelle', competitionActuelle)
            this.set('organisationEnCours', false)
            this.participationEnCours = false
            this.arreteActualisationCompetitionActuelle()
            this.dataService.participationCompetition.emit(competitionActuelle)
            redirection ? this.router.navigate([redirection]) : this.router.navigate(['/competitions'])
          }
        },
        error => {
          console.log(error)
        });
    }
  }

  /**
   * Signale au serveur que l'organisateur d'une compétition n'est pas afk
   */
  pingCompetition() {
    if (this.dataService.competitionActuelleToujoursEnCours()) {
      const competitionActuelle = <Competition>this.get('competitionActuelle')
      if (competitionActuelle.profilOrganisateur.id == this.dataService.user.id) {
        this.http.post<string>(GlobalConstants.apiUrl + 'pingCompetition.php', {
          identifiant: this.dataService.user.identifiant,
          id: competitionActuelle.id
        }).subscribe(dernierSignal => {
          competitionActuelle.dernierSignal = dernierSignal
          this.set('competitionActuelle', competitionActuelle)
          this.dataService.participationCompetition.emit(competitionActuelle)
        },
          error => {
            console.log(error)
          });
      }
    }
  }

  /**
   * Ajoute l'utilisateur à la liste des participants d'une compétition
   * @param competition 
   */
  rejoindreCompetition(id: number) {
    if (this.get('organisationEnCours')) {
      alert("Tu es en train d'organiser une compétition,\ntu dois d'abord l'annuler si tu veux en rejoindre une autre")
    } else {
      this.http.post<Competition>(GlobalConstants.apiUrl + 'rejoindreCompetition.php', {
        identifiant: this.dataService.user.identifiant,
        id: id
      }).subscribe(competition => {
        this.set('competitionActuelle', competition)
        this.dataService.participationCompetition.emit(competition)
        this.router.navigateByUrl('/accueil', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/competitions']);
      }); 
      },
        error => {
          console.log(error)
        });
    }
  }

  lancerCompetition() {

  }

  /**
   * Récupère la liste des compétitions en cours et la stocke dans la variable this.competitionsEnCours
   */
  getCompetitionsEnCours() {
    if (isDevMode()) {
      this.competitionsEnCours = []
      if (typeof (this.get('competitionActuelle')) != 'undefined') this.competitionsEnCours.push(this.get('competitionActuelle'))
    } else {
      this.enCoursDeMaj = true
      this.http.get<CompetitionSimplifiee[]>(GlobalConstants.apiUrl + 'getCompetitionsEnCours.php').subscribe(competitions => {
        this.competitionsEnCours = competitions
        this.enCoursDeMaj = false
      },
        error => {
          console.log(error)
        });
    }
  }

  /**
   * Récupère les informations sur la compétition actuelle
   */
  getCompetitionActuelle() {
    this.enCoursDeMajCompetitionActuelle = true
    this.http.post<Competition>(GlobalConstants.apiUrl + 'getCompetition.php', { id: this.get('competitionActuelle').id }).subscribe(
      competition => {
        this.enCoursDeMajCompetitionActuelle = false
        this.set('competitionActuelle', competition)
        if (!this.dataService.competitionActuelleToujoursEnCours()) {
          alert("Cette compétition a été annulée")
          this.annulerCompetition(false)
        } else {
          this.dataService.participationCompetition.emit(competition)
        }
      },
      error => {
        console.log(error)
      });
  }

  /**
   * Cache ou affiche les compétitions en cours
   * Lorsque les compétitions sont cachées, leur actualisation est interrompue
   */
  toggleCompetitionsEnCours() {
    const divCompetitionsEnCours = document.getElementById('divCompetitionsEnCours')
    const titreCompetitionsEnCours = document.getElementById('titreCompetitionsEnCours')
    if (divCompetitionsEnCours != null && titreCompetitionsEnCours != null) {
      if (divCompetitionsEnCours.style.display == 'none') {
        divCompetitionsEnCours.style.display = 'block'
        titreCompetitionsEnCours.classList.remove('tout-rond')
        this.lanceActualisationCompetitionsEnCours()
      } else {
        divCompetitionsEnCours.style.display = 'none'
        titreCompetitionsEnCours.classList.add('tout-rond')
        this.arreteActualisationCompetitionsEnCours()
      }
    }
  }

  /**
   * Modifie les textes de la modale de confirmation en fonction de la situation et l'affiche
   */
  afficherModaleConfirmation() {
    const modaleConfirmation = document.getElementById("modaleConfirmation")
    if (modaleConfirmation != null) {
      const texteModale = document.getElementById('texteModale')
      const boutonRester = document.getElementById('boutonRester')
      const boutonPartir = document.getElementById('boutonPartir')
      if (texteModale != null && boutonRester != null && boutonPartir != null) {
        if (this.get('organisationEnCours')) {
          texteModale.innerText = "Si tu veux rejoindre cette compétition, tu dois d'abord annuler celle que tu es en train d'organiser."
          boutonRester.innerText = "Continuer d'organiser"
          boutonPartir.innerText = "Arrêter d'organiser"
        }
      }
      modaleConfirmation.style.display = 'block'
    }
  }

  /**
   * Ferme la modale de confirmation
   * Si la modale s'est affichée lorsque l'utilisateur voulait aller quelque part, le déplace vers là où il voulait aller
   */
  fermerModaleConfirmation(redirection?: string) {
    const modaleConfirmation = document.getElementById("modaleConfirmation")
    if (modaleConfirmation != null) modaleConfirmation.style.display = 'none'
    if (redirection) {
      this.router.navigate([redirection])
    }
  }

  /**
   * Préfixe le tag de 'Competition' et ecrit dans le localStorage
   * @param tag nom de la "variable"
   * @param valeurs 
   */
  set(tag: string, objet: any) {
    this.dataService.set('Competition' + tag, objet)
  }

  /**
   * Préfixe le tag de 'Competition' et récupère un nombre du localStorage
   * @param tag nom de la "variable"
   * @returns 
   */
  get(tag: string) {
    return this.dataService.get('Competition' + tag)
  }
}
