<script lang="ts">
  import { calendrierAnneeEnCours, listeDesUrl, niveauxObjectifs, niveauxSequences, vue, vuePrecedente } from '../services/store'
  import type { ObjectifNiveau } from '../services/types'
  import { estCoopmaths } from '../services/outils'
  import { environment } from '../services/environment'
  import { get } from 'svelte/store'
  import LevelsTabsMenu from './shared/LevelsTabsMenu.svelte'

  let niveauChoisi = 'tout'

  function lancerExercicesMathalea () {
    if ($calendrierAnneeEnCours.periodeNumero > 0) {
      const listeDesReferences = getListeDesReferences(niveauChoisi)
      if (listeDesReferences.length === 0) {
        alert('Tu n\'as pas encore d\'exercice à réviser, reviens plus tard !')
      } else {
        lancer(listeDesReferences)
      }
    }
  }

function lancerExercicesBrevet () {
  if ($calendrierAnneeEnCours.periodeNumero > 0) {
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
    for (const niveau of $niveauxSequences) {
      if (niveau.nom === niveauChoisi || niveauChoisi === 'tout') {
        const derniereSequence = getDerniereSequence(niveau.nom)
        for (const sequence of niveau.sequences) {
          if (sequence.numero <= derniereSequence) {
            for (const objectif of sequence.objectifs) {
              listeDesReferences.push(objectif.reference)
            }
          }
        }
      }
    }
    return getListeDesUrl(listeDesReferences, $niveauxObjectifs)
  }

function getListeExercicesBrevet () {
  const listeDesReferences: string[] = []
  for (const niveau of $niveauxSequences) {
    if (niveau.nom === '3e') {
      const derniereSequence = getDerniereSequence(niveau.nom)
      for (const sequence of niveau.sequences) {
        if (sequence.numero <= derniereSequence) {
          if (sequence.lienEvalBrevet !== '') {
            const entries = new URL(sequence.lienEvalBrevet).searchParams.entries()
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
  }
  return listeDesReferences
}

  function getListeDesUrl (
    listeDesReferences: string[],
    niveaux: ObjectifNiveau[]
  ) {
    const listeDesUrl: string[] = []
    for (const niveau of niveaux) {
      for (const theme of niveau.themes) {
        for (const sousTheme of theme.sousThemes) {
          for (const objectif of sousTheme.objectifs) {
            for (const reference of listeDesReferences) {
              if (reference === objectif.reference) {
                for (const exercice of objectif.exercices) {
                  if (estCoopmaths(exercice.lien)) listeDesUrl.push(exercice.lien)
                }
              }
            }
          }
        }
      }
    }
    return listeDesUrl
  }

  function getDerniereSequence (niveau: string) {
    const numeroPeriode = $calendrierAnneeEnCours.periodeNumero
    const typeDePeriode = $calendrierAnneeEnCours.typeDePeriode
    const semaineDansLaPeriode = $calendrierAnneeEnCours.semaineDansLaPeriode
    const nbSequencesCumulees = getNbSequencesCumulees(niveau)

    const nbSequencesDebutPeriode = nbSequencesCumulees[numeroPeriode - 1]
    const nbSequencesDevine = nbSequencesDebutPeriode + semaineDansLaPeriode - 3
    const nbSequencesFinPeriode = nbSequencesCumulees[numeroPeriode] - 1

    if (typeDePeriode === 'cours') {
      return Math.min(nbSequencesDevine, nbSequencesFinPeriode)
    } else {
      return nbSequencesFinPeriode
    }
  }

  function getNbSequencesCumulees (nomNiveau: string) {
    const niveau = $niveauxSequences.find(niveauSequence => niveauSequence.nom === nomNiveau)
    let periode = 1
    let nbSequences = 0
    const nbSequencesCumulees = [0]
    if (niveau === undefined) return nbSequencesCumulees
    for (const sequence of niveau.sequences) {
      if (sequence.periode === periode) {
        nbSequences++
      } else {
        nbSequencesCumulees.push(nbSequences)
        nbSequences++
        periode = sequence.periode
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
