import { isTeacherMode, isPersonalMode } from './store'

export const storage = {
  getTeacherModeState () {
    const obj = localStorage.getItem('teacherMode')
    if (obj !== null) isTeacherMode.set(JSON.parse(obj))
  },
  getPersoModeState () {
    const obj = localStorage.getItem('modePerso')
    if (obj !== null) isPersonalMode.set(JSON.parse(obj))
  },
  activateTeacherMode () {
    localStorage.setItem('teacherMode', JSON.stringify(true))
    isTeacherMode.set(true)
  },
  deactivateTeacherMode () {
    localStorage.setItem('teacherMode', JSON.stringify(false))
    isTeacherMode.set(false)
  },
  activerModePerso () {
    localStorage.setItem('modePerso', JSON.stringify(true))
    isPersonalMode.set(true)
  },
  desactiverModePerso () {
    localStorage.setItem('modePerso', JSON.stringify(false))
    isPersonalMode.set(false)
  },
  get (key: string) {
    const obj = sessionStorage.getItem(key)
    if (obj !== null) return JSON.parse(obj)
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set (key: string, objet: any) {
    sessionStorage.setItem(key, JSON.stringify(objet))
  },
  delete (key: string) {
    sessionStorage.removeItem(key)
  }
}
