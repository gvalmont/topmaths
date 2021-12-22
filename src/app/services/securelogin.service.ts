import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SecureloginService {
  div!: HTMLElement
  dateDerniereReponse: Date;
  constructor(private dataService: ApiService) {
    this.dateDerniereReponse = new Date()
  }

  /**
   * Ouvre une modale qui demande à l'utilisateur de s'authentifier à nouveau,
   * si l'authentification est incorrecte (d'un point de vue client ou serveur), prévient secoue le champ
   * si l'authentification est correcte d'un point de vue client, demande le point de vue serveur avec this.dataService.secureLogin(identifiant)
   * 
   * À tout moment, si l'utilisateur clique sur le fond ou la croix, détruit la modale
   * @param data données à transmettre
   */
  login(data: object) {
    const origine = this.dataService.origine
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
            window.frames.postMessage({ secureLogin: champSecureLogin.value, donnees: data }, origine)
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
    const divListenerExistant = document.getElementById('secureLoginListener')
    if (divListenerExistant == null) {
      const divListener = document.createElement('div')
      divListener.id = 'secureLoginListener'
      document.body.appendChild(divListener)
      window.addEventListener('message', (event) => {
        const dateNouvelleReponse = new Date()
        if (dateNouvelleReponse.getTime() - this.dateDerniereReponse.getTime() > 200) {
          // Tentative de connexion
          const identifiant = event.data.secureLogin
          const donnees = event.data.donnees
          if (typeof (identifiant) != 'undefined') {
            if (this.inputOk(identifiant)) { // On envoie la demande si l'input passe les tests clients
              this.dataService.secureLogin(identifiant, donnees)
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
    if (!this.dataService.onlyLettersAndNumbers(input)) errSpChar = true
    return (!defaut && !errSpChar && !errPetitNbChar && !errGrandNbChar)
  }
}
