import { qcmCamExport } from '../lib/amc/qcmCam'
import { propositionsQcm } from '../lib/interactif/qcm'
import { texteEnCouleurEtGras } from '../lib/outils/embellissements'
import { context } from '../modules/context'
import Exercice from './Exercice'

// export const uuid = 'UUID à modifier'
// export const titre = 'Titre de l'exercice à modifier'
// export const refs = [{'fr-fr',['ref française à renseigner']},{'fr-ch', ['ref suisse à renseigner]}]

export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'

export const nombreElementsDifferents = (liste: string[]) => {
  const elements = new Set(liste)
  return elements.size
}

// class à utiliser pour fabriquer des Qcms sans aléatoirisation (en cas d'aléatoirisation, on utilisera ExerciceQcmA à la place)
export default class ExerciceQcm extends Exercice {
  enonce!: string
  reponses!: string[]
  options: {vertical?: boolean, ordered: boolean, lastChoice?: number}
  versionAleatoire?: ()=>void
  versionOriginale:()=>void = () => {
    // Le texte récupéré avant le bloc des réponses (il ne faut pas oublier de doubler les \ du latex et de vérifier que les commandes latex sont supportées par Katex)
    this.enonce = 'Enoncé de la question'
    // Ici, on colle les différentes réponses prise dans le latex : attention !!! mettre la bonne en premier (elles seront brassées par propositionsQcm)
    this.reponses = [
      'réponse A', // La bonne réponse !
      'réponse B',
      'réponse C',
      'réponse D'
    ]
    this.correction = 'La correction'
  }

  constructor () {
    super()
    this.besoinFormulaire2CaseACocher = ['Consigne augmentée', false]
    this.sup2 = false
    // Il n'est pas prévu d'avoir plus d'une question car ceci est prévu pour un seul énoncé statique à la base même si on pourra changer les valeurs et prévoir une aléatoirisation
    this.nbQuestions = 1
    this.nbQuestionsModifiable = false
    this.spacing = 1 // à adapter selon le contenu de l'énoncé
    this.spacingCorr = 2 // idem pour la correction
    // Les options pour le qcm à modifier éventuellement (vertical à true pour les longues réponses par exemple)
    this.options = { vertical: false, ordered: false, lastChoice: 8 }
    this.versionOriginale()
  }

  nouvelleVersion () {
    if (this.versionAleatoire != null) {
      if (this.sup) this.versionOriginale()
      else this.versionAleatoire()
    } else {
      this.versionOriginale()
    }
    if (this.sup2) {
      this.consigne = `Parmi les ${this.reponses.length} réponses ci-dessous, une seule est correcte.<br>
${this.interactif || context.isAmc ? 'Cocher la case correspondante.' : 'Donner la lettre correspondante.'}`
    } else {
      this.consigne = ''
    }
    let texte = this.enonce
    this.autoCorrection[0] = {}
    if (this.options != null) {
      this.autoCorrection[0].options = { ...this.options }
    }
    this.autoCorrection[0].propositions = []
    for (let i = 0; i < this.reponses.length; i++) {
      this.autoCorrection[0].propositions.push({
        texte: this.reponses[i],
        statut: i === 0
      })
    }

    const lettres = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].slice(0, this.reponses.length)

    const monQcm = propositionsQcm(this, 0, { style: 'margin:0 3px 0 3px;', format: this.interactif ? 'case' : 'lettre' })
    texte += `<br>${monQcm.texte}`

    const laBonneLettre = lettres[this.autoCorrection[0].propositions.findIndex(el => el.statut)]
    // Ici on colle le texte de la correction à partir du latex d'origine (vérifier la compatibilité Katex et doubler les \)s
    const texteCorr = `${this.correction}<br>${this.interactif ? '' : `La bonne réponse est la réponse ${texteEnCouleurEtGras(laBonneLettre)}.`}`

    this.listeQuestions[0] = texte
    this.listeCorrections[0] = texteCorr
  }

  // Pour permettre d'exporter tous les qcm pour en faire des séries de questions pour QcmCam. Ne pas y toucher
  qcmCamExport (): {question: string, reponse: string}[] {
    return qcmCamExport(this)
  }
}
