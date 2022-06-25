import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor () { }

  get (key: string) {
    const obj = localStorage.getItem(key)
    if (obj !== null) return JSON.parse(obj)
  }

  set (key: string, objet: any) {
    localStorage.setItem(key, JSON.stringify(objet))
  }

  delete (key: string) {
    localStorage.removeItem(key)
  }
}
