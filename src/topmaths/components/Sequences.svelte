<script lang="ts">
  import {
    niveauxSequences,
    sequencesParticulieres
  } from '../services/store'
  import { onDestroy } from 'svelte'
  import { goVue, normaliser } from '../services/outils'
  import type { Unsubscriber } from 'svelte/store'
  import { writable, derived } from 'svelte/store'
  import LevelsTabsMenu from './shared/LevelsTabsMenu.svelte'

  interface Ligne {
    niveau: string
    periode: number
    numero: number
    reference: string
    titre: string
  }

  const filtre = {
    niveau: 'tout',
    periode: 0,
    numero: 0,
    reference: '',
    titre: ''
  } as Ligne
  const texteRecherche = writable<string>('')
  const lignesSequencesNormales = writable<Ligne[]>([])
  const lignesFiltreesSequencesNormales = derived(
    [texteRecherche, lignesSequencesNormales],
    ([$texteRecherche, $lignesSequencesNormales]) =>
      getLignesFiltrees($texteRecherche, $lignesSequencesNormales)
  )

  let niveauxSequencesUnsubscribe: Unsubscriber
  let sequencesParticulieresUnsubscribe: Unsubscriber
  let lignesSequencesParticulieres = [] as Ligne[]

  updateParamsFromUrl()
  MAJPage()
  surveillerChargementDesDonnees()
  addEventListener('popstate', updateParamsFromUrl)
  onDestroy(() => {
    removeEventListener('popstate', updateParamsFromUrl)
  })

  function updateParamsFromUrl () {
    const url = new URL(window.location.href)
    const entries = url.searchParams.entries()
    for (const entry of entries) {
      if (entry[0] === 'niveau') filtre.niveau = entry[1]
      if (entry[0] === 'periode') filtre.periode = Number(entry[1])
    }
  }

function MAJPage () {
  if (lesDonneesSontChargees()) {
    MAJLignesSequencesParticulieres()
    MAJLignesSequencesNormales()
  }
}

function lesDonneesSontChargees () {
  return $sequencesParticulieres.length > 0 && $niveauxSequences.length > 0
}

  function MAJLignesSequencesParticulieres () {
    lignesSequencesParticulieres = []
    lignesSequencesParticulieres.push({
      niveau: 'Séquences particulières',
      periode: 0,
      numero: 0,
      reference: '',
      titre: ''
    })
    for (const sequence of $sequencesParticulieres) {
      lignesSequencesParticulieres.push({
        niveau: 'Séquences particulières',
        reference: sequence.reference,
        titre: sequence.titre,
        numero: 0,
        periode: 1
      })
    }
    lignesSequencesParticulieres.push({
      niveau: 'fin',
      periode: 0,
      numero: 0,
      reference: '',
      titre: ''
    })
  }

  function MAJLignesSequencesNormales () {
    const lignes = [] as Ligne[]
    for (const niveau of $niveauxSequences) {
      lignes.push({
        niveau: niveau.nom,
        reference: '',
        titre: '',
        periode: 0,
        numero: 0
      })
      for (const sequence of niveau.sequences) {
        lignes.push({
          niveau: niveau.nom,
          reference: sequence.reference,
          titre: sequence.titre,
          periode: sequence.periode,
          numero: sequence.numero
        })
      }
      lignes.push({
        niveau: 'fin',
        reference: '',
        titre: '',
        periode: 0,
        numero: 0
      })
    }
    lignesSequencesNormales.set(lignes)
  }

  function surveillerChargementDesDonnees () {
    sequencesParticulieresUnsubscribe = sequencesParticulieres.subscribe(() => MAJPage())
    niveauxSequencesUnsubscribe = niveauxSequences.subscribe(() => MAJPage())
    onDestroy(niveauxSequencesUnsubscribe)
    onDestroy(sequencesParticulieresUnsubscribe)
  }

  function getLignesFiltrees (texteRecherche: string, lignes: Ligne[]): Ligne[] {
    if (texteRecherche === '') return lignes
    const motsCherches = normaliser(texteRecherche).split(' ')
    return lignes.filter((ligne) => {
      for (const mot of motsCherches) {
        if (!motTrouve(mot, ligne)) return false
      }
      return true
    })
  }

  function motTrouve (mot: string, ligne: Ligne) {
    if (
      ligne.niveau !== undefined &&
      normaliser(ligne.niveau).includes(mot)
    ) { return true }
    if (
      ligne.numero !== undefined &&
      normaliser(ligne.numero.toString()).includes(mot)
    ) { return true }
    if (
      ligne.reference !== undefined &&
      normaliser(ligne.reference).includes(mot)
    ) { return true }
    if (
      ligne.titre !== undefined &&
      normaliser(ligne.titre).includes(mot)
    ) { return true }
    return false
  }

  function clicFiltre (niveau: string, periode?: number) {
    if (niveau !== '') {
      filtre.niveau = niveau
    }
    if (periode !== undefined) {
      filtre.periode === periode
        ? (filtre.periode = 0)
        : (filtre.periode = periode)
    }
    window.history.pushState({}, '', `?v=sequences&niveau=${filtre.niveau}&periode=${filtre.periode}`)
  }
