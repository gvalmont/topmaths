import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ObjectifComponent } from './objectif/objectif.component';
import { ObjectifsComponent } from './objectifs/objectifs.component';
import { SequencesComponent } from './sequences/sequences.component';
import { SequenceComponent } from './sequence/sequence.component';
import { JeuxComponent } from './jeux/jeux.component';
import { LoginComponent } from './login/login.component';
import { ProfilComponent } from './profil/profil.component';
import { AuthguardGuard } from './services/auth.guard';
import { ClassementComponent } from './classement/classement.component';
import { SPS1Component } from './sequencesParticulieres/sps1/sps1.component';
import { TropheesComponent } from './trophees/trophees.component';
import { RevisionsComponent } from './revisions/revisions.component';
import { ExercicesAuHasardComponent } from './exercices-au-hasard/exercices-au-hasard.component';
import { CompetitionsComponent } from './competitions/competitions.component';
import { EquipeModificationComponent } from './equipe/modification/equipe.modification.component';
import { EquipePageComponent } from './equipe/page/equipe.page.component';

const routes: Routes = [
  { path: 'accueil', component: AccueilComponent },
  { path: 'objectif/:ref', component: ObjectifComponent },
  { path: 'objectifs/:niveau/:theme/:sousTheme', component: ObjectifsComponent },
  { path: 'objectifs/:niveau/:theme', component: ObjectifsComponent },
  { path: 'objectifs/:niveau', component: ObjectifsComponent },
  { path: 'objectifs', redirectTo: 'objectifs/tout' },
  { path: 'sequences/:niveau', component: SequencesComponent },
  { path: 'sequences', redirectTo: 'sequences/tout' },
  { path: 'sequence/SPS1', component: SPS1Component },
  { path: 'sequence/:ref', component: SequenceComponent },
  { path: 'trophees/:ref', component: TropheesComponent },
  { path: 'jeux', component: JeuxComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profil', component: ProfilComponent, canActivate: [AuthguardGuard] },
  { path: 'classement/:categorie', component: ClassementComponent },
  { path: 'classement', redirectTo: 'classement/individuel' },
  { path: 'revisions', component: RevisionsComponent },
  { path: 'exercices-au-hasard', component: ExercicesAuHasardComponent },
  { path: 'competitions', component: CompetitionsComponent },
  { path: 'team/admin/:ref', component: EquipeModificationComponent, canActivate: [AuthguardGuard]},
  { path: 'team/:teamName', component: EquipePageComponent},
  { path: '', component: AccueilComponent },
  { path: ':ref', component: ObjectifComponent },
  { path: '**', component: AccueilComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
