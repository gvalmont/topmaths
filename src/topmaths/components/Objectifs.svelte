<script lang="ts">
  import { isTeacherMode, objectives, isTitleAcademicPreferred } from '../services/store'
  import { normalize } from '../services/shared'
  import { goToView } from '../services/navigation'
  import { onDestroy } from 'svelte'
  import { writable, derived } from 'svelte/store'
  import LevelsTabsMenu from './shared/LevelsTabsMenu.svelte'
  import { isLineGrade, type LineGrade } from '../types/grade'
  type LineObjective = {
  grade: LineGrade,
  term: number,
  theme: string,
  subTheme: string,
  reference: string,
  titleAcademic: string,
  title: string
}
  type Filter = {
    grade: LineGrade,
    term: number
  }

  const filter: Filter = {
    grade: 'all',
    term: 0
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

  function count ({ grade, theme, subTheme, term, filter }: { grade: LineGrade, theme: string, subTheme: string, term: number, filter: Filter }) {
    return $objectives
      .filter((objective) => {
        return (
          (grade === 'all' || objective.grade === grade) && (filter.grade === 'all' || filter.grade === grade) &&
          (theme === '' || objective.theme === theme) &&
          (subTheme === '' || objective.subTheme === subTheme) &&
          ((term === 0 || objective.term === term) && (filter.term === 0 || filter.term === term))
        )
      })
      .length
  }

  function updateParamsFromUrl () {
    const url = new URL(window.location.href)
    const entries = url.searchParams.entries()
    for (const entry of entries) {
      if (entry[0] === 'niveau') filter.grade = isLineGrade(entry[1]) ? entry[1] : 'all'
      if (entry[0] === 'periode') filter.term = Number(entry[1])
    }
  }

  function getLignesFiltrees (texteRecherche: string, objectives: LineObjective[]): LineObjective[] {
    if (texteRecherche === '') return objectives
    const motsCherches = normalize(texteRecherche).split(' ')
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
      normalize(ligne.grade).includes(mot)
    ) { return true }
    if (
      ligne.reference !== undefined &&
      normalize(ligne.reference).includes(mot)
    ) { return true }
    if (
      ligne.titleAcademic !== undefined &&
      normalize(ligne.titleAcademic).includes(mot)
    ) { return true }
    if (
      ligne.title !== undefined &&
      normalize(ligne.title).includes(mot)
    ) { return true }
    return false
  }

  function clicFiltre (grade: LineGrade, term?: number) {
    if (grade !== '') {
      filter.grade = grade
    }
    if (term !== undefined) {
      filter.term === term
        ? (filter.term = 0)
        : (filter.term = term)
    }
    window.history.pushState({}, '', `?v=objectifs&niveau=${filter.grade}&periode=${filter.term}`)
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
      class:is-light={filter.term !== null &&
        filter.term !== undefined &&
        filter.term > 0}
      on:click={() => clicFiltre('', 0)}>Période</button
    >
    {#each [1, 2, 3, 4, 5] as term}
      <button
        class="button rounded-3xl py-1 px-5 is-link mb-5 mx-1 text-sm md:text-2xl"
        class:is-light={filter.term !== term}
        on:click={() => clicFiltre('', term)}>{term}</button
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
  {#if $isTeacherMode}
  <label class="absolute mt-2 ml-2 text-xs md:text-base">
    <input type="checkbox" bind:checked={$isTitleAcademicPreferred} />
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
          {#if (i === 0 || $rows[i - 1].theme !== $rows[i].theme) && count({ grade: row.grade, theme: row.theme, subTheme: row.subTheme, term: row.term, filter }) > 0}
            <h2 class="subtitle text-xl md:text-3xl pt-2 is-{row.grade}">
              {row.theme}
            </h2>
          {/if}
          {#if (i === 0 || $rows[i - 1].subTheme !== $rows[i].subTheme) && count({ grade: row.grade, theme: row.theme, subTheme: row.subTheme, term: row.term, filter }) > 0}
            <h3 class="subtitle text-lg md:text-2xl p-4 is-{row.grade}">
              {row.subTheme}
            </h3>
          {/if}
          {#if count({ grade: row.grade, theme: row.theme, subTheme: row.subTheme, term: row.term, filter }) > 0}
            <div
              class="p-1  is-{row.grade}"
              class:is-fin={$texteRecherche === '' && i < $rows.length - 2 && ($rows[i + 1].grade === 'end' || $rows[i + 1].theme === 'Extra')}
            >
              <a
                href="/?v=objectif&ref={row.reference}"
                on:click={(event) =>
                  goToView(event, 'objectif', row.reference ?? '')}
              >
                <div>
                  {row.reference} : {$isTitleAcademicPreferred ||
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
