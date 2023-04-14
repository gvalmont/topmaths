import { ViewportScroller } from '@angular/common'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Objectif } from '../services/modeles/objectifs'
import { Title } from '@angular/platform-browser'
import { DataService } from '../services/data.service'
import { Subscription } from 'rxjs'
import { StorageService } from '../services/storage.service'
import { PanierItem } from '../services/modeles/panier'
import { OutilsService } from '../services/outils.service'

@Component({
  selector: 'app-objectif',
  templateUrl: './objectif.component.html',
  styleUrls: ['./objectif.component.css']
})
export class ObjectifComponent implements OnInit, OnDestroy {
  niveau: string
  reference: string
  objectif: Objectif
  infosModale: [string[], string, Date]
  dataMAJSubscription: Subscription
  tousLesExercicesSontDansLePanier: boolean

  // eslint-disable-next-line no-unused-vars
  constructor (private activatedRoute: ActivatedRoute, private dataService: DataService, public router: Router, private viewportScroller: ViewportScroller, private titleService: Title, public storageService: StorageService, private outilsService: OutilsService) {
    this.niveau = ''
    this.reference = ''
    this.objectif = new Objectif('', '', 0, '', '', '', [], [], [], '', { entrainement: false, test: false })
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
      if (valeurModifiee === 'niveauxObjectifs') {
        if (this.lesDonneesSontChargees()) this.MAJPage()
      }
    })
  }

  lesDonneesSontChargees () {
    return this.dataService.niveauxObjectifs.length > 0 && this.dataService.niveauxSequences.length > 0
  }

  MAJPage () {
    this.objectif = this.getObjectif()
    this.niveau = this.objectif.reference.slice(0, 1) + 'e'
    this.MAJProprietes()
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
    return new Objectif('', '', 0, '', '', '', [], [], [], '', { entrainement: false, test: false })
  }

  MAJProprietes () {
    this.titleService.setTitle(this.objectif.titre)
    this.MAJPanier()
  }

  MAJPanier () {
    for (const exercice of this.objectif.exercices) {
      if (exercice.slug !== '') {
        if (this.estPresentDansLePanier(exercice.id)) {
          exercice.estDansLePanier = true
        } else {
          exercice.estDansLePanier = false
        }
      }
    }
    this.verifierSiTousLesExercicesSontPresentsDansLePanier()
  }

  ouvrirModaleExercices (lien: string | undefined) {
    if (lien !== undefined) {
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
    for (let i = 0; i < this.objectif.exercices.length; i++) {
      this.ajouterAuPanier(i)
    }
  }

  ajouterAuPanier (exerciceIndex: number) {
    const exercice = this.objectif.exercices[exerciceIndex]
    const description = exercice.description !== undefined && exercice.description !== '' ? exercice.description : this.objectif.exercices.length > 1 ? 'Exercices de niveau ' + (exerciceIndex + 1) : 'Lancer l\'exercice'
    const panierActuel = <PanierItem[]> this.storageService.get('panier')
    const panierItem = { id: exercice.id, objectif: this.objectif.titre, description, slug: exercice.slug }
    if (!this.estPresentDansLePanier(panierItem.id, panierActuel)) {
      this.objectif.exercices[exerciceIndex].estDansLePanier = true
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
    for (const exercice of this.objectif.exercices) {
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
