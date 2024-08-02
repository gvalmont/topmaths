<script lang="ts">
  import {
    isTeacherMode,
    isPersonalMode,
    objectives,
    units,
    reference
  } from '../services/store'
  import { emptyObjective, isObjective, type Objective, type ObjectiveExercise } from '../types/objective'
  import { getTitle } from '../services/shared'
  import { goToView } from '../services/navigation'
  import { afterUpdate, onDestroy, tick } from 'svelte'
  import type { Unsubscriber } from 'svelte/store'
  import {
    mathaleaRenderDiv
  } from '../../lib/mathalea'
  import Cart from '../modules/Cart'
  import iepLoadPromise from 'instrumenpoche'
  import BoutonsExercices from './shared/BoutonsExercices.svelte'
  import DownloadLine from './shared/DownloadLine.svelte'
  import { isEmptyArrayRecord } from '../types/shared'

  export let title = 'topmaths.fr - Séquence'
  let objectif = {} as Objective
  let tousLesExercicesSontDansLePanier = false
  let niveau = '' as string
  let exercicesDeBrevetDansLePanier = false
  let nomsPanier: string[] = []
  let referenceObjectifUnsubscribe: Unsubscriber
  let niveauxObjectifsUnsubscribe: Unsubscriber
  surveillerChangementsDeReference()
  surveillerLeChargementDesDonnees()

  afterUpdate(async () => {
    if (objectif.lessonSummaryHTML !== '') {
      await tick()
      const rappelDuCoursHTML = document.getElementById('rappelDuCoursHTML')
      if (rappelDuCoursHTML !== null) mathaleaRenderDiv(rappelDuCoursHTML, -1)
    }
    if (objectif.lessonSummaryInstrumenpoche !== undefined && objectif.lessonSummaryInstrumenpoche !== '') loadIep()
  })

  function surveillerChangementsDeReference () {
    referenceObjectifUnsubscribe = reference.subscribe(() => MAJPage())
    onDestroy(referenceObjectifUnsubscribe)
  }

  function surveillerLeChargementDesDonnees () {
    niveauxObjectifsUnsubscribe = objectives.subscribe(() => MAJPage())
    onDestroy(niveauxObjectifsUnsubscribe)
  }

  function lesDonneesSontChargees () {
    return $objectives.length > 0 && $units.length > 0
  }

  function MAJPage () {
    if (lesDonneesSontChargees() && $reference.slice(0, 1) !== 'S') {
      objectif = getObjectif()
      niveau = objectif.reference.slice(0, 1) + 'e'
      MAJProprietes()
    }
  }

  function getObjectif () {
    const objectiveCandidate = $objectives.find(objectif => objectif.reference === $reference)
    if (isObjective(objectiveCandidate)) {
      return objectiveCandidate
    }
    console.error('Objectif non trouvé')
    return emptyObjective
  }

  function MAJProprietes () {
    title = objectif.reference + ' : ' + getTitle(objectif)
    MakeNomsPanier()
    MAJPanier()
  }

  function MakeNomsPanier () {
    nomsPanier = []
    for (let i = 0; i < objectif.exercises.length; i++) {
      nomsPanier.push(objectif.reference + ' ' + getTitle(objectif))
    }
  }

  function tousLesExercicesSontPresentsDansLePanier (objectif: Objective, exDeBrevet = false): boolean {
    let exercices: ObjectiveExercise[]
    if (exDeBrevet) exercices = objectif.examExercises
    else exercices = objectif.exercises
    if (exercices !== undefined) {
      for (const exercice of exercices) {
        if (!exercice.isInCart) return false
      }
    }
    return true
  }

  function MAJPanier () {
    for (const exercice of objectif.exercises) {
      if (exercice.slug !== '') {
        exercice.isInCart = Cart.includes(exercice.id)
      }
    }
    tousLesExercicesSontDansLePanier =
      tousLesExercicesSontPresentsDansLePanier(objectif)
    if (objectif.examExercises !== undefined) {
      for (const exercice of objectif.examExercises) {
        if (exercice.slug !== '') {
          exercice.isInCart = Cart.includes(exercice.id)
        }
      }
      exercicesDeBrevetDansLePanier = tousLesExercicesSontPresentsDansLePanier(
        objectif,
        true
      )
    }
  }

  function loadIep () {
    const url = `topmaths/data/instrumenpoche/${objectif.lessonSummaryInstrumenpoche}.xml`
    fetch(url)
      .then(response => response.text())
      .then(xml => {
        const container = document.getElementById('divIEP')
        iepLoadPromise(container, xml).then(iepApp => {
        }).catch(error => {
          console.log(error)
        })
      })
      .catch(err => {
        console.error(err)
      })
  }
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="w-screen max-w-screen-lg">
  <h1 id="titre" class="title text-2xl md:text-4xl font-semibold p-4 is-{niveau}">
    {objectif.reference + ' : ' + getTitle(objectif)}
  </h1>
  {#if objectif.lessonSummaryHTML !== '' || objectif.lessonSummaryImage !== '' || (objectif.lessonSummaryInstrumenpoche !== undefined && objectif.lessonSummaryInstrumenpoche !== '')}
    <div class="is-{niveau}">
      <h2 class="subtitle text-xl md:text-3xl p-3 is-{niveau}">Rappel du cours</h2>
      <div class="p-6 ">
        {#if objectif.lessonSummaryHTML !== ''}
          <p
            id="rappelDuCoursHTML"
            contenteditable="false"
            bind:innerHTML={objectif.lessonSummaryHTML}
          />
        {/if}
        {#if objectif.lessonSummaryImage !== ''}
          <img class="inline-block" src={objectif.lessonSummaryImage} />
        {/if}
        {#if objectif.lessonSummaryInstrumenpoche !== undefined && objectif.lessonSummaryInstrumenpoche !== ''}
        <div class="text-center">
          <div class="inline-block" id="divIEP"></div>
        </div>
        {/if}
      </div>
    </div>
  {/if}
  {#if objectif.videos.length > 0}
    <div class="is-{niveau}">
      <h2 class="subtitle text-xl md:text-3xl p-3 is-{niveau}">
        Vidéo{objectif.videos.length > 1 ? 's' : ''} d'explication
      </h2>
      {#each objectif.videos as video}
        <div class="pb-5 ">
          {#if video.title !== ''}
            <h3 class="subtitle text-lg md:text-2xl p-3 is-{niveau}">{video.title}</h3>
          {/if}
          <div class="image is-16by9">
            <iframe
              class="has-ratio"
              src={video.videoLink}
              title="Vidéo d'explication"
              allowfullscreen
            />
          </div>
          Vidéo de&nbsp;<a
            href={video.authorLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button>
              {video.authorName}
            </button>
          </a>
        </div>
      {/each}
    </div>
  {/if}
  {#if objectif.exercises.length > 0}
    <div
      id="divExercices"
      class="is-{niveau}"
      class:is-fin = {objectif.units.length === 0 &&
        !objectif.downloadLinks.practiceSheetLink &&
        (!$isTeacherMode || !objectif.downloadLinks.testSheetLink) &&
        (!$isPersonalMode || isEmptyArrayRecord(objectif.downloadLinks.lessonPlanLinks))}
    >
      <h2 class="subtitle text-xl md:text-3xl p-3 is-{niveau}">
        <BoutonsExercices
          reference = {objectif.reference}
          exercices = {objectif.exercises}
          videos = {objectif.videos}
          lienExercices = {objectif.exercisesLink}
          panierRempli = {tousLesExercicesSontDansLePanier}
          titre = {'S\'entraîner'}
          nomsPanier = {nomsPanier}
        />
      </h2>
      <ul class="p-6 ">
        {#each objectif.exercises as exercice, i}
          <li class="p-1 md:p-2">
            <BoutonsExercices
              reference = {objectif.reference}
              exercices = {[objectif.exercises[i]]}
              videos = {objectif.videos}
              lienExercices = {exercice.link}
              panierRempli = {exercice.isInCart}
              titre = {exercice.description !== ''
                ? exercice.description
                : objectif.exercises.length > 1
                  ? 'Exercices de niveau ' + (i + 1)
                  : "Lancer l'exercice"}
              indiceExercice = {i}
              nomsPanier = {[objectif.reference + ' ' + getTitle(objectif)]}
            />
          </li>
        {/each}
      </ul>
    </div>
  {/if}
  {#if objectif.examExercisesLink !== ''}
    <div class="is-{niveau}">
      <h2 class="subtitle text-xl md:text-3xl p-3 is-{niveau}">En route vers le brevet</h2>
      <div class="pt-6 text-sm md:text-base">
        Tu ne peux pas encore faire ces exercices en entier mais avec ce que tu
        as appris tu sais répondre à au moins une question de chacun
        d'entre eux !
      </div>
      <ul class="p-6 ">
        <li class="p-2">
          <BoutonsExercices
            exercices = {objectif.examExercises}
            videos = {objectif.videos}
            lienExercices = {objectif.examExercisesLink}
            panierRempli = {exercicesDeBrevetDansLePanier}
            titre = {'Lancer les exercices de brevet'}
            exercicesDeBrevet = {true}
            nomsPanier = {[objectif.reference + ' ' + getTitle(objectif) + ' Brevet ']}
          />
        </li>
      </ul>
    </div>
  {/if}
  {#if objectif.downloadLinks.practiceSheetLink ||
    ($isTeacherMode && objectif.downloadLinks.testSheetLink) ||
    ($isPersonalMode && !isEmptyArrayRecord(objectif.downloadLinks.lessonPlanLinks))}
    <div
      class="{objectif.units.length === 0 ? 'is-fin ' : ''}is-{niveau}"
    >
      <h2 class="subtitle text-xl md:text-3xl p-3 is-{niveau}">Téléchargements</h2>
      <ul class="p-6 ">
        <DownloadLine
          displayCondition={!!objectif.downloadLinks.practiceSheetLink}
          href={objectif.downloadLinks.practiceSheetLink}
          label="Télécharger la feuille d'entraînement"
        />
        <DownloadLine
          displayCondition={$isTeacherMode && !!objectif.downloadLinks.testSheetLink}
          href={objectif.downloadLinks.testSheetLink}
          label="Télécharger les tests"
        />
        {#if $isPersonalMode && !isEmptyArrayRecord(objectif.downloadLinks.lessonPlanLinks)}
          {#each Object.keys(objectif.downloadLinks.lessonPlanLinks) as grade}
            {#if objectif.downloadLinks.lessonPlanLinks[grade].length > 0}
              {#each objectif.downloadLinks.lessonPlanLinks[grade] as lessonPlanLink, i}
                <DownloadLine
                  displayCondition={true}
                  href={lessonPlanLink}
                  label="Télécharger la fiche {objectif.downloadLinks.lessonPlanLinks[grade].length > 1 ? i + 1 : '' } pour le niveau {grade}"
                />
              {/each}
            {/if}
          {/each}
        {/if}
      </ul>
    </div>
  {/if}
  {#if objectif.units.length > 0}
    <div class="is-fin is-{niveau}">
      <h2 class="subtitle text-xl md:text-3xl p-3 is-{niveau}">
        Séquence{objectif.units.length > 1 ? 's' : ''}
      </h2>
      <p class="pt-8">Cet objectif fait partie de :</p>
      <ul class="p-6">
        {#each objectif.units as sequence}
          <li class="p-1 md:p-2">
            <a
              href="/?v=sequence&ref={sequence.reference}"
              style="color: var(--base{sequence.reference.slice(1, 2)}e) !important;"
              on:click={(event) =>
                goToView(event, 'unit', sequence.reference)}
            >
              {'Séquence ' +
                sequence.reference.slice(3) +
                ' : ' +
                sequence.title}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
