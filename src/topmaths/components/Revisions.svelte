<script lang="ts">
  import {
    calendrierAnneeEnCours,
    listeDesUrl,
    niveauxObjectifs,
    niveauxSequences
  } from '../services/store'
  import type { ObjectifNiveau } from '../services/types'
  import { outils } from '../services/outils'
  import { randint } from '../../modules/outils'
  import { ouvrirModaleExercices } from '../services/modale'
  import { mathaleaUpdateUrlFromExercicesParams } from '../../lib/mathalea'
    import { environment } from '../services/environment'

  let niveauChoisi = 'tout'
  mathaleaUpdateUrlFromExercicesParams()

  function lancerExercices () {
    if ($calendrierAnneeEnCours.periodeNumero > 0) {
      const listeDesReferences = getListeDesReferences(
        niveauChoisi
      )
      if (listeDesReferences.length === 0) {
        alert('Tu n\'as pas encore d\'exercice à réviser, reviens plus tard !')
      } else {
        listeDesUrl.set(getListeDesUrl(listeDesReferences, $niveauxObjectifs))
        ouvrirModaleExercices($listeDesUrl[randint(0, $listeDesUrl.length - 1)])
      }
    }
  }

function lancerExercicesBrevet () {
  if ($calendrierAnneeEnCours.periodeNumero > 0) {
    const listeExercicesBrevet = getListeExercicesBrevet()
    if (listeExercicesBrevet.length === 0) {
      alert('Tu n\'as pas encore d\'exercice de brevet à réviser, reviens plus tard !')
    } else {
      listeDesUrl.set(listeExercicesBrevet)
      ouvrirModaleExercices($listeDesUrl[randint(0, $listeDesUrl.length - 1)])
    }
  }
}

  function getListeDesReferences (
    niveauChoisi: string
  ) {
    const listeDesReferences: string[] = []
    for (const niveau of $niveauxSequences) {
      if (niveau.nom === niveauChoisi || niveauChoisi === 'tout') {
        const derniereSequence = getDerniereSequence(niveau.nom)
        console.log(derniereSequence)
        for (const sequence of niveau.sequences) {
          if (sequence.numero <= derniereSequence) {
            for (const objectif of sequence.objectifs) {
              listeDesReferences.push(objectif.reference)
            }
          }
        }
      }
    }
    return listeDesReferences
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
                  if (outils.estCoopmaths(exercice.lien)) listeDesUrl.push(exercice.lien)
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

<div class="container is-max-desktop centre">
  <h1 style="border-radius: 50px 50px 0px 0px; padding: 5px 50px 5px 50px; margin-bottom: 0px; background-color: #ea4aaa; color: white; font-size: xx-large; font-weight: 600;">
    Révisions
  </h1>
  <div style="background-color: #fffafa; border-radius: 0px 0px 50px 50px; ">
    <br>
    <div class="tabs is-medium is-centered">
      <ul class="tabs-menu is-full-rounded" style="border-width: 0px;">
        {#each ['tout', '6e', '5e', '4e', '3e'] as niveau}
          <li>
            <button
              on:click={() => { niveauChoisi = niveau }}
              class="subtitle is-4 px-5 is-{niveau}"
              class:is-active={niveauChoisi === niveau}
              class:is-left-side={niveau === 'tout'}
              class:is-right-side={niveau === '3e'}
              style="text-transform: capitalize; width: 85px">
              {niveau}
            </button>
          </li>
        {/each}
        <li />
      </ul>
    </div>
    <button on:click={() => lancerExercices()} class="button is-large is-link is-outlined">
      Réviser les exercices
    </button>
    <br />
    <br />
    <button on:click={() => lancerExercicesBrevet()} class="button is-large is-sponsor is-outlined">
      Réviser les exercices de brevet (3e)
    </button>
    <br />
    <br />
  </div>
</div>
