<script lang="ts">
  import { calendrierAnneeEnCours, listeDesUrl, objectives, units, vue, vuePrecedente } from '../services/store'
  import { estCoopmaths } from '../services/outils'
  import { environment } from '../services/environment'
  import { get } from 'svelte/store'
  import LevelsTabsMenu from './shared/LevelsTabsMenu.svelte'

  let niveauChoisi = 'tout'

  function lancerExercicesMathalea () {
    if ($calendrierAnneeEnCours.periodNumber > 0) {
      const listeDesReferences = getListeDesReferences(niveauChoisi)
      if (listeDesReferences.length === 0) {
        alert('Tu n\'as pas encore d\'exercice à réviser, reviens plus tard !')
      } else {
        lancer(listeDesReferences)
      }
    }
  }

  function lancerExercicesBrevet () {
    if ($calendrierAnneeEnCours.periodNumber > 0) {
      const listeExercicesBrevet = getListeExercicesBrevet()
      if (listeExercicesBrevet.length === 0) {
        alert('Tu n\'as pas encore d\'exercice de brevet à réviser, reviens plus tard !')
      } else {
        lancer(listeExercicesBrevet)
      }
    }
  }

  function lancer (listeUrls: string[]) {
    listeDesUrl.set(listeUrls)
    vuePrecedente.set(get(vue))
    vue.set('exercices')
  }

  function getListeDesReferences (
    niveauChoisi: string
  ) {
    const listeDesReferences: string[] = []
    for (const unit of $units) {
      if (unit.grade === niveauChoisi || niveauChoisi === 'tout') {
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
                listeDesReferences.push(environment.baseUrl + environment.V3 + 'uuid=' + uuid)
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
            if (estCoopmaths(exercice.link)) listeDesUrl.push(exercice.link)
          }
        }
      }
    })
    return listeDesUrl
  }

  function getDerniereSequence (niveau: string) {
    const numeroPeriode = $calendrierAnneeEnCours.periodNumber
    const isHoliday = $calendrierAnneeEnCours.isHoliday
    const semaineDansLaPeriode = $calendrierAnneeEnCours.weekInPeriod
    const nbSequencesCumulees = getNbSequencesCumulees(niveau)

    const nbSequencesDebutPeriode = nbSequencesCumulees[numeroPeriode - 1]
    const nbSequencesDevine = nbSequencesDebutPeriode + semaineDansLaPeriode - 3
    const nbSequencesFinPeriode = nbSequencesCumulees[numeroPeriode] - 1

    if (!isHoliday) {
      return Math.min(nbSequencesDevine, nbSequencesFinPeriode)
    } else {
      return nbSequencesFinPeriode
    }
  }

  function getNbSequencesCumulees (nomNiveau: string) {
    const niveau = $units.filter(unit => unit.grade === nomNiveau)
    let periode = 1
    let nbSequences = 0
    const nbSequencesCumulees = [0]
    if (niveau === undefined) return nbSequencesCumulees
    for (const sequence of niveau) {
      if (sequence.period === periode) {
        nbSequences++
      } else {
        nbSequencesCumulees.push(nbSequences)
        nbSequences++
        periode = sequence.period
      }
    }
    nbSequencesCumulees.push(nbSequences)
    nbSequences++
    return nbSequencesCumulees
  }
</script>

<svelte:head>
  <title>Révisions - topmaths</title>
</svelte:head>

<div class="w-screen max-w-screen-lg">
  <h1 class="title text-2xl md:text-4xl font-semibold p-4 is-3e">
    Révisions
  </h1>
  <div class="flex flex-col justify-center p-8 is-fin" style="background-color: #fffafa;">
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
