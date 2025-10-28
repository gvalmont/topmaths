export class BetaQcmRadio extends ExerciceSimple {
  constructor() {
    super()
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.optionsDeComparaison = { nombreDecimalSeulement: true }
    this.versionQcmDisponible = true

    this.versionQcm = true
  }

  nouvelleVersion() {
    this.question = 'Question exemple pour QCM radio'
    this.reponse = 'Réponse correcte'
    this.distracteurs = ['Distracteur 1', 'Distracteur 2', 'Distracteur 3']
    this.canEnonce = 'Choisir la bonne réponse.'
    this.canReponseACompleter = `La bonne réponse est $\\ldots$`
  }
}
