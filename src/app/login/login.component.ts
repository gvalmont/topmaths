import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { OutilsService } from '../services/outils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  angForm: FormGroup
  defaut: boolean
  errGrandNbChar: boolean
  errPetitNbChar: boolean
  errSpChar: boolean
  shake: boolean
  loginVisible: boolean

  // eslint-disable-next-line no-unused-vars
  constructor(private fb: FormBuilder, public apiService: ApiService, private router: Router, private outilsService: OutilsService) {
    this.angForm = this.fb.group({
      identifiant: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(5)]]
    })
    this.defaut = true
    this.errGrandNbChar = false
    this.errPetitNbChar = false
    this.errSpChar = false
    this.shake = false
    this.loginVisible = false
    this.surveillerChamp()
    this.apiService.profilModifie.subscribe(valeursModifiees => {
      if (valeursModifiees.includes('identifiant')) this.router.navigate(['/profil'])
    })
  }

  login(identifiant: string) {
    if (this.inputOk(identifiant)) {
      const bouton = <HTMLButtonElement> document.getElementById("loginButton")
      if (bouton != null) bouton.disabled = true
      this.apiService.login(identifiant, false, true)
    } else {
      this.shake = true
      setTimeout(() => this.shake = false, 500)
    }
  }

  surveillerChamp() {
    this.angForm.valueChanges.subscribe(x => {
      this.inputOk(x.identifiant)
    })
  }

  inputOk(input: string) {
    this.defaut = true
    this.errSpChar = false
    this.errPetitNbChar = false
    this.errGrandNbChar = false
    if (input.length != 0) this.defaut = false
    if (input.length < 4 && input.length != 0) this.errPetitNbChar = true
    if (input.length > 5) this.errGrandNbChar = true
    if (!this.outilsService.onlyLettersAndNumbers(input)) this.errSpChar = true
    return (!this.defaut && !this.errSpChar && !this.errPetitNbChar && !this.errGrandNbChar)
  }

  montrerCacherIdentifiant() {
    const champLogin = <HTMLInputElement>document.getElementById('champLogin')
    if (champLogin.type === 'password') {
      champLogin.type = 'text'
      this.loginVisible = true
    } else {
      champLogin.type = 'password'
      this.loginVisible = false
    }
  }
}