import { Component } from '@angular/core'
import { StorageService } from '../services/storage.service'
import { PanierItem } from '../services/modeles/panier'
import { ViewportScroller } from '@angular/common'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css']
})
export class PanierComponent {
  panier: PanierItem[]
  lien: string
  infosModale: [string[], string, Date]

  // eslint-disable-next-line no-unused-vars
  constructor (private storageService: StorageService, private viewportScroller: ViewportScroller) {
    this.panier = storageService.get('panier')
    this.lien = ''
    this.infosModale = [[], '', new Date() ]
    this.MAJLien()
  }

  retirerDuPanier (panierItem: PanierItem) {
    delete this.panier[this.panier.indexOf(panierItem)]
    this.storageService.set('panier', this.panier)
    this.MAJLien()
  }

  viderLePanier () {
    this.panier = []
    this.storageService.delete('panier')
    this.MAJLien()
  }

  ouvrirModaleExercices () {
    this.MAJLien()
    this.infosModale = [[this.changerSerie(this.lien)], '', new Date() ]
  }

  MAJLien () {
    this.lien = environment.urlMathALEA
    for (const panierItem of this.panier) {
      if (panierItem !== null && panierItem !== undefined) {
        if (panierItem.slug.slice(0, 4) !== 'http' && panierItem.slug !== '') {
          this.lien = this.lien.concat('ex=', panierItem.slug, ',i=0&')
        }
      }
    }
    this.lien = this.lien.concat('v=e&z=1.5')
  }

  changerSerie (lien: string) {
    return lien.split('&serie=')[0] + '&serie=' + Math.random().toString(16).slice(2, 6) + lien.split('&serie=')[1]
  }

  scrollBack (): void {
    this.viewportScroller.scrollToAnchor('top')
  }
}
