<script lang="ts">
  import {
    isPersonalMode,
    units
  } from '../../services/store'
  import { emptyUnit, type Unit } from '../../types/unit'
  import { getTitle } from '../../services/shared'
  import { goToView } from '../../services/navigation'
  import { onMount } from 'svelte'
  import BoutonsExercices from '../shared/BoutonsExercices.svelte'
  import DownloadLine from '../shared/DownloadLine.svelte'

  export let unitReference
  let unit: Unit = emptyUnit

  onMount(() => {
    unit = $units.find((unitFound) => unitFound.reference === unitReference) || emptyUnit
  })

</script>

<svelte:head>
  <title>Séquence {unit.number} : {unit.title}</title>
</svelte:head>

<h1 class="font-semibold p-4 title is-{unit.grade} rounded-t-4xl md:rounded-t-5xl
  text-2xl md:text-5xl"
>
  Séquence {unit.reference.slice(3)} :<br />{unit.title}
</h1>
<div class="is-{unit.grade}">
  <h2 class="subtitle text-xl md:text-3xl p-3 is-{unit.grade}">Objectifs</h2>
  <ul class="p-6">
    {#each unit.objectives as objectif}
      {#if objectif.reference.slice(1, 2) !== 'X'}
        <li class=" p-1 md:p-2 is-{unit.grade}">
          <a
            href="/?v=objectif&ref={objectif.reference}"
            on:click={(event) => goToView(event, 'objectif', objectif.reference)}
          >
            {objectif.reference} : {getTitle(objectif)}
          </a>
        </li>
      {/if}
    {/each}
      </ul>
</div>
{#if unit.mentalCalculations[0] !== undefined && unit.mentalCalculations[0].reference !== ''}
  <div class="is-{unit.grade}">
    <h2 id="calculMental" class="subtitle text-xl md:text-3xl p-3 is-{unit.grade}">Calcul Mental</h2>
    {#if unit.mentalCalculations[0].reference !== ''}
      <div class="p-6">
        <p class="text-sm md:text-base">
          Dans cette séquence, le calcul mental pourra porter sur :
        </p>
        <ul>
          {#each unit.mentalCalculations as calculMental}
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
{:else if unit.mentalCalculations[0]?.exercises[0] !== undefined && unit.mentalCalculations[0].exercises[0].description !== ''}
  <div class="pb-5 is-{unit.grade}">
    <h2 class="subtitle text-xl md:text-3xl p-3 is-{unit.grade}">Calcul Mental</h2>
    <p
      contenteditable="false"
      bind:innerHTML={unit.mentalCalculations[0].exercises[0].description}
      class=""
    />
  </div>
{/if}
{#if unit.flashQuestions[0] !== undefined && unit.flashQuestions[0].slug !== ''}
  <div class="is-{unit.grade}">
    <h2 id="questionsFlash" class="subtitle text-xl md:text-3xl p-3 is-{unit.grade}">
      Questions Flash
    </h2>
    <div class="p-6">
      <div class="text-sm md:text-base">
        <p class="p-1 md:p-2">
          Dans cette séquence, les questions flash pourront porter sur :
        </p>
        <ul>
          {#each unit.flashQuestions as questionFlash}
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
          exercices = {unit.flashQuestions.map(questionFlash => questionFlash).flat()}
          lienExercices = {unit.flashQuestionsLink}
          titre = {'S\'entraîner pour les Questions Flash'}
        />
      </div>
    </div>
  </div>
{/if}
<div
  id="divEvaluation"
  class="is-{unit.grade} {unit.downloadLinks.lessonLink || unit.downloadLinks.lessonSummaryLink || unit.downloadLinks.missionLink || ($isPersonalMode && unit.downloadLinks.lessonPlanLink)
    ? ''
    : ' rounded-b-5xl'}"
>
  <h2 id="Evaluation" class="subtitle text-xl md:text-3xl p-3 is-{unit.grade}">Évaluation</h2>
  <div class="p-6  flex flex-col">
    <div class="p-1 md:p-2">
      <BoutonsExercices
        exercices = {unit.objectives.map(objectif => objectif.exercises).flat()}
        lienExercices = {unit.assessmentLink}
        titre = {'S\'entraîner pour l\'évaluation ' + (unit.grade === '3e' ? ' (Automatismes)' : '')}
        reference = {unit.reference}
        nomsPanier = {unit.objectives.map(objectif => objectif.reference + ' ' + getTitle(objectif))}
      />
    </div>
    {#if unit.grade === '3e' && unit.assessmentExamLink !== '' && unit.assessmentExamLink !== undefined}
      <div class="p-1 md:p-2">
        <BoutonsExercices
          exercices = {[]}
          reference = {unit.reference + ' Brevet '}
          nomsPanier = {[unit.reference]}
          lienExercices = {unit.assessmentExamLink}
          titre = {'S\'entraîner pour l\'évaluation (Exercices de brevet)'}
        />
      </div>
    {/if}
  </div>
</div>
{#if unit.downloadLinks.lessonLink || unit.downloadLinks.lessonSummaryLink || unit.downloadLinks.missionLink || ($isPersonalMode && unit.downloadLinks.lessonPlanLink) }
  <div class="rounded-b-5xl is-{unit.grade}">
    <h2 class="subtitle text-xl md:text-3xl p-3 is-{unit.grade}">Téléchargements</h2>
    <ul class="p-6 ">
      <DownloadLine
        displayCondition={!!unit.downloadLinks.lessonLink}
        href={unit.downloadLinks.lessonLink}
        label="Télécharger le cours"
      />
      <DownloadLine
        displayCondition={!!unit.downloadLinks.lessonSummaryLink}
        href={unit.downloadLinks.lessonSummaryLink}
        label="Télécharger le résumé"
      />
      <DownloadLine
        displayCondition={!!unit.downloadLinks.missionLink}
        href={unit.downloadLinks.missionLink}
        label="Télécharger la mission"
      />
      <DownloadLine
        displayCondition={!!($isPersonalMode && unit.downloadLinks.lessonPlanLink)}
        href={unit.downloadLinks.lessonPlanLink}
        label="Télécharger la fiche"
      />
    </ul>
  </div>
{/if}
