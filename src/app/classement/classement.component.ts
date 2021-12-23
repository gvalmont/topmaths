import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, Event as NavigationEvent } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UserSimplifie } from '../services/user';

@Component({
  selector: 'app-classement',
  templateUrl: './classement.component.html',
  styleUrls: []
})
export class ClassementComponent implements OnInit {
  ongletActif: string
  event$: any

  constructor(public dataService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.ongletActif = 'individuel'
    this.recupereOngletActif()
    this.recupereParametresUrl()
  }

  ngOnInit(): void {
    this.dataService.recupClassement()
  }
  
  ngOnDestroy() {
    this.event$.unsubscribe();
  }

  /**
   * Récupère l'onglet actif à partir de l'url pour le mettre en surbrillance
   */
   recupereOngletActif(){
    this.event$ = this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        this.ongletActif = event.url.split('/')[2]
      }
    });
  }

  /**
   * Récupère la catégorie à partir de l'url
   */
  recupereParametresUrl(){
    this.route.params.subscribe(params => {
      this.ongletActif = params.categorie
    })
  }
  
  /**
   * Renvoie le numéro du badge correspondant au classement
   * @param classement 
   * @returns 
   */
   top(classement: number) {
    if (classement <= 3) return classement
    else if (classement <= 5) return 5
    else if (classement <= 10) return 10
    else if (classement <= 20) return 20
    else if (classement <= 50) return 50
    else return 0
  }
  
  /**
   * Envoie l'utilisateur sur la page de trophées et indique que ce sont les trophées de user.pseudo
   * @param user
   */
   voirTropheesPerso(user: UserSimplifie) {
    this.dataService.pseudoClique = user.pseudo
    this.dataService.lienTropheesClique = user.lienTrophees
    this.router.navigate(['trophees', 'autre'])
  }
}
