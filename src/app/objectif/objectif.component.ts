import { ViewportScroller } from '@angular/common'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Objectif, Video, Exercice } from '../services/modeles/objectifs'
import { Title } from '@angular/platform-browser'
import { DataService } from '../services/data.service'
import { Subscription } from 'rxjs'
import { Sequence } from '../services/modeles/sequences'
import { StorageService } from '../services/storage.service'
import { PanierItem } from '../services/modeles/panier'
import { environment } from 'src/environments/environment'
import { OutilsService } from '../services/outils.service'

@Component({
  selector: 'app-objectif',
  templateUrl: './objectif.component.html',
  styleUrls: ['./objectif.component.css']
})
export class ObjectifComponent implements OnInit, OnDestroy {
  reference: string
  niveau: string
  titre: string
  rappelDuCoursHTML: string
  rappelDuCoursImage: string
  rappelDuCoursInstrumenpoche: string
  videos: Video[]
  exercices: Exercice[]
  lienExercices: string
  sequences: Sequence[]
  infosModale: [string[], string, Date]
  dataMAJSubscription: Subscription
  tousLesExercicesSontDansLePanier: boolean

  // eslint-disable-next-line no-unused-vars
  constructor (private activatedRoute: ActivatedRoute, private dataService: DataService, public router: Router, private viewportScroller: ViewportScroller, private titleService: Title, public storageService: StorageService, private outilsService: OutilsService) {
    this.reference = ''
    this.niveau = ''
    this.titre = ''
    this.rappelDuCoursHTML = ''
    this.rappelDuCoursImage = ''
    this.rappelDuCoursInstrumenpoche = ''
    this.videos = []
    this.exercices = []
    this.lienExercices = ''
    this.sequences = []
    this.infosModale = [[], '', new Date() ]
    this.dataMAJSubscription = new Subscription
    this.tousLesExercicesSontDansLePanier = false
  }

  ngOnInit (): void {
    this.viewportScroller.scrollToAnchor('titre')
    this.surveillerChangementsDeReference()
    this.surveillerLeChargementDesDonnees()
  }

  ngOnDestroy () {
    this.dataMAJSubscription.unsubscribe()
  }

  surveillerChangementsDeReference () {
    this.activatedRoute.params.subscribe(params => {
      this.reference = params.reference
      if (this.lesDonneesSontChargees()) this.MAJPage()
    })
  }

  surveillerLeChargementDesDonnees () {
    this.dataMAJSubscription = this.dataService.dataMAJ.subscribe(valeurModifiee => {
      if (valeurModifiee === 'niveauxObjectifs' || valeurModifiee === 'niveauxSequences') {
        if (this.lesDonneesSontChargees()) this.MAJPage()
      }
    })
  }

  lesDonneesSontChargees () {
    return this.dataService.niveauxObjectifs.length > 0 && this.dataService.niveauxSequences.length > 0
  }

  MAJPage () {
    const objectif: Objectif = this.getObjectif()
    this.sequences = this.getSequences()
    this.niveau = objectif.reference.slice(0, 1) + 'e'
    this.MAJProprietes(objectif)
  }

  getObjectif () {
    for (const niveau of this.dataService.niveauxObjectifs) {
      for (const theme of niveau.themes) {
        for (const sousTheme of theme.sousThemes) {
          for (const objectif of sousTheme.objectifs) {
            if (objectif.reference === this.reference) {
              return objectif
            }
          }
        }
      }
    }
    return new Objectif('', '', 0, '', '', '', [], [])
  }

  getSequences () {
    const listeDesSequences = []
    for (const niveau of this.dataService.niveauxSequences) {
      for (const sequence of niveau.sequences) {
        for (const objectif of sequence.objectifs) {
          if (objectif.reference === this.reference) {
            listeDesSequences.push(sequence)
          }
        }
      }
    }
    return listeDesSequences
  }

  MAJProprietes (objectif: Objectif) {
    this.titre = `${objectif.reference} : ${objectif.titre}`
    this.titleService.setTitle(this.titre)
    this.MAJRappelDuCours(objectif)
    this.MAJVideos(objectif)
    this.MAJLienExercices(objectif)
    this.MAJExercices(objectif)
    this.MAJLienTelechargement(objectif.reference, 'entrainement')
    this.MAJAffichageSequences()
    if (this.storageService.modeEnseignant) this.MAJLienTelechargement(objectif.reference, 'test')
  }

  MAJRappelDuCours (objectif: Objectif) {
    this.rappelDuCoursHTML = objectif.rappelDuCoursHTML
    if (objectif.rappelDuCoursImage === '') {
      this.rappelDuCoursImage = ''
    } else {
      this.rappelDuCoursImage = '../assets/img/' + objectif.rappelDuCoursImage
    }
    if (objectif.rappelDuCoursInstrumenpoche === '' || typeof objectif.rappelDuCoursInstrumenpoche === 'undefined') {
      this.rappelDuCoursInstrumenpoche = ''
    } else {
      this.rappelDuCoursInstrumenpoche = objectif.rappelDuCoursInstrumenpoche
    }
  }

  MAJVideos (objectif: Objectif) {
    this.videos = []
    for (const video of objectif.videos) {
      if (video.slug !== '') {
        let lienVideo: string
        if (video.slug.slice(0, 4) === 'http') {
          lienVideo = video.slug
        } else {
          lienVideo = "https://www.youtube.com/embed/" + video.slug
        }
        this.videos.push({
          titre: video.titre,
          slug: video.slug,
          auteur: video.auteur,
          lienAuteur: video.lienAuteur,
          lienVideo: lienVideo
        })
      }
    }
  }

