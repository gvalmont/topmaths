import { Injectable, Output, EventEmitter, isDevMode } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { User } from './modeles/user'
import { Router } from '@angular/router'
import { GlobalConstants } from './modeles/global-constants'
import { OutilsService } from './outils.service'
import { DataService } from './data.service'
import { StorageService } from './storage.service'

@Injectable({
  providedIn: 'root'
})

export class ProfilService {
  @Output() profilModifie: EventEmitter<string[]> = new EventEmitter()

  redirectUrl: string
  isloggedIn: boolean
  user: User
  derniereVersionToken: string
  lienAvatar: string

  // eslint-disable-next-line no-unused-vars
  constructor(public httpClient: HttpClient, private router: Router, private outils: OutilsService, private dataService: DataService, private storageService: StorageService) {
    this.redirectUrl = ''
    this.user = {
      id: 0,
      identifiant: '',
      codeAvatar: '',
      lastLogin: '',
      pseudo: '',
      derniereSequence: '',
      dernierObjectif: ''
    }
    this.isloggedIn = false
    this.derniereVersionToken = '2'
    this.lienAvatar = ''
    this.MAJLienAvatar()
  }

  MAJLienAvatar() {
    this.profilModifie.subscribe(valeursModifiees => {
      if (valeursModifiees.includes('codeAvatar')) {
        this.lienAvatar = this.getLienAvatar(this.user)
      }
    })
  }

