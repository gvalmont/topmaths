import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ConfettiService } from '../services/confetti.service';
import { GlobalConstants } from '../services/global-constants';
import { Niveau as NiveauObjectif } from '../services/objectifs';
import { Niveau as NiveauSequence } from '../services/sequences';

interface Exercice {
  lien: string
  score: number
}

@Component({
  selector: 'app-modale-exercices',
  templateUrl: './modale-exercices.component.html',
  styleUrls: ['./modale-exercices.component.css']
})
export class ModaleExercicesComponent implements OnInit {
  @Input() infosModale: [string[], string, Date]
  @Output() modaleFermee = new EventEmitter<boolean>();
  modale!: HTMLElement
  modaleUrl!: HTMLElement
  boutonRetour!: HTMLElement
  boutonFermer!: HTMLElement
  boutonCopier!: HTMLElement
  lienSpinner: string
  site: string
  iframe!: HTMLIFrameElement
  listeExercices: Exercice[]
  listeDesUrl: string[]

  constructor(private http: HttpClient, private dataService: ApiService, public confetti: ConfettiService) {
    this.infosModale = [[''], '', new Date()]
    this.lienSpinner = ''
    this.site = ''
    this.listeExercices = []
    this.listeDesUrl = []
    setTimeout(() => this.confetti.stop(), 3000) // Sinon un reliquat reste apparent
  }

  ngOnInit(): void {
    this.recupereListeExercices()
    this.recupereElementsHTML()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (typeof (changes.infosModale) != 'undefined') {
      if (!changes.infosModale.isFirstChange()) {
        this.listeDesUrl = changes.infosModale.currentValue[0]
        this.set('type', [changes.infosModale.currentValue[1]])
        if (this.isMathsmentales(this.listeDesUrl[0].toString())) {
          this.site = 'mathsmentales'
        } else if (this.isMathalea(this.listeDesUrl[0].toString())) {
          this.site = 'mathalea'
        }
        this.parametrage()
      }
    }
  }

  /**
   * Attend les messages contenant une url,
   * vérifie dans la liste d'exercices s'il y a une correspondance,
   * vérifie si les points ont déjà été compabilisés pour cet exercice avec ces paramètres,
   * lance this.dataService.majScore si ce n'est pas le cas
   */
  ecouteMessagesPost() {
    const divListenerExistant = document.getElementById('modaleExercicesListener')
    if (divListenerExistant == null) {
      const divListener = document.createElement('div')
      divListener.id = 'modaleExercicesListener'
      document.body.appendChild(divListener)
      window.addEventListener('message', (event) => {
        const exercicesDejaFaits = this.getStrL('exercicesDejaFaits')
        const type = this.getStr('type')
        const urlDejaFaits = this.getStrL('urlDejaFaits')
        const indiceExerciceActuel = this.getNb('indiceExerciceActuel')
        const listeDesIndices = this.getNbL('listeDesIndices')
        const coef: number = this.getNb('coef')
        const dateDerniereReponse: Date = new Date(this.getStr('dateDerniereReponse'))
        const dateNouvelleReponse = new Date()
        if (dateNouvelleReponse.getTime() - dateDerniereReponse.getTime() > 200) {
          const url: string = event.data.url;
          if (typeof (url) != 'undefined') {
            if (event.data.exercicesAffiches == true) {
              if (type == '') {
                this.hideLoadingScreen()
              } else if (type == 'tranquille') {
                if (urlDejaFaits.includes(url.split('&serie=')[0].split(',i=')[0])) {
                  this.exerciceSuivant()
                } else {
                  this.hideLoadingScreen()
                }
              }
            } else if (event.data.nbBonnesReponses != null) {
              // On cherche à quel exercice correspond ce message
              for (const exercice of this.listeExercices) {
                if (typeof (exercice.lien) != 'undefined') {
                  // A décommenter pour débugger lorsqu'il n'y a pas de confettis et que le score ne se met pas à jour
                  // console.log('lienACopier ' + exercice.lienACopier)
                  // console.log('url ' + url)
                  if (url.split('&serie=')[0].split(',i=')[0] == exercice.lien.split('&serie=')[0].split(',i=')[0]) { // Lorsqu'un exercice n'est pas interactifReady, le ,i=0 est retiré de l'url
                    // On a trouvé à quel exercice correspond ce message
                    const nbBonnesReponses: number = event.data.nbBonnesReponses
                    const nbMauvaisesReponses: number = event.data.nbMauvaisesReponses
                    const graine = event.data.graine
                    const titre: string = event.data.titre
                    const slider: string = event.data.slider
                    const stringExerciceDejaFait: string = url + graine + titre + slider
                    // On s'assure que les exercices soient différents pour ne pas ajouter plusieurs fois du score
                    if (!exercicesDejaFaits.includes(stringExerciceDejaFait)) {
                      this.set('exercicesDejaFaits', [this.getStr('exercicesDejaFaits') + '!' + stringExerciceDejaFait])
                      this.set('urlDejaFaits', [this.getStr('urlDejaFaits') + '!' + url.split('&serie=')[0].split(',i=')[0]])
                      this.set('dateDerniereReponse', [(new Date()).toString()])
                      const majScore: number = exercice.score * nbBonnesReponses * coef
                      if (majScore > 0) {
                        this.dataService.majScore(majScore, exercice.lien, type)
                        let divBonneReponse = document.createElement('div')
                        divBonneReponse.className = 'pleinEcran is-unselectable gigantesque moveUp centre'
                        divBonneReponse.innerText = '+ ' + majScore
                        document.body.appendChild(divBonneReponse);
                        setTimeout(() => divBonneReponse.parentNode?.removeChild(divBonneReponse), 2000)
                        if (nbMauvaisesReponses == 0) {
                          this.confetti.lanceConfetti()
                        }
                      }
                      if(type == 'tranquille') {
                        if (url.slice(0, 25) == 'https://mathsmentales.net') {
                          setTimeout(() => this.exerciceSuivant(), 3000)
                        }
                      }
                    }
                    if (url.slice(0, 25) == 'https://mathsmentales.net') {
                      exercice.lien = `${url.split(',a=')[0]},a=${graine}${url.split(',a=')[1]}`
                    } else {
                      exercice.lien = url
                    }
                  }
                }
              }

            }
          }
        }
      })
    }
  }

