<script lang="ts">
  import { modeEnseignant, objectives, titresProchesDesAttendus } from '../services/store'
  import { normaliser } from '../services/outils'
  import { goVue } from '../services/navigation'
  import { onDestroy } from 'svelte'
  import { writable, derived } from 'svelte/store'
  import { isLineGrade, type LineGrade, type LineObjective } from '../services/types'
  import LevelsTabsMenu from './shared/LevelsTabsMenu.svelte'

  type Filter = {
    grade: LineGrade,
    period: number
  }

  const filter: Filter = {
    grade: 'all',
    period: 0
  }
  const texteRecherche = writable('')
  const rows = derived(
    [texteRecherche, objectives],
    ([$texteRecherche, $objectives]) => getLignesFiltrees($texteRecherche, $objectives)
  )

  updateParamsFromUrl()
  addEventListener('popstate', updateParamsFromUrl)
  onDestroy(() => {
    removeEventListener('popstate', updateParamsFromUrl)
  })

  function count ({ grade, theme, subTheme, period, filter }: { grade: LineGrade, theme: string, subTheme: string, period: number, filter: Filter }) {
    return $objectives
      .filter((objective) => {
        return (
          (grade === 'all' || objective.grade === grade) && (filter.grade === 'all' || filter.grade === grade) &&
          (theme === '' || objective.theme === theme) &&
          (subTheme === '' || objective.subTheme === subTheme) &&
          ((period === 0 || objective.period === period) && (filter.period === 0 || filter.period === period))
        )
      })
      .length
  }

  function updateParamsFromUrl () {
    const url = new URL(window.location.href)
    const entries = url.searchParams.entries()
    for (const entry of entries) {
      if (entry[0] === 'niveau') filter.grade = isLineGrade(entry[1]) ? entry[1] : 'all'
      if (entry[0] === 'periode') filter.period = Number(entry[1])
    }
  }

  function getLignesFiltrees (texteRecherche: string, objectives: LineObjective[]): LineObjective[] {
    if (texteRecherche === '') return objectives
    const motsCherches = normaliser(texteRecherche).split(' ')
    return objectives.filter((ligne) => {
      for (const mot of motsCherches) {
        if (!motTrouve(mot, ligne)) return false
      }
      return true
    })
  }

  function motTrouve (mot: string, ligne: LineObjective) {
    if (
      ligne.grade !== undefined &&
      normaliser(ligne.grade).includes(mot)
    ) { return true }
    if (
      ligne.reference !== undefined &&
      normaliser(ligne.reference).includes(mot)
    ) { return true }
    if (
      ligne.titleAcademic !== undefined &&
      normaliser(ligne.titleAcademic).includes(mot)
    ) { return true }
    if (
      ligne.title !== undefined &&
      normaliser(ligne.title).includes(mot)
    ) { return true }
    return false
  }

  function clicFiltre (grade: LineGrade, periode?: number) {
    if (grade !== '') {
      filter.grade = grade
    }
    if (periode !== undefined) {
      filter.period === periode
        ? (filter.period = 0)
        : (filter.period = periode)
    }
    window.history.pushState({}, '', `?v=objectifs&niveau=${filter.grade}&periode=${filter.period}`)
  }
</script>

<svelte:head>
  <title>Liste des objectifs topmaths</title>
</svelte:head>

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
    aria-describedby="Champ pour rechercher un objectif"
    autocomplete="off"
    placeholder="Recherche"
    bind:value={$texteRecherche}
    on:input
  />
  {#if $modeEnseignant}
  <label class="absolute mt-2 ml-2 text-xs md:text-base">
    <input type="checkbox" bind:checked={$titresProchesDesAttendus} />
      Intitulés proches des attendus de fin d'année
  </label>
  {/if}
  <div><br /></div>
  <div>
    {#each $rows as row, i}
      {#if row.theme !== 'Extra' && row.grade !== 'end'}
        <span>
          {#if (i === 0 || $rows[i - 1].grade !== $rows[i].grade) && (filter.grade === 'all' || filter.grade === row.grade)}
            <h1 class="title text-2xl md:text-4xl font-semibold p-2 is-{row.grade}">
              {row.grade}
            </h1>
          {/if}
          {#if (i === 0 || $rows[i - 1].theme !== $rows[i].theme) && count({ grade: row.grade, theme: row.theme, subTheme: row.subTheme, period: row.period, filter }) > 0}
            <h2 class="subtitle text-xl md:text-3xl pt-2 is-{row.grade}">
              {row.theme}
            </h2>
          {/if}
          {#if (i === 0 || $rows[i - 1].subTheme !== $rows[i].subTheme) && count({ grade: row.grade, theme: row.theme, subTheme: row.subTheme, period: row.period, filter }) > 0}
            <h3 class="subtitle text-lg md:text-2xl p-4 is-{row.grade}">
              {row.subTheme}
            </h3>
          {/if}
          {#if count({ grade: row.grade, theme: row.theme, subTheme: row.subTheme, period: row.period, filter }) > 0}
            <div
              class="p-1  is-{row.grade}"
              class:is-fin={$texteRecherche === '' && i < $rows.length - 2 && ($rows[i + 1].grade === 'end' || $rows[i + 1].theme === 'Extra')}
            >
              <a
                href="/?v=objectif&ref={row.reference}"
                on:click={(event) =>
                  goVue(event, 'objectif', row.reference ?? '')}
              >
                <div>
                  {row.reference} : {$titresProchesDesAttendus ||
                    row.title === undefined || row.title === ''
                    ? row.titleAcademic
                    : row.title}<br />
                </div>
              </a>
            </div>
          {/if}
        </span>
      {/if}
      {#if i > 0 && row.grade === 'end' && filter.grade === 'all'}
        <div>
          <br />
        </div>
      {/if}
    {/each}
  </div>
</div>
