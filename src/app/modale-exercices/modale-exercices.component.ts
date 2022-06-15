import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, isDevMode, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ConfettiService } from '../services/confetti.service';
import { GlobalConstants } from '../services/global-constants';
import { Niveau as NiveauObjectif } from '../services/objectifs';
import { Niveau as NiveauSequence } from '../services/sequences';

interface Exercice {
  lien: string
  isInteractif: boolean
}

@Component({
  selector: 'app-modale-exercices',
  templateUrl: './modale-exercices.component.html',
  styleUrls: ['./modale-exercices.component.css']
})
export class ModaleExercicesComponent implements OnInit {
  @Input() infosModale: [string[], string, Date, number[], number?] // liste des url, type d'exercice, date, liste des temps, coef?
  @Output() modaleFermee = new EventEmitter<number>();
  modale!: HTMLElement
  modaleUrl!: HTMLElement
  boutonFermer!: HTMLElement
  boutonCopier!: HTMLElement
  boutonCopierLoading!: HTMLElement
  confirmationModale!: HTMLElement
  affCoef!: HTMLElement
  lienSpinner: string
  site: string
  listeExercices: Exercice[]
  interval: any

  constructor(private http: HttpClient, private dataService: ApiService, public confetti: ConfettiService) {
    this.infosModale = [[], '', new Date(), []]
    this.lienSpinner = ''
    this.site = ''
    this.listeExercices = []
    this.set('indiceExerciceActuel', 0)
    this.set('urlDejaFaits', [''])
    this.set('exercicesDejaFaits', [''])
    this.set('dateDerniereReponse', new Date())
    this.set('coef', 1)
    setTimeout(() => this.confetti.stop(), 3000) // Sinon un reliquat reste apparent
  }

