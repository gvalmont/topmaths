import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AccueilComponent } from './accueil/accueil.component'
import { ObjectifComponent } from './objectif/objectif.component'
import { ObjectifsComponent } from './objectifs/objectifs.component'
import { SequencesComponent } from './sequences/sequences.component'
import { SequenceComponent } from './sequence/sequence.component'
import { SPS1Component } from './sequencesParticulieres/sps1/sps1.component'
import { SPS2Component } from './sequencesParticulieres/sps2/sps2.component'
import { ExercicesAuHasardComponent } from './exercices-au-hasard/exercices-au-hasard.component'
import { MathadorComponent } from './outils/mathador/mathador.component'
import { OutilsComponent } from './outils/outils.component'
import { PolitiqueDeConfidentialiteComponent } from './politique-de-confidentialite/politique-de-confidentialite.component'
import { PanierComponent } from './panier/panier.component'
import { TableauDAideComponent } from './outils/tableau-d-aide/tableau-d-aide.component'
import { MentionsLegalesComponent } from './mentions-legales/mentions-legales.component'
import { CguComponent } from './cgu/cgu.component'

const routes: Routes = [
  { path: 'accueil', component: AccueilComponent, data: { title: 'topmaths.fr - Les maths au TOP !' } },
  { path: 'objectif/:reference', component: ObjectifComponent },
  { path: 'objectifs/:niveau/:theme/:sousTheme', component: ObjectifsComponent },
  { path: 'objectifs/:niveau/:theme', component: ObjectifsComponent },
  { path: 'objectifs/:niveau', component: ObjectifsComponent, data: { title: 'topmaths.fr - Objectifs' } },
  { path: 'objectifs', redirectTo: 'objectifs/tout' },
  { path: 'sequences/:niveau', component: SequencesComponent, data: { title: 'topmaths.fr - Séquences' } },
  { path: 'sequences', redirectTo: 'sequences/tout' },
  { path: 'sequence/SPS1', component: SPS1Component, data: { title: 'topmaths.fr - Programmation' } },
  { path: 'sequence/SPS2', component: SPS2Component, data: { title: 'topmaths.fr - Défis géométriques' } },
  { path: 'sequence/:reference', component: SequenceComponent },
  { path: 'exercices-au-hasard', component: ExercicesAuHasardComponent, data: { title: 'topmaths.fr - Exercices au hasard' } },
  { path: 'outils/mathador', component: MathadorComponent, data: { title: 'topmaths.fr - Mathador' }  },
  { path: 'outils/tableau-d-aide', component: TableauDAideComponent, data: { title: 'topmaths.fr - Tableau d\'aide' }  },
  { path: 'outils', component: OutilsComponent, data: { title: 'topmaths.fr - Outils pour la classe' }  },
  { path: 'panier', component: PanierComponent, data: { title: 'topmaths.fr - Panier' }  },
  { path: 'politique-de-confidentialite', component: PolitiqueDeConfidentialiteComponent, data: { title: 'topmaths.fr - Politique de confidentialité' } },
  { path: 'mentions-legales', component: MentionsLegalesComponent, data: { title: 'topmaths.fr - Mentions légales' } },
  { path: 'cgu', component: CguComponent, data: { title: 'topmaths.fr - CGU' }  },
  { path: '', component: AccueilComponent },
  { path: ':reference', component: ObjectifComponent },
  { path: '**', component: AccueilComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
