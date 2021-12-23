import { Injectable, Output, EventEmitter, isDevMode } from '@angular/core';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User, UserSimplifie } from './user';
import { Router } from '@angular/router';
import { Trophee4e, Trophee5e } from './trophees';
import { Equipe } from './equipe';

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
  origine: string
  redirectUrl: string
  baseUrl: string
  isloggedIn: boolean
  user: User
  onlineUsers: UserSimplifie[]
  classement: UserSimplifie[]
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

  @Output() profilModifie: EventEmitter<string[]> = new EventEmitter();
  constructor(private http: HttpClient, private router: Router) {
    isDevMode() ? this.origine = 'http://localhost:4200' : this.origine = 'https://beta.topmaths.fr'
    this.baseUrl = this.origine + "/api";
    this.redirectUrl = ''
    this.user = {
      id: 0,
      identifiant: '',
      lienAvatar: '',
      scores: '',
      lastLogin: '',
      lastAction: '',
      visible: '',
      pseudo: '',
      score: '0',
      codeTrophees: '',
      tropheesVisibles: '',
      cleScore: '',
      classement: 0,
      teamName: '',
      scoreEquipe: 0
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
    this.classement = []
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
    this.surveilleModificationsDuProfil()
    this.ecouteMessagesPost()
    this.recupereDonneesPseudos() // En cas de création d'un nouveau compte
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
    })
  }

  /**
   * Récupère dans les utilisateurs de la base de données par score décroissant
   */
  recupClassement() {
    if (isDevMode()) {
      this.classement = [
        {
          id: 1,
          lienAvatar: 'https://avatars.dicebear.com/api/adventurer/id1.svg',
          pseudo: 'lapin bleu',
          score: '17',
          lienTrophees: 'tcqnfy',
          classement: 2,
          teamName: '',
          scoreEquipe: 0
        }, {
          id: 2,
          lienAvatar: '',
          pseudo: 'anonyme',
          score: '38',
          lienTrophees: 'tuoocj',
          classement: 1,
          teamName: '',
          scoreEquipe: 0
        }
      ]
    } else {
      this.http.get<UserSimplifie[]>(this.baseUrl + '/classement.php').subscribe(usersSimplifies => {
        this.classement = usersSimplifies
        this.recupWhosOnline()
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
            lienAvatar: 'https://avatars.dicebear.com/api/adventurer/id2.svg',
            score: '38',
            lienTrophees: 'tuoocj',
            classement: 1,
            teamName: 'PUF',
            scoreEquipe: 28,
          },
          {
            id: 2,
            pseudo: 'lapin bleu',
            lienAvatar: 'https://avatars.dicebear.com/api/adventurer/id3.svg',
            score: '38',
            lienTrophees: 'tcqnfy',
            classement: 2,
            teamName: 'PUF',
            scoreEquipe: 23,
          }
        ]
      }
    } else {
      this.http.post<InfosEquipe>(this.baseUrl + '/equipe.php', { teamName: teamName, identifiant: this.user.identifiant }).subscribe(equipe => {
        this.infosEquipe = equipe
      },
        error => {
          console.log(error)
        })
    }
  }

  rejoindreEquipe(codeEquipe: string) {
    this.http.post<User[]>(this.baseUrl + '/rejoindreEquipe.php', { identifiant: this.user.identifiant, codeEquipe: codeEquipe }).subscribe(users => {
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
    this.http.post<User[]>(this.baseUrl + '/quitterEquipe.php', { identifiant: this.user.identifiant }).subscribe(users => {
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
          lienAvatar: 'https://avatars.dicebear.com/api/adventurer/id1.svg',
          pseudo: 'lapin bleu',
          score: '17',
          lienTrophees: 'tuoocj',
          classement: 2,
          teamName: '',
          scoreEquipe: 0
        }, {
          id: 2,
          lienAvatar: 'https://avatars.dicebear.com/api/adventurer/id2.svg',
          pseudo: 'Pierre verte',
          score: '38',
          lienTrophees: 'tuoocj',
          classement: 1,
          teamName: '',
          scoreEquipe: 0
        }
      ]
    } else {
      this.http.get<UserSimplifie[]>(this.baseUrl + '/whosonline.php').subscribe(userSimplifies => {
        const infos = userSimplifies.pop() // Le dernier usersSimplifie n'en est pas un mais sert juste à récupérer des infos comme le nombre de personnes en ligne
        if (typeof (infos) != 'undefined') this.onlineNb = parseInt(infos.pseudo)
        this.onlineUsers = userSimplifies
      }, error => {
        console.log(error)
      })
    }
  }

  /**
   * Renvoie un style de css qui permet d'afficher un avatar, l'emblème de son équipe et le badge de son classement
   */
  getStyleAvatar(user: User | UserSimplifie) {
    const lienEquipe = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MzYuOCIgaGVpZ2h0PSI0MzYuOCIgc2hhcGUtcmVuZGVyaW5nPSJnZW9tZXRyaWNQcmVjaXNpb24iPjxnIHRyYW5zZm9ybT0ic2NhbGUoMS43MDYyNSwxLjcwNjI1KSIgc3Ryb2tlLXdpZHRoPSIuMDUlIj48ZyBmaWxsPSIjYzNjMGJmIj48cGF0aCBkPSIgTSA0OC4xMCAxNC4xNyBDIDY4LjA0IDE0LjQyIDg3Ljk4IDE0LjEwIDEwNy45MiAxNC4wNSBDIDE1Mi43MyA2My4wNyAxOTcuMTcgMTEyLjQzIDI0Mi4wMCAxNjEuNDMgQyAyNDEuOTQgMTgzLjU5IDI0MS45OCAyMDUuNzYgMjQxLjk4IDIyNy45MiBDIDE3Ny41MyAxNTYuNTEgMTEyLjYyIDg1LjUyIDQ4LjEwIDE0LjE3IFoiLz48cGF0aCBkPSIgTSAxMTIuMjQgMTQuMDIgQyAxMTMuMjQgMTQuMDEgMTE1LjIyIDEzLjk5IDExNi4yMiAxMy45OCBDIDE1OC4yOCA1OS45OCAyMDAuMDIgMTA2LjI3IDI0Mi4wMSAxNTIuMzMgQyAyNDIuMDAgMTUzLjg3IDI0MS45OSAxNTUuNDEgMjQxLjk3IDE1Ni45NiBDIDE5OC42OSAxMDkuMzQgMTU1LjM1IDYxLjc5IDExMi4yNCAxNC4wMiBaIi8+PHBhdGggZD0iIE0gMTQuMzAgMzAuMjEgQyAxNy44MCAzNC44MCAyMS45NiAzOC44MiAyNS44NyA0My4wNCBDIDg2LjMxIDEwOS4yMyAxNDYuNDggMTc1LjY3IDIwNi43NiAyNDIuMDAgQyAxODYuODcgMjQyLjAzIDE2Ni45OCAyNDEuOTAgMTQ3LjEwIDI0Mi4wMCBDIDEwMi43NSAxOTMuMjAgNTguNDggMTQ0LjM0IDE0LjEwIDk1LjU3IEMgMTQuMTAgNzMuNzkgMTQuNDYgNTIuMDAgMTQuMzAgMzAuMjEgWiIvPjxwYXRoIGQ9IiBNIDEzLjk0IDEwMC4xMyBDIDI4LjY3IDExNS43MiA0Mi43NSAxMzEuOTIgNTcuMzQgMTQ3LjYzIEMgODUuNzggMTc5LjE2IDExNC40OSAyMTAuNDcgMTQyLjkzIDI0Mi4wMCBDIDE0MS4yNyAyNDIuMDIgMTM5LjYyIDI0Mi4wMSAxMzcuOTYgMjQyLjAwIEMgOTYuOTggMTk3LjMzIDU2LjQ0IDE1Mi4yNCAxNS41OCAxMDcuNDYgQyAxMy40NSAxMDUuNjIgMTQuMTMgMTAyLjYwIDEzLjk0IDEwMC4xMyBaIi8+PC9nPjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0MzYuOCwgMCkgc2NhbGUoLTEsIDEpc2NhbGUoMS43MDYyNSwxLjcwNjI1KSIgc3Ryb2tlLXdpZHRoPSIuMDUlIj48ZyBmaWxsPSIjZDQ3MzdjIj48cGF0aCBkPSIgTSAxNTMuNjggMzYuNzggQyAxNTYuODAgMzMuODMgMTYxLjUyIDM0LjQyIDE2NS40MSAzNC45OCBDIDE3MC45OSAzNi4zMCAxNzcuMzAgMzYuMjQgMTgxLjk2IDQwLjAwIEMgMTg0LjM2IDQyLjA2IDE4My4wOSA0NS40NCAxODIuMjkgNDcuOTggQyAxODEuOTMgNDguNDggMTgxLjIxIDQ5LjQ5IDE4MC44NSA1MC4wMCBDIDE3OS44NSA1MC40NiAxNzguODYgNTAuOTMgMTc3Ljg3IDUxLjQxIEMgMTc0LjA4IDQ5LjM1IDE3MC43NCA0Ni41MiAxNjYuNzYgNDQuODEgQyAxNjMuMjYgNDMuNTYgMTU5LjU1IDQ1LjE1IDE1Ni4wMCA0NC40OSBDIDE1Mi45NiA0My4zOSAxNTIuNjYgMzkuNDAgMTUzLjY4IDM2Ljc4IFoiLz48cGF0aCBkPSIgTSAxNDAuNTggNDguNDUgQyAxNDIuMTIgNDUuMTcgMTQ0LjgwIDQwLjg5IDE0OS4wMiA0MS42MyBDIDE1MS42MSA0My4wMSAxNTIuNzkgNDYuMTYgMTUyLjQ1IDQ4Ljk4IEMgMTQ3Ljc3IDU0LjU5IDE0OS4xMSA2Mi40MiAxNDguMjQgNjkuMTcgQyAxNDUuMDcgNjkuODQgMTM5LjYyIDcxLjk5IDEzNy44OCA2OC4yMSBDIDEzOC4zOSA2MS42MSAxMzguMjIgNTQuNzQgMTQwLjU4IDQ4LjQ1IFoiLz48cGF0aCBkPSIgTSAxODYuMTQgNDUuNDEgQyAxODcuMjUgNDUuNDIgMTg4LjM3IDQ1LjQzIDE4OS40OCA0NS40NCBDIDE5NC44NSA1MC4wNCAxOTYuMTIgNTcuNTYgMTk2LjQ4IDY0LjI1IEMgMTkyLjg1IDY1LjEyIDE4OS4xNCA2NC41NyAxODUuNjEgNjMuNTcgQyAxODYuMDMgNTkuMjcgMTg0Ljk0IDU1LjE0IDE4Mi4wNiA1MS44OSBDIDE4Mi45MyA0OS40OCAxODQuODMgNDcuNjAgMTg2LjE0IDQ1LjQxIFoiLz48cGF0aCBkPSIgTSAxODMuODggNzEuOTggQyAxODQuNTEgNjguMjYgMTg4LjI1IDY1LjU2IDE5MS45OCA2Ni4xMiBDIDE5NS41MiA2NS44OCAxOTguMTcgNjkuNTcgMTk3Ljg3IDcyLjkxIEMgMTk4LjIzIDgwLjc4IDE5MC43OCA4Ny4xNiAxODMuMjEgODcuMjcgQyAxODQuNDUgODUuMzQgMTg3LjU1IDg0LjYzIDE4Ny42NyA4Mi4xNCBDIDE4Ni43MSA3OC42MyAxODIuNTIgNzYuMDEgMTgzLjg4IDcxLjk4IFoiLz48cGF0aCBkPSIgTSAxMzkuMTEgNzYuMTUgQyAxNDEuNzAgNzAuMjggMTUxLjU2IDcxLjk5IDE1My4wMiA3Ny44OSBDIDE1NC4xOSA4MS45MSAxNTEuMTUgODUuNDAgMTQ5LjIwIDg4LjYwIEMgMTQ2LjY5IDg4LjQ0IDE0NC4xNyA4OC4zMSAxNDEuNjYgODguMTUgQyAxNDAuNzQgODQuMjEgMTM3LjUzIDgwLjMzIDEzOS4xMSA3Ni4xNSBaIi8+PHBhdGggZD0iIE0gMTMzLjU4IDEwMC4xNiBDIDEzNi42NyA5Ni43MyAxMzguMzggOTEuODUgMTQyLjY4IDg5LjY4IEMgMTQ1LjQyIDkxLjMxIDE0OS4xNyA4OS41NCAxNTEuNDUgOTEuOTggQyAxNTIuMjAgOTQuMjcgMTUxLjQyIDk2LjcyIDE1MS4yMSA5OS4wNSBDIDE1MC41NiAxMDIuMzEgMTUwLjY4IDEwNS43MyAxNDkuMzQgMTA4LjgyIEMgMTQ1LjE4IDEwOC42NyAxNDAuOTcgMTA5LjA1IDEzNy4wOCAxMDcuMjcgQyAxMzUuNDAgMTA1LjE5IDEzMy44NCAxMDIuOTAgMTMzLjU4IDEwMC4xNiBaIi8+PHBhdGggZD0iIE0gMTI3LjEzIDEwOS4zMiBDIDEyNy42NSAxMDcuNDIgMTI4LjQ0IDEwNC44NiAxMzAuOTMgMTA1LjExIEMgMTM1Ljc3IDEwNC41NiAxMzguMTQgMTExLjEyIDE0My4xMiAxMDkuNTMgQyAxNDUuMTEgMTEwLjU3IDE0Ny4wNSAxMTEuNzEgMTQ4Ljk5IDExMi44NCBDIDE0OC40MSAxMTQuODQgMTQ3Ljc4IDExNi44MyAxNDcuMjAgMTE4LjgzIEMgMTQzLjc4IDExNy40MSAxMzkuOTYgMTE4LjA1IDEzNi41NSAxMTYuNjkgQyAxMzIuNjIgMTE1LjQwIDEzMC40MiAxMTEuNTkgMTI3LjEzIDEwOS4zMiBaIi8+PHBhdGggZD0iIE0gMTIwLjIxIDExOC4zMyBDIDEyMS43NCAxMTYuMTIgMTIyLjMzIDExMi42MSAxMjUuMjQgMTExLjgxIEMgMTI5LjY2IDExMi40NCAxMzEuNTYgMTE3Ljk0IDEzNi4wMiAxMTguNjIgQyAxMzkuNjcgMTE5LjIxIDE0NC40MCAxMTkuMDAgMTQ2LjM3IDEyMi44NCBDIDE0NS40NiAxMjUuMDEgMTQ0Ljc1IDEyNy4yNSAxNDQuMDYgMTI5LjUwIEMgMTM5LjM3IDEyOC40OCAxMzUuMDMgMTI2LjM0IDEzMC42MCAxMjQuNTUgQyAxMjYuOTQgMTIyLjg0IDEyMy4wMCAxMjEuMzggMTIwLjIxIDExOC4zMyBaIi8+PHBhdGggZD0iIE0gMTE2LjIwIDEyNi45NyBDIDExNi4wMiAxMjQuNzAgMTE3LjQzIDEyMi44OCAxMTguNTcgMTIxLjA4IEMgMTI3LjAxIDEyMy44MSAxMzQuNTQgMTI4LjUyIDE0Mi42MCAxMzIuMTQgQyAxNDIuMjkgMTM0LjE5IDE0MS43MSAxMzYuMTggMTQxLjA1IDEzOC4xNCBDIDEzMi40MCAxMzUuMzIgMTI0LjYwIDEzMC40MSAxMTYuMjAgMTI2Ljk3IFoiLz48cGF0aCBkPSIgTSAxMTkuMTggMTQwLjk1IEMgMTEzLjU0IDEzOS4zMSAxMTEuODkgMTMxLjg3IDExNC43MyAxMjcuMjQgQyAxMjMuMTcgMTMxLjU2IDEzMS40MSAxMzcuMDEgMTQwLjkyIDEzOC41NiBDIDEzOS45MyAxNDEuMzMgMTM3Ljk0IDE0My4zOSAxMzUuMTcgMTQ0LjM4IEMgMTMzLjIxIDE0NS4xNSAxMzEuMTQgMTQ1LjQ2IDEyOS4wNSAxNDUuMjMgQyAxMjcuNDEgMTQ0LjYzIDEyNS43MiAxNDQuMTUgMTI0LjAzIDE0My43NCBDIDEyMi42NyAxNDQuNDIgMTIxLjUzIDE0NC4xNyAxMjAuNjAgMTQzLjAwIEMgMTE5LjYwIDE0NS45MiAxMTkuMjQgMTQ5LjAzIDExOC4xMiAxNTEuOTMgQyAxMTUuNjcgMTU4Ljk2IDExMS41MSAxNjUuMjEgMTA4LjgxIDE3Mi4xNCBDIDEwNi4zMiAxNzEuMjQgMTAzLjI3IDE3MC4yOCAxMDIuMzQgMTY3LjQ4IEMgMTAwLjA2IDE2MS44MiAxMDMuNDMgMTU2LjA5IDEwNC41MCAxNTAuNTcgQyAxMDQuNDkgMTUwLjQwIDEwNC40NyAxNTAuMDUgMTA0LjQ2IDE0OS44OCBDIDEwNi4xMyAxNDguMzUgMTA2LjIyIDE0NS45NiAxMDcuMDEgMTQzLjk3IEMgMTA3LjM1IDE0Mi4wNCAxMDkuNjQgMTQyLjIwIDExMS4wOSAxNDEuNzYgQyAxMTQuMTUgMTQxLjEzIDExNy4yMCAxNDIuMjggMTE5LjY4IDE0NC4wNCBDIDExOS41NSAxNDMuMjYgMTE5LjMwIDE0MS43MiAxMTkuMTggMTQwLjk1IFoiLz48cGF0aCBkPSIgTSAxMjMuMDEgMTQ2LjUwIEMgMTI3LjI3IDE0NS44MyAxMzEuMTMgMTQ4LjY1IDEzMy4xNyAxNTIuMTcgQyAxMzQuMjkgMTU0LjY3IDEzMi41OCAxNTcuMDkgMTMxLjQyIDE1OS4yMSBDIDEyNy43NyAxNjUuMDQgMTI0LjY3IDE3MS44MiAxMTguNDEgMTc1LjMyIEMgMTE1Ljg0IDE3Ni4wNSAxMTEuODQgMTc1Ljg2IDExMC41NSAxNzMuMTAgQyAxMTEuNjcgMTY3LjUyIDExNC40NyAxNjIuMzggMTE2LjgwIDE1Ny4yMSBDIDExOC40NyAxNTMuMzkgMTIxLjY5IDE1MC40NyAxMjMuMDEgMTQ2LjUwIFoiLz48cGF0aCBkPSIgTSA5NS42NiAxNTcuMjkgQyA5Ny41NCAxNTYuODggOTkuMTMgMTU4LjAwIDEwMC42NCAxNTguOTMgQyAxMDAuMDMgMTYwLjE3IDk5Ljg0IDE2Mi4yMCA5Ny45NSAxNjEuOTUgQyA5NS41OCAxNjIuMTAgOTMuNjUgMTU5LjAxIDk1LjY2IDE1Ny4yOSBaIi8+PHBhdGggZD0iIE0gODIuNDggMTc0Ljk2IEMgODEuMDAgMTcyLjE4IDgwLjk0IDE2Ny4xOSA4NS4wNCAxNjcuMDAgQyA4NC45MSAxNjkuMDQgODMuNDQgMTcxLjMzIDg0LjgwIDE3My4yMSBDIDg3LjY1IDE3Ny42NyA5MS44NCAxODEuNTIgOTIuNjQgMTg3LjAyIEMgODguNTYgMTgzLjcwIDg1LjAwIDE3OS41OSA4Mi40OCAxNzQuOTYgWiIvPjxwYXRoIGQ9IiBNIDEyNS4xMiAxNzIuNzcgQyAxMjYuNDMgMTcyLjIyIDEyNy43NyAxNzEuNzUgMTI5LjEzIDE3MS4zNiBDIDEyOS42MCAxNzEuOTMgMTMwLjUzIDE3My4wNSAxMzEuMDAgMTczLjYyIEMgMTMwLjcxIDE3NC4zNCAxMzAuMTUgMTc1Ljc5IDEyOS44NiAxNzYuNTEgQyAxMzAuNTkgMTc2LjQ3IDEzMi4wNCAxNzYuMzkgMTMyLjc2IDE3Ni4zNSBDIDEzMS42MiAxNzYuODMgMTMwLjQ1IDE3Ny4yMyAxMjkuMjkgMTc3LjY1IEMgMTI5LjA0IDE3Ny4yNSAxMjguNTQgMTc2LjQ0IDEyOC4yOSAxNzYuMDQgQyAxMjcuNzAgMTc1Ljc4IDEyNi41MSAxNzUuMjYgMTI1LjkyIDE3NS4wMCBDIDEyNS43MiAxNzQuNDQgMTI1LjMyIDE3My4zMyAxMjUuMTIgMTcyLjc3IFoiLz48cGF0aCBkPSIgTSAxMDIuNTMgMTc0LjQ3IEMgMTAzLjg5IDE3NC41MiAxMDUuMjYgMTc0LjU5IDEwNi42MyAxNzQuNjkgQyAxMDYuODcgMTc2Ljg3IDEwNS44MyAxNzguNjMgMTA0LjAxIDE3OS43NSBDIDEwMy41MyAxNzcuOTggMTAzLjA0IDE3Ni4yMyAxMDIuNTMgMTc0LjQ3IFoiLz48cGF0aCBkPSIgTSAxMDguNzggMTc3LjU2IEMgMTA5LjgxIDE3Ny41MyAxMTAuODUgMTc3LjUxIDExMS44OSAxNzcuNDkgQyAxMTEuOTUgMTc5LjQwIDExMC42NCAxODAuMzcgMTA4Ljg3IDE4MC40OSBDIDEwOC44NSAxNzkuNTEgMTA4LjgyIDE3OC41NCAxMDguNzggMTc3LjU2IFoiLz48cGF0aCBkPSIgTSAxMjguNjggMTg5LjI0IEMgMTI5LjM4IDE4OS4yMCAxMzAuNzkgMTg5LjEwIDEzMS41MCAxODkuMDYgQyAxMzEuMzMgMTkxLjc1IDEyOS41MCAxOTQuNTAgMTI2LjY0IDE5NC43NSBDIDEyNy4zNiAxOTIuOTMgMTI4LjA1IDE5MS4xMCAxMjguNjggMTg5LjI0IFoiLz48cGF0aCBkPSIgTSAxMDkuNzEgMTk1LjUwIEMgMTEzLjU2IDE5MS4wOCAxMjAuMjQgMTkzLjcyIDEyNS4yNyAxOTIuMTIgQyAxMjQuNzkgMTkzLjc0IDEyMy43MCAxOTUuMjAgMTIxLjk1IDE5NS41MiBDIDExNy45MSAxOTYuMjggMTEzLjc4IDE5NS41MCAxMDkuNzEgMTk1LjUwIFoiLz48L2c+PGcgZmlsbD0iIzAwMjIzMyI+PHBhdGggZD0iIE0gMTExLjQ5IDc3LjAwIEMgMTEyLjk0IDc0LjA5IDExNS43NCA3MS43OSAxMTkuMTAgNzEuNzIgQyAxMjEuMjYgNzEuNzYgMTI0LjY4IDcxLjE2IDEyNS4zOCA3My45MyBDIDEyNC44MiA3NC45MCAxMjQuMTYgNzUuNzkgMTIzLjM4IDc2LjYxIEMgMTIxLjc1IDc1LjYwIDEyMC4yMCA3My44NiAxMTguMDggNzQuMjAgQyAxMTUuNzUgNzQuNzUgMTEzLjY4IDc2LjA2IDExMS40OSA3Ny4wMCBaIi8+PHBhdGggZD0iIE0gMTI3LjIzIDcyLjI5IEMgMTI5LjA4IDczLjg4IDEyOS4zOSA3Ni40NyAxMzAuNzkgNzguMzkgQyAxMzIuNDEgODEuMDAgMTM0LjEwIDg0LjQ1IDEzMi4zNSA4Ny40MSBDIDEzMS4zMiA4OS4zNiAxMjguOTYgOTAuMTcgMTI2Ljk1IDg5LjI4IEMgMTI0Ljk0IDgzLjY4IDEyNy4xMCA3Ny45OCAxMjcuMjMgNzIuMjkgWiIvPjxwYXRoIGQ9IiBNIDEyMy4xNiA5Mi4wMyBDIDEyNS4yMyA5MC42MiAxMjcuNTggOTIuMTUgMTI5LjU2IDkyLjkzIEMgMTI3LjczIDk1LjYxIDEyNS4wNCA5Ny41MiAxMjMuMDYgMTAwLjA1IEMgMTIxLjY1IDEwMy4yMyAxMjAuNTIgMTA2LjUzIDExOC43MiAxMDkuNTMgQyAxMTcuMzYgMTA5Ljc2IDExNi4wMCAxMDkuOTkgMTE0LjY0IDExMC4yMiBDIDExNC45NCAxMDMuMzIgMTE3Ljk3IDk2LjYwIDEyMy4xNiA5Mi4wMyBaIi8+PHBhdGggZD0iIE0gMTYzLjcwIDk3LjcxIEMgMTY2Ljg4IDk2LjAxIDE3MC42MyA5Ni4xNCAxNzQuMTQgOTYuMDcgQyAxNzIuNTYgOTguODIgMTcxLjM4IDEwMi42MSAxNjcuOTMgMTAzLjQ0IEMgMTY1LjY4IDEwMy43OSAxNjIuOTEgMTA0LjQyIDE2MS4wMiAxMDIuNzYgQyAxNTkuNzMgMTAwLjU4IDE2Mi4xNyA5OC44OSAxNjMuNzAgOTcuNzEgWiIvPjxwYXRoIGQ9IiBNIDE3NS42NiA5OS45OSBDIDE3Ni40MSA5OS4xNSAxNzcuMTkgOTguMzQgMTc4LjAwIDk3LjU3IEMgMTgyLjIzIDk5LjI1IDE4NC45MCAxMDUuNjMgMTgxLjQ2IDEwOS4yNCBDIDE4MS4yMyAxMDcuNDMgMTgxLjgxIDEwNS4yMCAxODAuMzUgMTAzLjc3IEMgMTc4LjkxIDEwMi4zNyAxNzcuMjQgMTAxLjIyIDE3NS42NiA5OS45OSBaIi8+PHBhdGggZD0iIE0gODkuNTcgMTAxLjg1IEMgOTQuMDUgMTAxLjk0IDk4LjQ4IDEwMC40NSAxMDIuOTQgMTAxLjA1IEMgMTA1LjE3IDEwMi4yNSAxMDQuNDYgMTA0Ljk5IDEwNC4yMiAxMDcuMDEgQyAxMDAuMzYgMTA5LjM2IDk0Ljk4IDEwOS42MyA5MS4zOSAxMDYuNjIgQyA4OS45NSAxMDUuNDYgODkuOTMgMTAzLjUwIDg5LjU3IDEwMS44NSBaIi8+PHBhdGggZD0iIE0gNzguNTkgMTA5LjM4IEMgNzkuMDYgMTA1Ljk1IDgxLjY5IDEwMy41NSA4NC44OSAxMDIuNTkgQyA4NS42MCAxMDMuNjcgODYuMzAgMTA0Ljc2IDg3LjAwIDEwNS44NSBDIDgzLjk4IDEwNi40NSA4MS4wMyAxMDcuNDQgNzguNTkgMTA5LjM4IFoiLz48cGF0aCBkPSIgTSAxNTkuMDMgMTA0LjUxIEMgMTYxLjIwIDEwNC43NiAxNjIuOTEgMTA2LjA0IDE2NC4wNiAxMDcuODQgQyAxNjMuMTkgMTEwLjk0IDE2Mi44NyAxMTQuMjkgMTYxLjA0IDExNy4wMyBDIDE1OS4wNCAxMjAuMTUgMTU2LjI1IDEyMi42NCAxNTMuNzEgMTI1LjMxIEMgMTUyLjI0IDEyNC42MiAxNTAuODMgMTIzLjgwIDE0OS41NiAxMjIuODAgQyAxNTQuODcgMTE4LjE2IDE1Ny4zMiAxMTEuMTYgMTU5LjAzIDEwNC41MSBaIi8+PHBhdGggZD0iIE0gMTAxLjU4IDEyMC4wNiBDIDEwMS4zMCAxMTUuMDcgMTAzLjkzIDExMC42MCAxMDcuNDIgMTA3LjI1IEMgMTA5LjU5IDExMC43OSAxMDguNDYgMTE1LjIwIDEwOC40NiAxMTkuMTIgQyAxMDguMjcgMTIyLjk3IDEwOC4wOSAxMjguNDggMTAzLjExIDEyOC45OCBDIDEwMC43NSAxMjYuNzkgMTAxLjg1IDEyMi45NyAxMDEuNTggMTIwLjA2IFoiLz48cGF0aCBkPSIgTSAxMTAuNjEgMTE4LjA5IEMgMTEwLjc1IDExNS44NSAxMTEuMjkgMTEzLjQ4IDExMi45OCAxMTEuODkgQyAxMTQuODggMTExLjYzIDExNi43MCAxMTIuNDggMTE4LjUyIDExMi45MSBDIDExOC4xNSAxMTcuNTkgMTE2LjI1IDEyMi40OSAxMTIuODEgMTI1Ljc4IEMgMTEwLjM0IDEyNC4wMiAxMTAuNTQgMTIwLjc4IDExMC42MSAxMTguMDkgWiIvPjxwYXRoIGQ9IiBNIDE0Ni44NiAxMjYuODYgQyAxNDkuMTAgMTI0LjU5IDE1Mi40NSAxMjYuOTMgMTU1LjExIDEyNy4wMiBDIDE1NC4xNCAxMzMuMTEgMTUwLjMwIDE0MC4yMyAxNDMuNjkgMTQxLjM4IEMgMTQ0LjI3IDEzNi40NiAxNDUuMjEgMTMxLjUyIDE0Ni44NiAxMjYuODYgWiIvPjxwYXRoIGQ9IiBNIDcyLjE1IDEzMC41OCBDIDc2LjgyIDEzMC4wOCA4MS42MyAxMjguNjUgODYuMzIgMTI5LjU5IEMgODkuMzkgMTMwLjM0IDg5LjI2IDEzNS4yNSA4NS45NSAxMzUuNTEgQyA4MC45MiAxMzUuOTIgNzUuOTQgMTMzLjc5IDcyLjE1IDEzMC41OCBaIi8+PHBhdGggZD0iIE0gOTEuNDQgMTMwLjU5IEMgOTYuNzAgMTMzLjcyIDk5LjIzIDE0MC4yNiA5OS40OSAxNDYuMTYgQyA5OC4yOSAxNDYuNDEgOTcuMTAgMTQ2LjY3IDk1LjkyIDE0Ni45NCBDIDkzLjAyIDE0Mi4wMCA5Mi4zOSAxMzYuMTQgOTEuNDQgMTMwLjU5IFoiLz48cGF0aCBkPSIgTSAxMDMuMDggMTMzLjA0IEMgMTA0LjM1IDEzMC45MiAxMDcuNTYgMTI5LjU4IDEwOS42NCAxMzEuMzQgQyAxMTEuMTAgMTMzLjYxIDExMS4yMSAxMzYuNDAgMTExLjY0IDEzOC45OSBDIDEwOS43NyAxNDAuMTggMTA4LjA3IDE0MS43MCAxMDUuOTcgMTQyLjQ5IEMgMTAzLjA1IDE0MC40NSAxMDEuNzYgMTM2LjM1IDEwMy4wOCAxMzMuMDQgWiIvPjxwYXRoIGQ9IiBNIDE2My4yNSAxMzIuMDIgQyAxNjUuOTcgMTMxLjg2IDE2OS4wNCAxMzIuMDMgMTcxLjIwIDEzMy45MCBDIDE3My41MCAxMzYuNTMgMTc0Ljc4IDEzOS44NiAxNzYuNTcgMTQyLjgzIEMgMTczLjAxIDE0NC4yNCAxNjguNjYgMTQ0LjAzIDE2Ni4xNCAxNDAuODIgQyAxNjMuNDAgMTM4LjcxIDE2My4xNSAxMzUuMjAgMTYzLjI1IDEzMi4wMiBaIi8+PHBhdGggZD0iIE0gNTguODMgMTQwLjA3IEMgNjAuOTIgMTM2LjM2IDY0LjIyIDEzMi42MyA2OC44NyAxMzIuNzQgQyA2OS4wNyAxMzMuMjAgNjkuNDkgMTM0LjEzIDY5LjcwIDEzNC42MCBDIDY1LjYyIDEzNS40MCA2Mi4xNSAxMzcuNzEgNTguODMgMTQwLjA3IFoiLz48cGF0aCBkPSIgTSAxNDUuNjIgMTQ0Ljc3IEMgMTUwLjcyIDE0MS4wMiAxNTUuODMgMTM3LjI0IDE2MS4yMCAxMzMuODcgQyAxNjEuNTEgMTM3Ljk2IDE1OS4yMyAxNDEuNjQgMTU2LjM0IDE0NC4zMyBDIDE1My4xMCAxNDcuMjkgMTQ5Ljk0IDE1MC40MCAxNDYuMTQgMTUyLjY2IEMgMTQ2LjQzIDE1MC4wNCAxNDUuMTEgMTQ3LjI0IDE0NS42MiAxNDQuNzcgWiIvPjxwYXRoIGQ9IiBNIDY4Ljk0IDE0OS4yNCBDIDc0LjM1IDE0OC4yMSA3OS4zOCAxNDMuNTggODUuMDggMTQ2LjI5IEMgODMuMjEgMTQ5LjYxIDgwLjYxIDE1Mi40MyA3OC40NCAxNTUuNTUgQyA3Ny4xNiAxNTcuMzUgNzUuNTUgMTU5LjQwIDczLjEzIDE1OS40NiBDIDcwLjQ2IDE1OC43OCA2Ny45MiAxNTYuOTQgNjUuMDYgMTU3LjU5IEMgNjIuNTAgMTU4LjAzIDYwLjAxIDE1OC43OSA1Ny40OCAxNTkuNDAgQyA2MC40NCAxNTUuMDkgNjUuNTIgMTUzLjExIDY4Ljk0IDE0OS4yNCBaIi8+PHBhdGggZD0iIE0gOTcuMTMgMTQ4LjM2IEMgOTguODggMTQ2LjQ4IDEwMS40NCAxNDUuNzEgMTAzLjkyIDE0NS40OCBDIDEwNC4wNSAxNDYuNTggMTA0LjMyIDE0OC43OCAxMDQuNDYgMTQ5Ljg4IEMgMTA0LjQ3IDE1MC4wNSAxMDQuNDkgMTUwLjQwIDEwNC41MCAxNTAuNTcgQyAxMDIuMTMgMTUzLjc1IDk3Ljc2IDE1MS43NiA5Ny4xMyAxNDguMzYgWiIvPjxwYXRoIGQ9IiBNIDEzNC4zOCAxNDcuNzcgQyAxMzcuNTYgMTQ2LjU2IDE0MS43MiAxNDQuMzkgMTQ0LjMyIDE0Ny44MSBDIDE0NC4yNiAxNDkuNTQgMTQ0LjIxIDE1MS4yOCAxNDQuMTcgMTUzLjAxIEMgMTQxLjkyIDE1NS4yNyAxMzguOTYgMTU2LjQ3IDEzNS45MiAxNTcuMjQgQyAxMzUuMzkgMTU0LjA5IDEzNC44NSAxNTAuOTMgMTM0LjM4IDE0Ny43NyBaIi8+PHBhdGggZD0iIE0gMTc2LjU4IDE0Ny41MCBDIDE3Ny41NSAxNDYuMzYgMTc4LjUyIDE0Ni4zMiAxNzkuNDkgMTQ3LjM2IEMgMTgwLjIzIDE1MC44NSAxNzkuOTAgMTU0LjYwIDE3Ny41MSAxNTcuMzkgQyAxNzguMzEgMTU0LjAzIDE3Ny4yNCAxNTAuNzYgMTc2LjU4IDE0Ny41MCBaIi8+PHBhdGggZD0iIE0gODYuNTUgMTQ3LjY5IEMgOTIuNTEgMTUxLjM4IDkyLjQ5IDE1OS4wMSA5My40MSAxNjUuMTUgQyA5Mi4zMiAxNjUuODYgOTEuMjYgMTY2LjY2IDkwLjA1IDE2Ny4xNiBDIDg4LjI5IDE2Ny41NyA4Ny4xNCAxNjYuMDAgODYuMTYgMTY0Ljg1IEMgODMuODAgMTYxLjcxIDgyLjM2IDE1OC4wMiA4MC40NyAxNTQuNjEgQyA4Mi42MiAxNTIuNDIgODUuMzIgMTUwLjYzIDg2LjU1IDE0Ny42OSBaIi8+PHBhdGggZD0iIE0gMTM4Ljk0IDE2Mi4xMiBDIDE0My4zMSAxNTkuNjQgMTQ4LjU4IDE1OC4yMyAxNTMuNTggMTU5LjM3IEMgMTQ5LjY0IDE2My4yNiAxNDMuOTcgMTY0LjI5IDEzOS42NiAxNjcuNjcgQyAxMzguNjcgMTY2LjA0IDEzNi41MyAxNjMuNTggMTM4Ljk0IDE2Mi4xMiBaIi8+PHBhdGggZD0iIE0gNTguMjIgMTYyLjE2IEMgNjEuNjQgMTU5LjU4IDY2LjU4IDE1OS43NCA3MC4zOSAxNjEuMzkgQyA3My42NyAxNjIuNzcgNzQuNDkgMTY2LjgwIDc0LjUwIDE2OS45OSBDIDczLjg0IDE3Ni41OSA3MS4xMyAxODIuODQgNjYuNzIgMTg3Ljc3IEMgNjUuMTEgMTk1Ljc3IDcwLjM2IDIwMy4wNiA3My43NCAyMDkuOTMgQyA2Ni4wNyAyMDUuNTYgNjcuMDMgMTk0LjE3IDU5LjMxIDE4OS43NCBDIDU0Ljc0IDE5OC43MCA1OC40OSAyMDguNzkgNTkuOTAgMjE4LjA1IEMgNTguNjggMjE2LjQ3IDU3LjI0IDIxNC45NSA1Ni44NCAyMTIuOTMgQyA1NC41OCAyMDQuMDYgNTIuNDggMTk1LjEyIDUxLjU4IDE4Ni4wMSBDIDUyLjA0IDE3Ny43NiA1My4yMyAxNjkuMDEgNTguMjIgMTYyLjE2IFoiLz48cGF0aCBkPSIgTSAxMjkuNTggMTY1LjE1IEMgMTMwLjY4IDE2My4yOSAxMzEuNzQgMTYxLjQxIDEzMi44MSAxNTkuNTQgQyAxMzQuMjcgMTYwLjUzIDEzNS43NSAxNjEuNTIgMTM3LjI4IDE2Mi40MSBDIDEzNy4yNiAxNjMuOTIgMTM3LjQ3IDE2NS40NyAxMzcuMDAgMTY2LjkzIEMgMTM0LjY1IDE2OC44OSAxMzAuOTggMTY3Ljc0IDEyOS41OCAxNjUuMTUgWiIvPjxwYXRoIGQ9IiBNIDE1My41MyAxNjcuNTYgQyAxNTEuNzMgMTYzLjY5IDE1Ny41MiAxNjAuODAgMTU5Ljc3IDE2NC4yOSBDIDE2MS4zOCAxNjguMTQgMTYzLjg1IDE3MS40NSAxNjYuNjcgMTc0LjQ5IEMgMTYyLjA1IDE3My4wNSAxNTYuMTAgMTcyLjE0IDE1My41MyAxNjcuNTYgWiIvPjxwYXRoIGQ9IiBNIDg5LjUxIDE3MS43OCBDIDkxLjI3IDE2OS4wNSA5My40NiAxNjUuNzUgOTcuMDYgMTY1LjYxIEMgOTkuMjYgMTY2LjQxIDk5LjQ4IDE2OC45MyA5OS4wNCAxNzAuOTEgQyA5Ny4yOCAxNzIuOTggOTQuNTQgMTczLjYxIDkyLjA0IDE3NC4zMCBDIDkxLjIwIDE3My40NiA5MC4zNiAxNzIuNjIgODkuNTEgMTcxLjc4IFoiLz48cGF0aCBkPSIgTSAxMzIuNzYgMTc2LjM1IEMgMTM1LjkxIDE3NC44MCAxMzkuMjQgMTczLjMxIDE0Mi44NCAxNzMuNzggQyAxNDIuNjUgMTc3LjA0IDE0Mi4yNSAxODAuMjkgMTQxLjg2IDE4My41MyBDIDEzNy40MiAxODQuMjkgMTMyLjk5IDE4NS4xNyAxMjguNjcgMTg2LjQzIEMgMTI1LjQ1IDE4NC41MSAxMjYuNTEgMTc5LjQxIDEyOS4yOSAxNzcuNjUgQyAxMzAuNDUgMTc3LjIzIDEzMS42MiAxNzYuODMgMTMyLjc2IDE3Ni4zNSBaIi8+PHBhdGggZD0iIE0gMTQ0LjczIDE3OC43MyBDIDE0NS4zOSAxNzcuMzMgMTQ3LjUxIDE3NC45NiAxNDguNzYgMTc3LjExIEMgMTUzLjA0IDE4My40NiAxNTQuNDUgMTkxLjQxIDE1NC4wOSAxOTguOTcgQyAxNTQuMzUgMjAwLjQ5IDE1My4zNyAyMDEuNTUgMTUyLjM0IDIwMi40OSBDIDE1MC43MiAxOTguNzAgMTQ4LjkzIDE5NC42NSAxNDQuODQgMTkzLjAwIEMgMTQyLjg3IDE4OC42MiAxNDIuNTkgMTgzLjExIDE0NC43MyAxNzguNzMgWiIvPjxwYXRoIGQ9IiBNIDEyMC4yNCAxNzguMTQgQyAxMjEuNjYgMTc2Ljg4IDEyMy41NiAxNzcuNjMgMTI1LjE5IDE3Ny44OCBDIDEyNi4xNSAxODEuMTcgMTI0LjcxIDE4NC40NyAxMjMuMjUgMTg3LjM4IEMgMTIxLjM2IDE4OC40NSAxMTkuNTAgMTg2LjQ5IDExNy43OCAxODUuODkgQyAxMTcuNjYgMTgzLjEyIDExNy44NSAxNzkuOTkgMTIwLjI0IDE3OC4xNCBaIi8+PHBhdGggZD0iIE0gMTY0LjcwIDE3OS43MyBDIDE2NS4xMSAxNzguNjIgMTY2LjAxIDE3OC4xMyAxNjcuMDggMTc4LjY5IEMgMTY5LjI1IDE4MC45NCAxNjkuNDQgMTg0LjIyIDE2OC44MyAxODcuMTIgQyAxNjcuMjQgMTg0Ljc5IDE2NS42NiAxODIuNDEgMTY0LjcwIDE3OS43MyBaIi8+PHBhdGggZD0iIE0gMTI4LjMxIDIwNS40MiBDIDEzMS41OCAxOTkuOTggMTM3LjY5IDE5Ni4yMSAxNDQuMDMgMTk1Ljg5IEMgMTQ5LjY5IDE5OC4xOCAxNTIuOTEgMjA1LjkzIDE0OS4zMSAyMTEuMjMgQyAxNDMuMjEgMjIwLjcyIDEzNC40NiAyMjguNjUgMTI0LjExIDIzMy4yNSBDIDExOS44MSAyMzUuMjcgMTE1LjkwIDIzOC40NiAxMTAuOTkgMjM4LjgzIEMgMTEzLjUyIDIzNi4wNCAxMTcuNTAgMjM1LjYzIDEyMC40NyAyMzMuNTAgQyAxMjQuMjUgMjMwLjc4IDEyNi44NCAyMjYuNzMgMTI4LjU2IDIyMi40NSBDIDEyMS43OCAyMTkuNDQgMTE1LjI5IDIyNC45NCAxMDguNDQgMjI0Ljc5IEMgMTEzLjM5IDIyMS4yNCAxMjAuMTkgMjIxLjAxIDEyNC43NCAyMTYuNzYgQyAxMjcuMDAgMjEzLjM5IDEyNi4xOSAyMDguODggMTI4LjMxIDIwNS40MiBaIi8+PC9nPjwvZz48L3N2Zz4='
    const lienBadge = `assets/img/gvalmont/top${this.top(user.classement)}.svg`
    let lienAvatar: string
    user.pseudo == 'anonyme' ? lienAvatar = 'assets/img/reshot/user-3294.svg' : lienAvatar = user.lienAvatar
    const style = `--image-avatar:url(${lienAvatar});--image-badge:url(${lienBadge});--image-equipe:url(${lienEquipe});`
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
        lienAvatar: 'https://avatars.dicebear.com/api/adventurer/topmaths.svg?scale=90&eyes=variant12&eyebrows=variant09&mouth=variant21&accessoires=glasses&accessoiresProbability=100&hair=long07&skinColor=variant03&hairColor=brown01',
        scores: 'actives',
        lastLogin: '',
        lastAction: '',
        visible: '',
        pseudo: 'Cerf sauvage',
        score: '196',
        codeTrophees: 'tuoocj',
        tropheesVisibles: '',
        cleScore: 'abc',
        classement: 9,
        teamName: 'PUF',
        scoreEquipe: 0
      }
      this.setToken('identifiant', this.user.identifiant)
      this.setToken('version', this.derniereVersionToken)
      this.isloggedIn = true
      this.profilModifie.emit([
        'identifiant',
        'lienAvatar',
        'scores',
        'lastLogin',
        'lastAction',
        'visible',
        'pseudo',
        'score',
        'codeTrophees',
        'tropheesVisibles'])
    } else {
      let loginPage: string
      secure ? loginPage = '/login.php' : loginPage = '/autologin.php'
      this.http.post<User[]>(this.baseUrl + loginPage, { identifiant: identifiant }).subscribe(users => {
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
            'scores',
            'lastLogin',
            'lastAction',
            'visible',
            'pseudo',
            'score',
            'codeTrophees',
            'tropheesVisibles'])
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
    this.http.post<User[]>(this.baseUrl + '/securelogin.php', { identifiant: this.user.identifiant, secureIdentifiant: secureIdentifiant }).subscribe(users => {
      if (users[0].identifiant == 'personne') {
        window.frames.postMessage({ retourSecureLogin: 'erreur', donnees: donnees, origineDemande: origineDemande }, this.origine)
      } else if (users[0].identifiant == 'different') {
        window.frames.postMessage({ retourSecureLogin: 'different', donnees: donnees, origineDemande: origineDemande }, this.origine)
      } else {
        window.frames.postMessage({ retourSecureLogin: secureIdentifiant, donnees: donnees, origineDemande: origineDemande }, this.origine)
      }
    },
      error => {
        window.frames.postMessage({ retourSecureLogin: 'erreur', donnees: donnees, origineDemande: origineDemande }, this.origine)
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
        lienAvatar: `https://avatars.dicebear.com/api/adventurer/${identifiant}.svg`,
        scores: '',
        lastLogin: '',
        lastAction: '',
        visible: '',
        pseudo: this.pseudoAleatoire(),
        score: '0',
        codeTrophees: '',
        tropheesVisibles: '',
        cleScore: '',
        classement: 0,
        teamName: '',
        scoreEquipe: 0
      }
      this.http.post<User[]>(this.baseUrl + '/register.php', user).subscribe(users => {
        this.isloggedIn = true
        this.setToken('identifiant', users[0].identifiant);
        this.setToken('version', this.derniereVersionToken);
        this.user = users[0]
        this.profilModifie.emit([
          'identifiant',
          'lienAvatar',
          'scores',
          'lastLogin',
          'lastAction',
          'visible',
          'pseudo',
          'score',
          'codeTrophees',
          'tropheesVisibles'])
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
    this.http.post<Equipe[]>(`${this.baseUrl}/${creationOuModification}Equipe.php`, {
      teamName: teamName, lienEmbleme: lienEmbleme, codeEquipe: this.infosEquipe.codeEquipe,
      foregroundId: foregroundId, foregroundPrimaryColor: foregroundPrimaryColor, foregroundSecondaryColor: foregroundSecondaryColor,
      backgroundId: backgroundId, backgroundColor: backgroundColor, leader: identifiant
    }).subscribe(equipes => {
      this.equipe = equipes[0]
      if (this.equipe.teamName == 'personne') console.log('Aucune équipe avec ce codeEquipe ?')
      else if (this.equipe.teamName == 'existe_deja') {
        window.frames.postMessage({ retourCreationEquipe: 'existe_deja' }, this.origine)
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
    this.http.post<Equipe[]>(`${this.baseUrl}/getEquipe.php`, { codeEquipe: this.infosEquipe.codeEquipe, leader: this.user.id }).subscribe(equipes => {
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
   * Modifie le lienAvatar dans la bdd
   * @param lienAvatar 
   */
  majAvatar(lienAvatar: string) {
    this.user.lienAvatar = lienAvatar
    this.majProfil(['lienAvatar'])
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
   */
  majScore(score: string, url: string) {
    if (isDevMode()) {
      this.profilModifie.emit(['score'])
    } else {
      this.http.post<User[]>(this.baseUrl + `/majScore.php`, {
        identifiant: this.user.identifiant,
        score: (parseInt(this.user.score) + parseInt(score)).toString(),
        cleScore: this.user.cleScore,
        url: url,
        teamName: this.user.teamName
      }).subscribe(
        users => {
          console.log(users[0])
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
   * Modifie le token lienAvatar et le lienAvatar dans la bdd
   * @param scores peut être 'actives' ou 'desactives'
   */
  majScores(scores: string) {
    this.user.scores = scores
    this.majProfil(['scores'])
  }

  /**
   * Modifie la date de dernière action
   * Met à jour la liste d'utilisateurs en ligne et leur nombre
   */
  majLastAction() {
    if (isDevMode()) {
      this.onlineNb = 2
      this.onlineUsers = [
        {
          id: 1,
          lienAvatar: 'https://avatars.dicebear.com/api/adventurer/id1.svg',
          pseudo: 'lapin bleu',
          score: '17',
          lienTrophees: '',
          classement: 2,
          teamName: '',
          scoreEquipe: 0
        }, {
          id: 2,
          lienAvatar: 'https://avatars.dicebear.com/api/adventurer/id2.svg',
          pseudo: 'Pierre verte',
          score: '38',
          lienTrophees: '',
          classement: 1,
          teamName: '',
          scoreEquipe: 0
        }
      ]
    } else {
      if (typeof (this.user.identifiant) != 'undefined' && this.user.identifiant != '') {
        this.http.post<UserSimplifie[]>(this.baseUrl + `/actionUtilisateur.php`, { identifiant: this.user.identifiant }).subscribe(userSimplifies => {
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
      this.user = new User(0, '', '', '', '', '', '', '', '', '', '', '', 0, '', 0)
      this.isloggedIn = false
      this.profilModifie.emit([
        'identifiant',
        'lienAvatar',
        'scores',
        'lastLogin',
        'lastAction',
        'visible',
        'pseudo',
        'score',
        'codeTrophees',
        'tropheesVisibles'])
      this.router.navigate(['accueil'])
    } else {
      this.http.post(this.baseUrl + `/logout.php`, this.user).subscribe(
        data => {
          this.deleteToken('identifiant')
          this.deleteToken('version')
          this.user = new User(0, '', '', '', '', '', '', '', '', '', '', '', 0, '', 0)
          this.isloggedIn = false
          this.profilModifie.emit([
            'identifiant',
            'lienAvatar',
            'scores',
            'lastLogin',
            'lastAction',
            'visible',
            'pseudo',
            'score',
            'codeTrophees',
            'tropheesVisibles'])
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
    this.http.post<Message>(this.baseUrl + `/envoiMailEval.php`, { codeTrophee: codeTrophee, sujetEval: sujetEval }).pipe(first()).subscribe(
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
      this.http.post<User[]>(this.baseUrl + `/majProfil.php`, this.user).subscribe(
        users => {
          console.log(users[0])
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
    this.http.post<Trophee5e | Trophee4e>(this.baseUrl + `/trophees.php`, { lienTrophees: lienTrophees, codeTrophees: codeTrophees }).subscribe(
      trophees => {
        if (codeTrophees != '' && lienTrophees == '') {
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
    const origine = this.origine
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
}