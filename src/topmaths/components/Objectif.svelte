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
  import BoutonsExercices from './mini-components/BoutonsExercices.svelte'

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
  <h1 id="titre" class="title is-2 mb-0 is-{niveau}">
    {objectif.reference + ' : ' + getTitre(objectif)}
  </h1>
  {#if objectif.rappelDuCoursHTML !== '' || objectif.rappelDuCoursImage !== '' || (objectif.rappelDuCoursInstrumenpoche !== undefined && objectif.rappelDuCoursInstrumenpoche !== '')}
    <div class="is-{niveau}">
      <h2 class="mb-5 pb-5 subtitle is-3 is-{niveau}">Rappel du cours</h2>
      <div class="has-text-centered pb-5">
        {#if objectif.rappelDuCoursHTML !== ''}
          <p
            id="rappelDuCoursHTML"
            class="is-size-5 question"
            contenteditable="false"
            bind:innerHTML={objectif.rappelDuCoursHTML}
          />
        {/if}
        <br />
        {#if objectif.rappelDuCoursImage !== ''}
          <img class="is-inline-block" src={objectif.rappelDuCoursImage} />
        {/if}
        {#if objectif.rappelDuCoursInstrumenpoche !== undefined && objectif.rappelDuCoursInstrumenpoche !== ''}
        <div style="text-align: center;">
          <div class="is-inline-block" id="divIEP"></div>
        </div>
        {/if}
      </div>
    </div>
  {/if}
  {#if objectif.videos.length > 0}
    <div class="is-{niveau}">
      <h2 class="subtitle is-3 mb-0 is-{niveau}">
        Vidéo{objectif.videos.length > 1 ? 's' : ''} d'explication
      </h2>
      {#each objectif.videos as video}
        <div class="pb-5">
          {#if video.titre !== ''}
            <h3 class="subtitle is-4 mb-0 is-{niveau}">{video.titre}</h3>
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
      <h2 class="subtitle is-3 is-{niveau}">
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
      <div class="p-3">
        {#each objectif.exercices as exercice, i}
          <div>
            <h3 class="is-size-4 mb-0 is-inline-block">
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
            </h3>
            <div><br /></div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
  {#if objectif.lienExercicesDeBrevet !== ''}
    <div class="pb-5 is-{niveau}">
      <h2 class="subtitle is-3 is-{niveau}">En route vers le brevet</h2>
      <div class="p-1">
        Tu ne peux pas encore faire ces exercices en entier, mais avec ce que tu
        viens d'apprendre, tu sais répondre à au moins une question de chacun
        d'entre eux !
      </div>
      <h3 class="is-size-4 mb-0 is-inline-block">
        <BoutonsExercices
          exercices = {objectif.exercicesDeBrevet}
          videos = {objectif.videos}
          lienExercices = {objectif.lienExercicesDeBrevet}
          panierRempli = {exercicesDeBrevetDansLePanier}
          titre = {'Lancer les exercices de brevet'}
          exercicesDeBrevet = {true}
          nomsPanier = {[objectif.reference + ' ' + getTitre(objectif) + ' Brevet ']}
        />
      </h3>
    </div>
  {/if}
  {#if objectif.telechargementsDisponibles.entrainement || objectif.telechargementsDisponibles.test || ($modePerso && objectif.telechargementsDisponibles.fiche)}
    <div
      class="{objectif.sequences.length === 0 ? 'is-fin ' : ''}pb-5 is-{niveau}"
    >
      <h2 class="subtitle is-3 is-{niveau}">Téléchargements</h2>
      <div class="p-1">
        {#if objectif.telechargementsDisponibles.entrainement}
          <div class="p-1">
            <a
              href="topmaths/entrainement/{niveau}/Entrainement_{$reference}.pdf"
            >
              <button>
                Télécharger la feuille d'entraînement &nbsp;
                <i class="image is-24x24 is-inline-block">
                  <img
                    src="/topmaths/img/cc0/pdf-file-format-symbol-svgrepo-com.svg"
                    alt="Fichier PDF"
                  />
                </i>
              </button>
            </a>
          </div>
        {/if}
        {#if $modeEnseignant && objectif.telechargementsDisponibles.test}
          <div class="p-1">
            <a href="topmaths/test/{niveau}/Test_{$reference}.pdf">
              <button>
                Télécharger les tests &nbsp;
                <i class="image is-24x24 is-inline-block">
                  <img
                    src="/topmaths/img/cc0/pdf-file-format-symbol-svgrepo-com.svg"
                    alt="Fichier PDF"
                  />
                </i>
              </button>
            </a>
          </div>
        {/if}
        {#if $modePerso && objectif.telechargementsDisponibles.fiche}
          {#each objectif.telechargementsDisponibles.niveauxFiches as niveauDisponible}
            {#each objectif.fiches as fiche}
              {#if fiche.niveaux.length === 0 || fiche.niveaux.includes(niveauDisponible)}
                <div class="p-1">
                  <a href="topmaths/fiches/objectifs/{objectif.niveau}/{niveauDisponible}_{fiche.reference.split('-')[1] === undefined ? (fiche.reference + '_Fiche') : fiche.reference.split('-')[0] + '_Fiche-' + fiche.reference.split('-')[1]}.pdf">
                    <button>
                      Télécharger la fiche{fiche.reference.split('-')[1] === undefined ? '' : ' ' + fiche.reference.split('-')[1]}{objectif.telechargementsDisponibles.niveauxFiches.length > 1 ? ` (${niveauDisponible})` : ''} &nbsp;
                      <i class="image is-24x24 is-inline-block">
                        <img
                          src="/topmaths/img/cc0/pdf-file-format-symbol-svgrepo-com.svg"
                          alt="Fichier PDF"
                        />
                      </i>
                    </button>
                  </a>
                </div>
              {/if}
            {/each}
          {/each}
        {/if}
      </div>
    </div>
  {/if}
  {#if objectif.sequences.length > 0}
    <div class="is-fin is-{niveau}">
      <h2 class="subtitle is-3 is-{niveau}">
        Séquence{objectif.sequences.length > 1 ? 's' : ''}
      </h2>
      <p>Cet objectif fait partie de :</p>
      <br />
      <ul>
        {#each objectif.sequences as sequence}
          <li class="title is-4">
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
      <div><br /><br /></div>
    </div>
  {/if}
</div>
