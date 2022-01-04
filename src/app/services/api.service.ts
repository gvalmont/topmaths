import { Injectable, Output, EventEmitter, isDevMode } from '@angular/core';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User, UserSimplifie } from './user';
import { Router } from '@angular/router';
import { Trophee4e, Trophee5e } from './trophees';
import { Equipe } from './equipe';
import { GlobalConstants } from './global-constants';
import { Competition } from '../competitions/competitions.component';

interface InfosEquipe {
  leader: number
  codeEquipe: string
  teamName: string
  lienEmbleme: string
  score: number
  membres: UserSimplifie[]
}
interface Message {
  message: string
}

interface Nom {
  nom: string
}

interface Adjectif {
  masculin: string,
  feminin: string
}

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  @Output() profilModifie: EventEmitter<string[]> = new EventEmitter();
  @Output() participationCompetition: EventEmitter<Competition> = new EventEmitter();

  redirectUrl: string
  isloggedIn: boolean
  user: User
  onlineUsers: UserSimplifie[]
  classementIndividuel: UserSimplifie[]
  classementEquipes: InfosEquipe[]
  onlineNb: number
  feminin: boolean
  listeMasculins: Nom[]
  listeFeminins: Nom[]
  listeAdjectifs: Adjectif[]
  pseudoClique: string
  ancienPseudoClique: string
  lienTropheesClique: string
  trophees!: Trophee5e | Trophee4e
  derniereVersionToken: string
  equipe: Equipe
  infosEquipe: InfosEquipe
  dateDerniereReponse: Date
  div!: HTMLElement
  lienAvatar: string
  styleAvatar: string

  constructor(private http: HttpClient, private router: Router) {
    this.redirectUrl = ''
    this.user = {
      id: 0,
      identifiant: '',
      codeAvatar: '',
      lastLogin: '',
      lastAction: '',
      visible: '',
      pseudo: '',
      score: 0,
      codeTrophees: '',
      tropheesVisibles: '',
      cleScore: '',
      classement: 0,
      teamName: '',
      scoreEquipe: 0,
      derniereSequence: '',
      dernierObjectif: ''
    }
    this.infosEquipe = {
      leader: -1,
      codeEquipe: '',
      lienEmbleme: '',
      teamName: '',
      score: 0,
      membres: []
    }
    this.onlineUsers = []
    this.classementIndividuel = []
    this.classementEquipes = []
    this.onlineNb = 0
    this.feminin = false
    this.pseudoClique = ''
    this.ancienPseudoClique = ''
    this.lienTropheesClique = ''
    this.listeMasculins = []
    this.listeFeminins = []
    this.listeAdjectifs = []
    this.isloggedIn = false
    this.derniereVersionToken = '2'
    this.equipe = {
      teamName: '',
      codeEquipe: '',
      lienEmbleme: '',
      foregroundId: 0,
      foregroundPrimaryColor: '',
      foregroundSecondaryColor: '',
      backgroundId: 0,
      backgroundColor: '',
      leader: '',
      membres: []
    }
    this.dateDerniereReponse = new Date()
    this.lienAvatar = ''
    this.styleAvatar = ''
    this.surveilleModificationsDuProfil()
    this.ecouteMessagesPost()
    this.recupereDonneesPseudos() // En cas de création d'un nouveau compte
    setTimeout(() => {
      if (this.competitionActuelleToujoursEnCours()) { // On vérifie si elle est toujours d'actualité
        this.participationCompetition.emit(this.get('CompetitioncompetitionActuelle'))
      } else {
        this.set('CompetitioncompetitionActuelle', { type: '', niveaux: [], sequences: [], listeDesUrl: [], listeDesTemps: [], minParticipants: 0, maxParticipants: 0, participants: [] })
      }
    }, 0); // Pour le lancer une fois que app.component soit prêt à le recevoir
  }

  /**
   * Vérifie si la dernière compétition où l'utilisateur s'est inscrit est toujours d'actualité
   * @returns true si c'est le cas
   */
  competitionActuelleToujoursEnCours() {
    const competitionActuelle = <Competition>this.get('CompetitioncompetitionActuelle')
    if (competitionActuelle != null && competitionActuelle.dernierSignal != null && competitionActuelle.dernierSignal != '') { // On vérifie si on est en train de participer à une compétition
      let date = new Date(competitionActuelle.dernierSignal);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset() - 60); //Le serveur mysql semble être en UTC + 1
      if ((new Date()).getTime() - date.getTime() < 300000) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  /**
   * Surveille les modifications du profil
   * À chaque modification du profil :
   * - Met à jour la dernière action
   */
  surveilleModificationsDuProfil() {
    this.profilModifie.subscribe(valeursModifiees => {
      if (!valeursModifiees.includes('score')) this.majLastAction()
      if (valeursModifiees.includes('identifiant')) {
        this.recupClassement()
      }
      if (valeursModifiees.includes('lienAvatar')) {
        this.lienAvatar = this.getLienAvatar(this.user)
        this.styleAvatar = this.getStyleAvatar(this.user)
      }
    })
  }

  /**
   * Récupère dans les utilisateurs de la base de données par score décroissant
   */
  recupClassement() {
    if (isDevMode()) {
      this.classementIndividuel = [
        {
          id: 1,
          codeAvatar: '',
          pseudo: 'lapin bleu',
          score: 17,
          lienTrophees: 'tcqnfy',
          classement: 2,
          teamName: '',
          scoreEquipe: 0
        }, {
          id: 2,
          codeAvatar: '',
          pseudo: 'anonyme',
          score: 38,
          lienTrophees: 'tuoocj',
          classement: 1,
          teamName: '',
          scoreEquipe: 0
        }
      ]
      this.classementEquipes = [
        {
          leader: 0,
          codeEquipe: "",
          teamName: "AMG",
          lienEmbleme: '',
          score: 28,
          membres: []
        }
      ]
    } else {
      this.http.get<UserSimplifie[]>(GlobalConstants.apiUrl + 'classementIndividuel.php').subscribe(usersSimplifies => {
        this.classementIndividuel = usersSimplifies
      }, error => {
        console.log(error)
      })
      this.http.get<InfosEquipe[]>(GlobalConstants.apiUrl + 'classementEquipes.php').subscribe(equipes => {
        this.classementEquipes = equipes
      }, error => {
        console.log(error)
      })
    }
  }

  /**
   * Récupère de la bdd les infos sur l'équipe teamName
   * @param teamName
   */
  recupInfosEquipe(teamName: string) {
    if (isDevMode()) {
      this.infosEquipe = {
        leader: 0,
        codeEquipe: 'lkopee',
        teamName: 'PUF',
        lienEmbleme: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDBweCIgaGVpZ2h0PSIzMDBweCIgc2hhcGUtcmVuZGVyaW5nPSJnZW9tZXRyaWNQcmVjaXNpb24iPjxnIHRyYW5zZm9ybT0ic2NhbGUoMS4xNzE4NzUsMS4xNzE4NzUpIiBzdHJva2Utd2lkdGg9Ii4wNSUiPjxnIGZpbGw9InJnYmEoMjA0LDExOCwxNTYsMC44KSI+PHBhdGggZD0iIE0gNjkuNDMgMTIuNjcgQyA3Ni4yNyAxMi4wNyA4My4xNCAxMi40NSA5MC4wMCAxMi4zOSBDIDEyMC42OSAxMi4zNSAxNTEuMzcgMTIuNDUgMTgyLjA2IDEyLjMzIEMgMTg0LjQwIDEyLjMyIDE4Ni43MyAxMi42NiAxODkuMDUgMTIuOTYgQyAxOTAuMDcgMTguOTIgMTg5LjU2IDI0Ljk4IDE4OS42MiAzMS4wMCBDIDE4OS42MSA5Mi4wMCAxODkuNjIgMTUzLjAwIDE4OS42MSAyMTQuMDAgQyAxODkuMzQgMjIyLjk5IDE5MC4yOSAyMzIuMDMgMTg5LjEwIDI0MC45NyBDIDE4Ny4xMCAyNDEuMzEgMTg1LjEwIDI0MS42OSAxODMuMDcgMjQxLjY5IEMgMTUxLjM4IDI0MS41MyAxMTkuNjkgMjQxLjY2IDg4LjAwIDI0MS42MSBDIDgxLjYzIDI0MS41NCA3NS4yMiAyNDIuMTIgNjguOTEgMjQxLjA0IEMgNjguMDcgMjM0LjM5IDY4LjUzIDIyNy42OCA2OC40NiAyMjEuMDAgQyA2OC40NCAxNTYuNjcgNjguNDkgOTIuMzMgNjguNDQgMjguMDAgQyA2OC42MCAyMi45MCA2Ny43MCAxNy41OSA2OS40MyAxMi42NyBaIi8+PC9nPjwvZz48ZyB0cmFuc2Zvcm09InNjYWxlKDEuMTcxODc1LDEuMTcxODc1KSIgc3Ryb2tlLXdpZHRoPSIuMDUlIj48ZyBmaWxsPSJyZ2JhKDIxNiw0Niw0MiwwLjUpIj48cGF0aCBkPSIgTSAxMzcuNTYgNDAuNTcgQyAxNDQuMzcgMzcuMjQgMTUwLjg2IDMyLjQxIDE1OC43MCAzMi4wMSBDIDE1NC44NyAzNi43MCAxNDkuOTEgNDAuMzIgMTQ2LjE1IDQ1LjA3IEMgMTQ0LjE5IDQ3LjQ2IDE0MS45OCA0OS42NCAxNDAuMTAgNTIuMTAgQyAxNDQuNjkgNTEuOTMgMTQ5LjIwIDUxLjAyIDE1My43OCA1MC44MCBDIDE2NC42NyA0OS42NCAxNzUuMjQgNDYuNjEgMTg2LjA2IDQ1LjA0IEMgMTg0LjMwIDU0LjAwIDE4MS42NCA2Mi43NSAxNzkuMDcgNzEuNTAgQyAxODMuMDUgNzQuMTkgMTg3LjY3IDc1LjcwIDE5MS43OCA3OC4xNyBDIDE5Ni4xNSA4MC43MiAyMDAuNzQgODIuODUgMjA1LjQ5IDg0LjU3IEMgMjAxLjE1IDg4Ljk3IDE5Ny4xMyA5My42NyAxOTIuOTYgOTguMjQgQyAxOTQuODUgMTA2LjIwIDE5NS43MCAxMTQuMzcgMTk2LjY3IDEyMi40OCBDIDE5OC41NiAxMjYuNTcgMjAyLjI1IDEyOS41NiAyMDQuODcgMTMzLjIwIEMgMjAyLjkyIDEzNS44MiAyMDAuNjMgMTM4LjE2IDE5OC4yNCAxNDAuMzcgQyAxOTguNDUgMTQyLjg2IDE5OC43MSAxNDUuMzcgMTk4LjQxIDE0Ny44NyBDIDE5Ny40MyAxNTUuNjIgMTk5LjQ0IDE2My4zOSAxOTguNDEgMTcxLjEzIEMgMTk3Ljg1IDE3NS4wNSAxOTguNjAgMTc5LjMyIDE5Ny4xNiAxODMuMDIgQyAxODkuMTIgMTkxLjQ2IDE4MC4wMyAxOTguOTIgMTcwLjIzIDIwNS4yNSBDIDE2OC4wMyAyMDYuNjQgMTY1LjY2IDIwNy43NyAxNjMuMTggMjA4LjU2IEMgMTYyLjQ0IDIwMi42MCAxNjQuODIgMTk2LjkxIDE2NS4wNiAxOTEuMDAgQyAxNjUuMzQgMTgyLjgyIDE2NS4yMCAxNzQuNjIgMTY1LjA3IDE2Ni40NCBDIDE1OS40MyAxNzUuMjcgMTUzLjI0IDE4My43MyAxNDYuNTggMTkxLjgzIEMgMTQ3LjAwIDE4Ni44NyAxNDcuMTYgMTgxLjkxIDE0Ny4wNSAxNzYuOTMgQyAxNDcuODUgMTcxLjYxIDE1MC4zMSAxNjYuNjkgMTUxLjMzIDE2MS40MCBDIDE1My45NSAxNTIuNDEgMTU1LjIxIDE0My4xMyAxNTcuMjIgMTM0LjAwIEMgMTUwLjQzIDEzOS42NyAxNDUuMTcgMTQ2Ljg3IDE0MC4xOSAxNTQuMTEgQyAxMzcuNTQgMTU4LjUyIDEzMi4yMCAxNTkuNTYgMTI4LjA2IDE2Mi4wNCBDIDEwOS4zMiAxNzMuNTUgOTEuMTQgMTg2LjA0IDc0LjAyIDE5OS44NyBDIDY4Ljc1IDIwNC4xMCA2NC4zNCAyMDkuMjkgNTkuMjAgMjEzLjY2IEMgNjIuODMgMjA1LjY3IDY4LjM5IDE5OC43MiA3My43MyAxOTEuODEgQyA3OC4xNyAxODYuMjUgODIuODQgMTgwLjg4IDg3Ljc4IDE3NS43NSBDIDExMC40NCAxNTIuMDYgMTMyLjY0IDEyNy40OSAxNTkuMzggMTA4LjI2IEMgMTYxLjYxIDEwNi42NCAxNjIuMTYgMTAzLjc0IDE2My4xNCAxMDEuMzIgQyAxNjQuNTQgOTYuOTQgMTY2LjM2IDkyLjYyIDE2Ny4wNCA4OC4wNiBDIDE2Mi43MiA4MS40NSAxNTYuNDggNzYuNDMgMTUwLjAzIDcyLjAxIEMgMTM4LjQ4IDczLjkxIDEyOC44MCA4MS4xNCAxMjAuNzIgODkuMjEgQyAxMjUuODAgODkuMTIgMTMwLjYyIDg3LjI4IDEzNS42MiA4Ni42MiBDIDEzMS41MCA5MS42NCAxMjYuOTQgOTYuMjcgMTIyLjU1IDEwMS4wNCBDIDEyMC4xNyAxMDEuMTAgMTE3Ljc2IDEwMC44MyAxMTUuNDEgMTAxLjI2IEMgMTExLjA0IDEwMy45OSAxMDguNjkgMTA4Ljc0IDEwNS43NyAxMTIuODAgQyAxMDIuNDIgMTE3LjUwIDk5LjUxIDEyMi40OSA5Ni41MyAxMjcuNDMgQyA5NS4xMyAxMzAuMDMgOTIuMTIgMTMwLjkzIDg5LjgwIDEzMi40NyBDIDkwLjAxIDEyNC40NSA5MC40NiAxMTYuMzAgODguOTQgMTA4LjM3IEMgOTIuMzkgMTA1Ljg5IDk1Ljk0IDEwMy4zMCA5OC4zNCA5OS43MyBDIDk4LjI5IDk1LjM5IDk3Ljg5IDkxLjA0IDk3LjY3IDg2LjcwIEMgOTIuNjEgODguNDIgODcuNTAgOTAuMDMgODIuNTMgOTIuMDIgQyA3OS4xOSA5OC4zNSA3Ni40MiAxMDQuOTUgNzMuMTYgMTExLjMyIEMgNzIuNDUgMTE0LjM1IDczLjA4IDExNy41MSA3NC4yNyAxMjAuMzUgQyA3MS40MiAxMjAuNjYgNjguNTYgMTIwLjQ1IDY1LjczIDEyMC4xNiBDIDY2LjA3IDEyMS4yNSA2Ni40NCAxMjIuMzUgNjYuODIgMTIzLjQ0IEMgNjkuNDQgMTI0LjY3IDcyLjExIDEyNS44MSA3NC43NCAxMjcuMDUgQyA2OC40OSAxMjcuMzcgNjIuMjQgMTI3LjY1IDU2LjA0IDEyNi40OSBDIDU1Ljk5IDEyMi42MSA1NS43NiAxMTguNzQgNTUuNDkgMTE0Ljg3IEMgNTguNTQgMTA4LjE4IDYzLjI0IDEwMi4yMyA2NS4zMyA5NS4xMyBDIDYzLjc4IDg4LjQ5IDY0LjEyIDgxLjYxIDY1LjEzIDc0LjkxIEMgNjUuNTcgNzIuNDMgNjUuNjIgNjkuNDkgNjcuODMgNjcuODIgQyA3My41OCA2Mi41NCA3OS4wMCA1Ni44OCA4My43NCA1MC42NyBDIDg1LjcwIDQ4LjE0IDg2LjkzIDQ1LjEzIDg4Ljk5IDQyLjY3IEMgODguMDAgNDguNzAgODUuODYgNTQuNDggODQuMjUgNjAuMzcgQyA4Ny44OCA1Ny40NCA5Mi4wOCA1NS40MCA5NS45MCA1Mi43NiBDIDEwMC45OSA0OS45NyAxMDYuNzcgNDguNjQgMTExLjgxIDQ1Ljc4IEMgMTE1LjQ4IDQxLjk4IDExNy4zNSAzNi44MCAxMjAuNzkgMzIuNzggQyAxMjEuMTUgMzkuMDQgMTIwLjY2IDQ1LjMxIDEyMS4xOSA1MS41NSBDIDEyNi42OCA0Ny45NCAxMzEuOTUgNDMuOTkgMTM3LjU2IDQwLjU3IE0gNzIuNzAgNzcuNjIgQyA3MC4yOCA4MS4xOCA3MC45MiA4NS43MCA3MC42OSA4OS43NyBDIDcyLjI5IDg3LjI1IDczLjcwIDg0LjYzIDc1LjA1IDgxLjk4IEMgNzYuNjMgNzkuMzcgNzUuOTAgNzYuMTkgNzUuOTAgNzMuMzIgQyA3NC43MyA3NC42NyA3My41OSA3Ni4wNiA3Mi43MCA3Ny42MiBaIi8+PC9nPjxnIGZpbGw9InJnYmEoNjUsOTAsNSwwLjUpIj48cGF0aCBkPSIgTSA3Mi43MCA3Ny42MiBDIDczLjU5IDc2LjA2IDc0LjczIDc0LjY3IDc1LjkwIDczLjMyIEMgNzUuOTAgNzYuMTkgNzYuNjMgNzkuMzcgNzUuMDUgODEuOTggQyA3My43MCA4NC42MyA3Mi4yOSA4Ny4yNSA3MC42OSA4OS43NyBDIDcwLjkyIDg1LjcwIDcwLjI4IDgxLjE4IDcyLjcwIDc3LjYyIFoiLz48cGF0aCBkPSIgTSA1OS43OCAxNDEuOTEgQyA2Ni4yMyAxMzkuMzAgNzMuMjUgMTM3Ljk0IDc5LjEwIDEzMy45OCBDIDc4Ljg1IDEzOS4zMiA3OC4zNyAxNDQuNjUgNzguMTEgMTQ5Ljk5IEMgNzQuNjAgMTUzLjEyIDcxLjAxIDE1Ni4xNSA2Ny4zOCAxNTkuMTQgQyA2MS42OCAxNTguNzUgNTYuMDMgMTU3Ljg5IDUwLjM2IDE1Ny4yNSBDIDU2LjU1IDE1My4wOCA2My45OCAxNTAuODAgNjkuMjggMTQ1LjM2IEMgNjYuMTIgMTQ0LjE5IDYyLjkxIDE0My4xNiA1OS43OCAxNDEuOTEgWiIvPjxwYXRoIGQ9IiBNIDEyMi41NiAxODIuNjMgQyAxMjcuNDkgMTc5LjI2IDEzMS4zNCAxNzQuNjQgMTM1Ljc1IDE3MC42OCBDIDEzNS4yMiAxODEuNDcgMTM0LjEzIDE5Mi4yNyAxMzEuNTMgMjAyLjc4IEMgMTMxLjA2IDIwNC41NCAxMjkuMDQgMjA1LjAxIDEyNy42MiAyMDUuNzUgQyAxMTcuMjkgMjA5LjkzIDEwNi42NiAyMTMuNTMgOTUuNzIgMjE1LjcwIEMgOTAuMDYgMjE2LjI1IDg0LjQzIDIxNC44MyA3OC43OCAyMTQuNTEgQyA5My4yNyAyMDMuNzQgMTA3Ljg1IDE5My4wOSAxMjIuNTYgMTgyLjYzIFoiLz48cGF0aCBkPSIgTSAxMzIuMTcgMjExLjIxIEMgMTM5LjI4IDIwNC45NyAxNDYuNzkgMTk5LjE1IDE1My4zMyAxOTIuMjkgQyAxNTIuNzMgMTk5LjA4IDE1Mi4yNiAyMDUuODkgMTUxLjU2IDIxMi42NSBDIDE0NS43NCAyMTUuMzMgMTM5LjMzIDIxNi41MiAxMzMuMjAgMjE4LjMzIEMgMTI4LjI2IDIxOS42NSAxMjMuMzEgMjIxLjEwIDExOC4xNyAyMjEuNDMgQyAxMjIuODMgMjE4LjAwIDEyNy44OSAyMTUuMTMgMTMyLjE3IDIxMS4yMSBaIi8+PHBhdGggZD0iIE0gMTgyLjQzIDIwOS45MCBDIDE4Ni45MSAyMDYuMzYgMTkxLjMwIDIwMi42OSAxOTUuMTYgMTk4LjQ3IEMgMTk0LjI2IDIwMi4zOSAxOTMuNDQgMjA2LjM0IDE5Mi42NiAyMTAuMjkgQyAxODkuMjUgMjEwLjE3IDE4NS44NCAyMTAuMDMgMTgyLjQzIDIwOS45MCBaIi8+PC9nPjwvZz48L3N2Zz4=',
        score: 17,
        membres: [
          {
            id: 2,
            pseudo: 'anonyme',
            codeAvatar: '',
            score: 38,
            lienTrophees: 'tuoocj',
            classement: 1,
            teamName: 'PUF',
            scoreEquipe: 28,
          },
          {
            id: 2,
            pseudo: 'lapin bleu',
            codeAvatar: '',
            score: 38,
            lienTrophees: 'tcqnfy',
            classement: 2,
            teamName: 'PUF',
            scoreEquipe: 23,
          }
        ]
      }
    } else {
      this.http.post<InfosEquipe>(GlobalConstants.apiUrl + 'equipe.php', { teamName: teamName, identifiant: this.user.identifiant }).subscribe(equipe => {
        this.infosEquipe = equipe
      },
        error => {
          console.log(error)
        })
    }
  }

  rejoindreEquipe(codeEquipe: string) {
    this.http.post<User[]>(GlobalConstants.apiUrl + 'rejoindreEquipe.php', { identifiant: this.user.identifiant, codeEquipe: codeEquipe }).subscribe(users => {
      if (users[0].identifiant == 'personne') {
        alert('Code incorrect')
      } else {
        this.user = users[0]
      }
    },
      error => {
        console.log(error)
      })
  }

  /**
   * Demande une reconnexion avant de faire quitter l'équipe
   */
  quitterEquipe() {
    this.securelogin({ quitterEquipe: true }, 'apiService')
  }

  /**
   * Fait quitter l'équipe
   */
  quitterEquipeSansConfirmation() {
    this.http.post<User[]>(GlobalConstants.apiUrl + 'quitterEquipe.php', { identifiant: this.user.identifiant }).subscribe(users => {
      if (users[0].identifiant == 'personne') {
        alert("Une erreur s'est produite")
      } else {
        this.user = users[0]
      }
    },
      error => {
        console.log(error)
      })
  }

  /**
   * Récupère dans la base de données la liste des utilisateurs ayant été actifs au cours des 10 dernières minutes
   * ainsi que le nombre d'utilisateurs désirant rester invisibles
   */
  recupWhosOnline() {
    if (isDevMode()) {
      this.onlineUsers = [
        {
          id: 1,
          codeAvatar: '',
          pseudo: 'lapin bleu',
          score: 17,
          lienTrophees: 'tuoocj',
          classement: 2,
          teamName: '',
          scoreEquipe: 0
        }, {
          id: 2,
          codeAvatar: '',
          pseudo: 'Pierre verte',
          score: 38,
          lienTrophees: 'tuoocj',
          classement: 1,
          teamName: '',
          scoreEquipe: 0
        }
      ]
    } else {
      this.http.get<UserSimplifie[]>(GlobalConstants.apiUrl + 'whosonline.php').subscribe(userSimplifies => {
        const infos = userSimplifies.pop() // Le dernier usersSimplifie n'en est pas un mais sert juste à récupérer des infos comme le nombre de personnes en ligne
        if (typeof (infos) != 'undefined') this.onlineNb = parseInt(infos.pseudo)
        this.onlineUsers = userSimplifies
      }, error => {
        console.log(error)
      })
    }
  }

  /**
   * Si l'utilisateur choisit de rester anonyme ou qu'il n'a pas de codeAvatar, renvoie le lien vers l'icone de base
   * Sinon, épure le codeAvatar et renvoie le lien vers son avatar (avec un ?user.codeAvatar épuré pour signaler une mise à jour et forcer le retéléchargement)
   * @param user 
   * @returns 
   */
  getLienAvatar(user: User | UserSimplifie) {
    let lienAvatar: string
    if (user.pseudo == 'anonyme' || user.codeAvatar == '') {
      lienAvatar = 'assets/img/reshot/user-3294.svg'
    } else {
      lienAvatar = `/avatars/${user.id}.svg?${user.codeAvatar}`
      lienAvatar = lienAvatar.replace(/-/g, '')
      lienAvatar = lienAvatar.replace(/,/g, '')
      lienAvatar = lienAvatar.replace(/\s/g, '')
      lienAvatar = lienAvatar.replace(/\(/g, '')
      lienAvatar = lienAvatar.replace(/\)/g, '')
      lienAvatar = lienAvatar.replace(/#/g, '')
    }
    return lienAvatar
  }

  /**
   * Renvoie un style de css qui permet d'afficher un avatar, l'emblème de son équipe et le badge de son classement
   */
  getStyleAvatar(user: User | UserSimplifie) {
    const lienEquipe = `/team_emblems/${user.teamName}.svg`
    const lienBadge = `/assets/img/gvalmont/top${this.top(user.classement)}.svg`
    let style = `--image-avatar:url('${this.getLienAvatar(user)}');`
    if (user.teamName != '') style += `--image-equipe:url('${lienEquipe}');`
    if (user.classement <= 50) style += `--image-badge:url('${lienBadge}');`
    return <string>style
  }

  /**
   * Renvoie le numéro du badge correspondant au classement
   * @param classement 
   * @returns 
   */
  top(classement: number) {
    if (classement <= 3) return classement
    else if (classement <= 5) return 5
    else if (classement <= 10) return 10
    else if (classement <= 20) return 20
    else if (classement <= 50) return 50
    else return 0
  }
  /**
   * Envoie l'identifiant par message post à login.php pour s'identifier
   * Si pas connecté, on renvoie vers erreurLogin pour tenter de créer l'identifiant.
   * Si connecté :
   * - Met à jour le lastLogin
   * - Crée/modifie un token dans le localstorage avec l'identifiant du premier utilisateur correspondant dans la bdd
   * - Fire un event pour prévenir de la connexion
   * - Redirige vers la page qu'on a voulu accéder ou vers la page profil.
   * @param identifiant identifiant à chercher dans la bdd
   * @param secure false si connexion automatique, true si l'utilisateur saisit son identifiant
   * @param redigire true s'il y a une redirection à faire, false sinon
   */
  login(identifiant: string, secure: boolean, redirige?: boolean) {
    if (isDevMode()) {
      this.user = {
        id: 0,
        identifiant: 'X',
        codeAvatar: '',
        lastLogin: '',
        lastAction: '',
        visible: '',
        pseudo: 'Cerf sauvage',
        score: 196,
        codeTrophees: 'tuoocj',
        tropheesVisibles: '',
        cleScore: 'abc',
        classement: 9,
        teamName: 'PUF',
        scoreEquipe: 0,
        derniereSequence: 'S4S5!Séquence 5 :<br>Théorème de Pythagore',
        dernierObjectif: '4G20!4G20 : Calculer une longueur avec le théorème de Pythagore'
      }
      this.setToken('identifiant', this.user.identifiant)
      this.setToken('version', this.derniereVersionToken)
      this.isloggedIn = true
      this.profilModifie.emit([
        'identifiant',
        'lienAvatar',
        'lastLogin',
        'lastAction',
        'visible',
        'pseudo',
        'score',
        'codeTrophees',
        'tropheesVisibles',
        'derniereSequence',
        'dernierObjectif'])
    } else {
      let loginPage: string
      secure ? loginPage = 'login.php' : loginPage = 'autologin.php'
      this.http.post<User[]>(GlobalConstants.apiUrl + loginPage, { identifiant: identifiant }).subscribe(users => {
        if (users[0].identifiant == 'personne') {
          console.log('identifiant non trouvé, on en crée un nouveau')
          this.registration(identifiant)
        } else {
          this.isloggedIn = true
          this.setToken('identifiant', users[0].identifiant)
          this.setToken('version', this.derniereVersionToken)
          this.user = users[0]
          this.profilModifie.emit([
            'identifiant',
            'lienAvatar',
            'lastLogin',
            'lastAction',
            'visible',
            'pseudo',
            'score',
            'codeTrophees',
            'tropheesVisibles',
            'derniereSequence',
            'dernierObjectif'])
          if (redirige) {
            const redirect = this.redirectUrl ? this.redirectUrl : 'profil';
            this.router.navigate([redirect]);
          }
        }
      },
        error => {
          console.log(error)
        })
    }
  }

  /**
   * Vérifie si l'identifiant existe bien et correspond bien à celui de l'utilisateur actuel,
   * envoie un postMessage de type retourSecureLogin avec le résultat du test
   * @param secureIdentifiant 
   */
  secureLoginCheck(secureIdentifiant: string, donnees: object, origineDemande: string) {
    this.http.post<User[]>(GlobalConstants.apiUrl + 'securelogin.php', { identifiant: this.user.identifiant, secureIdentifiant: secureIdentifiant }).subscribe(users => {
      if (users[0].identifiant == 'personne') {
        window.frames.postMessage({ retourSecureLogin: 'erreur', donnees: donnees, origineDemande: origineDemande }, GlobalConstants.origine)
      } else if (users[0].identifiant == 'different') {
        window.frames.postMessage({ retourSecureLogin: 'different', donnees: donnees, origineDemande: origineDemande }, GlobalConstants.origine)
      } else {
        window.frames.postMessage({ retourSecureLogin: secureIdentifiant, donnees: donnees, origineDemande: origineDemande }, GlobalConstants.origine)
      }
    },
      error => {
        window.frames.postMessage({ retourSecureLogin: 'erreur', donnees: donnees, origineDemande: origineDemande }, GlobalConstants.origine)
        this.erreurRegistration('secureLogin', error['message'])
        console.log(error)
      })
  }

  /**
   * Vérifie la longueur et la présence de caractères spéciaux dans la chaîne.
   * Si tout est ok, on passe l'identifiant à l'API pour le créer.
   * @param identifiant 
   */
  registration(identifiant: string) {
    if (identifiant.length > 5 || identifiant.length < 4) {
      this.erreurRegistration('longueur')
    } else if (!this.onlyLettersAndNumbers(identifiant)) {
      this.erreurRegistration('caracteres_speciaux')
    } else {
      const user: User = {
        id: 0,
        identifiant: identifiant,
        codeAvatar: '',
        lastLogin: '',
        lastAction: '',
        visible: '',
        pseudo: this.pseudoAleatoire(),
        score: 0,
        codeTrophees: '',
        tropheesVisibles: '',
        cleScore: '',
        classement: 0,
        teamName: '',
        scoreEquipe: 0,
        derniereSequence: '',
        dernierObjectif: ''
      }
      this.http.post<User[]>(GlobalConstants.apiUrl + 'register.php', user).subscribe(users => {
        this.isloggedIn = true
        this.setToken('identifiant', users[0].identifiant);
        this.setToken('version', this.derniereVersionToken);
        this.user = users[0]
        this.profilModifie.emit([
          'identifiant',
          'lienAvatar',
          'lastLogin',
          'lastAction',
          'visible',
          'pseudo',
          'score',
          'codeTrophees',
          'tropheesVisibles',
          'derniereSequence',
          'dernierObjectif'])
        this.router.navigate(['profil'])
      }, error => {
        console.log(error)
        this.erreurRegistration('userregistration', error['message'])
      });
    }
  }
  /**
   * Demande l'ajout d'une nouvelle équipe à la base de données
   * envoie un postMessage de type retourCreationEquipe si l'équipe existe déjà,
   * envoie l'utilisateur vers la page de l'équipe si c'est bon
   * @param creationOuModification
   * @param teamName 
   * @param lienEmbleme 
   * @param foregroundId 
   * @param foregroundPrimaryColor 
   * @param foregroundSecondaryColor 
   * @param backgroundId 
   * @param backgroundColor 
   * @param identifiant 
   */
  creationModificationEquipe(creationOuModification: string, teamName: string, lienEmbleme: string,
    foregroundId: number, foregroundPrimaryColor: string, foregroundSecondaryColor: string,
    backgroundId: number, backgroundColor: string, identifiant: string) {
    this.http.post<Equipe[]>(`${GlobalConstants.apiUrl}${creationOuModification}Equipe.php`, {
      teamName: teamName, lienEmbleme: lienEmbleme, codeEquipe: this.infosEquipe.codeEquipe,
      foregroundId: foregroundId, foregroundPrimaryColor: foregroundPrimaryColor, foregroundSecondaryColor: foregroundSecondaryColor,
      backgroundId: backgroundId, backgroundColor: backgroundColor, leader: identifiant
    }).subscribe(equipes => {
      this.equipe = equipes[0]
      if (this.equipe.teamName == 'personne') console.log('Aucune équipe avec ce codeEquipe ?')
      else if (this.equipe.teamName == 'existe_deja') {
        window.frames.postMessage({ retourCreationEquipe: 'existe_deja' }, GlobalConstants.origine)
      } else {
        this.user.teamName = this.equipe.teamName
        this.router.navigate(['team', this.user.teamName])
      }
    }, error => {
      this.erreurRegistration('creationEquipe', error['message'])
      console.log(error)
    });
  }

  /**
   * Vérifie si l'utilisateur est bien leader de l'équipe,
   * récupère les infos sur l'équipe,
   * dirige vers la page de modification de l'équipe
   */
  modifierEquipe() {
    this.http.post<Equipe[]>(`${GlobalConstants.apiUrl}getEquipe.php`, { codeEquipe: this.infosEquipe.codeEquipe, leader: this.user.id }).subscribe(equipes => {
      this.equipe = equipes[0]
      if (this.equipe.teamName == 'personne') {
        alert("Tu n'es pas le chef de cette équipe")
        this.router.navigate(['accueil'])
      }
      else {
        this.router.navigate(['team', 'admin', 'modification'])
      }
    }, error => {
      this.erreurRegistration('modifierEquipe', error['message'])
      console.log(error)
    });
  }

  /**
   * Signale à l'utilisateur un problème dans l'enregistrement d'un nouvel identifiant
   * @param typeErreur chaine de caractères
   * @param erreur objet erreur
   */
  erreurRegistration(typeErreur?: string, erreur?: any) {
    if (typeErreur == 'longueur') {
      alert('Erreur : l\'identifiant doit comporter 4 ou 5 caractères !')
    } else if (typeErreur == 'caracteres_speciaux') {
      alert('Erreur : tu ne dois utiliser que des chiffres et des lettres sans accent')
    } else if (typeErreur == 'userregistration') {
      alert('Une erreur s\'est produite lors de l\'accès à la base de données (peut-être que la connexion n\'est pas sécurisée ? (https)\n\nLe message d\'erreur est le suivant :\n' + erreur)
    } else if (typeErreur == 'creationEquipe') {
      alert('Une erreur s\'est produite lors de l\'accès à la base de données (peut-être que la connexion n\'est pas sécurisée ? (https)\n\nLe message d\'erreur est le suivant :\n' + erreur)
    } else if (typeErreur == 'modifierEquipe') {
      alert('Une erreur s\'est produite lors de l\'accès à la base de données (peut-être que la connexion n\'est pas sécurisée ? (https)\n\nLe message d\'erreur est le suivant :\n' + erreur)
    } else if (typeErreur == 'secureLogin') {
      alert('Une erreur s\'est produite lors de l\'accès à la base de données (peut-être que la connexion n\'est pas sécurisée ? (https)\n\nLe message d\'erreur est le suivant :\n' + erreur)
    } else {
      alert('Une erreur s\'est produite')
    }
  }

  /**
   * Vérifie qu'il n'y a que des lettres et des chiffres
   * @param str chaîne à tester
   * @returns true si c'est le cas, false sinon
   */
  onlyLettersAndNumbers(str: string) {
    return /^[A-Za-z0-9]*$/.test(str);
  }

  /**
   * Met à jour this.feminin
   * @param feminin boolean
   */
  majFeminin(feminin: boolean) {
    this.feminin = feminin
  }

  /**
   * Crée un pseudo aléatoire en mélangeant un nom et un adjectif au hasard
   * @returns pseudo
   */
  pseudoAleatoire() {
    if (this.feminin) {
      const nom = this.listeFeminins[Math.floor(Math.random() * this.listeFeminins.length)].nom
      const adjectif = this.listeAdjectifs[Math.floor(Math.random() * this.listeAdjectifs.length)].feminin
      return nom + ' ' + adjectif
    } else {
      const nom = this.listeMasculins[Math.floor(Math.random() * this.listeMasculins.length)].nom
      const adjectif = this.listeAdjectifs[Math.floor(Math.random() * this.listeAdjectifs.length)].masculin
      return nom + ' ' + adjectif
    }
  }

  /**
   * Récupère les listes de noms masculins, de noms féminins et d'adjectifs
   */
  recupereDonneesPseudos() {
    this.http.get<Nom[]>('assets/data/nomsMasculins.json').subscribe(noms => {
      this.listeMasculins = noms
    })
    this.http.get<Nom[]>('assets/data/nomsFeminins.json').subscribe(noms => {
      this.listeFeminins = noms
    })
    this.http.get<Adjectif[]>('assets/data/adjectifs.json').subscribe(adjectifs => {
      this.listeAdjectifs = adjectifs
    })
  }

  /**
   * Modifie le codeAvatar dans la bdd et écrit le svg
   * @param lienAvatar
   * @param codeAvatar
   */
  majAvatar(lienAvatar: string, codeAvatar: string) {
    this.user.codeAvatar = codeAvatar
    if (isDevMode()) {
      this.profilModifie.emit(['lienAvatar'])
    } else {
      this.http.post<User[]>(GlobalConstants.apiUrl + 'majAvatar.php', { identifiant: this.user.identifiant, codeAvatar: this.user.codeAvatar, lienAvatar: lienAvatar }).subscribe(
        users => {
          this.profilModifie.emit(['lienAvatar'])
        },
        error => {
          console.log(error)
        });
    }
  }

  /**
   * Modifie le pseudo dans la bdd
   * @param pseudo 
   */
  majPseudo(pseudo: string) {
    this.user.pseudo = pseudo
    this.majProfil(['pseudo'])
  }

  /**
   * Récupère le score actuel
   * Ajoute le score de l'exercice
   * Met à jour le score de la base de données
   * @param score à ajouter 
   * @param url de l'exercice en question
   * @param type de l'exercice '', 'tranquille', 'vitesse', 'performance' etc.
   */
  majScore(score: number, url: string, type: string) {
    if (isDevMode()) {
      this.profilModifie.emit(['score'])
    } else {
      this.http.post<User[]>(GlobalConstants.apiUrl + 'majScore.php', {
        identifiant: this.user.identifiant,
        score: score,
        cleScore: this.user.cleScore,
        url: url,
        type: type,
        teamName: this.user.teamName
      }).subscribe(
        users => {
          this.user.score = users[0].score
          this.user.cleScore = users[0].cleScore
          this.profilModifie.emit(['score'])
        },
        error => {
          console.log(error)
        });
    }
  }

  /**
   * Modifie la date de dernière action
   * Met à jour la liste d'utilisateurs en ligne et leur nombre
   * Si l'utilisateur est actuellement organisateur d'une compétition, autoCheck sa présence
   */
  majLastAction() {
    if (this.get('CompetitionorganisationEnCours') && this.competitionActuelleToujoursEnCours()) {
      this.set('CompetitionautoCheckPresenceOrganisateur', true)
    }
    if (isDevMode()) {
      this.onlineNb = 2
      this.onlineUsers = [
        {
          id: 1,
          codeAvatar: '',
          pseudo: 'lapin bleu',
          score: 17,
          lienTrophees: '',
          classement: 2,
          teamName: '',
          scoreEquipe: 0
        }, {
          id: 2,
          codeAvatar: '',
          pseudo: 'Pierre verte',
          score: 38,
          lienTrophees: '',
          classement: 1,
          teamName: '',
          scoreEquipe: 0
        }
      ]
    } else {
      if (typeof (this.user.identifiant) != 'undefined' && this.user.identifiant != '') {
        this.http.post<UserSimplifie[]>(GlobalConstants.apiUrl + 'actionUtilisateur.php', { identifiant: this.user.identifiant }).subscribe(userSimplifies => {
          const infos = userSimplifies.pop() // Le dernier usersSimplifie n'en est pas un mais sert juste à récupérer des infos comme le nombre de personnes en ligne
          if (typeof (infos) != 'undefined') this.onlineNb = parseInt(infos.pseudo)
          this.onlineUsers = userSimplifies
        },
          error => {
            console.log(error)
          });
      }
    }
  }


  /**
   * Supprime le token de clé 'identifiant' utilisé pour vérifier si l'utilisateur est connecté.
   * Supprime aussi le token de clé 'lienAvatar'
   * Toggle les profilbtn et loginbtn.
   * Renvoie vers l'accueil.
   */
  logout() {
    if (isDevMode()) {
      this.deleteToken('identifiant')
      this.deleteToken('version')
      this.user = new User(0, '', '', '', '', '', '', 0, '', '', '', 0, '', 0, '', '')
      this.isloggedIn = false
      this.profilModifie.emit([
        'identifiant',
        'lienAvatar',
        'lastLogin',
        'lastAction',
        'visible',
        'pseudo',
        'score',
        'codeTrophees',
        'tropheesVisibles',
        'derniereSequence',
        'dernierObjectif'])
      this.router.navigate(['accueil'])
    } else {
      this.http.post(GlobalConstants.apiUrl + 'logout.php', this.user).subscribe(
        data => {
          this.deleteToken('identifiant')
          this.deleteToken('version')
          this.user = new User(0, '', '', '', '', '', '', 0, '', '', '', 0, '', 0, '', '')
          this.isloggedIn = false
          this.profilModifie.emit([
            'identifiant',
            'lienAvatar',
            'lastLogin',
            'lastAction',
            'visible',
            'pseudo',
            'score',
            'codeTrophees',
            'tropheesVisibles',
            'derniereSequence',
            'dernierObjectif'])
          this.router.navigate(['accueil'])
        },
        error => {
          console.log(error)
        });
    }
  }

  /**
   * @param visible peut être 'oui' ou 'non'
   */
  majVisible(visible: string) {
    this.user.visible = visible
    this.majProfil(['visible'])
  }

  /**
   * @param tropheesVisibles peut être 'oui' ou 'non'
   */
  majTropheesVisibles(tropheesVisibles: string) {
    this.user.tropheesVisibles = tropheesVisibles
    this.majProfil(['tropheesVisibles'])
  }

  /**
   * Met à jour le codeTrophees du profil local et de celui de la bdd
   * @param codeTrophees
   */
  majCodeTrophees(codeTrophees: string) {
    this.user.codeTrophees = codeTrophees
    this.majProfil(['codeTrophees'])
  }

  /**
   * Envoie un mail au propriétaire du site
   * @param message
   */
  envoiMailEval(codeTrophee: string, sujetEval: string) {
    this.http.post<Message>(GlobalConstants.apiUrl + 'envoiMailEval.php', { codeTrophee: codeTrophee, sujetEval: sujetEval }).pipe(first()).subscribe(
      message => {
        if (message.message == 'mail envoye') {
          alert('Ton message a bien été envoyé !\nM. Valmont t\'enverra un message sur Pronote pour te dire quoi réviser.')
        } else {
          alert('Il semble que le mail ait été envoyé')
        }
      },
      error => {
        alert('Une erreur s\'est produite')
        console.log(error)
      });
  }

  /**
   * Met à jour le profil de l'utilisateur
   */
  majProfil(valeursModifiees: string[]) {
    if (isDevMode()) {
      this.profilModifie.emit(valeursModifiees)
    } else {
      this.http.post<User[]>(GlobalConstants.apiUrl + 'majProfil.php', this.user).subscribe(
        users => {
          this.profilModifie.emit(valeursModifiees)
        },
        error => {
          console.log(error)
        });
    }
  }

  /**
   * On renseigne soit le lienTrophees, soit le codeTrophees
   * Renvoie la liste des trophées
   * Si on passe par le lienTrophees, ne permet pas de demander à refaire une évaluation
   * Si on passe par le codeTrophees, permet de demander à refaire une évaluation
   * @param lienTrophees public, affiché dans le classement et la liste des personnes en ligne
   * @param codeTrophees privé, remis par le professeur, permet de voir ses trophées, de le lier à son profil et de demander à refaire une évaluation
   */
  getTrophees(lienTrophees: string, codeTrophees: string) {
    this.http.post<Trophee5e | Trophee4e>(GlobalConstants.apiUrl + 'trophees.php', { lienTrophees: lienTrophees, codeTrophees: codeTrophees }).subscribe(
      trophees => {
        if (codeTrophees != '' && lienTrophees == '' && trophees.peutDemanderEval != 'personne') {
          this.majCodeTrophees(codeTrophees)
        }
        this.trophees = trophees
        this.profilModifie.emit(['trophees'])
      },
      error => {
        console.log(error)
      })
  }

  /**
   * Crée un token dans le localStorage
   * @param key clé to token
   * @param value Valeur du token
   */
  setToken(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  /**
   * Récupère la valeur du token key du localStorage
   * @param key
   * @returns Valeur du token key
   */
  getToken(key: string) {
    return localStorage.getItem(key);
  }

  /**
   * Supprime le token key du localStorage
   * @param key
   */
  deleteToken(key: string) {
    localStorage.removeItem(key);
  }

  /**
   * Vérifie si l'utilisateur est connecté en vérifiant la présence d'un token qui a pour clé 'identifiant'
   * Si on en trouve un, renvoie true
   * Sinon, renvoie false
   * @returns boolean
   */
  checkLoggedIn() {
    const usertoken = this.getToken('identifiant');
    const version = this.getToken('version')
    if (usertoken != null && version == this.derniereVersionToken) {
      this.isloggedIn = true
    } else {
      this.isloggedIn = false
    }
  }


  /**
   * Ouvre une modale qui demande à l'utilisateur de s'authentifier à nouveau,
   * si l'authentification est incorrecte (d'un point de vue client ou serveur), prévient secoue le champ
   * si l'authentification est correcte d'un point de vue client, demande le point de vue serveur avec this.dataService.secureLogin(identifiant)
   * 
   * À tout moment, si l'utilisateur clique sur le fond ou la croix, détruit la modale
   * @param data données à transmettre
   */
  securelogin(data: object, origineDemande: string) {
    const origine = GlobalConstants.origine
    this.ecouteMessagesPost()
    this.div = document.createElement('div')
    this.div.id = 'modaleSecureLogin'
    this.div.className = 'centre pleinEcran has-background-dark'
    this.div.innerHTML = `
      <div><br><br><br></div>
      <div class="container is-max-desktop box">
        <h1 class="title is-3">Par mesure de sécurité, tu dois te reconnecter.</h1>
        <div class="columns is-centered">
          <div class="column is-narrow">
            <!-- Champ de connexion -->
            <form autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
              <div class="field">
                <div class="columns">
                  <div class="column is-one-fifth">
                  </div>
                  <!-- On fait un tableau à une seule colonne pour que les contenus restent alignés en vue portrait -->
                  <div class="column is-three-fifths">
                    <div class="control has-icons-left has-icons-right is-inline-block">
                      <!-- Champ en lui-même -->
                      <input id='champSecureLogin' class="input is-large" max="5" min="4" type="password"
                      autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Identifiant" size="15">
                      <!-- icônes de part et d'autre du champ -->
                      <span class="icon is-small is-left filter-grey">
                        <i class="image is-24x24"><img src="assets/img/reshot/user-3294.svg" /></i>
                      </span>
                    </div>
                  </div>
                  <div class="column is-one-fift is-flex is-align-items-center is-justify-content-center">
                  </div>
                </div>
              </div>
              <br>
            </form>
            <div id="indicationChampSecureLogin"></div>
            <br>
            <!-- Bouton d'envoi -->
            <button id="secureLoginButton" class="button is-success is-rounded is-medium">Se connecter</button>
          </div>
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close"></button>`
    document.body.appendChild(this.div);

    /**
     * Quand on appuie sur entrée ou qu'on clique sur le bouton lorsqu'il a l'attribut submit, la modale se ferme
     * En attendant de trouver la source du bug, on bloque les input 'Enter' et on a retiré le bouton du form
     */
    document.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    });
    const modale = <HTMLElement>document.getElementById("modaleSecureLogin")
    const champSecureLogin = <HTMLInputElement>document.getElementById("champSecureLogin")
    if (champSecureLogin != null) {
      /**
       * À chaque input, vérifie si le contenu du champ est correct pour en prévenir l'utilisateur
       */
      champSecureLogin.addEventListener('input', (event) => {
        const dateNouvelleReponse = new Date()
        if (dateNouvelleReponse.getTime() - this.dateDerniereReponse.getTime() > 200) {
          const input = champSecureLogin.value
          let messageErreur = ''
          if (input.length < 4 && input.length != 0) messageErreur += "C'est trop court !"
          if (input.length > 5 && input.length != 0) messageErreur += "C'est trop long !"
          if (!/^[A-Za-z0-9]*$/.test(input)) messageErreur += "N'utilises que des chiffres<br>et des lettres sans accent !"
          const divIndication = document.getElementById("indicationChampSecureLogin")
          if (divIndication != null) {
            if (messageErreur != '') {
              divIndication.innerHTML = messageErreur
              divIndication.className = 'has-text-danger'
              champSecureLogin.className = 'input is-large is-danger'
            } else if (input.length != 0) {
              divIndication.innerHTML = "C'est parfait !"
              divIndication.className = 'has-text-success'
              champSecureLogin.className = 'input is-large is-success'
            } else {
              divIndication.innerHTML = ""
              champSecureLogin.className = 'input is-large'
            }
          }
        }
      })
    }

    /**
     * Lorsqu'on clique sur le bouton de login, vérifie si l'input est correct,
     * si c'est le cas, envoie un postMessage de type secureLogin
     * sinon, secoue le champ
     * 
     * Lorsqu'on clique sur le fond ou sur la croix,
     * détruit la modale
     */
    this.div.onclick = function (e: any) {
      const classe = e.target.className
      if (classe == "button is-success is-rounded is-medium") {
        if (champSecureLogin != null && modale != null) {
          if (champSecureLogin.value.length >= 4 && champSecureLogin.value.length <= 5 && /^[A-Za-z0-9]*$/.test(champSecureLogin.value)) {
            champSecureLogin.className = 'input is-large is-success'
            const bouton = <HTMLButtonElement>document.getElementById("secureLoginButton")
            bouton.disabled = true
            window.frames.postMessage({ secureLogin: champSecureLogin.value, donnees: data, origineDemande: origineDemande }, origine)
          } else {
            champSecureLogin.className = 'input is-large is-danger shake'
            setTimeout(() => champSecureLogin.className = 'input is-large is-danger', 500)
          }
        }
      } else if ((classe == "modal-close is-large" || classe == "centre pleinEcran has-background-dark") && modale != null) {
        modale.parentNode?.removeChild(modale)
      }
    }
  }

  /**
   * Attend les messages contenant un secureLogin,
   * s'il passe les tests client, l'envoie dans this.dataService.secureLogin pour passer les tests serveur
   * sinon, secoue le champ
   * 
   * Attend les messages contenant un retourSecureLogin,
   * s'il y a une erreur, prévient et secoue le champ
   * sinon, détruit la modale
   */
  ecouteMessagesPost() {
    const divListenerExistant = document.getElementById('apiServiceListener')
    if (divListenerExistant == null) {
      const divListener = document.createElement('div')
      divListener.id = 'apiServiceListener'
      document.body.appendChild(divListener)
      window.addEventListener('message', (event) => {
        const dateNouvelleReponse = new Date()
        if (dateNouvelleReponse.getTime() - this.dateDerniereReponse.getTime() > 200) {
          // Tentative de connexion
          const identifiant = event.data.secureLogin
          const donnees = event.data.donnees
          const origineDemande = event.data.origineDemande
          if (typeof (identifiant) != 'undefined') {
            if (this.inputOk(identifiant)) { // On envoie la demande si l'input passe les tests clients
              this.secureLoginCheck(identifiant, donnees, origineDemande)
            } else { // Sinon on secoue
              const champSecureLogin = <HTMLInputElement>document.getElementById("champSecureLogin")
              champSecureLogin.className = 'input is-large is-danger shake'
              setTimeout(() => champSecureLogin.className = 'input is-large is-danger', 500)
              const bouton = <HTMLButtonElement>document.getElementById("secureLoginButton")
              bouton.disabled = false
            }
          }
          // Retour de connextion
          const retourSecureLogin = event.data.retourSecureLogin
          if (typeof (retourSecureLogin) != 'undefined') {
            if (retourSecureLogin == 'erreur' || retourSecureLogin == 'different') { // S'il y a une erreur, on prévient et on secoue
              const divIndication = <HTMLElement>document.getElementById("indicationChampSecureLogin")
              divIndication.innerHTML = "L'identifiant est incorrect"
              divIndication.className = 'has-text-danger'
              const champSecureLogin = <HTMLInputElement>document.getElementById("champSecureLogin")
              champSecureLogin.className = 'input is-large is-danger shake'
              setTimeout(() => champSecureLogin.className = 'input is-large is-danger', 500)
              const bouton = <HTMLButtonElement>document.getElementById("secureLoginButton")
              bouton.disabled = false
            } else { // Sinon on ferme la modale
              if (origineDemande == 'apiService' && donnees.quitterEquipe) {
                this.quitterEquipeSansConfirmation()
              }
              const modale = <HTMLElement>document.getElementById("modaleSecureLogin")
              modale.parentNode?.removeChild(modale)
            }
          }
        }
      })
    }
  }

  avatarAleatoire() {
    const r = function (max: number) {
      return Math.floor(Math.random() * max)
    }

    const c = function () {
      const o = Math.round, r = Math.random, s = 255
      return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')'
    }
    return `${c()},${r(26)},${r(10)},${r(30)},${r(7)},${r(36)},${c()}`
  }

  /**
   * Tests clients pour vérifier si l'input est correct
   * @param input 
   * @returns true si l'input est correct, false sinon
   */
  inputOk(input: string) {
    let defaut = true
    let errSpChar = false
    let errPetitNbChar = false
    let errGrandNbChar = false
    if (input.length != 0) defaut = false
    if (input.length < 4 && input.length != 0) errPetitNbChar = true
    if (input.length > 5) errGrandNbChar = true
    if (!this.onlyLettersAndNumbers(input)) errSpChar = true
    return (!defaut && !errSpChar && !errPetitNbChar && !errGrandNbChar)
  }

  /**
   * Ecrit dans le localStorage les valeurs séparés par des '!' s'il y en a plusieurs
   * @param tag nom de la "variable"
   * @param valeurs 
   */
  set(tag: string, objet: any) {
    localStorage.setItem(tag, JSON.stringify(objet))
  }

  /**
   * Récupère un nombre du localStorage
   * @param tag nom de la "variable"
   * @returns
   */
  get(tag: string) {
    const obj = localStorage.getItem(tag)
    if (obj != null) return JSON.parse(obj)
  }
}