<script lang="ts">
  import { curriculum, exerciseLinks, objectives, units, view } from '../services/store'
  import { isCoopmaths } from '../services/shared'
  import { COOPMATHS_BASE_URL } from '../services/environment'
  import LevelsTabsMenu from './shared/LevelsTabsMenu.svelte'
  import { getCurrentTerm, getWeekIndexInCurrentTerm } from '../services/calendar'
  import { type StringGrade } from '../types/grade'

  let niveauChoisi = 'all'
  const currentTerm = getCurrentTerm()
  const isHoliday = currentTerm.type === 'break'
  const semaineDansLaPeriode = getWeekIndexInCurrentTerm()

  function lancerExercicesMathalea () {
    const listeDesReferences = getListeDesReferences(niveauChoisi)
    if (listeDesReferences.length === 0) {
      alert('Tu n\'as pas encore d\'exercice à réviser, reviens plus tard !')
    } else {
      lancer(listeDesReferences)
    }
  }

  function lancerExercicesBrevet () {
    const listeExercicesBrevet = getListeExercicesBrevet()
    if (listeExercicesBrevet.length === 0) {
      alert('Tu n\'as pas encore d\'exercice de brevet à réviser, reviens plus tard !')
    } else {
      lancer(listeExercicesBrevet)
    }
  }

  function lancer (listeUrls: string[]) {
    exerciseLinks.set(listeUrls)
    view.set('exercices')
  }

  function getListeDesReferences (niveauChoisi: string) {
    const listeDesReferences: string[] = []
    for (const unit of $units) {
      if (unit.grade === niveauChoisi || niveauChoisi === 'all') {
        const derniereSequence = getDerniereSequence(unit.grade)
        if (unit.number <= derniereSequence) {
          for (const objectif of unit.objectives) {
            listeDesReferences.push(objectif.reference)
          }
        }
      }
    }
    return getListeDesUrl(listeDesReferences)
  }

  function getListeExercicesBrevet () {
    const listeDesReferences: string[] = []
    for (const unit of $units) {
      if (unit.grade === '3e') {
        const derniereSequence = getDerniereSequence(unit.grade)
        if (unit.number <= derniereSequence) {
          if (unit.assessmentExamLink !== '') {
            const entries = new URL(unit.assessmentExamLink).searchParams.entries()
            for (const entry of entries) {
              if (entry[0] === 'uuid') {
                const uuid = entry[1]
                listeDesReferences.push(COOPMATHS_BASE_URL + 'uuid=' + uuid)
              }
            }
          }
        }
      }
    }
    return listeDesReferences
  }

  function getListeDesUrl (listeDesReferences: string[]) {
    const listeDesUrl: string[] = []
    listeDesReferences.forEach(reference => {
      for (const objectif of $objectives) {
        if (reference === objectif.reference) {
          for (const exercice of objectif.exercises) {
            if (isCoopmaths(exercice.link)) listeDesUrl.push(exercice.link)
          }
        }
      }
    })
    return listeDesUrl
  }

  function getDerniereSequence (niveau: StringGrade) {
    const nbSequencesDebutPeriode = $curriculum[niveau].cumulateUnitsPerTerm[currentTerm.termIndex]
    const nbSequencesDevine = nbSequencesDebutPeriode + semaineDansLaPeriode - 2
    const nbSequencesFinPeriode = $curriculum[niveau].cumulateUnitsPerTerm[currentTerm.termIndex + 1] - 1

    if (!isHoliday) {
      return Math.min(nbSequencesDevine, nbSequencesFinPeriode)
    } else {
      return nbSequencesFinPeriode
    }
  }
</script>

<svelte:head>
  <title>Révisions - topmaths</title>
</svelte:head>

<div class="w-screen max-w-screen-lg">
  <h1 class="title text-2xl md:text-4xl font-semibold p-4 is-3e">
    Révisions
  </h1>
  <div class="flex flex-col justify-center p-8 rounded-b-5xl" style="background-color: #fffafa;">
    <LevelsTabsMenu
      activeLevelTab={niveauChoisi}
      onLevelsTabsMenuClicked={(clickedLevel) => { niveauChoisi = clickedLevel }}
    />
    <button on:click={() => lancerExercicesMathalea()} class="mx-auto p-5 my-4 button is-link is-outlined rounded md:rounded-lg">
      <p class="mx-auto text-sm md:text-2xl shrink-0">Réviser les exercices</p>
    </button>
    <button on:click={() => lancerExercicesBrevet()} class="mx-auto p-5 my-4 button is-sponsor is-outlined rounded md:rounded-lg">
      <p class="mx-auto text-sm md:text-2xl shrink-0">Réviser les exercices de brevet (3e)</p>
    </button>
  </div>
</div>
