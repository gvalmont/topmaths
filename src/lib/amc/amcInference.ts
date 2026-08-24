import { type AutoCorrection, type IExercice } from '../types'
import {
  ensureAMCOpenAutoCorrection,
  extractAMCValue,
  inferNumericValueForAMC,
  mergeNumericParamsFromOptions,
} from './amcInferenceHelpers'
import { normalizeAMCNumBlocks } from './amcNormalize'
import type { AMCReponseValue, IExerciceAMC, ReponseParams } from './amcTypes'

/**
 * Applique une compatibilité AMC par défaut quand un exercice n'est pas paramétré finement.
 * Cette fonction privilégie un export possible (fallback AMCOpen) plutôt qu'un rejet.
 * @author Jean-claude Lhote
 */
export function mathaleaEnsureAMCCompatibility(
  exercice: IExercice | IExerciceAMC,
): IExerciceAMC {
  type InferenceAutoCorrectionItem = {
    enonce?: string
    propositions?: Array<{ statut?: unknown; [key: string]: unknown }>
    reponse?: {
      valeur?: unknown
      param?: ReponseParams
      [key: string]: unknown
    }
    [key: string]: unknown
  }

  const exerciseAny = exercice as any
  const interactiveAutoCorrection = Array.isArray(
    exerciseAny.interactiveAutoCorrectionForAMC,
  )
    ? exerciseAny.interactiveAutoCorrectionForAMC
    : []
  const amcAutoCorrection = Array.isArray(exerciseAny.autoCorrectionAMC)
    ? exerciseAny.autoCorrectionAMC
    : []
  const autoCorrectionSource: AutoCorrection[] =
    interactiveAutoCorrection.length > 0
      ? interactiveAutoCorrection
      : exercice.autoCorrection
  const statementQuestionCount = Math.max(
    exercice.listeQuestions.length,
    exercice.question != null ? 1 : 0,
  )

  const getFormat = (item: InferenceAutoCorrectionItem | undefined): string =>
    String(
      item?.formatInteractif ??
        exercice.formatInteractif ??
        exercice.interactifType ??
        '',
    ).toLowerCase()

  const isQcmItem = (
    item: InferenceAutoCorrectionItem | undefined,
  ): boolean => {
    const propositions = item?.propositions
    if (!Array.isArray(propositions) || propositions.length < 2) return false
    const format = getFormat(item)
    if (format === 'qcm' || format === 'mathalea-qcm') return true

    // Compatibilité des anciens QCM qui ne renseignaient pas toujours le
    // format par question. Les statuts AMCOpen sont numériques (nombre de
    // lignes) : exiger des booléens évite de les prendre pour des QCM.
    return propositions.every(
      (proposition) => typeof proposition.statut === 'boolean',
    )
  }

  const applyQcmInference = (): boolean => {
    if (
      autoCorrectionSource.length === 0 ||
      autoCorrectionSource.length < statementQuestionCount ||
      autoCorrectionSource.some((item) => item == null || !isQcmItem(item))
    ) {
      return false
    }
    const items = autoCorrectionSource as Array<
      AutoCorrection & InferenceAutoCorrectionItem
    >

    // Le type AMC porte sur tout le groupe. Dès qu'une question a plusieurs
    // bonnes réponses, qcmMult est le seul type qui conserve tous les statuts.
    const hasMultipleCorrectAnswers = items.some(
      (item) =>
        (item.propositions ?? []).filter((p) => Boolean(p.statut)).length > 1,
    )
    exercice.amcType = hasMultipleCorrectAnswers ? 'qcmMult' : 'qcmMono'
    exercice.amcReady = true
    exerciseAny.autoCorrectionAMC = items.map((item, index) => ({
      ...item,
      enonce: item.enonce ?? exercice.listeQuestions[index],
      propositions: (item.propositions ?? []).map((proposition) => ({
        ...proposition,
        statut: Boolean(proposition.statut),
      })),
    }))
    return true
  }

  const applyAMCOpenFallback = (): IExerciceAMC => {
    exercice.amcType = 'AMCOpen'
    exercice.amcReady = true
    const target = amcAutoCorrection.map((item: unknown) =>
      item != null &&
      typeof item === 'object' &&
      'enonce' in item &&
      typeof item.enonce === 'string'
        ? { enonce: item.enonce }
        : {},
    )
    ensureAMCOpenAutoCorrection(exercice, target)
    exerciseAny.autoCorrectionAMC = target
    if (exercice.autoCorrection.length === 0) {
      exercice.autoCorrection = target.map((item) => ({ ...item })) as any
    }
    return exercice as IExerciceAMC
  }

  const numericFormats = new Set([
    'mathlive',
    'mathalea-mathfield',
    'calcul',
    'fillintheblank',
    'fill-in-the-blank',
    'multi-mathfield',
    'tableaumathlive',
    'tableau-mathlive',
  ])
  const hasOnlyPotentiallyNumericQuestions =
    autoCorrectionSource.length > 0 &&
    autoCorrectionSource.every(
      (item) => item != null && numericFormats.has(getFormat(item)),
    )

  // Ici on débute l'inférence du type AMC de l'exercice.
  // Si l'exercice est déja amcReady, on suppose que le type AMC est correctement défini et on ne fait rien.
  // Ensuite, si le type AMC n'est pas défini, on va essayer de l'inférer à partir des données disponibles dans les autoCorrections, les réponses interactives mises en cache, et la réponse de l'exercice lui-même.

  if (exercice.amcReady) {
    // L'exercice est déjà prêt pour AMC, on suppose que tout est en ordre, mais c'est faux.
    // On doit pour les AMCNum s'assurer que les données dans autoCorrectionAMC comme digits, decimals, signe, etc sont bien renseignées
    // On doit aussi s'assurer que pour les qcm la propriété 'correction' de options est bien renseignée pour l'afficher à l'lélève dans le détail de correction AMC.
    if (exercice.amcType === 'AMCNum') {
      const autoCorrectionAmc = []
      const declaredSource =
        amcAutoCorrection.length > 0
          ? amcAutoCorrection
          : autoCorrectionSource.length > 0
            ? autoCorrectionSource
            : exercice.reponse != null
              ? [
                  {
                    enonce: exercice.question ?? exercice.listeQuestions[0],
                    valeur: { reponse: { value: exercice.reponse } },
                  },
                ]
              : []

      for (const [index, item] of declaredSource.entries()) {
        if (item == null) continue
        const valeur = inferNumericValueForAMC(
          extractAMCValue(item.reponse?.valeur ?? item.valeur),
        )
        if (valeur === undefined) continue
        // item est un item de autoCorrectionAMC, qui est censé être déjà au format AMC, mais on fait le travail d'inférence au cas où les données ne seraient pas parfaitement conformes. On infère les options AMC à partir de la réponse interactive (item.reponse) plutôt que de réutiliser directement les options de comparaison interactive (item.options) pour éviter de faire des hypothèses sur la structure des options interactives qui peuvent être différentes des options attendues par AMC.
        const param = mergeNumericParamsFromOptions(
          item.reponse?.param,
          item.options,
        )

        const blocks = normalizeAMCNumBlocks({
          valeur,
          param,
        })

        if (blocks.length === 0) continue

        autoCorrectionAmc.push({
          ...item,
          enonce: item.enonce ?? exercice.listeQuestions[index],
          reponse: {
            ...(item.reponse ?? {}),
            valeur,
            param,
          },
        })
      }
      if (
        autoCorrectionAmc.length === 0 ||
        autoCorrectionAmc.length !== declaredSource.length ||
        autoCorrectionAmc.length < statementQuestionCount
      ) {
        return applyAMCOpenFallback()
      }
      exerciseAny.autoCorrectionAMC = autoCorrectionAmc as any
    } else if (
      exercice.amcType === 'qcmMono' ||
      exercice.amcType === 'qcmMult'
    ) {
      const qcmSource =
        autoCorrectionSource.length > 0
          ? autoCorrectionSource
          : (amcAutoCorrection as AutoCorrection[])
      // L'instance peut ne pas être générée encore (tests, chargement initial).
      // Dans ce cas on conserve la déclaration native ; la page AMC refera la
      // vérification après nouvelleVersion().
      if (qcmSource.length === 0) return exercice as IExerciceAMC
      if (
        qcmSource.length < statementQuestionCount ||
        qcmSource.some((item) => item == null || !isQcmItem(item))
      ) {
        return applyAMCOpenFallback()
      }
      const autoCorrectionAmc = qcmSource.map(
        (item: InferenceAutoCorrectionItem, index) => {
          if (item == null) return item

          const propositions = Array.isArray(item.propositions)
            ? item.propositions.map((p) => ({
                ...p,
                statut: Boolean(p.statut),
              }))
            : item.propositions

          return {
            ...item,
            enonce: item.enonce ?? exercice.listeQuestions[index],
            propositions,
          }
        },
      )
      if (
        autoCorrectionAmc.some(
          (item) =>
            (item?.propositions ?? []).filter((p) => Boolean(p.statut)).length >
            1,
        )
      ) {
        exercice.amcType = 'qcmMult'
      }
      exerciseAny.autoCorrectionAMC = autoCorrectionAmc as any
    } else if (
      exercice.amcType === 'AMCOpen' ||
      exercice.amcType === 'AMCHybride'
    ) {
      // Les structures explicites restent prioritaires. Une déclaration vide
      // ne doit toutefois pas faire disparaître l'exercice de l'export.
      return amcAutoCorrection.length > 0
        ? (exercice as IExerciceAMC)
        : applyAMCOpenFallback()
    } else if (exercice.amcType != null) {
      return applyAMCOpenFallback()
    } else {
      // amcReady sans amcType existe dans quelques anciens modules : poursuivre
      // l'inférence évite qu'ils disparaissent silencieusement de l'export.
      exercice.amcReady = undefined
    }
    if (exercice.amcReady) return exercice as IExerciceAMC
  }

  // Respecte un marquage explicite "non prêt AMC" quand un type AMC est déjà posé.
  // Cela permet d'exclure volontairement un exercice de l'export sans qu'un fallback le réactive.
  if (exercice.amcReady === false && exercice.amcType != null) {
    return exercice as IExerciceAMC
  }

  if (exercice.interactifType == null) {
    // Si l'exercice n'est pas interactif, on suppose que c'est un exercice ouvert compatible avec AMC.
    // Certains exercices modernes ne déclarent le format qu'au niveau de la
    // question. Il faut donc examiner autoCorrection avant de conclure qu'ils
    // ne sont pas interactifs (cas fréquent de mathalea-qcm).
    if (applyQcmInference()) return exercice as IExerciceAMC
    if (autoCorrectionSource.length === 0) return applyAMCOpenFallback()
  }

  // La donnée par question est plus précise que interactifType et couvre à la
  // fois les QCM historiques ('qcm') et le custom element moderne.
  if (applyQcmInference()) return exercice as IExerciceAMC

  // type interactifs non supportés par AMC : svg-selection, cliqueFigure, DragAndDrop, apiGeom, tableur, MetaInteractif2d : on les considère comme des AMCOpen car ils ne sont pas incompatibles avec AMC, mais ils nécessitent une correction personnalisée.
  if (
    [
      'svg-selection', // inadapté clairement pour AMC
      'cliqueFigure', // inadapté clairement pour AMC
      'dnd', // inadapté clairement pour AMC
      'my-spreadsheet', // Difficile à faire rentrer dans AMC
      'MetaInteractif2d', // Difficile à faire rentrer dans AMC
      'texte', // inadapté pour AMC, mais on peut faire du AMCOpen
      'custom', // inadapté pour AMC (contient du apiGeom et autres), mais on peut faire du AMCOpen
    ].includes(String(exercice.interactifType))
  ) {
    return applyAMCOpenFallback()
  }

  if (
    String(exercice.interactifType).toLowerCase() === 'qcm' ||
    String(exercice.interactifType).toLowerCase() === 'mathalea-qcm'
  ) {
    // Si l'exercice est de type QCM interactif, alors il est compatible avec AMC, et on peut inférer le type AMC à partir du nombre de bonnes réponses dans la première autoCorrection.
    // Un QCM sans propositions exploitables ne doit pas produire silencieusement
    // une question vide : le contrat AMCOpen reste imprimable et annotable.
    return applyAMCOpenFallback()
  }

  // Si c'est un exercice de type liste déroulante interactif, on transforme la liste déroulante en propositions de type QCM pour l'autoCorrection AMC.
  // On le signale car l'exo peut avoir un export AMC qcmMono en utilisant la fonction listeDeroulanteToQcm.
  if (exercice.interactifType === 'listeDeroulante') {
    return applyAMCOpenFallback()
  }

  if (
    String(exercice.interactifType).toLowerCase() !== 'mathlive' &&
    !hasOnlyPotentiallyNumericQuestions
  ) {
    // Pour ce qui ne rentre pas dans les cas précédents : fallback AMCOpen.
    return applyAMCOpenFallback()
  }

  // Cas Mathlive à détailler
  // à priori, les données pour AMC n'ont pas été renseignées sinon on peut espérer que amcReady serait true et amcType défini
  // On va essayer d'inférer un type AMCNum à partir des réponses numériques présentes dans les autoCorrections ou les réponses interactives mises en cache.

  const extractNumericFields = (item: AutoCorrection) => {
    const values = item.valeur as
      | Record<string, { value?: unknown; options?: ReponseParams } | unknown>
      | undefined
    if (values == null || typeof values !== 'object') return []

    return Object.entries(values)
      .filter(([key]) => key !== 'bareme')
      .map(([key, answer]) => {
        const valeur = inferNumericValueForAMC(extractAMCValue(answer))
        const answerOptions =
          answer != null && typeof answer === 'object' && 'options' in answer
            ? (answer.options as ReponseParams | undefined)
            : undefined
        const param = mergeNumericParamsFromOptions(item.options, answerOptions)
        return { key, valeur, param }
      })
  }

  // Plusieurs champs numériques indépendants se traduisent fidèlement en
  // AMCHybride. Si un seul champ est non numérique, on ne devine pas : AMCOpen.
  const numericFieldGroups = autoCorrectionSource.map(extractNumericFields)
  if (
    numericFieldGroups.some((fields) => fields.length > 1) &&
    numericFieldGroups.every(
      (fields) =>
        fields.length > 0 &&
        fields.every((field) => field.valeur !== undefined),
    )
  ) {
    exerciseAny.autoCorrectionAMC = numericFieldGroups.map((fields, index) => ({
      enonce: exercice.listeQuestions[index],
      propositions: fields.map((field, fieldIndex) => ({
        type: 'AMCNum',
        propositions: [
          {
            texte:
              fieldIndex === fields.length - 1
                ? (exercice.listeCorrections[index] ?? '')
                : '',
            reponse: {
              texte: `Réponse ${fieldIndex + 1}`,
              valeur: field.valeur,
              param: field.param,
            },
          },
        ],
      })),
    }))
    exercice.amcType = 'AMCHybride'
    exercice.amcReady = true
    return exercice as IExerciceAMC
  }

  const autoCorrectionAmc = []
  let canInferAMCNum =
    autoCorrectionSource.length > 0 &&
    autoCorrectionSource.length >= statementQuestionCount

  for (const [index, item] of autoCorrectionSource.entries()) {
    if (item == null) {
      canInferAMCNum = false
      break
    }
    let valeur: AMCReponseValue | undefined
    if (
      ['mathlive', 'mathalea-mathfield', 'calcul'].includes(getFormat(item)) &&
      item.valeur?.reponse?.value != null
    ) {
      valeur = inferNumericValueForAMC(
        extractAMCValue(item.valeur?.reponse?.value),
      )
    } else if (
      ['fillintheblank', 'fill-in-the-blank'].includes(getFormat(item)) &&
      item.valeur?.champ1 != null &&
      !('champ2' in item.valeur)
    ) {
      valeur = inferNumericValueForAMC(
        extractAMCValue(item.valeur?.champ1.value),
      )
    } else if (
      getFormat(item) === 'multi-mathfield' &&
      item.valeur?.champ1 != null &&
      !('champ2' in item.valeur)
    ) {
      valeur = inferNumericValueForAMC(
        extractAMCValue(item.valeur?.champ1.value),
      )
    } else {
      canInferAMCNum = false
      break
    }
    if (valeur === undefined) {
      canInferAMCNum = false
      break
    }
    // On infère des options AMCNum à partir de la réponse interactive
    // ({ value, options, compare }) au lieu de réutiliser directement
    // les options de comparaison interactive.
    const param = mergeNumericParamsFromOptions(item.options, {})

    const blocks = normalizeAMCNumBlocks({
      valeur,
      param,
    })

    if (blocks.length === 0) {
      canInferAMCNum = false
      break
    }

    autoCorrectionAmc.push({
      ...item,
      enonce: item.enonce ?? exercice.listeQuestions[index],
      reponse: {
        ...item.valeur,
        valeur,
        param,
      },
    })
  }

  if (canInferAMCNum) {
    exerciseAny.autoCorrectionAMC = autoCorrectionAmc
    exercice.amcType = 'AMCNum'
    exercice.amcReady = true
    return exercice as IExerciceAMC
  }

  return applyAMCOpenFallback()
}
