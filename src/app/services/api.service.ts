import { Injectable, Output, EventEmitter, isDevMode } from '@angular/core';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User, UserSimplifie } from './user';
import { Router } from '@angular/router';
import { Trophee4e, Trophee5e } from './trophees';

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
  redirectUrl: string = ''
  baseUrl: string = "https://beta.topmaths.fr/api";
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

  @Output() profilModifie: EventEmitter<string[]> = new EventEmitter();
  constructor(private http: HttpClient, private router: Router) {
    this.user = {
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
      equipe: ''
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
    this.surveilleModificationsDuProfil()
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
          id: '1',
          lienAvatar: 'https://avatars.dicebear.com/api/adventurer/id1.svg',
          pseudo: 'lapin bleu',
          score: '17',
          lienTrophees: 'tcqnfy',
          classement: 2,
          equipe: ''
        }, {
          id: '2',
          lienAvatar: '',
          pseudo: 'anonyme',
          score: '38',
          lienTrophees: 'tuoocj',
          classement: 1,
          equipe: ''
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
   * Récupère dans la base de données la liste des utilisateurs ayant été actifs au cours des 10 dernières minutes
   * ainsi que le nombre d'utilisateurs désirant rester invisibles
   */
  recupWhosOnline() {
    if (isDevMode()) {
      this.onlineUsers = [
        {
          id: '1',
          lienAvatar: 'https://avatars.dicebear.com/api/adventurer/id1.svg',
          pseudo: 'lapin bleu',
          score: '17',
          lienTrophees: 'tuoocj',
          classement: 2,
          equipe: ''
        }, {
          id: '2',
          lienAvatar: 'https://avatars.dicebear.com/api/adventurer/id2.svg',
          pseudo: 'Pierre verte',
          score: '38',
          lienTrophees: 'tuoocj',
          classement: 1,
          equipe: ''
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
  getStyleAvatar(user: User| UserSimplifie) {
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
        equipe: ''
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
      secure ? loginPage = '/securelogin.php' : loginPage = '/autologin.php'
      this.http.post<User[]>(this.baseUrl + loginPage, { identifiant }).subscribe(users => {
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
        });
    }
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
        equipe: ''
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
  creationEquipe(teamName: string, lienImage: string,
    foregroundId: number, foregroundPrimaryColor: string, foregroundSecondaryColor: string,
    backgroundId: number, backgroundColor: string){

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
        url: url
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
          id: '1',
          lienAvatar: 'https://avatars.dicebear.com/api/adventurer/id1.svg',
          pseudo: 'lapin bleu',
          score: '17',
          lienTrophees: '',
          classement: 2,
          equipe: ''
        }, {
          id: '2',
          lienAvatar: 'https://avatars.dicebear.com/api/adventurer/id2.svg',
          pseudo: 'Pierre verte',
          score: '38',
          lienTrophees: '',
          classement: 1,
          equipe: ''
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
      this.user = new User('', '', '', '', '', '', '', '', '', '', '', 0, '')
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
          this.user = new User('', '', '', '', '', '', '', '', '', '', '', 0, '')
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
}