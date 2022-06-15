import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UserSimplifie } from 'src/app/services/user';

@Component({
  selector: 'app-equipe.page',
  templateUrl: './equipe.page.component.html',
  styleUrls: ['./equipe.page.component.css']
})
export class EquipePageComponent implements OnInit {
  afficherCodeEquipe: boolean
  constructor(public http: HttpClient, private route: ActivatedRoute, public dataService: ApiService, private router: Router) {
    this.afficherCodeEquipe = false
    this.observeChangementsDeRoute()
  }

  ngOnInit(): void {
  }

  /**
   * Observe les changements de route,
   * modifie ensuite les paramètres selon le nom de l'équipe
   */
   observeChangementsDeRoute() {
    this.route.params.subscribe(params => {
      if (typeof(params.teamName) != 'undefined' && params.teamName != '') this.dataService.recupInfosEquipe(params.teamName)
    })
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
