import { isTeacherMode, isPersonalMode } from '../services/store'

export default class Storage {
  static getTeacherModeState (): void {
    const obj = localStorage.getItem('teacherMode')
    if (obj !== null) isTeacherMode.set(JSON.parse(obj))
  }

  static getPersoModeState (): void {
    const obj = localStorage.getItem('modePerso')
    if (obj !== null) isPersonalMode.set(JSON.parse(obj))
  }

  static activateTeacherMode (): void {
    localStorage.setItem('teacherMode', JSON.stringify(true))
    isTeacherMode.set(true)
  }

  static deactivateTeacherMode (): void {
    localStorage.setItem('teacherMode', JSON.stringify(false))
    isTeacherMode.set(false)
  }

  static activerModePerso (): void {
    localStorage.setItem('modePerso', JSON.stringify(true))
    isPersonalMode.set(true)
  }

  static desactiverModePerso (): void {
    localStorage.setItem('modePerso', JSON.stringify(false))
    isPersonalMode.set(false)
  }

  static get (key: string): unknown {
    const obj = sessionStorage.getItem(key)
    if (obj !== null) return JSON.parse(obj)
  }

  static set (key: string, objet: unknown): void {
    sessionStorage.setItem(key, JSON.stringify(objet))
  }

  static delete (key: string): void {
    sessionStorage.removeItem(key)
  }
}
