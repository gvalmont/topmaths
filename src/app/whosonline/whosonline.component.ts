import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UserSimplifie } from '../services/user';

@Component({
  selector: 'app-whosonline',
  templateUrl: './whosonline.component.html',
  styleUrls: []
})
export class WhosonlineComponent implements OnInit {

  constructor(public dataService: ApiService, private router: Router) { }

  ngOnInit(): void {
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
   * Envoie l'utilisateur sur la page de classement et l'ancre correspondant au pseudo cliqué
   * @param user 
   */
  voirClassementPerso(user: UserSimplifie){
    this.router.navigate(['classement'], { fragment: user.pseudo })
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
