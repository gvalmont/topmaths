import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  /**
   * Crée un token dans le localStorage
   * @param key clé to token
   * @param value Valeur du token
   */
  setToken(key: string, value: string) {
    localStorage.setItem(key, value)
  }

  /**
   * Récupère la valeur du token key du localStorage
   * @param key
   * @returns Valeur du token key
   */
  getToken(key: string) {
    return localStorage.getItem(key)
  }

  /**
   * Supprime le token key du localStorage
   * @param key
   */
  deleteToken(key: string) {
    localStorage.removeItem(key)
  }

  /**
   * Ecrit dans le localStorage les valeurs séparés par des '!' s'il y en a plusieurs
   * @param tag nom de la "variable"
   * @param valeurs
   */
  set(tag: string, objet: any) {
    localStorage.setItem(tag, JSON.stringify(objet))
  }

  /**
   * Récupère un nombre du localStorage
   * @param tag nom de la "variable"
   * @returns
   */
  get(tag: string) {
    const obj = localStorage.getItem(tag)
    if (obj !== null) return JSON.parse(obj)
  }
}
