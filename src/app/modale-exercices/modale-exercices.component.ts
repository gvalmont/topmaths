import { HttpClient } from '@angular/common/http'
import { Component, EventEmitter, Input, isDevMode, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core'
import { ApiService } from '../services/api.service'
import { ConfettiService } from '../services/confetti.service'
import { GlobalConstants } from '../services/global-constants'
import { Niveau as NiveauObjectif } from '../services/objectifs'
import { Niveau as NiveauSequence } from '../services/sequences'

interface Exercice {
  lien: string
  isInteractif: boolean
}

@Component({
  selector: 'app-modale-exercices',
  templateUrl: './modale-exercices.component.html',
  styleUrls: ['./modale-exercices.component.css']
})
export class ModaleExercicesComponent implements OnInit, OnChanges {
  @Input() infosModale: [string[], string, Date] // liste des url, type d'exercice, date
  @Output() modaleFermee = new EventEmitter<number>()
  modale!: HTMLElement
  modaleUrl!: HTMLElement
  boutonFermer!: HTMLElement
  boutonCopier!: HTMLElement
  boutonCopierLoading!: HTMLElement
  lienSpinner: string
  site: string
  listeExercices: Exercice[]

  // eslint-disable-next-line no-unused-vars
  constructor(private httpClient: HttpClient, private apiService: ApiService, public confettiService: ConfettiService) {
    this.infosModale = [[], '', new Date()]
    this.lienSpinner = ''
    this.site = ''
    this.listeExercices = []
    this.set('indiceExerciceActuel', 0)
    this.set('urlDejaFaits', [''])
    this.set('exercicesDejaFaits', [''])
    this.set('dateDerniereReponse', new Date())
    setTimeout(() => this.confettiService.stop(), 3000) // Sinon un reliquat reste apparent
  }

  ngOnInit(): void {
    this.recupererListeExercices()
    this.recupererElementsHTML()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (typeof (changes.infosModale) != 'undefined') {
      if (!changes.infosModale.isFirstChange()) {
        this.set('listeDesUrl', changes.infosModale.currentValue[0])
        this.set('type', changes.infosModale.currentValue[1])
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
   * Ajoute tous les exercices du objectifs.json à la liste des exercices,
   * puis ajoute tous les calculs mentaux du sequences.json à la liste des exercices,
   * enfin lance la création du listener des messages post (car ces listes d'exercices seront "embed" avec le listener et ne pourra plus être modifiée)
   */
  recupererListeExercices() {
    this.httpClient.get<NiveauObjectif[]>('assets/data/objectifs.json').subscribe(niveaux => {
      this.recupererExercicesObjectifs(niveaux)
      this.httpClient.get<NiveauSequence[]>('assets/data/sequences.json').subscribe(niveaux => {
        this.recupererExercicesSequences(niveaux)
        this.creerListenerMessagesPost()
      })
    })
  }

  recupererExercicesObjectifs(niveaux: NiveauObjectif[]) {
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
  }

  recupererExercicesSequences(niveaux: NiveauSequence[]) {
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
  }

  creerListenerMessagesPost() {
    const divListenerExistant = document.getElementById('modaleExercicesListener')
    if (divListenerExistant == null) {
      this.creerDivPresenceListener()
      window.addEventListener('message', (event) => {
        const type: string = this.get('type')
        const urlDejaFaits: string[] = this.get('urlDejaFaits')
        const dateDerniereReponse: Date = new Date(this.get('dateDerniereReponse'))
        const dateNouvelleReponse: Date = new Date()
        if (dateNouvelleReponse.getTime() - dateDerniereReponse.getTime() > 200) {
          const url: string = event.data.url
          if (typeof (url) != 'undefined') {
            if (event.data.exercicesAffiches == true || event.data.ready == 'ok') {
              this.fermerEcranDeChargement(type, url, urlDejaFaits)
              this.set('lienACopier', url)
            } else if (event.data.nbBonnesReponses != null) {
              for (const exercice of this.listeExercices) {
                if (typeof (exercice.lien) != 'undefined') {
                  // A décommenter pour débugger lorsqu'il n'y a pas de confetti
                  // console.log('lienACopier ' + exercice.lien)
                  // console.log('url ' + url)
                  if (url.split('&serie=')[0].split(',i=')[0] == exercice.lien.split('&serie=')[0].split(',i=')[0]) { // Lorsqu'un exercice n'est pas interactifReady, le ,i=0 est retiré de l'url
                    this.lancerLesConfetti(exercice, event.data)
                    const graine = event.data.graine
                    this.MAJurlDejaFaits(type, exercice, graine, url, urlDejaFaits)
                  }
                }
              }
            }
          }
        }
      })
    }
  }

  creerDivPresenceListener() {
    const divListener = document.createElement('div')
    divListener.id = 'modaleExercicesListener'
    document.body.appendChild(divListener)
  }

  fermerEcranDeChargement(type: string, url: string, urlDejaFaits: string[]) {
    if (type == '') {
      this.hideLoadingScreen()
    } else if (type == 'exerciceAuHasard') {
      if (urlDejaFaits.includes(url.split('&serie=')[0].split(',i=')[0])) {
        this.exerciceAleatoireSuivant()
      } else {
        this.hideLoadingScreen()
      }
    }
  }

  lancerLesConfetti(exercice: Exercice, data: any) {
    const nbBonnesReponses: number = data.nbBonnesReponses
    const nbMauvaisesReponses: number = data.nbMauvaisesReponses
    if (nbBonnesReponses > 0 && nbMauvaisesReponses == 0 && exercice.isInteractif) {
      this.confettiService.lanceConfetti()
    }
  }

  MAJurlDejaFaits(type: string, exercice: Exercice, graine: string, url: string, urlDejaFaits: string[]) {
    urlDejaFaits.push(url.split('&serie=')[0].split(',i=')[0])
    this.set('urlDejaFaits', urlDejaFaits)
    if (type === 'exerciceAuHasard' && url.slice(0, 25) === 'https://mathsmentales.net') {
      setTimeout(() => this.exerciceAleatoireSuivant(), 3000)
    }
    this.set('dateDerniereReponse', new Date())
    if (url.slice(0, 25) === 'https://mathsmentales.net') {
      exercice.lien = `${url.split(',a=')[0]},a=${graine}${url.split(',a=')[1]}`
    } else {
      exercice.lien = url
    }
  }

  exerciceAleatoireSuivant() {
    const indiceExerciceActuel = this.get('indiceExerciceActuel')
    const listeDesIndices = this.get('listeDesIndices')
    const nouvelIndice = indiceExerciceActuel % (this.get('listeDesUrl').length - 1) + 1
    this.set('indiceExerciceActuel', nouvelIndice)
    const urlExerciceSuivant = this.get('listeDesUrl')[listeDesIndices[nouvelIndice]]
    if (!isDevMode()) this.displayLoadingScreen()
    this.ajouterIframe(urlExerciceSuivant)
  }

   recupererElementsHTML() {
    let element = document.getElementById("modaleExercices")
    if (element != null) this.modale = element
    element = document.getElementById("modaleExercicesUrl")
    if (element != null) this.modaleUrl = element
    element = document.getElementById("modal-copy")
    if (element != null) this.boutonCopier = element
    element = document.getElementById("modal-cross")
    if (element != null) this.boutonFermer = element
    element = document.getElementById("boutonCopierLoading")
    if (element != null) this.boutonCopierLoading = element
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

  parametrage() {
    this.modale.style.display = 'block'
    const type = this.get('type')
    if (!isDevMode()) this.displayLoadingScreen()
    this.creeListeIndicesExercices()
    let url: string = ''
    if (type == 'exerciceAuHasard') {
      url = this.get('listeDesUrl')[this.get('listeDesIndices')[this.get('indiceExerciceActuel')]]
    } else {
      url = this.get('listeDesUrl')[this.get('indiceExerciceActuel')]
    }
    this.ajouterIframe(url)
    this.set('lienACopier', this.infosModale[0][this.get('listeDesIndices')[this.get('indiceExerciceActuel')]])
    this.positionnerLesBoutons()
  }

  creeListeIndicesExercices() {
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
  ajouterIframe(url: string) {
    const iframeActuel = document.getElementById('iframeExercice1')
    let parent = <Node>this.modale // Pour le premier iframe
    if (iframeActuel != null && iframeActuel.parentNode != null) {
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

  positionnerLesBoutons() {
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
        break
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
        break
    }
  }

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

  fermerModale(valeur?: number) {
    this.modaleFermee.emit(valeur)
    const iframe = document.getElementById('iframeExercice1')
    if (iframe != null && iframe.parentNode != null) iframe.parentNode.removeChild(iframe)
    this.modale.style.display = "none"
    this.hideLoadingScreen()
  }

  displayLoadingScreen() {
    const loadingDiv = document.getElementById('loading')
    if (loadingDiv != null) loadingDiv.style.display = 'block'
  }

  hideLoadingScreen() {
    const loadingDiv = document.getElementById('loading')
    if (loadingDiv != null) loadingDiv.style.display = 'none'
  }

  copierLien() {
    navigator.clipboard.writeText(this.get('lienACopier'))
    alert('Le lien vers l\'exercice a été copié')
  }

  set(tag: string, objet: any) {
    this.apiService.set('ME' + tag, objet)
  }

  get(tag: string) {
    return this.apiService.get('ME' + tag)
  }

  isMathalea(url: string) {
    return url.slice(0, 34) == 'https://coopmaths.fr/mathalea.html'
  }

  isMathsmentales(url: string) {
    return url.slice(0, 25) == 'https://mathsmentales.net'
  }
}