  MAJLienExercices (objectif: Objectif) {
    this.lienExercices = environment.urlMathALEA
    let nbExercices = 0
    for (const exercice of objectif.exercices) {
      if (exercice.slug !== '' && exercice.slug.slice(0, 4) !== 'http') {
        this.lienExercices = this.lienExercices.concat('ex=', exercice.slug, ',i=0&')
        nbExercices ++
      }
    }
    this.lienExercices = this.lienExercices.concat('v=e&z=1.5')
    if (nbExercices === 0) this.lienExercices = ''
  }

  MAJExercices (objectif: Objectif) {
    this.exercices = []
    for (const exercice of objectif.exercices) {
      if (exercice.slug !== '') {
        this.exercices.push({
          id: exercice.id,
          slug: exercice.slug,
          lien: `${environment.urlMathALEA}ex=${exercice.slug},i=0&serie=&v=e&z=1.5`,
          isInteractif: exercice.isInteractif,
          description: exercice.description
        })
        this.exercices[this.exercices.length - 1].lien = this.exercices[this.exercices.length - 1].lien.replace(/&ex=/g, ',i=0&ex=') // dans le cas où il y aurait plusieurs exercices dans le même slug
        if (this.outilsService.estMathsMentales(exercice.slug)) {
          this.exercices[this.exercices.length - 1].lien = exercice.slug + '&embed=' + environment.origine
        } else if (exercice.slug.slice(0, 4) === 'http') {
          this.exercices[this.exercices.length - 1].lien = exercice.slug
        }
        if (this.estPresentDansLePanier(exercice.id)) {
          this.exercices[this.exercices.length - 1].estDansLePanier = true
        } else {
          this.exercices[this.exercices.length - 1].estDansLePanier = false
        }
      }
    }
    this.verifierSiTousLesExercicesSontPresentsDansLePanier()
  }

  MAJLienTelechargement (reference: string, type: string) {
    const lien = `assets/${type}/${reference.slice(0, 1)}e/${type.charAt(0).toUpperCase() + type.slice(1)}_${reference}.pdf`
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        majDivLigneTelechargement(type, lien)
      }
    }
    xhttp.open("HEAD", lien, true)
    xhttp.send()

    function majDivLigneTelechargement (type: string, lien: string) {
      let divId = '', description
      switch (type) {
        case 'entrainement':
          divId = 'lienEntrainement'
          description = 'la feuille d\'entraînement'
          break
        case 'test':
          divId = 'lienTest'
          description = 'les tests'
          break
      }
      const div = document.getElementById(divId)
      if (div !== null) {
        div.innerHTML = `<a href=${lien}>
        Télécharger ${description}
          &nbsp;
          <i class='image is-24x24 is-inline-block'>
            <img src='/assets/img/cc0/pdf-file-format-symbol-svgrepo-com.svg' />
          </i>
        </a>`
        div.style.display = 'block'
      }
      const divTelechargement = document.getElementById('divTelechargements')
      if (divTelechargement !== null) {
        divTelechargement.classList.remove('cache')
      }
    }
  }

  MAJAffichageSequences () {
    const divSequences = document.getElementById('divSequences')
    if (divSequences !== null && this.sequences.length === 0) divSequences.classList.add('cache')
  }

  ouvrirModaleExercices (lien: string | undefined) {
    if (typeof lien !== 'undefined') {
      this.infosModale = [[this.changerSerie(lien)], '', new Date() ]
    }
  }

  changerSerie (lien: string) {
    if (this.outilsService.estMathALEA(lien)) {
      const lienSplit = lien.split('&serie=')
      return lienSplit[0] + '&serie=' + Math.random().toString(16).slice(2, 6) + (lienSplit.length > 1 ? lienSplit[1] : '')
    } else {
      return lien
    }
  }

  toutAjouterAuPanier () {
    for (let i = 0; i < this.exercices.length; i++) {
      this.ajouterAuPanier(i)
    }
  }

  ajouterAuPanier (exerciceIndex: number) {
    const exercice = this.exercices[exerciceIndex]
    const description = exercice.description !== undefined && exercice.description !== '' ? exercice.description : this.exercices.length > 1 ? 'Exercices de niveau ' + (exerciceIndex + 1) : 'Lancer l\'exercice'
    const panierActuel = <PanierItem[]> this.storageService.get('panier')
    const panierItem = { id: exercice.id, objectif: this.titre, description, slug: exercice.slug }
    if (!this.estPresentDansLePanier(panierItem.id, panierActuel)) {
      this.exercices[exerciceIndex].estDansLePanier = true
      this.verifierSiTousLesExercicesSontPresentsDansLePanier()
      let panier = <PanierItem[]>[]
      if (panierActuel !== undefined) panier = panierActuel
      panier.push(panierItem)
      this.storageService.set('panier', panier)
    }
  }

  verifierSiTousLesExercicesSontPresentsDansLePanier () {
    if (this.tousLesExercicesSontPresentsDansLePanier()) {
      this.tousLesExercicesSontDansLePanier = true
    } else {
      this.tousLesExercicesSontDansLePanier = false
    }
  }

  tousLesExercicesSontPresentsDansLePanier () {
    for (const exercice of this.exercices) {
      if (!exercice.estDansLePanier) return false
    }
    return true
  }

  estPresentDansLePanier (exerciceId: string, panierActuel: PanierItem[] = <PanierItem[]> this.storageService.get('panier')) {
    if (panierActuel !== undefined) {
      for (const panierActuelItem of panierActuel) {
        if (panierActuelItem !== null && panierActuelItem.id === exerciceId) return true
      }
    }
    return false
  }

  scrollBack (): void {
    this.viewportScroller.scrollToAnchor('divExercices')
  }
}