</script>

<svelte:head>
  <title>Liste des séquences - topmaths</title>
</svelte:head>

<!-- Menu -->
<div class="w-screen max-w-screen-lg">
  <LevelsTabsMenu
    activeLevelTab={filtre.niveau}
    onLevelsTabsMenuClicked={clicFiltre}
  />
  <div class="is-flex is-justify-content-center pt-2 pb-1" style="overflow:auto">
    <button
      class="button rounded-3xl py-1 px-5 is-link mb-5 mx-1 text-sm md:text-2xl"
      class:is-light={filtre.periode !== null &&
        filtre.periode !== undefined &&
        filtre.periode > 0}
      on:click={() => clicFiltre('', 0)}>Période</button
    >
    {#each [1, 2, 3, 4, 5] as periode}
      <button
        class="button rounded-3xl py-1 px-5 is-link mb-5 mx-1 text-sm md:text-2xl"
        class:is-light={filtre.periode !== periode}
        on:click={() => clicFiltre('', periode)}>{periode}</button
      >
    {/each}
  </div>
  <input
    class="p-1 text-center text-sm md:text-2xl"
    type="text"
    aria-describedby="Champ pour rechercher une séquence"
    autocomplete="off"
    placeholder="Recherche"
    bind:value={$texteRecherche}
    on:input
  />
  <div><br /></div>
  <!-- Séquences particulières -->
  {#if $texteRecherche === ''}
    <div>
      {#each lignesSequencesParticulieres as ligne, i}
        {#if ligne.niveau !== '' && ligne.niveau !== 'fin' && ligne.reference === ''}
          <h1 class="title text-2xl md:text-4xl font-semibold p-2 is-tout">{ligne.niveau}</h1>
        {/if}
        {#if ligne.reference !== ''}
          <a
            href="/?v=sequence&ref={ligne.reference}"
            on:click={(event) =>
              goVue(event, 'sequence', ligne.reference)}
          >
            <div
              class="p-1  is-tout"
              class:is-fin={i === lignesSequencesParticulieres.length - 2}
            >
              {ligne.numero === 0
                ? ''
                : 'Séquence ' + ligne.numero + ' : '}{ligne.titre}<br />
            </div>
          </a>
        {/if}
      {/each}
    </div>
    <div><br /></div>
  {/if}
  {#each $lignesFiltreesSequencesNormales as ligne, i}
    <div>
      {#if ligne.niveau !== '' && ligne.niveau !== 'fin' && ligne.reference === '' && (filtre.niveau === 'tout' || filtre.niveau === ligne.niveau)}
        <h1 class="title text-2xl md:text-4xl font-semibold p-2 is-{ligne.niveau}">
          <span class="has-text-white">
            {ligne.niveau}
          </span>
        </h1>
      {/if}
      {#if ligne.reference !== '' && ligne.niveau !== 'fin' && (ligne.periode === filtre.periode || filtre.periode === 0) && (filtre.niveau === 'tout' || filtre.niveau === ligne.niveau)}
        <div
          class="p-1  is-{ligne.niveau}"
          class:is-fin={i < $lignesSequencesNormales.length && ((filtre.periode > 0 && $lignesSequencesNormales[i].periode !== $lignesSequencesNormales[i + 1].periode) || $lignesSequencesNormales[i + 1].niveau === 'fin')}
        >
          <a
            href="/?v=sequence&ref={ligne.reference}"
            on:click={(event) =>
              goVue(event, 'sequence', ligne.reference)}
          >
            <div>
              {ligne.numero === 0
                ? ''
                : 'Séquence ' + ligne.numero + ' : '}{ligne.titre}
            </div>
          </a>
        </div>
      {/if}
    </div>
    {#if ligne.niveau === 'fin' && (filtre.niveau === 'tout')}
      <div><br /></div>
    {/if}
  {/each}
</div>
