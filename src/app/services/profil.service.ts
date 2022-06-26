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
  @Output() profilMAJ: EventEmitter<string[]> = new EventEmitter()

  redirectUrl: string
  isloggedIn: boolean
  user: User
  derniereVersionToken: string
  lienAvatar: string

  // eslint-disable-next-line no-unused-vars
  constructor (public httpClient: HttpClient, private router: Router, private outils: OutilsService, private dataService: DataService, private storageService: StorageService) {
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
    this.derniereVersionToken = '3'
    this.lienAvatar = ''
    this.MAJLienAvatar()
  }

  MAJLienAvatar () {
    this.profilMAJ.subscribe(valeursModifiees => {
      if (valeursModifiees.includes('codeAvatar')) {
        this.lienAvatar = this.getLienAvatar(this.user)
      }
    })
  }

  getLienAvatar (user: User) {
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

  login (identifiant: string, connexionAutomatique: boolean, redirection?: boolean) {
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
      this.stockerInfosUtilisateur()
    } else {
      let loginPage: string
      connexionAutomatique ? loginPage = 'autologin.php' : loginPage = 'login.php'
      this.httpClient.post<User[]>(GlobalConstants.API_URL + loginPage, { identifiant: identifiant }).subscribe(users => {
        if (users[0].identifiant === 'personne') {
          if (connexionAutomatique) {
            console.log('la connexion automatique a échoué')
          } else {
            console.log('identifiant non trouvé, on en crée un nouveau')
            this.inscrireNouvelUtilisateur(identifiant)
          }
        } else {
          this.user = users[0]
          this.stockerInfosUtilisateur()
          if (redirection) {
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

  stockerInfosUtilisateur () {
    this.storageService.set('identifiant', this.user.identifiant)
    this.storageService.set('version', this.derniereVersionToken)
    this.isloggedIn = true
    this.profilMAJ.emit([
      'identifiant',
      'codeAvatar',
      'lastLogin',
      'lastAction',
      'pseudo',
      'derniereSequence',
      'dernierObjectif'])
  }

  inscrireNouvelUtilisateur (identifiant: string) {
    if (identifiant.length > 5 || identifiant.length < 4) {
      this.alerterErreurInscription('longueur')
    } else if (!this.outils.estAlphanumerique(identifiant)) {
      this.alerterErreurInscription('caracteresSpeciaux')
    } else {
      const user: User = {
        id: 0,
        identifiant: identifiant,
        codeAvatar: '',
        lastLogin: '',
        pseudo: this.tirerUnPseudoAleatoire(true),
        derniereSequence: '',
        dernierObjectif: ''
      }
      this.httpClient.post<User[]>(GlobalConstants.API_URL + 'register.php', user).subscribe(users => {
        this.user = users[0]
        this.stockerInfosUtilisateur()
        this.router.navigate(['profil'])
      }, error => {
        console.log(error)
        this.alerterErreurInscription('baseDeDonnees', error['message'])
      })
    }
  }

  alerterErreurInscription (typeErreur?: string, erreur?: string) {
    if (typeErreur === 'longueur') {
      alert('Erreur : l\'identifiant doit comporter 4 ou 5 caractères !')
    } else if (typeErreur === 'caracteresSpeciaux') {
      alert('Erreur : tu ne dois utiliser que des chiffres et des lettres sans accent')
    } else if (typeErreur === 'baseDeDonnees') {
      alert('Une erreur s\'est produite lors de l\'accès à la base de données.\n\nLe message d\'erreur est le suivant :\n' + erreur)
    } else {
      alert('Une erreur s\'est produite')
    }
  }

  MAJAvatar (avatarSVG: string, codeAvatar: string) {
    this.user.codeAvatar = codeAvatar
    if (isDevMode() || !this.isloggedIn) {
      this.profilMAJ.emit(['codeAvatar'])
    } else {
      this.httpClient.post<User[]>(GlobalConstants.API_URL + 'majAvatar.php', { identifiant: this.user.identifiant, codeAvatar: this.user.codeAvatar, avatarSVG: avatarSVG }).subscribe(
        () => {
          this.profilMAJ.emit(['codeAvatar'])
        },
        error => {
          console.log(error)
        })
    }
  }

  logout () {
    this.storageService.delete('identifiant')
    this.storageService.delete('version')
    this.user = new User(0, '', '', '', '', '', '')
    this.isloggedIn = false
    this.profilMAJ.emit([
      'identifiant',
      'codeAvatar',
      'lastLogin',
      'lastAction',
      'pseudo',
      'derniereSequence',
      'dernierObjectif'])
    this.router.navigate(['accueil'])
  }

  majProfil (valeursModifiees: string[]) {
    if (isDevMode() || !this.isloggedIn) {
      this.profilMAJ.emit(valeursModifiees)
    } else {
      this.httpClient.post<User[]>(GlobalConstants.API_URL + 'majProfil.php', this.user).subscribe(
        () => {
          this.profilMAJ.emit(valeursModifiees)
        },
        error => {
          console.log(error)
        })
    }
  }

  tirerUnPseudoAleatoire (estFeminin: boolean) {
    if (estFeminin) {
      const nom = this.dataService.listeFeminins[Math.floor(Math.random() * this.dataService.listeFeminins.length)].nom
      const adjectif = this.dataService.listeAdjectifs[Math.floor(Math.random() * this.dataService.listeAdjectifs.length)].feminin
      return nom + ' ' + adjectif
    } else {
      const nom = this.dataService.listeMasculins[Math.floor(Math.random() * this.dataService.listeMasculins.length)].nom
      const adjectif = this.dataService.listeAdjectifs[Math.floor(Math.random() * this.dataService.listeAdjectifs.length)].masculin
      return nom + ' ' + adjectif
    }
  }

  MAJIsLoggedIn () {
    const usertoken = this.storageService.get('identifiant')
    const version = this.storageService.get('version')
    if (usertoken !== null && version === this.derniereVersionToken) {
      this.isloggedIn = true
    } else {
      this.isloggedIn = false
    }
  }

  isInputOk (input: string) {
    let defaut = true
    let errSpChar = false
    let errPetitNbChar = false
    let errGrandNbChar = false
    if (input.length !== 0) defaut = false
    if (input.length < 4 && input.length !== 0) errPetitNbChar = true
    if (input.length > 5) errGrandNbChar = true
    if (!this.outils.estAlphanumerique(input)) errSpChar = true
    return (!defaut && !errSpChar && !errPetitNbChar && !errGrandNbChar)
  }
}