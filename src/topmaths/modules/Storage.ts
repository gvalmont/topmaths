import { isTeacherMode, isPersonalMode } from '../services/store'

export default class Storage {
  // TeacherMode and PersonalMode are stored in localStorage
  static getTeacherMode (): boolean {
    const obj = localStorage.getItem('teacherMode')
    if (obj == null) return false
    return JSON.parse(obj)
  }

  static setTeacherMode (teacherMode: boolean): void {
    localStorage.setItem('teacherMode', JSON.stringify(teacherMode))
    isTeacherMode.set(teacherMode)
  }

  static getPersonalMode (): boolean {
    const obj = localStorage.getItem('personalMode')
    if (obj == null) return false
    return JSON.parse(obj)
  }

  static setPersonalMode (personalMode: boolean): void {
    localStorage.setItem('personalMode', JSON.stringify(personalMode))
    isPersonalMode.set(personalMode)
  }

  // generic set and get for other data stored in sessionStorage
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
