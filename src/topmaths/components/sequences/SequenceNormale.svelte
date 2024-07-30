<script lang="ts">
  import {
    isPersonalMode,
    objectives,
    units
  } from '../../services/store'
  import type { ObjectiveExercise } from '../../types/objective'
  import { emptyUnitDownloadLinks, type Unit } from '../../types/unit'
  import { getTitre } from '../../services/outils'
  import { goToView } from '../../services/navigation'
  import { onDestroy } from 'svelte'
  import type { Unsubscriber } from 'svelte/store'
  import BoutonsExercices from '../shared/BoutonsExercices.svelte'
  import DownloadLine from '../shared/DownloadLine.svelte'

  let niveau = ''
  export let referenceSequence = ''
  let sequence: Unit = {
    reference: '',
    title: '',
    grade: 'none',
    number: 0,
    term: 0,
    objectives: [],
    mentalCalculations: [],
    flashQuestions: [],
    flashQuestionsLink: '',
    assessmentExamSlug: '',
    assessmentLink: '',
    assessmentExamLink: '',
    downloadLinks: emptyUnitDownloadLinks
  }
  let exercicesSequence: ObjectiveExercise[] = []
  let nomsExercicesSequence: string[] = []
  let niveauxObjectifsUnsubscribe: Unsubscriber
  let niveauxSequencesUnsubscribe: Unsubscriber
  export let title = 'topmaths.fr - Séquence'
  trouverSequence()
  surveillerLeChargementDesDonnees()

  function surveillerLeChargementDesDonnees () {
    niveauxObjectifsUnsubscribe = objectives.subscribe(() =>
      trouverSequence()
    )
    onDestroy(niveauxObjectifsUnsubscribe)
    niveauxSequencesUnsubscribe = units.subscribe(() =>
      trouverSequence()
    )
    onDestroy(niveauxSequencesUnsubscribe)
  }

  function lesDonneesSontChargees () {
    return $objectives.length > 0 && $units.length > 0
  }

  function trouverSequence () {
    if (lesDonneesSontChargees() && referenceSequence.slice(0, 1) === 'S') {
      $units.find((sequenceTrouve) => {
        if (sequenceTrouve.reference === referenceSequence) {
          niveau = sequenceTrouve.grade
          sequence = sequenceTrouve
          title =
              'Séquence ' +
              sequence.reference.slice(3) +
              ' : ' +
              sequence.title
        }
        return sequenceTrouve.reference === referenceSequence
      })
      listerExercices()
    }
  }

  function listerExercices () {
    exercicesSequence = []
    nomsExercicesSequence = []
    for (const objectif of sequence.objectives) {
      for (const exercice of objectif.exercises) {
        exercicesSequence.push(exercice)
        nomsExercicesSequence.push(objectif.reference + ' ' + getTitre(objectif))
      }
    }
  }
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<h1 id="titre" class="title text-2xl md:text-4xl font-semibold p-4 is-{niveau}">
  Séquence {sequence.reference.slice(3)} :<br />{sequence.title}