  /**
   * Affiche l'exercice aléatoire suivant.
   */
  exerciceSuivant() {
    const indiceExerciceActuel = this.getNb('indiceExerciceActuel')
    const listeDesIndices = this.getNbL('listeDesIndices')
    this.set('indiceExerciceActuel', [((indiceExerciceActuel + 1) % this.listeDesUrl.length).toString()])
    const urlExerciceSuivant = this.infosModale[0][listeDesIndices[indiceExerciceActuel + 1]]
    if (this.isMathalea(urlExerciceSuivant)) this.displayLoadingScreen()
    this.ajouteIframe(urlExerciceSuivant)
  }

  /**
   * Ajoute tous les exercices du objectifs.json à la liste des exercices,
   * puis ajoute tous les calculs mentaux du sequences.json à la liste des exercices,
   * enfin lance la création du listener des messages post (car ces listes d'exercices seront "embed" avec le listener et ne pourra plus être modifiée)
   */
  recupereListeExercices() {
    this.http.get<NiveauObjectif[]>('assets/data/objectifs.json').subscribe(niveaux => {
      for (const niveau of niveaux) {
        for (const theme of niveau.themes) {
          for (const sousTheme of theme.sousThemes) {
            for (const objectif of sousTheme.objectifs) {
              for (const exercice of objectif.exercices) {
                this.listeExercices.push({
                  lien: `https://coopmaths.fr/mathalea.html?ex=${exercice.slug},i=1&v=can&z=1.5`,
                  score: exercice.score
                })
                this.listeExercices[this.listeExercices.length - 1].lien = this.listeExercices[this.listeExercices.length - 1].lien.replace(/&ex=/g, ',i=1&ex=') // dans le cas où il y aurait plusieurs exercices dans le même slug
                if (exercice.slug.slice(0, 25) == 'https://mathsmentales.net') {
                  this.listeExercices[this.listeExercices.length - 1].lien = exercice.slug + '&embed=' + GlobalConstants.origine
                } else if (exercice.slug.slice(0, 4) == 'http') {
                  this.listeExercices[this.listeExercices.length - 1].lien = exercice.slug
                }
              }
            }
          }
        }
      }
      this.http.get<NiveauSequence[]>('assets/data/sequences.json').subscribe(niveaux => {
        for (const niveau of niveaux) {
          for (const sequence of niveau.sequences) {
            for (const calculMental of sequence.calculsMentaux) {
              for (const niveau of calculMental.niveaux) {
                this.listeExercices.push({
                  lien: niveau.lien + '&embed=' + GlobalConstants.origine,
                  score: niveau.score
                })
              }
            }
          }
        }
        this.ecouteMessagesPost()
      })
    })
  }

