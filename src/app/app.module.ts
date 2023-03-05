import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module'
import { SafePipe } from './services/pipes/safe.pipe'
import { ObjectifsFilter } from './services/pipes/objectifsFilter.pipe'
import { SequencesFilter } from './services/pipes/sequencesFilter.pipe'
import { AppComponent } from './app.component'
import { ObjectifComponent } from './objectif/objectif.component'
import { AccueilComponent } from './accueil/accueil.component'
import { ObjectifsComponent } from './objectifs/objectifs.component'
import { SequencesComponent } from './sequences/sequences.component'
import { SequenceComponent } from './sequence/sequence.component'
import { HashLocationStrategy, LocationStrategy } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MathjaxModule } from 'mathjax-angular'
import { SPS1Component } from './sequencesParticulieres/sps1/sps1.component'
import { ExercicesAuHasardComponent } from './exercices-au-hasard/exercices-au-hasard.component'
import { ModaleExercicesComponent } from './modale-exercices/modale-exercices.component'
import { MathadorComponent } from './outils/mathador/mathador.component'
import { OutilsComponent } from './outils/outils.component'
import { BoutonImprimerComponent } from './mini-components/bouton-imprimer/bouton-imprimer.component'
import { AnimationInstrumenpocheComponent } from './mini-components/animation-instrumenpoche/animation-instrumenpoche.component'
import { PolitiqueDeConfidentialiteComponent } from './politique-de-confidentialite/politique-de-confidentialite.component'
import { PanierComponent } from './panier/panier.component'
import { BoutonDropdownSimpleComponent } from './mini-components/bouton-dropdown-simple/bouton-dropdown-simple.component'
import { SPS2Component } from './sequencesParticulieres/sps2/sps2.component'
import { LecteurDeXlsComponent } from './mini-components/lecteur-de-xls/lecteur-de-xls.component'
import { MentionsLegalesComponent } from './mentions-legales/mentions-legales.component'
import { CguComponent } from './cgu/cgu.component'
import { ModaleTutoXlsComponent } from './mini-components/modale-tuto-xls/modale-tuto-xls.component'

@NgModule({
  declarations: [
    AppComponent,
    ObjectifComponent,
    AccueilComponent,
    SafePipe,
    ObjectifsComponent,
    SequencesComponent,
    SequenceComponent,
    SPS1Component,
    SPS2Component,
    ExercicesAuHasardComponent,
    ModaleExercicesComponent,
    MathadorComponent,
    OutilsComponent,
    BoutonImprimerComponent,
    AnimationInstrumenpocheComponent,
    PolitiqueDeConfidentialiteComponent,
    ObjectifsFilter,
    SequencesFilter,
    PanierComponent,
    BoutonDropdownSimpleComponent,
    LecteurDeXlsComponent,
    MentionsLegalesComponent,
    CguComponent,
    ModaleTutoXlsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MathjaxModule.forRoot({
      "config": {
        "loader": {
          "load": [ "output/svg", "[tex]/require", "[tex]/ams" ]
        },
        "tex": {
          "inlineMath": [[ "$", "$" ]],
          "packages": [ "base", "require", "ams" ]
        },
        "svg": {
          "fontCache": "global"
        }
      },
      "src": "https://cdn.jsdelivr.net/npm/mathjax@3.0.0/es5/startup.js"
    }),
    MathjaxModule.forChild()
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