</h1>
<div class="is-{niveau}">
  <h2 class="subtitle text-xl md:text-3xl p-3 is-{niveau}">Objectifs</h2>
  <ul class="p-6">
    {#each sequence.objectives as objectif}
      {#if objectif.reference.slice(1, 2) !== 'X'}
        <li class=" p-1 md:p-2 is-{niveau}">
          <a
            href="/?v=objectif&ref={objectif.reference}"
            on:click={(event) => goToView(event, 'objectif', objectif.reference)}
          >
            {objectif.reference} : {getTitre(objectif)}
          </a>
        </li>
      {/if}
    {/each}
      </ul>
</div>
{#if sequence.mentalCalculations[0] !== undefined && sequence.mentalCalculations[0].reference !== ''}
  <div class="is-{niveau}">
    <h2 id="calculMental" class="subtitle text-xl md:text-3xl p-3 is-{niveau}">Calcul Mental</h2>
    {#if sequence.mentalCalculations[0].reference !== ''}
      <div class="p-6">
        <p class="text-sm md:text-base">
          Dans cette séquence, le calcul mental pourra porter sur :
        </p>
        <ul>
          {#each sequence.mentalCalculations as calculMental}
            <li class="p-1 md:p-2">
              {#if calculMental.isRelatedObjectivePageAvailable}
                <a
                  class="text-sm md:text-base"
                  href="/?v=objectif&ref={calculMental.reference}"
                  on:click={(event) =>
                    goToView(event, 'objectif', calculMental.reference)}
                >
                  {calculMental.reference} : {calculMental.titleAcademic}
                </a>
              {:else}
                <p class="text-sm md:text-base">
                  {calculMental.reference} : {calculMental.titleAcademic}
                </p>
              {/if}
              <ul>
                {#each calculMental.exercises as exercice, j}
                  <li>
                    <h3 class="p-1 md:p-2 ">
                      <BoutonsExercices
                        lienExercices = {exercice.link}
                        titre = {calculMental.exercises.length === 1
                          ? "S'entraîner pour le calcul mental"
                          : exercice.description === ''
                            ? 'Calcul mental de niveau ' + (j + 1)
                            : exercice.description}
                        exercices = {[exercice]}
                        nomsPanier = {[calculMental.reference + ' ' + calculMental.titleAcademic]}
                      />
                    </h3>
                  </li>
                {/each}
              </ul>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
{:else if sequence.mentalCalculations[0].exercises[0] !== undefined && sequence.mentalCalculations[0].exercises[0].description !== ''}
  <div class="pb-5 is-{niveau}">
    <h2 class="subtitle text-xl md:text-3xl p-3 is-{niveau}">Calcul Mental</h2>
    <p
      contenteditable="false"
      bind:innerHTML={sequence.mentalCalculations[0].exercises[0].description}
      class=""
    />
  </div>
{/if}
{#if sequence.flashQuestions[0] !== undefined && sequence.flashQuestions[0].slug !== ''}
  <div class="is-{niveau}">
    <h2 id="questionsFlash" class="subtitle text-xl md:text-3xl p-3 is-{niveau}">
      Questions Flash
    </h2>
    <div class="p-6">
      <div class="text-sm md:text-base">
        <p class="p-1 md:p-2">
          Dans cette séquence, les questions flash pourront porter sur :
        </p>
        <ul>
          {#each sequence.flashQuestions as questionFlash}
            <li class="p-1 md:p-2">
              {#if questionFlash.isRelatedObjectivePageAvailable}
                <a
                  href="/?v=objectif&ref={questionFlash.reference}"
                  on:click={(event) =>
                    goToView(event, 'objectif', questionFlash.reference)}
                >
                  <p>
                    {questionFlash.reference} : {questionFlash.titleAcademic}
                  </p>
                </a>
              {:else}
                <p>
                  {questionFlash.reference} : {questionFlash.titleAcademic}
                </p>
              {/if}
            </li>
          {/each}
        </ul>
      </div>
      <div class="p-1 md:p-2 ">
        <BoutonsExercices
          exercices = {[]}
          lienExercices = {sequence.flashQuestionsLink}
          titre = {'S\'entraîner pour les Questions Flash'}
          nomsPanier = {[sequence.reference + ' Question Flash ']}
        />
      </div>
    </div>
  </div>
{/if}
<div
  id="divEvaluation"
  class="is-{niveau} {sequence.downloadLinks.lessonLink || sequence.downloadLinks.lessonSummaryLink || sequence.downloadLinks.missionLink || ($isPersonalMode && sequence.downloadLinks.lessonPlanLink)
    ? ''
    : ' is-fin'}"
>
  <h2 id="Evaluation" class="subtitle text-xl md:text-3xl p-3 is-{niveau}">Évaluation</h2>
  <div class="p-6  flex flex-col">
    <div class="p-1 md:p-2">
      <BoutonsExercices
        exercices = {exercicesSequence}
        lienExercices = {sequence.assessmentLink}
        titre = {'S\'entraîner pour l\'évaluation ' + (niveau === '3e' ? ' (Automatismes)' : '')}
        reference = {sequence.reference}
        nomsPanier = {nomsExercicesSequence}
      />
    </div>
    {#if niveau === '3e' && sequence.assessmentExamLink !== '' && sequence.assessmentExamLink !== undefined}
      <div class="p-1 md:p-2">
        <BoutonsExercices
          exercices = {[]}
          reference = {sequence.reference + ' Brevet '}
          nomsPanier = {[sequence.reference]}
          lienExercices = {sequence.assessmentExamLink}
          titre = {'S\'entraîner pour l\'évaluation (Exercices de brevet)'}
        />
      </div>
    {/if}
  </div>
</div>
{#if sequence.downloadLinks.lessonLink || sequence.downloadLinks.lessonSummaryLink || sequence.downloadLinks.missionLink || ($isPersonalMode && sequence.downloadLinks.lessonPlanLink) }
  <div class="is-fin is-{niveau}">
    <h2 class="subtitle text-xl md:text-3xl p-3 is-{niveau}">Téléchargements</h2>
    <ul class="p-6 ">
      <DownloadLine
        displayCondition={!!sequence.downloadLinks.lessonLink}
        href={sequence.downloadLinks.lessonLink}
        label="Télécharger le cours"
      />
      <DownloadLine
        displayCondition={!!sequence.downloadLinks.lessonSummaryLink}
        href={sequence.downloadLinks.lessonSummaryLink}
        label="Télécharger le résumé"
      />
      <DownloadLine
        displayCondition={!!sequence.downloadLinks.missionLink}
        href={sequence.downloadLinks.missionLink}
        label="Télécharger la mission"
      />
      <DownloadLine
        displayCondition={!!($isPersonalMode && sequence.downloadLinks.lessonPlanLink)}
        href={sequence.downloadLinks.lessonPlanLink}
        label="Télécharger la fiche"
      />
    </ul>
  </div>
{/if}
