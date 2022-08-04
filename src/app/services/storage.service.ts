import { EventEmitter, Injectable, Output } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  @Output() MAJPanier: EventEmitter<[string]> = new EventEmitter()
  modeEnseignant: boolean

  constructor () {
    this.modeEnseignant = false
    this.verifierActivationModeEnseignant()
  }

  verifierActivationModeEnseignant () {
    const obj = localStorage.getItem('modeEnseignant')
    if (obj !== null) this.modeEnseignant = <boolean> JSON.parse(obj)
  }

  activerModeEnseignant () {
    localStorage.setItem('modeEnseignant', JSON.stringify(true))
    this.modeEnseignant = true
  }

  desactiverModeEnseignant () {
    localStorage.setItem('modeEnseignant', JSON.stringify(false))
    this.modeEnseignant = false
  }

  get (key: string) {
    const obj = sessionStorage.getItem(key)
    if (obj !== null) return JSON.parse(obj)
  }

  set (key: string, objet: any) {
    sessionStorage.setItem(key, JSON.stringify(objet))
    if (key === 'panier') this.MAJPanier.emit(objet)
  }

  delete (key: string) {
    sessionStorage.removeItem(key)
    if (key === 'panier') this.MAJPanier.emit()
  }
}
