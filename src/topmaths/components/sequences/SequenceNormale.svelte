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
  import BoutonsExercices from '../mini-components/BoutonsExercices.svelte'

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

<h1 id="titre" class="title is-2 is-{niveau} mb-0">
  Séquence {sequence.reference.slice(3)} :<br />{sequence.titre}
</h1>
<div class="is-{niveau}">
  <h2 class="subtitle is-3 is-{niveau} mb-0">Objectifs</h2>
  <div class="p-1 py-5 is-size-5">
    {#each sequence.objectifs as objectif}
      {#if objectif.reference.slice(1, 2) !== 'X'}
        <a
          href="/?v=objectif&ref={objectif.reference}"
          on:click={(event) => goVue(event, 'objectif', objectif.reference)}
        >
          <div class="p-1 is-{niveau} is-size-5">
            {objectif.reference} : {getTitre(objectif)}
          </div>
        </a>
      {/if}
    {/each}
  </div>
</div>
{#if sequence.calculsMentaux[0] !== undefined && sequence.calculsMentaux[0].reference !== ''}
  <div class="is-{niveau}">
    <h2 id="calculMental" class="subtitle is-3 is-{niveau}">Calcul Mental</h2>
    {#if sequence.calculsMentaux[0].reference !== ''}
      <div>
        <p>Dans cette séquence, le calcul mental pourra porter sur :</p>
        {#each sequence.calculsMentaux as calculMental}
          <div class="pb-5">
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
            {#each calculMental.exercices as exercice, j}
              <div>
                <div><br /></div>
                <h3 class="is-inline-block is-size-4">
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
              </div>
            {/each}
          </div>
        {/each}
      </div>
    {/if}
  </div>
{:else if sequence.calculsMentaux[0].exercices[0] !== undefined && sequence.calculsMentaux[0].exercices[0].description !== ''}
  <div class="pb-5 is-{niveau}">
    <h2 class="subtitle is-3 is-{niveau}">Calcul Mental</h2>
    <br />
    <p
      contenteditable="false"
      bind:innerHTML={sequence.calculsMentaux[0].exercices[0].description}
      class="is-size-5"
    />
  </div>
{/if}
{#if sequence.questionsFlash[0] !== undefined && sequence.questionsFlash[0].slug !== ''}
  <div class="pb-5 is-{niveau}">
    <h2 id="questionsFlash" class="subtitle is-3 is-{niveau}">
      Questions Flash
    </h2>
    <p>Dans cette séquence, les questions flash pourront porter sur :</p>
    <div class="p-1">
      {#each sequence.questionsFlash as questionFlash}
        <div class="p-1">
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
        </div>
      {/each}
    </div>
    <div class="pt-5 pb-1 is-size-4">
      <BoutonsExercices
        exercices = {[]}
        lienExercices = {sequence.lienQuestionsFlash}
        titre = {'S\'entraîner pour les Questions Flash'}
        nomsPanier = {[sequence.reference + ' Question Flash ']}
      />
    </div>
  </div>
{/if}
<div
  id="divEvaluation"
  class="pb-5 is-{niveau} {sequence.telechargementsDisponibles.cours ||
  sequence.telechargementsDisponibles.resume ||
  sequence.telechargementsDisponibles.mission
    ? ''
    : ' is-fin'}"
>
  <h2 id="Evaluation" class="subtitle is-3 is-{niveau} mb-0">Évaluation</h2>
  <br />
  <div class="is-size-4">
    <BoutonsExercices
      exercices = {exercicesSequence}
      lienExercices = {sequence.lienEval}
      titre = {'S\'entraîner pour l\'évaluation ' + (niveau === '3e' ? ' (Automatismes)' : '')}
      reference = {sequence.reference}
      nomsPanier = {nomsExercicesSequence}
    />
  </div>
  {#if niveau === '3e' && sequence.lienEvalBrevet !== '' && sequence.lienEvalBrevet !== undefined}
    <div class="is-size-4">
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
{#if sequence.telechargementsDisponibles.cours || sequence.telechargementsDisponibles.resume || sequence.telechargementsDisponibles.mission || ($modePerso && sequence.telechargementsDisponibles.fiche) }
  <div class="pb-6 is-fin is-{niveau}">
    <h2 class="subtitle is-3 is-{niveau}">Téléchargements</h2>
    <div class="p-1 is-{niveau}">
      {#if sequence.telechargementsDisponibles.cours}
        <div class="p-1">
          <a
            href="topmaths/cours/{niveau}/{referenceSequence}_Cours.pdf"
          >
            <button>
              Télécharger le cours &nbsp;
              <i class="image is-24x24 is-inline-block">
                <img
                  src="/topmaths/img/cc0/pdf-file-format-symbol-svgrepo-com.svg"
                  alt="Icone de PDF"
                />
              </i>
            </button>
          </a>
        </div>
      {/if}
      {#if sequence.telechargementsDisponibles.resume}
        <div class="p-1">
          <a
            href="topmaths/resume/{niveau}/Resume_{referenceSequence}.pdf"
          >
            <button>
              Télécharger le résumé &nbsp;
              <i class="image is-24x24 is-inline-block">
                <img
                  src="/topmaths/img/cc0/pdf-file-format-symbol-svgrepo-com.svg"
                  alt="Icone de PDF"
                />
              </i>
            </button>
          </a>
        </div>
      {/if}
      {#if sequence.telechargementsDisponibles.mission}
        <div class="p-1">
          <a
            href="topmaths/mission/{niveau}/Mission_{referenceSequence}.pdf"
          >
            <button>
              Télécharger la mission &nbsp;
              <i class="image is-24x24 is-inline-block">
                <img
                  src="/topmaths/img/cc0/pdf-file-format-symbol-svgrepo-com.svg"
                  alt="Icone de PDF"
                />
              </i>
            </button>
          </a>
        </div>
      {/if}
      {#if $modePerso && sequence.telechargementsDisponibles.fiche}
      <div class="p-1">
        <a
          href="topmaths/fiches/sequences/{niveau}/{referenceSequence}_Fiche.pdf"
        >
          <button>
            Télécharger la fiche &nbsp;
            <i class="image is-24x24 is-inline-block">
              <img
                src="/topmaths/img/cc0/pdf-file-format-symbol-svgrepo-com.svg"
                alt="Icone de PDF"
              />
            </i>
          </button>
        </a>
      </div>
      {/if}
    </div>
  </div>
{/if}
