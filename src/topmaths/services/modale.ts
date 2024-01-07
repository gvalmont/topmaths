// eslint-disable-next-line camelcase
import { listeDesUrl, urlExercice, vue, vuePrecedente } from './store'
import { estCoopmaths, supprimerGraines } from './outils'
import { get } from 'svelte/store'

export function ouvrirModaleExercices (lien: string): void {
  listeDesUrl.set([])
  if (estCoopmaths(lien)) {
    afficherExercices(lien)
  } else {
    afficherModaleExercices(lien)
  }
}

function afficherExercices (lien: string): void {
  vuePrecedente.set(get(vue))
  urlExercice.set(supprimerGraines(lien))
  vue.set('exercices')
}

function afficherModaleExercices (lien: string): void {
  const modale = creerModale()
  const wrapper = ajouterWrapper(modale)
  ajouterBoutons(wrapper, lien)
  ajouterIframe(wrapper, lien)
}

function creerModale (): HTMLDivElement {
  const modale = document.createElement('div')
  modale.id = 'modaleExercices'
  modale.classList.add('pleinEcran')
  document.body.appendChild(modale)
  return modale
}

function ajouterWrapper (modale: HTMLDivElement): HTMLDivElement {
  const wrapper = document.createElement('div')
  wrapper.classList.add('pleinEcran')
  modale.appendChild(wrapper)
  return wrapper
}

function ajouterBoutons (wrapper: HTMLDivElement, lien: string): HTMLDivElement {
  const divBoutons = document.createElement('div')
  divBoutons.className = 'fixed h-10 z-20 top-3 right-36'
  wrapper.appendChild(divBoutons)

  ajouterBoutonCopier(divBoutons, lien)
  ajouterBoutonFermer(divBoutons)
  return divBoutons
}

function ajouterBoutonCopier (divBoutons: HTMLDivElement, lien: string): HTMLButtonElement {
  const boutonCopier = document.createElement('button')
  boutonCopier.className = 'mx-2'
  boutonCopier.onclick = (): void => {
    navigator.clipboard.writeText(lien)
    alert('Le lien a été copié')
  }
  divBoutons.appendChild(boutonCopier)

  const iconeCopie = document.createElement('i')
  iconeCopie.className = 'image is-32x32 is-inline-block'
  boutonCopier.appendChild(iconeCopie)

  const copie = document.createElement('img')
  copie.src = '/topmaths/img/cc0/copy-interface-symbol-svgrepo-com.svg'
  iconeCopie.appendChild(copie)

  return boutonCopier
}

function ajouterBoutonFermer (divBoutons: HTMLDivElement): HTMLButtonElement {
  const boutonFermer = document.createElement('button')
  boutonFermer.className = 'mx-2'
  boutonFermer.onclick = fermerModaleExercices
  divBoutons.appendChild(boutonFermer)

  const iconeCroix = document.createElement('i')
  iconeCroix.className = 'image is-32x32 is-inline-block'
  boutonFermer.appendChild(iconeCroix)

  const croix = document.createElement('img')
  croix.src = '/topmaths/img/cc0/cross-svgrepo-com.svg'
  iconeCroix.appendChild(croix)

  return boutonFermer
}

function fermerModaleExercices (): void {
  const modale = document.getElementById('modaleExercices')
  if (modale !== null) modale.remove()
}

function ajouterIframe (wrapper: HTMLDivElement, lien: string): void {
  const iframe = document.createElement('iframe')
  iframe.id = 'iframeModaleExercices'
  iframe.width = '100%'
  iframe.height = '100%'
  iframe.className = 'has-ratio'
  iframe.src = lien
  wrapper.appendChild(iframe)
}