  /**
   * Si l'utilisateur n'a pas de codeAvatar, renvoie le lien vers l'icone de base
   * Sinon, épure le codeAvatar et renvoie le lien vers son avatar (avec un ?user.codeAvatar épuré pour signaler une mise à jour et forcer le retéléchargement)
   * @param user
   * @returns lienAvatar
   */
  getLienAvatar(user: User) {
    let lienAvatar: string
    if (user.codeAvatar === undefined || user.codeAvatar === '') {
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
   * Envoie l'identifiant par message post à login.php pour s'identifier
   * Si pas connecté, on renvoie vers erreurLogin pour tenter de créer l'identifiant.
   * Si connecté :
   * - Met à jour le lastLogin
   * - Crée/modifie un token dans le localstorage avec l'identifiant du premier utilisateur correspondant dans la bdd
   * - Fire un event pour prévenir de la connexion
   * - Redirige vers la page qu'on a voulu accéder ou vers la page profil.
   * @param identifiant identifiant à chercher dans la bdd
   * @param auto true si connexion automatique, true si l'utilisateur saisit son identifiant
   * @param redigire true s'il y a une redirection à faire, false sinon
   */
  login(identifiant: string, auto: boolean, redirige?: boolean) {
    if (isDevMode()) {
      this.user = {
        id: 1,
        identifiant: 'X',
        codeAvatar: '',
        lastLogin: '',
        pseudo: 'Cerf sauvage',
        derniereSequence: 'S4S5!Séquence 5 :<br>Théorème de Pythagore',
        dernierObjectif: '4G20!4G20 : Calculer une longueur avec le théorème de Pythagore'
      }
      this.storageService.setToken('identifiant', this.user.identifiant)
      this.storageService.setToken('version', this.derniereVersionToken)
      this.isloggedIn = true
      this.profilModifie.emit([
        'identifiant',
        'codeAvatar',
        'lastLogin',
        'lastAction',
        'pseudo',
        'derniereSequence',
        'dernierObjectif'])
    } else {
      let loginPage: string
      auto ? loginPage = 'autologin.php' : loginPage = 'login.php'
      this.httpClient.post<User[]>(GlobalConstants.API_URL + loginPage, { identifiant: identifiant }).subscribe(users => {
        if (users[0].identifiant === 'personne') {
          console.log('identifiant non trouvé, on en crée un nouveau')
          this.registration(identifiant)
        } else {
          this.isloggedIn = true
          this.storageService.setToken('identifiant', users[0].identifiant)
          this.storageService.setToken('version', this.derniereVersionToken)
          this.user = users[0]
          this.profilModifie.emit([
            'identifiant',
            'codeAvatar',
            'lastLogin',
            'lastAction',
            'pseudo',
            'derniereSequence',
            'dernierObjectif'])
          if (redirige) {
            const redirect = this.redirectUrl ? this.redirectUrl : 'profil'
            this.router.navigate([redirect])
          }
        }
      },
      error => {
        console.log(error)
      })
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
    } else if (!this.outils.onlyLettersAndNumbers(identifiant)) {
      this.erreurRegistration('caracteres_speciaux')
    } else {
      const user: User = {
        id: 0,
        identifiant: identifiant,
        codeAvatar: '',
        lastLogin: '',
        pseudo: this.tirerUnPseudoAleatoire(),
        derniereSequence: '',
        dernierObjectif: ''
      }
      this.httpClient.post<User[]>(GlobalConstants.API_URL + 'register.php', user).subscribe(users => {
        this.isloggedIn = true
        this.storageService.setToken('identifiant', users[0].identifiant)
        this.storageService.setToken('version', this.derniereVersionToken)
        this.user = users[0]
        this.profilModifie.emit([
          'identifiant',
          'codeAvatar',
          'lastLogin',
          'lastAction',
          'pseudo',
          'derniereSequence',
          'dernierObjectif'])
        this.router.navigate(['profil'])
      }, error => {
        console.log(error)
        this.erreurRegistration('userregistration', error['message'])
      })
    }
  }

  /**
   * Signale à l'utilisateur un problème dans l'enregistrement d'un nouvel identifiant
   * @param typeErreur chaine de caractères
   * @param erreur objet erreur
   */
  erreurRegistration(typeErreur?: string, erreur?: any) {
    if (typeErreur === 'longueur') {
      alert('Erreur : l\'identifiant doit comporter 4 ou 5 caractères !')
    } else if (typeErreur === 'caracteres_speciaux') {
      alert('Erreur : tu ne dois utiliser que des chiffres et des lettres sans accent')
    } else if (typeErreur === 'userregistration') {
      alert('Une erreur s\'est produite lors de l\'accès à la base de données (peut-être que la connexion n\'est pas sécurisée ? (https)\n\nLe message d\'erreur est le suivant :\n' + erreur)
    } else {
      alert('Une erreur s\'est produite')
    }
  }

  /**
   * Modifie le codeAvatar dans la bdd et écrit le svg
   * @param avatarSVG
   * @param codeAvatar
   */
  MAJAvatar(avatarSVG: string, codeAvatar: string) {
    this.user.codeAvatar = codeAvatar
    if (isDevMode()) {
      this.profilModifie.emit(['codeAvatar'])
    } else {
      this.httpClient.post<User[]>(GlobalConstants.API_URL + 'majAvatar.php', { identifiant: this.user.identifiant, codeAvatar: this.user.codeAvatar, avatarSVG: avatarSVG }).subscribe(
        () => {
          this.profilModifie.emit(['codeAvatar'])
        },
        error => {
          console.log(error)
        })
    }
  }

  /**
   * Supprime le token de clé 'identifiant' utilisé pour vérifier si l'utilisateur est connecté.
   * Supprime aussi le token de clé 'codeAvatar'
   * Toggle les profilbtn et loginbtn.
   * Renvoie vers l'accueil.
   */
  logout() {
    this.storageService.deleteToken('identifiant')
    this.storageService.deleteToken('version')
    this.user = new User(0, '', '', '', '', '', '')
    this.isloggedIn = false
    this.profilModifie.emit([
      'identifiant',
      'codeAvatar',
      'lastLogin',
      'lastAction',
      'pseudo',
      'derniereSequence',
      'dernierObjectif'])
    this.router.navigate(['accueil'])
  }

  /**
   * Met à jour le profil de l'utilisateur
   */
  majProfil(valeursModifiees: string[]) {
    if (isDevMode()) {
      this.profilModifie.emit(valeursModifiees)
    } else {
      this.httpClient.post<User[]>(GlobalConstants.API_URL + 'majProfil.php', this.user).subscribe(
        () => {
          this.profilModifie.emit(valeursModifiees)
        },
        error => {
          console.log(error)
        })
    }
  }

  /**
   * Met à jour this.feminin
   * @param feminin boolean
   */
  majFeminin(feminin: boolean) {
    this.dataService.feminin = feminin
  }

  /**
   * Crée un pseudo aléatoire en mélangeant un nom et un adjectif au hasard
   * @returns pseudo
   */
  tirerUnPseudoAleatoire() {
    if (this.dataService.feminin) {
      const nom = this.dataService.listeFeminins[Math.floor(Math.random() * this.dataService.listeFeminins.length)].nom
      const adjectif = this.dataService.listeAdjectifs[Math.floor(Math.random() * this.dataService.listeAdjectifs.length)].feminin
      return nom + ' ' + adjectif
    } else {
      const nom = this.dataService.listeMasculins[Math.floor(Math.random() * this.dataService.listeMasculins.length)].nom
      const adjectif = this.dataService.listeAdjectifs[Math.floor(Math.random() * this.dataService.listeAdjectifs.length)].masculin
      return nom + ' ' + adjectif
    }
  }

  /**
   * Vérifie si l'utilisateur est connecté en vérifiant la présence d'un token qui a pour clé 'identifiant'
   * Si on en trouve un, renvoie true
   * Sinon, renvoie false
   * @returns boolean
   */
  checkLoggedIn() {
    const usertoken = this.storageService.getToken('identifiant')
    const version = this.storageService.getToken('version')
    if (usertoken !== null && version === this.derniereVersionToken) {
      this.isloggedIn = true
    } else {
      this.isloggedIn = false
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
    if (input.length !== 0) defaut = false
    if (input.length < 4 && input.length !== 0) errPetitNbChar = true
    if (input.length > 5) errGrandNbChar = true
    if (!this.outils.onlyLettersAndNumbers(input)) errSpChar = true
    return (!defaut && !errSpChar && !errPetitNbChar && !errGrandNbChar)
  }
}