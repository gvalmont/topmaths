import { Component, EventEmitter, Input, isDevMode, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core'
import { Subscription } from 'rxjs'
import { DataService } from '../services/data.service'
import { OutilsService } from '../services/outils.service'
import { StorageService } from '../services/storage.service'

@Component({
  selector: 'app-modale-exercices',
  templateUrl: './modale-exercices.component.html',
  styleUrls: ['./modale-exercices.component.css']
})
export class ModaleExercicesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() infosModale: [string[], string, Date] // liste des url, type d'exercice, date
  @Output() modaleFermee = new EventEmitter<number>()
  modale!: HTMLElement
  modaleUrl!: HTMLElement
  boutonFermer!: HTMLElement
  boutonCopier!: HTMLElement
  boutonCopierLoading!: HTMLElement
  boutonPauseMetacognitive!: HTMLElement
  divConfirmationCopie!: HTMLDivElement
  lienSpinner: string
  dataMAJSubscription: Subscription
  etapePauseMetacognitive: number

  // eslint-disable-next-line no-unused-vars
  constructor (private dataService: DataService, public storageService: StorageService, private outilsService: OutilsService) {
    this.infosModale = [[], '', new Date() ]
    this.lienSpinner = ''
    this.set('indiceExerciceActuel', 0)
    this.set('urlDejaFaits', [''])
    this.set('exercicesDejaFaits', [''])
    this.set('dateDerniereReponse', new Date())
    this.dataMAJSubscription = new Subscription
    this.surveillerLeChargementDesDonnees()
    this.etapePauseMetacognitive = 1
  }

  ngOnInit (): void {
    if (this.lesDonneesSontChargees()) this.MAJComponent()
  }

  ngOnChanges (changes: SimpleChanges) {
    if (typeof (changes.infosModale) !== 'undefined') {
      if (!changes.infosModale.isFirstChange()) {
        this.set('listeDesUrl', changes.infosModale.currentValue[0])
        this.set('type', changes.infosModale.currentValue[1])
        let site: string = ''
        if (this.outilsService.estMathsMentales(this.get('listeDesUrl')[0])) {
          site = 'mathsmentales'
        } else if (this.outilsService.estMathALEA(this.get('listeDesUrl')[0])) {
          site = 'mathalea'
        } else if (this.outilsService.estGeogebraClassic(this.get('listeDesUrl')[0])) {
          site = 'geogebraClassic'
        } else if (this.outilsService.estGeogebraM(this.get('listeDesUrl')[0])) {
          site = 'geogebraM'
        }
        this.parametrage(site)
      }
    }
  }

  ngOnDestroy () {
    this.dataMAJSubscription.unsubscribe()
  }

  surveillerLeChargementDesDonnees () {
    this.dataMAJSubscription = this.dataService.dataMAJ.subscribe(valeurModifiee => {
      if (valeurModifiee === 'niveauxSequences' || valeurModifiee === 'niveauxObjectifs') {
        if (this.lesDonneesSontChargees()) this.MAJComponent()
      }
    })
  }

  lesDonneesSontChargees () {
    return this.dataService.niveauxSequences.length > 0 && this.dataService.niveauxObjectifs.length > 0
  }

  MAJComponent () {
    this.creerListenerMessagesPost()
    this.MAJElementsHTML()
  }

  creerListenerMessagesPost () {
    const divListenerExistant = document.getElementById('modaleExercicesListener')
    if (divListenerExistant === null) {
      this.creerDivPresenceListener()
      window.addEventListener('message', (event) => {
        if (event.origin === 'https://coopmaths.fr' || event.origin === 'https://mathsmentales.net' ) {
          const type: string = this.get('type')
          const urlDejaFaits: string[] = this.get('urlDejaFaits')
          const dateDerniereReponse: Date = new Date(this.get('dateDerniereReponse'))
          const dateNouvelleReponse: Date = new Date()
          if (dateNouvelleReponse.getTime() - dateDerniereReponse.getTime() > 200) {
            const url: string = event.data.url
            if (typeof (url) !== 'undefined') {
              if (event.data.exercicesAffiches === true || event.data.ready === 'ok') {
                this.divConfirmationCopie.style.display = 'none'
                this.etapePauseMetacognitive = 1
                this.fermerEcranDeChargement(type, url, urlDejaFaits)
                this.set('lienACopier', url)
                this.MAJurlDejaFaits(url, urlDejaFaits)
                if (type === 'exerciceAuHasard' && this.outilsService.estMathsMentales(url)) {
                  this.exerciceAleatoireSuivant() // mathsmentales n'envoie pas de message à la fin de l'exercice, mieux vaut le shunter pour les exercices au hasard
                }
              }
            }
          }
        }
      })
    }
  }

  creerDivPresenceListener () {
    const divListener = document.createElement('div')
    divListener.id = 'modaleExercicesListener'
    document.body.appendChild(divListener)
  }

  fermerEcranDeChargement (type: string, url: string, urlDejaFaits: string[]) {
    if (type === '') {
      this.hideLoadingScreen()
    } else if (type === 'exerciceAuHasard') {
      if (urlDejaFaits.includes(url.split('&serie=')[0].split(',i=')[0])) {
        this.exerciceAleatoireSuivant()
      } else {
        this.hideLoadingScreen()
      }
    }
  }

  MAJurlDejaFaits (url: string, urlDejaFaits: string[]) {
    urlDejaFaits.push(url.split('&serie=')[0].split(',i=')[0])
    this.set('urlDejaFaits', urlDejaFaits)
    this.set('dateDerniereReponse', new Date())
  }

  exerciceAleatoireSuivant () {
    const indiceExerciceActuel = this.get('indiceExerciceActuel')
    const listeDesIndices = this.get('listeDesIndices')
    const nouvelIndice = indiceExerciceActuel % (this.get('listeDesUrl').length - 1) + 1
    this.set('indiceExerciceActuel', nouvelIndice)
    const urlExerciceSuivant = this.get('listeDesUrl')[listeDesIndices[nouvelIndice]]
    this.displayLoadingScreen('mathalea')
    this.ajouterIframe(urlExerciceSuivant)
  }

  MAJElementsHTML () {
    let element = document.getElementById("modaleExercices")
    if (element !== null) this.modale = element
    element = document.getElementById("modaleExercicesUrl")
    if (element !== null) this.modaleUrl = element
    element = document.getElementById("modal-copy")
    if (element !== null) this.boutonCopier = element
    element = document.getElementById("modal-cross")
    if (element !== null) this.boutonFermer = element
    element = document.getElementById("boutonCopierLoading")
    if (element !== null) this.boutonCopierLoading = element
    element = document.getElementById('boutonPauseMetacognitive')
    if (element !== null) this.boutonPauseMetacognitive = element
    element = document.getElementById("divConfirmationCopie")
    if (element !== null) this.divConfirmationCopie = <HTMLDivElement> element
  }

  parametrage (site: string) {
    this.modale.style.display = 'block'
    const type = this.get('type')
    this.displayLoadingScreen(site)
    this.creeListeIndicesExercices()
    let url: string = ''
    if (type === 'exerciceAuHasard') {
      url = this.get('listeDesUrl')[this.get('listeDesIndices')[this.get('indiceExerciceActuel')]]
    } else {
      url = this.get('listeDesUrl')[this.get('indiceExerciceActuel')]
    }
    this.ajouterIframe(url)
    this.set('lienACopier', this.infosModale[0][this.get('listeDesIndices')[this.get('indiceExerciceActuel')]])
    this.positionnerLesBoutons(site)
  }

  creeListeIndicesExercices () {
    const liste = []
    for (let i = 0; i < this.get('listeDesUrl').length; i++) {
      liste.push(i)
    }
    this.set('listeDesIndices', this.shuffle(liste))
  }

  /**
   * Crée une nouvelle iframe et remplace l'ancienne à chaque ouverture de la page
   * pour éviter des comportements bizarres si on charge plusieurs fois d'affilée la même page
   */
  ajouterIframe (url: string) {
    const iframeActuel = document.getElementById('iframeExercice1')
    let parent = <Node>this.modale // Pour le premier iframe
    if (iframeActuel !== null && iframeActuel.parentNode !== null) {
      parent = iframeActuel.parentNode // Pour tous les suivants car la référence this.modale n'est plus valide lorsque lancée depuis un ancien listener
      parent.removeChild(iframeActuel)
    }
    const nouvelIframe = document.createElement('iframe')
    nouvelIframe.id = 'iframeExercice1'
    nouvelIframe.width = '100%'
    nouvelIframe.height = '100%'
    nouvelIframe.className = 'has-ratio'
    nouvelIframe.src = url
    parent.appendChild(nouvelIframe)
  }

  positionnerLesBoutons (site: string) {
    switch (site) {
      case 'mathalea':
        this.boutonCopier.style.left = ''
        this.boutonCopier.style.right = '80px'
        this.boutonCopier.style.top = '45px'
        this.boutonCopier.style.width = '30px'

        this.divConfirmationCopie.style.left = ''
        this.divConfirmationCopie.style.right = '65px'
        this.divConfirmationCopie.style.top = '80px'

        this.boutonFermer.style.left = ''
        this.boutonFermer.style.right = '20px'
        this.boutonFermer.style.top = '45px'
        this.boutonFermer.style.width = '30px'

        this.boutonPauseMetacognitive.style.top = '98px'
        this.boutonPauseMetacognitive.style.right = '20px'
        break
      case 'mathsmentales':
        this.boutonCopier.style.left = ''
        this.boutonCopier.style.right = '80px'
        this.boutonCopier.style.top = '80px'
        this.boutonCopier.style.width = '30px'

        this.divConfirmationCopie.style.left = ''
        this.divConfirmationCopie.style.right = '35px'
        this.divConfirmationCopie.style.top = '115px'

        this.boutonFermer.style.left = ''
        this.boutonFermer.style.right = '20px'
        this.boutonFermer.style.top = '80px'
        this.boutonFermer.style.width = '30px'

        this.boutonPauseMetacognitive.style.top = '133px'
        this.boutonPauseMetacognitive.style.right = '20px'
        break
      case 'geogebraClassic':
        this.boutonCopier.style.left = ''
        this.boutonCopier.style.right = '80px'
        this.boutonCopier.style.top = '100px'
        this.boutonCopier.style.width = '30px'

        this.divConfirmationCopie.style.left = ''
        this.divConfirmationCopie.style.right = '65px'
        this.divConfirmationCopie.style.top = '135px'

        this.boutonFermer.style.left = ''
        this.boutonFermer.style.right = '20px'
        this.boutonFermer.style.top = '100px'
        this.boutonFermer.style.width = '30px'

        this.boutonPauseMetacognitive.style.top = '143px'
        this.boutonPauseMetacognitive.style.right = '20px'
        break
      case 'geogebraM':
        this.boutonCopier.style.left = ''
        this.boutonCopier.style.right = '50px'
        this.boutonCopier.style.top = '70px'
        this.boutonCopier.style.width = '30px'

        this.divConfirmationCopie.style.left = ''
        this.divConfirmationCopie.style.right = '80px'
        this.divConfirmationCopie.style.top = '70px'

        this.boutonFermer.style.left = ''
        this.boutonFermer.style.right = '15px'
        this.boutonFermer.style.top = '70px'
        this.boutonFermer.style.width = '30px'

        this.boutonPauseMetacognitive.style.top = '105px'
        this.boutonPauseMetacognitive.style.right = '15px'
        break
    }
  }

  shuffle (array: number[]) {
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

  fermerModale (valeur?: number) {
    this.modaleFermee.emit(valeur)
    const iframe = document.getElementById('iframeExercice1')
    if (iframe !== null && iframe.parentNode !== null) iframe.parentNode.removeChild(iframe)
    this.modale.style.display = 'none'
    this.divConfirmationCopie.style.display = 'none'
    this.hideLoadingScreen()
  }

  displayLoadingScreen (site: string) {
    if (!isDevMode()) {
      let afficherSpinner = false
      switch (site) {
        case 'mathalea':
          this.lienSpinner = '/assets/img/cc0/orange-spinner.svg'
          afficherSpinner = true
          break
        case 'mathsmentales':
          this.lienSpinner = '/assets/img/cc0/blue-spinner.svg'
          afficherSpinner = true
          break
        default:
          afficherSpinner = false
          break
      }
      if (afficherSpinner) {
        const loadingDiv = document.getElementById('loading')
        if (loadingDiv !== null) loadingDiv.style.display = 'block'
      }
    }
  }

  hideLoadingScreen () {
    const loadingDiv = document.getElementById('loading')
    if (loadingDiv !== null) loadingDiv.style.display = 'none'
  }

  copierLien () {
    navigator.clipboard.writeText(this.get('lienACopier'))
    this.divConfirmationCopie.style.display = 'block'
  }

  set (tag: string, objet: any) {
    this.storageService.set('ME' + tag, objet)
  }

  get (tag: string) {
    return this.storageService.get('ME' + tag)
  }

  alternerAffichagePauseMetacognitive () {
    const divFondPanneauPauseMetacognitive = document.getElementById('fondPanneauPauseMetacognitive')
    const divContenuPanneauPauseMetacognitive = document.getElementById('contenuPanneauPauseMetacognitive')
    if (divFondPanneauPauseMetacognitive !== null && divContenuPanneauPauseMetacognitive) {
      if (divContenuPanneauPauseMetacognitive.style.opacity === '1') {
        divContenuPanneauPauseMetacognitive.style.opacity = '0%'
        divFondPanneauPauseMetacognitive.style.opacity = '0%'
      } else {
        divContenuPanneauPauseMetacognitive.style.opacity = '100%'
        divFondPanneauPauseMetacognitive.style.opacity = '70%'
      }
    }
  }

  passerPauseMetacognitiveEtape (numeroEtape: number) {
    this.etapePauseMetacognitive = numeroEtape
  }
}
