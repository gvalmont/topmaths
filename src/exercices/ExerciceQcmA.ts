import ExerciceQcm from './ExerciceQcm'

// class à utiliser pour fabriquer des Qcm ayant une version aléatoire
export default class ExerciceQcmA extends ExerciceQcm {
  versionAleatoire: () => void = () => {}
  constructor () {
    super()
    this.besoinFormulaireCaseACocher = ['Version originale', false]
    this.sup = false
    this.versionAleatoire()
  }

  aleatoire: ()=>void = () => {}
}