  /**
   * Pour mathsmentales, une fois l'iframe chargée on enlève le spinner
   * Pour mathaléa, il reste encore pas mal de choses à charger, on attend le message post
   */
  isLoaded() {
    if (this.site == 'mathsmentales') {
      this.hideLoadingScreen()
    }
  }

  /**
   * Récupère les différents éléments HTML pour les mettre dans les variables appropriées
   */
  recupereElementsHTML() {
    let element = document.getElementById("modaleExercices")
    if (element != null) this.modale = element
    element = document.getElementById("modaleExercicesUrl")
    if (element != null) this.modaleUrl = element
    element = document.getElementById("modal-back")
    if (element != null) this.boutonRetour = element
    element = document.getElementById("modal-copy")
    if (element != null) this.boutonCopier = element
    element = document.getElementById("modal-cross")
    if (element != null) this.boutonFermer = element
  }

  /**
   * Setup les différentes div qui vont servir à communiquer avec le listener
   * Affiche la modale
   * Positionne les boutons pour être en accord avec le site en plein écran
   * Ajoute l'iframe de l'exercice
   */
  parametrage() {
    this.set('indiceExerciceActuel', ['0'])
    this.set('urlDejaFaits', [''])
    this.set('exercicesDejaFaits', [''])
    this.set('dateDerniereReponse', [(new Date()).toString()])
    this.modale.style.display = 'block'
    this.positionneLesBoutons()
    if (this.getStr('type') == '') {
      if (this.site == 'mathalea') this.displayLoadingScreen()
      this.set('coef', ['1'])
      this.ajouteIframe(this.infosModale[0][this.getNb('indiceExerciceActuel')])
    } else if (this.getStr('type') == 'tranquille') {
      this.set('coef', ['2'])
      this.creeListeIndicesExercices()
      const url = this.infosModale[0][this.getNbL('listeDesIndices')[this.getNb('indiceExerciceActuel')]]
      if (this.isMathalea(url)) this.displayLoadingScreen()
      this.ajouteIframe(url)
    }
  }

  /**
   * Crée une liste randomisée des indices de la liste des url et la set dans un div
   */
  creeListeIndicesExercices() {
    let liste = []
    for (let i = 0; i < this.listeDesUrl.length; i++) {
      liste.push(i)
    }
    this.set('listeDesIndices', this.shuffle(liste))
  }

  /**
   * Crée une nouvelle iframe et remplace l'ancienne à chaque ouverture de la page
   * pour éviter des comportements bizarres si on charge plusieurs fois d'affilée la même page
   */
  ajouteIframe(url: string) {
    this.iframe = document.createElement('iframe')
    this.iframe.id = 'iframeExercice1'
    this.iframe.width = '100%'
    this.iframe.height = '100%'
    this.iframe.className = 'has-ratio'
    this.iframe.src = url

    if (this.modale.lastChild != null) {
      const iframe = document.getElementById('iframeExercice1')
      if (iframe == null) this.modale.appendChild(this.iframe)
      else this.modale.replaceChild(this.iframe, this.modale.lastChild)
    }
  }

  /**
   * Positionne les boutons au bon endroit selon le site de l'exercice
   */
  positionneLesBoutons() {
    switch (this.site) {
      case 'mathalea':
        this.lienSpinner = '/assets/img/cc0/orange-spinner.svg'

        this.boutonRetour.style.left = '20px'
        this.boutonRetour.style.right = ''
        this.boutonRetour.style.top = '0px'
        this.boutonRetour.style.width = '30px'

        this.boutonCopier.style.left = ''
        this.boutonCopier.style.right = '80px'
        this.boutonCopier.style.top = '35px'
        this.boutonCopier.style.width = '30px'

        this.boutonFermer.style.left = ''
        this.boutonFermer.style.right = '20px'
        this.boutonFermer.style.top = '35px'
        this.boutonFermer.style.width = '30px'
        break;
      case 'mathsmentales':
        this.lienSpinner = '/assets/img/cc0/blue-spinner.svg'

        this.boutonRetour.style.left = '20px'
        this.boutonRetour.style.right = ''
        this.boutonRetour.style.top = '80px'
        this.boutonRetour.style.width = '30px'

        this.boutonCopier.style.left = ''
        this.boutonCopier.style.right = '80px'
        this.boutonCopier.style.top = '80px'
        this.boutonCopier.style.width = '30px'

        this.boutonFermer.style.left = ''
        this.boutonFermer.style.right = '20px'
        this.boutonFermer.style.top = '80px'
        this.boutonFermer.style.width = '30px'
        break;
    }
  }

