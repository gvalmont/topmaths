import ListeDeroulante, { type AllChoicesType } from './ListeDeroulante'

class ListeDeroulanteElement extends HTMLElement {
  private _listeDeroulante?: ListeDeroulante

  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
  }

  static get observedAttributes () {
    return ['choices']
  }

  attributeChangedCallback (name: string, oldValue: string, newValue: string) {
    if (name === 'choices' && oldValue !== newValue) {
      this.render()
    }
  }

  connectedCallback () {
    this.render()
  }

  set choices (val: AllChoicesType) {
    this._choices = val
    this.render()
  }

  get choices (): AllChoicesType {
    return this._choices
  }

  private _choices: AllChoicesType = []

  render () {
    if (this.shadowRoot) this.shadowRoot.innerHTML = ''

    // Ajoute le CSS compilé directement ici (copie-colle le contenu du .css généré)
    const style = document.createElement('style')
    style.textContent = `
span.listeDeroulante {
  position: relative;
  display: inline-flex;
  background: #F0FFFF;
  vertical-align: middle;
  margin: 0;
  padding: 0;
  cursor: pointer;
  border-radius: 5px;
  border: solid 1px grey;
}
span.listeDeroulante span.currentChoice {
  margin: 0;
  padding: 2px 10px;
  display: flex;
  outline: none;
}
span.listeDeroulante .trigger {
  margin: 0;
  font-weight: bold;
  padding-right: 6px;
  padding-left: 5px;
  padding-top: 2px;
  border-left: 1px solid grey;
  outline: none;
}
span.listeDeroulante span.currentChoice:hover, span.listeDeroulante .trigger:hover {
  border-color: CornflowerBlue;
}
span.listeDeroulante .ok {
  color: #008A73;
}
span.listeDeroulante .ko {
  color: #D64700;
}
span.listeDeroulante ul {
  position: absolute;
  left: 0;
  border-color: grey;
  margin: 0;
  padding: 0;
  display: none;
  z-index: 60;
}
span.listeDeroulante ul li {
  display: flex;
  width: 100%;
  list-style-type: none;
  border: solid 1px grey;
  cursor: pointer;
  font-size: 100%;
  color: black;
  background: #F0FFFF;
  margin: 0;
  padding: 2px 5px;
  box-sizing: border-box;
  box-shadow: 0 0 0 0;
  white-space: nowrap;
}
span.listeDeroulante ul li.selected, span.listeDeroulante ul li:hover {
  border-color: black;
  background-color: #D3D3D3;
}
span.listeDeroulante ul.visible {
  display: inline-block;
}
liste-deroulante.listeDeroulante:hover {
  border-color: CornflowerBlue;
}
liste-deroulante.listeDeroulante.disabled {
  cursor: auto;
  border-color: grey;
}
liste-deroulante.listeDeroulante.disabled .trigger {
  color: lightgrey;
  border-color: grey;
}
liste-deroulante.listeDeroulante.disabled span.currentChoice {
  border-color: grey;
  pointer-events: none;
}
span.listeDeroulante math-field {
  pointer-events: none;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
  padding: 0 !important;
}
span.listeDeroulante ul li math-field .ML__mathlive {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
  padding: 0 !important;
}
  span.listeDeroulante ul li svg.svgChoice {
  width: 100%;
  max-width: 100%;
  height: 2em; /* ou ajuste selon la hauteur souhaitée */
  max-height: 2.5em;
  display: block;
  object-fit: contain;
  box-sizing: border-box;
}
span.listeDeroulante ul li,
span.listeDeroulante ul li * {
  cursor: pointer !important;
}
`
    this.shadowRoot!.appendChild(style)

    // Création du conteneur
    const container = document.createElement('span')
    this.shadowRoot!.appendChild(container)

    // Récupère les choix depuis l'attribut ou la propriété
    let choices: AllChoicesType = this.choices
    if (!choices.length && this.hasAttribute('choices')) {
      try {
        const attr = decodeURIComponent(this.getAttribute('choices')!)
        choices = JSON.parse(attr)
      } catch (e) {
        choices = []
      }
    }
    const choix0 = this.hasAttribute('choix0')
      ? this.getAttribute('choix0') !== 'false'
      : false

    // Création de la liste déroulante
    this._listeDeroulante = new ListeDeroulante(choices, { choix0 })
    this._listeDeroulante._init({ conteneur: container })
  }

  // API JS pour récupérer la valeur sélectionnée
  get value () {
    return this._listeDeroulante?.reponse ?? ''
  }

  set value (val) {
    if (this._listeDeroulante) { this._listeDeroulante.select(this._listeDeroulante.choices.findIndex(el => el.value === val) + this._listeDeroulante._offset) }
  }
}

customElements.define('liste-deroulante', ListeDeroulanteElement)
export default ListeDeroulanteElement
