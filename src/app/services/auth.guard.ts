import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router'
import { ProfilService } from './profil.service'

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  // eslint-disable-next-line no-unused-vars
  constructor (private profilService: ProfilService, private router: Router) {
  }

  canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.profilService.isloggedIn) {
      return true
    } else {
      this.profilService.redirectUrl = state.url
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } })
      return false
    }
  }

}