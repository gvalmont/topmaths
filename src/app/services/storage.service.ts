import { EventEmitter, Injectable, Output } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  @Output() MAJPanier: EventEmitter<[string]> = new EventEmitter()

  constructor () { }

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
