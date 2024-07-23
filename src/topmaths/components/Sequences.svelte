<script lang="ts">
  import {
    units,
    sequencesParticulieres
  } from '../services/store'
  import { onDestroy } from 'svelte'
  import { normaliser } from '../services/outils'
  import { goVue } from '../services/navigation'
  import type { Unsubscriber } from 'svelte/store'
  import { writable, derived } from 'svelte/store'
  import LevelsTabsMenu from './shared/LevelsTabsMenu.svelte'
  import { isLineGrade, type LineGrade } from '../types/shared'
  import type { Unit } from '../types/unit'

  interface Ligne {
    grade: LineGrade
    period: number
    number: number
    reference: string
    title: string
  }

  const filter: Ligne = {
    grade: 'all',
    period: 0,
    number: 0,
    reference: '',
    title: ''
  }
  const texteRecherche = writable<string>('')
  const rowsRegular = derived(
    [texteRecherche, units],
    ([$texteRecherche, $units]) =>
      getLignesFiltrees($texteRecherche, $units)
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
      if (entry[0] === 'niveau') filter.grade = isLineGrade(entry[1]) ? entry[1] : 'all'
      if (entry[0] === 'periode') filter.period = Number(entry[1])
    }
  }

function MAJPage () {
  if (lesDonneesSontChargees()) {
    MAJLignesSequencesParticulieres()
  }
}

function lesDonneesSontChargees () {
  return $sequencesParticulieres.length > 0 && $units.length > 0
}

  function MAJLignesSequencesParticulieres () {
    lignesSequencesParticulieres = []
    lignesSequencesParticulieres.push({
      grade: 'all',
      period: 0,
      number: 0,
      reference: '',
      title: ''
    })
    for (const sequence of $sequencesParticulieres) {
      lignesSequencesParticulieres.push({
        grade: 'all',
        reference: sequence.reference,
        title: sequence.title,
        number: 0,
        period: 1
      })
    }
    lignesSequencesParticulieres.push({
      grade: 'end',
      period: 0,
      number: 0,
      reference: '',
      title: ''
    })
  }

  function surveillerChargementDesDonnees () {
    sequencesParticulieresUnsubscribe = sequencesParticulieres.subscribe(() => MAJPage())
    niveauxSequencesUnsubscribe = units.subscribe(() => MAJPage())
    onDestroy(niveauxSequencesUnsubscribe)
    onDestroy(sequencesParticulieresUnsubscribe)
  }

  function getLignesFiltrees (texteRecherche: string, lignes: Unit[]): Ligne[] {
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
      ligne.grade !== undefined &&
      normaliser(ligne.grade).includes(mot)
    ) { return true }
    if (
      ligne.number !== undefined &&
      normaliser(ligne.number.toString()).includes(mot)
    ) { return true }
    if (
      ligne.reference !== undefined &&
      normaliser(ligne.reference).includes(mot)
    ) { return true }
    if (
      ligne.title !== undefined &&
      normaliser(ligne.title).includes(mot)
    ) { return true }
    return false
  }

  function clicFiltre (niveau: LineGrade, periode?: number) {
    if (niveau !== '') {
      filter.grade = niveau
    }
    if (periode !== undefined) {
      filter.period === periode
        ? (filter.period = 0)
        : (filter.period = periode)
    }
    window.history.pushState({}, '', `?v=sequences&niveau=${filter.grade}&periode=${filter.period}`)
  }
</script>

<svelte:head>
  <title>Liste des séquences - topmaths</title>
</svelte:head>

<!-- Menu -->
<div class="w-screen max-w-screen-lg">
  <LevelsTabsMenu
    activeLevelTab={filter.grade}
    onLevelsTabsMenuClicked={clicFiltre}
  />
  <div class="is-flex is-justify-content-center pt-2 pb-1" style="overflow:auto">
    <button
      class="button rounded-3xl py-1 px-5 is-link mb-5 mx-1 text-sm md:text-2xl"
      class:is-light={filter.period !== null &&
        filter.period !== undefined &&
        filter.period > 0}
      on:click={() => clicFiltre('', 0)}>Période</button
    >
    {#each [1, 2, 3, 4, 5] as periode}
      <button
        class="button rounded-3xl py-1 px-5 is-link mb-5 mx-1 text-sm md:text-2xl"
        class:is-light={filter.period !== periode}
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
      <h1 class="title text-2xl md:text-4xl font-semibold p-2 is-tout">Séquences particulières</h1>
      {#each lignesSequencesParticulieres as ligne, i}
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
              {ligne.number === 0
                ? ''
                : 'Séquence ' + ligne.number + ' : '}{ligne.title}<br />
            </div>
          </a>
        {/if}
      {/each}
    </div>
    <div><br /></div>
  {/if}
  {#each $rowsRegular as row, i}
    <div>
      {#if (i === 0 || $rowsRegular[i - 1].grade !== $rowsRegular[i].grade) && (filter.grade === 'all' || filter.grade === row.grade)}
        <h1 class="title text-2xl md:text-4xl font-semibold p-2 is-{row.grade}">
          <span class="has-text-white">
            {row.grade}
          </span>
        </h1>
      {/if}
      {#if row.reference !== '' && row.grade !== 'end' && (row.period === filter.period || filter.period === 0) && (filter.grade === 'all' || filter.grade === row.grade)}
        <div
          class="p-1  is-{row.grade}"
          class:is-fin={i < $rowsRegular.length - 1 && ((filter.period > 0 && $rowsRegular[i].period !== $rowsRegular[i + 1].period) || $rowsRegular[i + 1].grade === 'end')}
        >
          <a
            href="/?v=sequence&ref={row.reference}"
            on:click={(event) =>
              goVue(event, 'sequence', row.reference)}
          >
            <div>
              {row.number === 0
                ? ''
                : 'Séquence ' + row.number + ' : '}{row.title}
            </div>
          </a>
        </div>
      {/if}
    </div>
    {#if row.grade === 'end' && (filter.grade === 'all')}
      <div><br /></div>
    {/if}
  {/each}
</div>
