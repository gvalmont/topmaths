<script lang="ts">
  import {
    modePerso,
    niveauxObjectifs,
    niveauxSequences
  } from '../../services/store'
  import type { ObjectifExercice, SequenceSequence } from '../../services/types'
  import { getTitre, goVue } from '../../services/outils'
  import { onDestroy } from 'svelte'
  import type { Unsubscriber } from 'svelte/store'
  import BoutonsExercices from '../shared/BoutonsExercices.svelte'
  import DownloadLine from '../shared/DownloadLine.svelte'

  let niveau = ''
  export let referenceSequence = ''
  let sequence: SequenceSequence = {
    reference: '',
    titre: '',
    niveau: '',
    numero: 0,
    periode: 0,
    objectifs: [],
    calculsMentaux: [],
    questionsFlash: [],
    lienQuestionsFlash: '',
    slugEvalBrevet: '',
    lienEval: '',
    lienEvalBrevet: '',
    telechargementsDisponibles: { cours: false, resume: false, mission: false, fiche: false }
  }
  let exercicesSequence: ObjectifExercice[] = []
  let nomsExercicesSequence: string[] = []
  let niveauxObjectifsUnsubscribe: Unsubscriber
  let niveauxSequencesUnsubscribe: Unsubscriber
  export let title = 'topmaths.fr - Séquence'
  trouverSequence()
  surveillerLeChargementDesDonnees()

  function surveillerLeChargementDesDonnees () {
    niveauxObjectifsUnsubscribe = niveauxObjectifs.subscribe(() =>
      trouverSequence()
    )
    onDestroy(niveauxObjectifsUnsubscribe)
    niveauxSequencesUnsubscribe = niveauxSequences.subscribe(() =>
      trouverSequence()
    )
    onDestroy(niveauxSequencesUnsubscribe)
  }

  function lesDonneesSontChargees () {
    return $niveauxObjectifs.length > 0 && $niveauxSequences.length > 0
  }

  function trouverSequence () {
    if (lesDonneesSontChargees() && referenceSequence.slice(0, 1) === 'S') {
      $niveauxSequences.find((niveauSequence) => {
        return niveauSequence.sequences.find((sequenceTrouve) => {
          if (sequenceTrouve.reference === referenceSequence) {
            niveau = niveauSequence.nom
            sequence = sequenceTrouve
            title =
              'Séquence ' +
              sequence.reference.slice(3) +
              ' : ' +
              sequence.titre
          }
          return sequenceTrouve.reference === referenceSequence
        })
      })
      listerExercices()
    }
  }

  function listerExercices () {
    exercicesSequence = []
    nomsExercicesSequence = []
    for (const objectif of sequence.objectifs) {
      for (const exercice of objectif.exercices) {
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
  Séquence {sequence.reference.slice(3)} :<br />{sequence.titre}
</h1>
<div class="is-{niveau}">
  <h2 class="subtitle text-xl md:text-3xl p-3 is-{niveau}">Objectifs</h2>
  <ul class="p-6">
    {#each sequence.objectifs as objectif}
      {#if objectif.reference.slice(1, 2) !== 'X'}
        <li class=" p-1 md:p-2 is-{niveau}">
          <a
            href="/?v=objectif&ref={objectif.reference}"
            on:click={(event) => goVue(event, 'objectif', objectif.reference)}
          >
            {objectif.reference} : {getTitre(objectif)}
          </a>
        </li>
      {/if}
    {/each}
      </ul>
</div>
{#if sequence.calculsMentaux[0] !== undefined && sequence.calculsMentaux[0].reference !== ''}
  <div class="is-{niveau}">
    <h2 id="calculMental" class="subtitle text-xl md:text-3xl p-3 is-{niveau}">Calcul Mental</h2>
    {#if sequence.calculsMentaux[0].reference !== ''}
      <div class="p-6 text-sm md:text-base">
        <p>Dans cette séquence, le calcul mental pourra porter sur :</p>
        <ul>
          {#each sequence.calculsMentaux as calculMental}
            <li class="p-1 md:p-2">
              {#if calculMental.pageExiste}
                <a
                  href="/?v=objectif&ref={calculMental.reference}"
                  on:click={(event) =>
                    goVue(event, 'objectif', calculMental.reference)}
                >
                  {calculMental.reference} : {calculMental.titre}
                </a>
              {:else}
                <p>
                  {calculMental.reference} : {calculMental.titre}
                </p>
              {/if}
              <ul>
                {#each calculMental.exercices as exercice, j}
                  <li>
                    <h3 class="p-1 md:p-2 ">
                      <BoutonsExercices
                        lienExercices = {exercice.lien}
                        titre = {calculMental.exercices.length === 1
                          ? "S'entraîner pour le calcul mental"
                          : exercice.description === ''
                            ? 'Calcul mental de niveau ' + (j + 1)
                            : exercice.description}
                        exercices = {[exercice]}
                        reference = {'Calcul Mental '}
                        nomsPanier = {[calculMental.reference + ' ' + calculMental.titre]}
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
{:else if sequence.calculsMentaux[0].exercices[0] !== undefined && sequence.calculsMentaux[0].exercices[0].description !== ''}
  <div class="pb-5 is-{niveau}">
    <h2 class="subtitle text-xl md:text-3xl p-3 is-{niveau}">Calcul Mental</h2>
    <p
      contenteditable="false"
      bind:innerHTML={sequence.calculsMentaux[0].exercices[0].description}
      class=""
    />
  </div>
{/if}
{#if sequence.questionsFlash[0] !== undefined && sequence.questionsFlash[0].slug !== ''}
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
          {#each sequence.questionsFlash as questionFlash}
            <li class="p-1 md:p-2">
              {#if questionFlash.pageExiste}
                <a
                  href="/?v=objectif&ref={questionFlash.reference}"
                  on:click={(event) =>
                    goVue(event, 'objectif', questionFlash.reference)}
                >
                  <p>
                    {questionFlash.reference} : {questionFlash.titre}
                  </p>
                </a>
              {:else}
                <p>
                  {questionFlash.reference} : {questionFlash.titre}
                </p>
              {/if}
            </li>
          {/each}
        </ul>
      </div>
      <div class="p-1 md:p-2 ">
        <BoutonsExercices
          exercices = {[]}
          lienExercices = {sequence.lienQuestionsFlash}
          titre = {'S\'entraîner pour les Questions Flash'}
          nomsPanier = {[sequence.reference + ' Question Flash ']}
        />
      </div>
    </div>
  </div>
{/if}
<div
  id="divEvaluation"
  class="is-{niveau} {sequence.telechargementsDisponibles.cours ||
  sequence.telechargementsDisponibles.resume ||
  sequence.telechargementsDisponibles.mission
    ? ''
    : ' is-fin'}"
>
  <h2 id="Evaluation" class="subtitle text-xl md:text-3xl p-3 is-{niveau}">Évaluation</h2>
  <div class="p-6  flex flex-col">
    <div class="p-1 md:p-2">
      <BoutonsExercices
        exercices = {exercicesSequence}
        lienExercices = {sequence.lienEval}
        titre = {'S\'entraîner pour l\'évaluation ' + (niveau === '3e' ? ' (Automatismes)' : '')}
        reference = {sequence.reference}
        nomsPanier = {nomsExercicesSequence}
      />
    </div>
    {#if niveau === '3e' && sequence.lienEvalBrevet !== '' && sequence.lienEvalBrevet !== undefined}
      <div class="p-1 md:p-2">
        <BoutonsExercices
          exercices = {[]}
          reference = {sequence.reference + ' Brevet '}
          nomsPanier = {[sequence.reference]}
          lienExercices = {sequence.lienEvalBrevet}
          titre = {'S\'entraîner pour l\'évaluation (Exercices de brevet)'}
        />
      </div>
    {/if}
  </div>
</div>
{#if sequence.telechargementsDisponibles.cours || sequence.telechargementsDisponibles.resume || sequence.telechargementsDisponibles.mission || ($modePerso && sequence.telechargementsDisponibles.fiche) }
  <div class="is-fin is-{niveau}">
    <h2 class="subtitle text-xl md:text-3xl p-3 is-{niveau}">Téléchargements</h2>
    <ul class="p-6 ">
      <DownloadLine
        displayCondition={sequence.telechargementsDisponibles.cours}
        href="topmaths/cours/{niveau}/{referenceSequence}_Cours.pdf"
        label="Télécharger le cours"
      />
      <DownloadLine
        displayCondition={sequence.telechargementsDisponibles.resume}
        href="topmaths/resume/{niveau}/Resume_{referenceSequence}.pdf"
        label="Télécharger le résumé"
      />
      <DownloadLine
        displayCondition={sequence.telechargementsDisponibles.mission}
        href="topmaths/mission/{niveau}/Mission_{referenceSequence}.pdf"
        label="Télécharger la mission"
      />
      <DownloadLine
        displayCondition={$modePerso && sequence.telechargementsDisponibles.fiche}
        href="topmaths/fiches/sequences/{niveau}/{referenceSequence}_Fiche.pdf"
        label="Télécharger la fiche"
      />
    </ul>
  </div>
{/if}
