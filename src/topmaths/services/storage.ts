import { modeEnseignant, modePerso } from '../../store'

export const storage = {
  recupererEtatModeEnseignant () {
    const obj = localStorage.getItem('modeEnseignant')
    if (obj !== null) modeEnseignant.set(JSON.parse(obj))
  },
  recupererEtatModePerso () {
    const obj = localStorage.getItem('modePerso')
    if (obj !== null) modePerso.set(JSON.parse(obj))
  },
  activerModeEnseignant () {
    localStorage.setItem('modeEnseignant', JSON.stringify(true))
    modeEnseignant.set(true)
  },
  desactiverModeEnseignant () {
    localStorage.setItem('modeEnseignant', JSON.stringify(false))
    modeEnseignant.set(false)
  },
  activerModePerso () {
    localStorage.setItem('modePerso', JSON.stringify(true))
    modePerso.set(true)
  },
  desactiverModePerso () {
    localStorage.setItem('modePerso', JSON.stringify(false))
    modePerso.set(false)
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
