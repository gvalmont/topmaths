import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

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

  constructor(private fb: FormBuilder, public dataService: ApiService, private router: Router) {
    this.angForm = this.fb.group({
      identifiant: ['', [Validators.required, Validators.minLength(4), Validators.minLength(5)]]
    });
    this.defaut = true
    this.errGrandNbChar = false
    this.errPetitNbChar = false
    this.errSpChar = false
    this.shake = false
    this.loginVisible = false
    this.surveilleChamp()
    this.dataService.profilModifie.subscribe(valeursModifiees => {
      if (valeursModifiees.includes('identifiant')) this.router.navigate(['/profil'])
    })
  }

  /**
   * Secoue le champ si la saisie est incorrecte,
   * se connecte sinon
   * @param identifiant 
   */
  login(identifiant: string) {
    if (this.inputOk(identifiant)) {
      this.dataService.login(identifiant, true, true)
    } else {
      this.shake = true
      setTimeout(() => this.shake = false, 500)
    }
  }

  /**
   * Surveille le champ de connexion,
   * actualise les booléens sur lesquels s'appuie le formatage du champ
   */
  surveilleChamp() {
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
    if (!this.dataService.onlyLettersAndNumbers(input)) this.errSpChar = true
    return (!this.defaut && !this.errSpChar && !this.errPetitNbChar && !this.errGrandNbChar)
  }

  /**
   * Montre ou cache l'identifiant
   */
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