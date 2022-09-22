import { Component } from '@angular/core'

interface seance {
  description: string,
  slug: string
}

@Component({
  selector: 'app-sps2',
  templateUrl: './sps2.component.html',
  styleUrls: ['./sps2.component.css']
})
export class SPS2Component {
  seances: seance[]
  infosModale: [string[], string, Date]

  constructor () {
    this.seances = [
      {
        description: 'Juste des segments',
        slug: '58711'
      },
      {
        description: 'Seulement des segments',
        slug: '58713'
      },
      {
        description: 'Avec des droites et des demi-droites',
        slug: '58733'
      },
      {
        description: 'Juste des cercles et des arcs de cercles',
        slug: '58735'
      },
      {
        description: 'Des droites et des cercles pour des experts',
        slug: '58737'
      },
      {
        description: 'Avec des macros',
        slug: '58739'
      }
    ]
    this.infosModale = [[], '', new Date() ]
  }

  ouvrirModaleExercices (lien: string | undefined) {
    if (typeof lien !== 'undefined') {
      this.infosModale = [[lien], '', new Date() ]
    }
  }

}
