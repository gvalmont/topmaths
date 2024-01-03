export interface ObjectifVideo {titre: string, slug: string, auteur: string, lienAuteur: string, lienVideo: string}

export interface ObjectifExercice {id: string, slug: string, lien: string, isInteractif: boolean, description: string, estDansLePanier: boolean}

export interface ObjectifFiche {debutDeSeance: string[], deroule: string[], devoirs: string[], finDeSeance: string[], materielEleve: string[], materielEnseignant: string[], niveaux: string[], notes: string[], prochaineSeance: string[], reference: string}

export interface ObjectifSequence {reference: string, titre: string}

export interface ObjectifTelechargementsDisponibles {entrainement: boolean, test: boolean, fiche: boolean, niveauxFiches: string[]}

export interface ObjectifObjectif {reference: string, titre: string, titreSimplifie: string, periode: number, rappelDuCoursHTML: string, rappelDuCoursImage: string, rappelDuCoursInstrumenpoche: string, videos: ObjectifVideo[], exercices: ObjectifExercice[], fiches: ObjectifFiche[], exercicesDeBrevet: ObjectifExercice[], lienExercices: string, lienExercicesDeBrevet: string, sequences: ObjectifSequence[], telechargementsDisponibles: ObjectifTelechargementsDisponibles, theme: string, niveau: string}

export interface ObjectifSousTheme {nom: string, objectifs: ObjectifObjectif[], nbObjectifsParPeriode: number[]}

export interface ObjectifTheme {nom: string, sousThemes: ObjectifSousTheme[], nbObjectifsParPeriode: number[]}

export interface ObjectifNiveau {nom: string, themes: ObjectifTheme[]}

export interface SequenceObjectif {reference: string, titre: string, titreSimplifie: string, exercices: ObjectifExercice[], exercicesDeBrevet: ObjectifExercice[], theme: string, niveau: string, fiches: ObjectifFiche[]}

export interface SequenceCalculMental {reference: string, titre: string, titreSimplifie: string, exercices: ObjectifExercice[], pageExiste: boolean, theme: string}

export interface SequenceQuestionFlash {reference: string, titre: string, titreSimplifie: string, slug: string, pageExiste: boolean, theme: string}

export interface SequenceTelechargementsDisponibles {cours: boolean, resume: boolean, mission: boolean, fiche: boolean}

export interface SequenceSequenceParticuliere {reference: string, titre: string}

export interface SequenceSequence {niveau: string, numero: number, reference: string, titre: string, periode: number, objectifs: SequenceObjectif[], calculsMentaux: SequenceCalculMental[], questionsFlash: SequenceQuestionFlash[], lienQuestionsFlash: string, slugEvalBrevet: string, lienEval: string, lienEvalBrevet: string, telechargementsDisponibles: SequenceTelechargementsDisponibles}

export interface SequenceNiveau {nom: string, sequences: SequenceSequence[]}

export interface LexiqueNotionLiee {titre: string, slug: string}

export interface LexiqueItem {type: 'definition' | 'propriete', niveau: string, titre: string, slug: string, contenu: string, avecImage: boolean, remarques: string[], exemples: string[], motsCles: string, objectifsLies: string[], notionsLiees: LexiqueNotionLiee[]}

export interface LigneTheme {nom: string, nbObjectifsParPeriode: number[]}

export interface LigneObjectif {niveau: string, periode: number, theme: LigneTheme, sousTheme: LigneTheme, reference: string, titre: string, titreSimplifie: string}

export interface Eleve {prenom: string, competencesValidees: string[], competencesMaitrisees: string[], evaluationsDemandees: string[], veutAider: boolean}

export interface CalendrierPeriode {numero: number, debut: number, fin: number, type: 'cours' | 'vacances'}

export interface CalendrierAnnee {annee: number, periodes: CalendrierPeriode[]}

export interface CalendrierAnneeEnCours {annee: number, jourNumero: number, periodeNumero: number, semaineDansLaPeriode: number, typeDePeriode: 'cours' | 'vacances'}

export interface PanierItem {id: string, objectif: string, description: string, slug: string, reference: string}
