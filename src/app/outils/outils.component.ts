import { Component } from '@angular/core'
import { StorageService } from '../services/storage.service'

@Component({
  selector: 'app-outils',
  templateUrl: './outils.component.html',
  styleUrls: ['./outils.component.css']
})
export class OutilsComponent {

  // eslint-disable-next-line no-unused-vars
  constructor (public storageService: StorageService) { }

  activerModeEnseignant () {
    this.storageService.activerModeEnseignant()
  }

  desactiverModeEnseignant () {
    this.storageService.desactiverModeEnseignant()
  }

}
