import { ViewportScroller } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalConstants } from 'src/app/services/global-constants';
import { Niveau as NiveauObjectif } from 'src/app/services/objectifs';
import { Niveau as NiveauSequence } from 'src/app/services/sequences';
import { ApiService } from '../services/api.service';
import { UserSimplifie } from '../services/user';

export interface Competition {
  organisateur: string
  type: string
  niveaux: string[]
  sequences: string[]
  listeDesUrl: string[]
  listeDesTemps: number[]
  minParticipants: number
  maxParticipants: number
  participants: UserSimplifie[]
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
  interval: any
  competitionsEnCours: Competition[]
  enCoursDeMaj: boolean
  reactiveBoutonsEnvoi: Date
  competitionActuelle: Competition

  constructor(public http: HttpClient, private route: ActivatedRoute, private router: Router, public dataService: ApiService, private viewportScroller: ViewportScroller) {
    this.infosModale = [[], '', new Date(), []]
    this.type = ''
    this.organisation = false
    this.redirection = ''
    this.reactiveBoutonsEnvoi = new Date()
    this.competitionActuelle = this.dataService.getCompet()
    this.competitionsEnCours = []
    this.enCoursDeMaj = false
    this.getCompetitionsEnCours()
    this.interval = setInterval(() => {
      this.enCoursDeMaj = true
      //this.getCompetitionsEnCours()
      setTimeout(() => {
        this.enCoursDeMaj = false
      }, 500);
    }, 5000);
  }

  ngOnInit(): void {
    this.observeChangementsDeRoute()
  }

  ngOnDestroy(): void {
    clearInterval(this.interval)
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
          this.organiserCompetition({
            organisateur: this.dataService.user.pseudo,
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
      this.competitionActuelle = this.dataService.setCompet(competition)
      this.router.navigate(['/competitions'])
      this.set('organisationEnCours', ['true'])
    } else {
      this.http.post(GlobalConstants.apiUrl + 'organiserCompetition.php', competition).subscribe(
        data => {
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
  annulerOrganisation(redirection?: string) {
    if (isDevMode()) {
      this.competitionActuelle = this.dataService.setCompet({ organisateur: '', type: '', niveaux: [], sequences: [], listeDesUrl: [], listeDesTemps: [], minParticipants: 0, maxParticipants: 0, participants: [] })
      this.set('organisationEnCours', ['false'])
      if (redirection) this.router.navigate([redirection]); else this.router.navigate(['/competitions'])
    } else {
      this.http.post(GlobalConstants.apiUrl + 'annulerCompetition.php', this.dataService.user.identifiant).subscribe(
        data => {
          this.set('organisationEnCours', ['false'])
          if (redirection) this.router.navigate([redirection])
        },
        error => {
          console.log(error)
        });
    }
  }

  /**
   * Récupère la liste des compétitions en cours et la stocke dans la variable this.competitionsEnCours
   */
  getCompetitionsEnCours() {
    if (isDevMode()) {
      this.competitionsEnCours = []
      this.competitionsEnCours.push({ "organisateur": "Cerf sauvage", "type": "bestOf10", "niveaux": ["5e"], "sequences": ["S4S3", "S4S5"], "listeDesUrl": [], "listeDesTemps": [], "minParticipants": 2, "maxParticipants": 2, "participants": [{ "id": 0, "pseudo": "Cerf sauvage", "codeAvatar": "", "score": 196, "lienTrophees": "", "classement": 9, "teamName": "PUF", "scoreEquipe": 0 }] })
      this.competitionsEnCours.push(this.dataService.getCompet())
    } else {
      this.http.post(GlobalConstants.apiUrl + 'annulerCompetition.php', this.dataService.user.identifiant).subscribe(
        data => {
        },
        error => {
          console.log(error)
        });
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
        if (this.getB('organisationEnCours')) {
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
  set(tag: string, valeurs: string[] | number[]) {
    this.dataService.set('Competition' + tag, valeurs)
  }

  /**
   * Préfixe le tag de 'Competition' et récupère un nombre du localStorage
   * @param tag nom de la "variable"
   * @returns 
   */
  getB(tag: string) {
    return this.dataService.getB('Competition' + tag)
  }

  /**
   * Préfixe le tag de 'Competition' et récupère un nombre du localStorage
   * @param tag nom de la "variable"
   * @returns 
   */
  getNb(tag: string) {
    return this.dataService.getNb('Competition' + tag)
  }

  /**
   * Préfixe le tag de 'Competition' et récupère un nombre[] du localStorage
   * @param tag nom de la "variable"
   * @returns 
   */
  getNbL(tag: string) {
    return this.dataService.getNbL('Competition' + tag)
  }

  /**
   * Préfixe le tag de 'Competition' et récupère un string du localStorage
   * @param tag nom de la "variable"
   * @returns 
   */
  getStr(tag: string) {
    return this.dataService.getStr('Competition' + tag)
  }

  /**
   * Préfixe le tag de 'Competition' et récupère un string[] du localStorage
   * @param tag nom de la "variable"
   * @returns 
   */
  getStrL(tag: string) {
    return this.dataService.getStrL('Competition' + tag)
  }

}
