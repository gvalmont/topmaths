<script lang="ts">
  import {
    modeEnseignant,
    modePerso,
    niveauxObjectifs,
    niveauxSequences,
    reference
  } from '../services/store'
  import type { ObjectifObjectif } from '../services/types'
  import { getTitre, goVue } from '../services/outils'
  import { afterUpdate, onDestroy, tick } from 'svelte'
  import type { Unsubscriber } from 'svelte/store'
  import {
    mathaleaRenderDiv
  } from '../../lib/mathalea'
  import {
    estPresentDansLePanier,
    tousLesExercicesSontPresentsDansLePanier
  } from '../services/panier'
  import iepLoadPromise from 'instrumenpoche'
  import BoutonsExercices from './shared/BoutonsExercices.svelte'
  import DownloadLine from './shared/DownloadLine.svelte'

  export let title = 'topmaths.fr - Séquence'
  let objectif = {} as ObjectifObjectif
  let tousLesExercicesSontDansLePanier = false
  let niveau = '' as string
  let exercicesDeBrevetDansLePanier = false
  let nomsPanier: string[] = []
  let referenceObjectifUnsubscribe: Unsubscriber
  let niveauxObjectifsUnsubscribe: Unsubscriber
  surveillerChangementsDeReference()
  surveillerLeChargementDesDonnees()

  afterUpdate(async () => {
    if (objectif.rappelDuCoursHTML !== '') {
      await tick()
      const rappelDuCoursHTML = document.getElementById('rappelDuCoursHTML')
      if (rappelDuCoursHTML !== null) mathaleaRenderDiv(rappelDuCoursHTML)
    }
    if (objectif.rappelDuCoursInstrumenpoche !== undefined && objectif.rappelDuCoursInstrumenpoche !== '') loadIep()
  })

  function surveillerChangementsDeReference () {
    referenceObjectifUnsubscribe = reference.subscribe(() => MAJPage())
    onDestroy(referenceObjectifUnsubscribe)
  }

  function surveillerLeChargementDesDonnees () {
    niveauxObjectifsUnsubscribe = niveauxObjectifs.subscribe(() => MAJPage())
    onDestroy(niveauxObjectifsUnsubscribe)
  }

  function lesDonneesSontChargees () {
    return $niveauxObjectifs.length > 0 && $niveauxSequences.length > 0
  }

  function MAJPage () {
    if (lesDonneesSontChargees() && $reference.slice(0, 1) !== 'S') {
      objectif = getObjectif()
      niveau = objectif.reference.slice(0, 1) + 'e'
      MAJProprietes()
    }
  }

  function getObjectif () {
    for (const niveau of $niveauxObjectifs) {
      for (const theme of niveau.themes) {
        for (const sousTheme of theme.sousThemes) {
          for (const objectif of sousTheme.objectifs) {
            if (objectif.reference === $reference) {
              return objectif
            }
          }
        }
      }
    }
    return {} as ObjectifObjectif
  }

  function MAJProprietes () {
    title = objectif.reference + ' : ' + getTitre(objectif)
    MakeNomsPanier()
    MAJPanier()
  }

  function MakeNomsPanier () {
    nomsPanier = []
    for (let i = 0; i < objectif.exercices.length; i++) {
      nomsPanier.push(objectif.reference + ' ' + getTitre(objectif))
    }
  }

  function MAJPanier () {
    for (const exercice of objectif.exercices) {
      if (exercice.slug !== '') {
        exercice.estDansLePanier = estPresentDansLePanier(exercice.id)
      }
    }
    tousLesExercicesSontDansLePanier =
      tousLesExercicesSontPresentsDansLePanier(objectif)
    if (objectif.exercicesDeBrevet !== undefined) {
      for (const exercice of objectif.exercicesDeBrevet) {
        if (exercice.slug !== '') {
          exercice.estDansLePanier = estPresentDansLePanier(exercice.id)
        }
      }
      exercicesDeBrevetDansLePanier = tousLesExercicesSontPresentsDansLePanier(
        objectif,
        true
      )
    }
  }

  function loadIep () {
    const url = `topmaths/data/instrumenpoche/${objectif.rappelDuCoursInstrumenpoche}.xml`
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
    {objectif.reference + ' : ' + getTitre(objectif)}
  </h1>
  {#if objectif.rappelDuCoursHTML !== '' || objectif.rappelDuCoursImage !== '' || (objectif.rappelDuCoursInstrumenpoche !== undefined && objectif.rappelDuCoursInstrumenpoche !== '')}
    <div class="is-{niveau}">
      <h2 class="subtitle text-xl md:text-3xl p-3 is-{niveau}">Rappel du cours</h2>
      <div class="p-6 ">
        {#if objectif.rappelDuCoursHTML !== ''}
          <p
            id="rappelDuCoursHTML"
            contenteditable="false"
            bind:innerHTML={objectif.rappelDuCoursHTML}
          />
        {/if}
        {#if objectif.rappelDuCoursImage !== ''}
          <img class="inline-block" src={objectif.rappelDuCoursImage} />
        {/if}
        {#if objectif.rappelDuCoursInstrumenpoche !== undefined && objectif.rappelDuCoursInstrumenpoche !== ''}
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
          {#if video.titre !== ''}
            <h3 class="subtitle text-lg md:text-2xl p-3 is-{niveau}">{video.titre}</h3>
          {/if}
          <div class="image is-16by9">
            <iframe
              class="has-ratio"
              src={video.slug}
              title="Vidéo d'explication"
              allowfullscreen
            />
          </div>
          Vidéo de&nbsp;<a
            href={video.lienAuteur}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button>
              {video.auteur}
            </button>
          </a>
        </div>
      {/each}
    </div>
  {/if}
  {#if objectif.exercices.length > 0}
    <div
      id="divExercices"
      class="is-{niveau}"
      class:is-fin = {objectif.sequences.length === 0 &&
        !objectif.telechargementsDisponibles.entrainement &&
        !objectif.telechargementsDisponibles.test}
    >
      <h2 class="subtitle text-xl md:text-3xl p-3 is-{niveau}">
        <BoutonsExercices
          reference = {objectif.reference}
          exercices = {objectif.exercices}
          videos = {objectif.videos}
          lienExercices = {objectif.lienExercices}
          panierRempli = {tousLesExercicesSontDansLePanier}
          titre = {'S\'entraîner'}
          nomsPanier = {nomsPanier}
        />
      </h2>
      <ul class="p-6 ">
        {#each objectif.exercices as exercice, i}
          <li class="p-1 md:p-2">
            <BoutonsExercices
              reference = {objectif.reference}
              exercices = {[objectif.exercices[i]]}
              videos = {objectif.videos}
              lienExercices = {exercice.lien}
              panierRempli = {exercice.estDansLePanier}
              titre = {exercice.description !== ''
                ? exercice.description
                : objectif.exercices.length > 1
                  ? 'Exercices de niveau ' + (i + 1)
                  : "Lancer l'exercice"}
              indiceExercice = {i}
              nomsPanier = {[objectif.reference + ' ' + getTitre(objectif)]}
            />
          </li>
        {/each}
      </ul>
    </div>
  {/if}
  {#if objectif.lienExercicesDeBrevet !== ''}
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
            exercices = {objectif.exercicesDeBrevet}
            videos = {objectif.videos}
            lienExercices = {objectif.lienExercicesDeBrevet}
            panierRempli = {exercicesDeBrevetDansLePanier}
            titre = {'Lancer les exercices de brevet'}
            exercicesDeBrevet = {true}
            nomsPanier = {[objectif.reference + ' ' + getTitre(objectif) + ' Brevet ']}
          />
        </li>
      </ul>
    </div>
  {/if}
  {#if objectif.telechargementsDisponibles.entrainement || objectif.telechargementsDisponibles.test || ($modePerso && objectif.telechargementsDisponibles.fiche)}
    <div
      class="{objectif.sequences.length === 0 ? 'is-fin ' : ''}is-{niveau}"
    >
      <h2 class="subtitle text-xl md:text-3xl p-3 is-{niveau}">Téléchargements</h2>
      <ul class="p-6 ">
        <DownloadLine
          displayCondition={objectif.telechargementsDisponibles.entrainement}
          href="topmaths/entrainement/{niveau}/Entrainement_{$reference}.pdf"
          label="Télécharger la feuille d'entraînement"
        />
        <DownloadLine
          displayCondition={$modeEnseignant && objectif.telechargementsDisponibles.test}
          href="topmaths/test/{niveau}/Test_{$reference}.pdf"
          label="Télécharger les tests"
        />
        {#if $modePerso && objectif.telechargementsDisponibles.fiche}
          {#each objectif.telechargementsDisponibles.niveauxFiches as niveauDisponible}
            {#each objectif.fiches as fiche}
              <DownloadLine
                displayCondition={fiche.niveaux.length === 0 || fiche.niveaux.includes(niveauDisponible)}
                href="topmaths/fiches/objectifs/{objectif.niveau}/{niveauDisponible}_{fiche.reference.split('-')[1] === undefined ? (fiche.reference + '_Fiche') : fiche.reference.split('-')[0] + '_Fiche-' + fiche.reference.split('-')[1]}.pdf"
                label="Télécharger la fiche{fiche.reference.split('-')[1] === undefined ? '' : ' ' + fiche.reference.split('-')[1]}{objectif.telechargementsDisponibles.niveauxFiches.length > 1 ? ` (${niveauDisponible})` : ''}"
              />
            {/each}
          {/each}
        {/if}
      </ul>
    </div>
  {/if}
  {#if objectif.sequences.length > 0}
    <div class="is-fin is-{niveau}">
      <h2 class="subtitle text-xl md:text-3xl p-3 is-{niveau}">
        Séquence{objectif.sequences.length > 1 ? 's' : ''}
      </h2>
      <p class="pt-8">Cet objectif fait partie de :</p>
      <ul class="p-6 ">
        {#each objectif.sequences as sequence}
          <li class="p-1 md:p-2">
            <a
              href="/?v=sequence&ref={sequence.reference}"
              style="color: var(--base{sequence.reference.slice(1, 2)}e);"
              on:click={(event) =>
                goVue(event, 'sequence', sequence.reference)}
            >
              {'Séquence ' +
                sequence.reference.slice(3) +
                ' : ' +
                sequence.titre}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