  /**
   * Mélange un array
   * @param array 
   * @returns array mélangé
   */
  shuffle(array: number[]) {
    let currentIndex = array.length; let temporaryValue; let randomIndex

    // While there remain elements to shuffle...
    const arrayBis = array.slice()
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      // And swap it with the current element.
      temporaryValue = arrayBis[currentIndex]
      arrayBis[currentIndex] = arrayBis[randomIndex]
      arrayBis[randomIndex] = temporaryValue
    }

    return arrayBis
  }

  /**
   * Cache la modale
   */
  fermerModale() {
    this.modaleFermee.emit(true)
    if (this.modale.lastChild != null) this.modale.removeChild(this.modale.lastChild)
    this.modale.style.display = "none"
    this.hideLoadingScreen()
  }

  /**
   * Cache le spinner de chargement
   */
  hideLoadingScreen() {
    const loadingDiv = document.getElementById('loading')
    if (loadingDiv != null) loadingDiv.style.display = 'none'
  }

  /**
   * Affiche le spinner de chargement
   */
  displayLoadingScreen() {
    const loadingDiv = document.getElementById('loading')
    if (loadingDiv != null) loadingDiv.style.display = 'block'
  }

  /**
   * Copie dans le presse papier le lien vers un exercice
   */
  copierLien() {
    navigator.clipboard.writeText(this.infosModale[0][this.getNbL('listeDesIndices')[this.getNb('indiceExerciceActuel')]]);
    alert('Le lien vers l\'exercice a été copié')
  }

  /**
   * inscrit dans le sessionStorage les valeurs séparés par des '!' s'il y en a plusieurs
   * @param tag nom de la "variable"
   * @param valeurs 
   */
  set(tag: string, valeurs: string[] | number[]) {
    let chaine: string
    if (valeurs.length == 1) {
      chaine = valeurs[0].toString()
    } else {
      let str = ''
      for (const valeur of valeurs) {
        str += valeur + '!'
      }
      chaine = str.slice(0, str.length - 1)
    }
    sessionStorage.setItem('ME' + tag, chaine)
  }

  /**
   * Récupère un nombre du sessionStorage
   * @param tag nom de la "variable"
   * @returns 
   */
  getNb(tag: string) {
    const nb = sessionStorage.getItem('ME' + tag)
    if (nb != null) return parseInt(nb)
    else return 0
  }

  /**
   * Récupère un nombre[] du sessionStorage
   * @param tag nom de la "variable"
   * @returns 
   */
  getNbL(tag: string) {
    const item = sessionStorage.getItem('ME' + tag)
    if (item != null) {
      const listeStr = item.split('!')
      let listeNb: number[] = []
      for (const str of listeStr) {
        listeNb.push(parseInt(str))
      }
      return listeNb
    } else return [0]
  }

  /**
   * Récupère un string du sessionStorage
   * @param tag nom de la "variable"
   * @returns 
   */
  getStr(tag: string) {
    const str = sessionStorage.getItem('ME' + tag)
    if (str != null) return str
    else return ''
  }

  /**
   * Récupère un string[] du sessionStorage
   * @param tag nom de la "variable"
   * @returns 
   */
  getStrL(tag: string) {
    const str = sessionStorage.getItem('ME' + tag)
    if (str != null) return str.split('!')
    else return ['']
  }

  isMathalea(url: string) {
    return url.slice(0, 34) == 'https://coopmaths.fr/mathalea.html'
  }

  isMathsmentales(url: string) {
    return url.slice(0, 25) == 'https://mathsmentales.net'
  }
}
