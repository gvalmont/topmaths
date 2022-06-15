import { Injectable, Output, EventEmitter, isDevMode } from '@angular/core';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User, UserSimplifie } from './user';
import { Router } from '@angular/router';
import { GlobalConstants } from './global-constants';

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

  redirectUrl: string
  isloggedIn: boolean
  user: User
  feminin: boolean
  listeMasculins: Nom[]
  listeFeminins: Nom[]
  listeAdjectifs: Adjectif[]
  pseudoClique: string
  ancienPseudoClique: string
  derniereVersionToken: string
  dateDerniereReponse: Date
  div!: HTMLElement
  lienAvatar: string
  styleAvatar: string

  constructor(public http: HttpClient, private router: Router) {
    this.redirectUrl = ''
    this.user = {
      id: 0,
      identifiant: '',
      codeAvatar: '',
      lastLogin: '',
      pseudo: '',
      score: 0,
      cleScore: '',
      derniereSequence: '',
      dernierObjectif: '',
      question: 0
    }
    this.feminin = false
    this.pseudoClique = ''
    this.ancienPseudoClique = ''
    this.listeMasculins = []
    this.listeFeminins = []
    this.listeAdjectifs = []
    this.isloggedIn = false
    this.derniereVersionToken = '2'
    this.dateDerniereReponse = new Date()
    this.lienAvatar = ''
    this.styleAvatar = ''
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
      if (valeursModifiees.includes('lienAvatar')) {
        this.lienAvatar = this.getLienAvatar(this.user)
        this.styleAvatar = this.getStyleAvatar(this.user)
      }
    })
  }

  /**
   * Si l'utilisateur choisit de rester anonyme ou qu'il n'a pas de codeAvatar, renvoie le lien vers l'icone de base
   * Sinon, épure le codeAvatar et renvoie le lien vers son avatar (avec un ?user.codeAvatar épuré pour signaler une mise à jour et forcer le retéléchargement)
   * @param user 
   * @returns 
   */
  getLienAvatar(user: User | UserSimplifie) {
    let lienAvatar: string
    if (user.pseudo == 'anonyme') {
      lienAvatar = 'assets/img/reshot/user-3294.svg'
    } else if (user.codeAvatar == null || user.codeAvatar == '') {
      if (user.lienAvatar != null && user.lienAvatar != '') {
        lienAvatar = user.lienAvatar
      } else {
        lienAvatar = 'assets/img/reshot/user-3294.svg'
      }
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
   * Renvoie un style de css qui permet d'afficher un avatar et l'emblème de son équipe
   */
  getStyleAvatar(user: User | UserSimplifie) {
    let style = `--image-avatar:url('${this.getLienAvatar(user)}');`
    return <string>style
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
        id: 1,
        identifiant: 'X',
        codeAvatar: '',
        lastLogin: '',
        pseudo: 'Cerf sauvage',
        score: 196,
        cleScore: 'abc',
        derniereSequence: 'S4S5!Séquence 5 :<br>Théorème de Pythagore',
        dernierObjectif: '4G20!4G20 : Calculer une longueur avec le théorème de Pythagore',
        question: 0
      }
      this.setToken('identifiant', this.user.identifiant)
      this.setToken('version', this.derniereVersionToken)
      this.isloggedIn = true
      this.profilModifie.emit([
        'identifiant',
        'lienAvatar',
        'lastLogin',
        'lastAction',
        'pseudo',
        'score',
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
            'pseudo',
            'score',
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
        pseudo: this.pseudoAleatoire(),
        score: 0,
        cleScore: '',
        derniereSequence: '',
        dernierObjectif: '',
        question: 0
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
          'pseudo',
          'score',
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
   * @param type de l'exercice '' ou 'tranquille'
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
   * Supprime le token de clé 'identifiant' utilisé pour vérifier si l'utilisateur est connecté.
   * Supprime aussi le token de clé 'lienAvatar'
   * Toggle les profilbtn et loginbtn.
   * Renvoie vers l'accueil.
   */
  logout() {
    this.deleteToken('identifiant')
    this.deleteToken('version')
    this.user = new User(0, '', '', '', '', 0, '', '', '', 0)
    this.isloggedIn = false
    this.profilModifie.emit([
      'identifiant',
      'lienAvatar',
      'lastLogin',
      'lastAction',
      'pseudo',
      'score',
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