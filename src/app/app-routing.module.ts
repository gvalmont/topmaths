import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ObjectifComponent } from './objectif/objectif.component';
import { ObjectifsComponent } from './objectifs/objectifs.component';
import { SequencesComponent } from './sequences/sequences.component';
import { SequenceComponent } from './sequence/sequence.component';
import { ModulesComponent } from './modules/modules.component';
import { ModuleComponent } from './module/module.component';
import { JeuxComponent } from './jeux/jeux.component';
import { LoginComponent } from './login/login.component';
import { ProfilComponent } from './profil/profil.component';
import { AuthguardGuard } from './services/auth.guard';
import { TimeguardGuard } from './services/time.guard';
import { ClassementComponent } from './classement/classement.component';
import { SPS1Component } from './sequencesParticulieres/sps1/sps1.component';
import { TropheesComponent } from './trophees/trophees.component';
import { RevisionsComponent } from './revisions/revisions.component';
import { ExercicesAuHasardComponent } from './exercices-au-hasard/exercices-au-hasard.component';
import { CompetitionsComponent } from './competitions/competitions.component';
import { EquipeModificationComponent } from './equipe/modification/equipe.modification.component';
import { EquipePageComponent } from './equipe/page/equipe.page.component';
import { AvatarComponent } from './avatar/avatar.component';
import { MathadorComponent } from './outils/mathador/mathador.component';
import { OutilsComponent } from './outils/outils.component';

const routes: Routes = [
  { path: 'accueil', component: AccueilComponent, data: {title: 'topmaths.fr - les maths au TOP !'} },
  { path: 'objectif/:ref', component: ObjectifComponent },
  { path: 'objectifs/:niveau/:theme/:sousTheme', component: ObjectifsComponent },
  { path: 'objectifs/:niveau/:theme', component: ObjectifsComponent },
  { path: 'objectifs/:niveau', component: ObjectifsComponent, data: {title: 'topmaths.fr - Objectifs'} },
  { path: 'objectifs', redirectTo: 'objectifs/tout' },
  { path: 'sequences/:niveau', component: SequencesComponent, data: {title: 'topmaths.fr - Séquences'} },
  { path: 'sequences', redirectTo: 'sequences/tout' },
  { path: 'modules/:niveau', component: ModulesComponent, data: {title: 'topmaths.fr - Modules'} },
  { path: 'modules', redirectTo: 'modules/tout' },
  { path: 'sequence/SPS1', component: SPS1Component, data: {title: 'topmaths.fr - Programmation'} },
  { path: 'sequence/:ref', component: SequenceComponent },
  { path: 'module/:ref', component: ModuleComponent },
  { path: 'trophees/:ref', component: TropheesComponent, canActivate: [TimeguardGuard], data: {title: 'topmaths.fr - Trophées'} },
  { path: 'jeux', component: JeuxComponent, canActivate: [TimeguardGuard], data: {title: 'topmaths.fr - Jeux'} },
  { path: 'login', component: LoginComponent, data: {title: 'topmaths.fr - Login'} },
  { path: 'profil/avatar', component: AvatarComponent, canActivate: [TimeguardGuard], data: {title: 'topmaths.fr - Avatar'}},
  { path: 'profil', component: ProfilComponent, canActivate: [AuthguardGuard], data: {title: 'topmaths.fr - Profil'} },
  { path: 'classement/:categorie', component: ClassementComponent, canActivate: [TimeguardGuard], data: {title: 'topmaths.fr - Classement'} },
  { path: 'classement', redirectTo: 'classement/individuel' },
  { path: 'revisions', component: RevisionsComponent, data: {title: 'topmaths.fr - Révisions'} },
  { path: 'exercices-au-hasard/:type', component: ExercicesAuHasardComponent, data: {title: 'topmaths.fr - Exercices au hasard'} },
  { path: 'exercices-au-hasard', component: ExercicesAuHasardComponent, data: {title: 'topmaths.fr - Exercices au hasard'} },
  { path: 'competitions/:action/:type', component: CompetitionsComponent, canActivate: [AuthguardGuard] },
  { path: 'competitions/:action', component: CompetitionsComponent, canActivate: [AuthguardGuard] },
  { path: 'competitions', component: CompetitionsComponent, data: {title: 'topmaths.fr - Compétitions'} },
  { path: 'team/admin/:ref', component: EquipeModificationComponent, canActivate: [AuthguardGuard, TimeguardGuard], data: {title: 'topmaths.fr - Modification de l\'équipe'}},
  { path: 'team/:teamName', canActivate: [TimeguardGuard], component: EquipePageComponent},
  { path: 'outils/mathador', component: MathadorComponent },
  { path: 'outils', component: OutilsComponent },
  { path: '', component: AccueilComponent },
  { path: ':ref', component: ObjectifComponent },
  { path: '**', component: AccueilComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