  ngOnInit(): void {
    this.recupereListeExercices()
    this.recupereElementsHTML()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (typeof (changes.infosModale) != 'undefined') {
      if (!changes.infosModale.isFirstChange()) {
        this.set('listeDesUrl', changes.infosModale.currentValue[0])
        this.set('type', changes.infosModale.currentValue[1])
        this.set('listeDesTemps', changes.infosModale.currentValue[3])
        if (changes.infosModale.currentValue[4] != null) this.set('coef', changes.infosModale.currentValue[4])
        if (this.isMathsmentales(this.get('listeDesUrl')[0])) {
          this.site = 'mathsmentales'
        } else if (this.isMathalea(this.get('listeDesUrl')[0])) {
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
   * lance des confetti s'il n'y a pas de mauvaise réponse
   */
  ecouteMessagesPost() {
    const divListenerExistant = document.getElementById('modaleExercicesListener')
    if (divListenerExistant == null) {
      const divListener = document.createElement('div')
      divListener.id = 'modaleExercicesListener'
      document.body.appendChild(divListener)
      window.addEventListener('message', (event) => {
        const exercicesDejaFaits = this.get('exercicesDejaFaits')
        const type = this.get('type')
        const urlDejaFaits = this.get('urlDejaFaits')
        const dateDerniereReponse: Date = new Date(this.get('dateDerniereReponse'))
        const dateNouvelleReponse = new Date()
        if (dateNouvelleReponse.getTime() - dateDerniereReponse.getTime() > 200) {
          const url: string = event.data.url;
          if (typeof (url) != 'undefined') {
            if (event.data.exercicesAffiches == true || event.data.ready == 'ok') {
              if (type == '') {
                this.set('lienACopier', url)
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
                  // A décommenter pour débugger lorsqu'il n'y a pas de confetti
                  // console.log('lienACopier ' + exercice.lien)
                  // console.log('url ' + url)
                  if (url.split('&serie=')[0].split(',i=')[0] == exercice.lien.split('&serie=')[0].split(',i=')[0]) { // Lorsqu'un exercice n'est pas interactifReady, le ,i=0 est retiré de l'url
                    // On a trouvé à quel exercice correspond ce message
                    const nbBonnesReponses: number = event.data.nbBonnesReponses
                    const nbMauvaisesReponses: number = event.data.nbMauvaisesReponses
                    const graine = event.data.graine
                    const titre: string = event.data.titre
                    const slider: string = event.data.slider
                    const stringExerciceDejaFait: string = url + graine + titre + slider
                    // On s'assure que les exercices soient bien différents
                    if (!exercicesDejaFaits.includes(stringExerciceDejaFait)) {
                      const coef: number = this.get('coef')
                      if (nbBonnesReponses > 0 && nbMauvaisesReponses == 0 && exercice.isInteractif) {
                        this.confetti.lanceConfetti()
                      }
                      exercicesDejaFaits.push(stringExerciceDejaFait)
                      if (type == '') {
                        urlDejaFaits.push(url.split('&serie=')[0].split(',i=')[0])
                      } else if (type == 'tranquille') {
                        urlDejaFaits.push(url.split('&serie=')[0].split(',i=')[0])
                        if (url.slice(0, 25) == 'https://mathsmentales.net') {
                          setTimeout(() => this.exerciceSuivant(), 3000)
                        }
                      }
                      this.set('exercicesDejaFaits', exercicesDejaFaits)
                      this.set('urlDejaFaits', urlDejaFaits)
                      this.set('dateDerniereReponse', new Date())
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
    const indiceExerciceActuel = this.get('indiceExerciceActuel')
    const listeDesIndices = this.get('listeDesIndices')
    this.set('indiceExerciceActuel', (indiceExerciceActuel + 1) % this.get('listeDesUrl').length)
    const urlExerciceSuivant = this.get('listeDesUrl')[listeDesIndices[indiceExerciceActuel + 1]]
    if (!isDevMode()) this.displayLoadingScreen()
    this.ajouteIframe(urlExerciceSuivant)
    this.resetProgressBar()
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
                  lien: `https://coopmaths.fr/mathalea.html?ex=${exercice.slug},i=1&v=eval&z=1.5`,
                  isInteractif: exercice.isInteractif
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
                  isInteractif: false
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
    element = document.getElementById("modal-copy")
    if (element != null) this.boutonCopier = element
    element = document.getElementById("modal-cross")
    if (element != null) this.boutonFermer = element
    element = document.getElementById("aff-coef")
    if (element != null) this.affCoef = element
    element = document.getElementById("confirmationModaleExercices")
    if (element != null) this.confirmationModale = element
    element = document.getElementById("boutonCopierLoading")
    if (element != null) this.boutonCopierLoading = element
  }

  resetProgressBar() {
    const divTimeLeft = document.getElementById('timeLeft')
    if (divTimeLeft != null) {
      divTimeLeft.style.transition = ''
      divTimeLeft.style.width = '100%'
      divTimeLeft.style.transition = '2s'
    }
  }

  /**
   * Setup les différentes div qui vont servir à communiquer avec le listener
   * Affiche la modale
   * Positionne les boutons pour être en accord avec le site en plein écran
   * Ajoute l'iframe de l'exercice
   */
  parametrage() {
    this.modale.style.display = 'block'
    const type = this.get('type')
    if (!isDevMode()) this.displayLoadingScreen()
    if (type == '') {
      this.boutonCopier.style.display = 'block'
      this.boutonCopierLoading.style.display = 'block'
      this.set('coef', 1)
      this.creeListeIndicesExercices()
      const url = this.get('listeDesUrl')[this.get('indiceExerciceActuel')]
      this.ajouteIframe(url)
    } else if (type == 'tranquille') {
      this.boutonCopier.style.display = 'none'
      this.boutonCopierLoading.style.display = 'none'
      this.set('coef', 2)
      this.creeListeIndicesExercices()
      const url = this.get('listeDesUrl')[this.get('listeDesIndices')[this.get('indiceExerciceActuel')]]
      this.ajouteIframe(url)
    }
    this.set('lienACopier', this.infosModale[0][this.get('listeDesIndices')[this.get('indiceExerciceActuel')]])
    this.positionneLesBoutons()
  }

  /**
   * Crée une liste randomisée des indices de la liste des url et la set dans un div
   */
  creeListeIndicesExercices() {
    let liste = []
    for (let i = 0; i < this.get('listeDesUrl').length; i++) {
      liste.push(i)
    }
    this.set('listeDesIndices', this.shuffle(liste))
  }

  /**
   * Crée une nouvelle iframe et remplace l'ancienne à chaque ouverture de la page
   * pour éviter des comportements bizarres si on charge plusieurs fois d'affilée la même page
   */
  ajouteIframe(url: string) {
    const iframeActuel = document.getElementById('iframeExercice1');
    let parent = <Node>this.modale // Pour le premier iframe
    if (iframeActuel != null && iframeActuel.parentNode != null) {
      parent = iframeActuel.parentNode // Pour tous les suivants car la référence this.modale n'est plus valide lorsque lancée depuis un ancien listener
      parent.removeChild(iframeActuel);
    }
    let nouvelIframe = document.createElement('iframe')
    nouvelIframe.id = 'iframeExercice1'
    nouvelIframe.width = '100%'
    nouvelIframe.height = '100%'
    nouvelIframe.className = 'has-ratio'
    nouvelIframe.src = url
    parent.appendChild(nouvelIframe)
  }

  /**
   * Positionne les boutons au bon endroit selon le site de l'exercice
   */
  positionneLesBoutons() {
    if (this.get('type') == '' || this.get('type') == 'tranquille') {
      this.affCoef.style.display = 'none'
    } else {
      this.affCoef.style.display = 'block'
      this.affCoef.style.color = 'black'
    }
    switch (this.site) {
      case 'mathalea':
        this.lienSpinner = '/assets/img/cc0/orange-spinner.svg'

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
    this.resetProgressBar()
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
   * Crée une progress bar
   * le paramètre en fonction de la durée de l'exercice
   * l'append au document (il ne réapparaît pas lorsqu'append à la modale)
   */
  startTimer() {
    const indiceExerciceActuel = this.get('indiceExerciceActuel')
    const listeDesIndices = this.get('listeDesIndices')
    const TIME_LIMIT = this.get('listeDesTemps')[listeDesIndices[indiceExerciceActuel]]
    this.set('tempsDisponible', TIME_LIMIT)

    let nouveauDivTimeLeft = document.createElement('div')
    nouveauDivTimeLeft.id = 'divTimeLeft'
    nouveauDivTimeLeft.style.width = '70%'
    nouveauDivTimeLeft.style.backgroundColor = 'hsl(0, 0%, 86%)'
    nouveauDivTimeLeft.style.height = '15px'
    nouveauDivTimeLeft.style.position = 'fixed'
    nouveauDivTimeLeft.style.left = '8%'
    nouveauDivTimeLeft.style.top = '75px'
    nouveauDivTimeLeft.style.borderRadius = '5000px'
    nouveauDivTimeLeft.style.zIndex = '250'

    let nouveauTimeLeft = document.createElement('div')
    nouveauTimeLeft.id = 'timeLeft'
    nouveauTimeLeft.style.width = '100%'
    nouveauTimeLeft.style.height = '15px'
    nouveauTimeLeft.style.backgroundColor = 'hsl(141, 71%, 48%)'
    nouveauTimeLeft.style.transition = '2s'
    nouveauTimeLeft.style.borderRadius = '5000px'

    let timePassed = 2, timeLeft = 0, pourcentRestant = 0, bool1 = false, bool2 = false, bool3 = false, bool4 = false // Pour compenser la transition de 2s du css
    this.interval = setInterval(() => {
      timePassed = timePassed += 1;
      timeLeft = TIME_LIMIT - timePassed;
      pourcentRestant = Math.floor((timeLeft / TIME_LIMIT) * 1000) / 10
      nouveauTimeLeft.style.width = pourcentRestant.toString() + '%'
    }, 1000);

    nouveauDivTimeLeft.appendChild(nouveauTimeLeft)

    const divActuel = document.getElementById('divTimeLeft')
    if (divActuel != null) divActuel.remove()
    document.body.appendChild(nouveauDivTimeLeft)
  }

  /**
   * Si c'est une compétition, demande une confirmation
   * Sinon, ferme directement la modale exercices
   */
  boutonFermerModale() {
    const type = this.get('type')
    this.fermerModale()
  }

  /**
   * Cache la modale
   */
  fermerModale(valeur?: number) {
    this.modaleFermee.emit(valeur)
    const iframe = document.getElementById('iframeExercice1')
    if (iframe != null && iframe.parentNode != null) iframe.parentNode.removeChild(iframe)
    this.confirmationModale.style.display = "none"
    this.modale.style.display = "none"
    const divTimeLeft = document.getElementById('divTimeLeft')
    if (divTimeLeft != null) divTimeLeft.remove()
    clearInterval(this.interval)
    this.hideLoadingScreen()
  }

  /**
   * Affiche la confirmation avant de fermer la modale exercices
   */
  afficherConfirmation() {
    this.confirmationModale.style.display = "block"
  }

  /**
   * Cache la confirmation
   */
  cacherConfirmation() {
    this.confirmationModale.style.display = "none"
  }

  /**
   * Cache le spinner de chargement
   */
  hideLoadingScreen() {
    const loadingDiv = document.getElementById('loading')
    if (loadingDiv != null) loadingDiv.style.display = 'none'
    const divTimeLeft = document.getElementById('divTimeLeft')
    if (divTimeLeft != null) divTimeLeft.style.display = 'block'
  }

  /**
   * Affiche le spinner de chargement
   */
  displayLoadingScreen() {
    const loadingDiv = document.getElementById('loading')
    if (loadingDiv != null) loadingDiv.style.display = 'block'
    const divTimeLeft = document.getElementById('divTimeLeft')
    if (divTimeLeft != null) divTimeLeft.style.display = 'none'
  }

  /**
   * Copie dans le presse papier le lien vers un exercice
   */
  copierLien() {
    navigator.clipboard.writeText(this.get('lienACopier'));
    alert('Le lien vers l\'exercice a été copié')
  }

  /**
   * Préfixe le tag de 'ME' et inscrit dans le localStorage les valeurs séparés par des '!' s'il y en a plusieurs
   * @param tag nom de la "variable"
   * @param valeurs 
   */
  set(tag: string, objet: any) {
    this.dataService.set('ME' + tag, objet)
    if (tag == 'coef') {
      const divCoef = document.getElementById('aff-coef')
      if (divCoef != null) {
        divCoef.innerHTML = ('&times;' + objet.toString()).replace('.', ',')
        divCoef.classList.add('booboom')
        setTimeout(() => { divCoef.classList.remove('booboom') }, 1000);
      }

    }
  }

  /**
   * Préfixe le tag de 'ME' et récupère un nombre du localStorage
   * @param tag nom de la "variable"
   * @returns 
   */
  get(tag: string) {
    return this.dataService.get('ME' + tag)
  }

  isMathalea(url: string) {
    return url.slice(0, 34) == 'https://coopmaths.fr/mathalea.html'
  }

  isMathsmentales(url: string) {
    return url.slice(0, 25) == 'https://mathsmentales.net'
  }
}
