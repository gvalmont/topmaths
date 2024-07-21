<script lang="ts">
  import { modeEnseignant, niveauxObjectifs, titresProchesDesAttendus } from '../services/store'
  import { normaliser } from '../services/outils'
  import { goVue } from '../services/navigation'
  import { onDestroy } from 'svelte'
  import type { Unsubscriber } from 'svelte/store'
  import { writable, derived } from 'svelte/store'
  import type { LineGrade, LineObjective } from '../services/types'
  import LevelsTabsMenu from './shared/LevelsTabsMenu.svelte'

  const filtre = {
    grade: 'all',
    period: 0,
    theme: { name: '', objectivesPerPeriodCount: [] },
    subTheme: { name: '', objectivesPerPeriodCount: [] },
    reference: '',
    titleAcademic: '',
    title: ''
  } as LineObjective
  const texteRecherche = writable('')
  const lignes = writable<LineObjective[]>([])
  const lignesFiltrees = derived(
    [texteRecherche, lignes],
    ([$texteRecherche, $lignes]) => getLignesFiltrees($texteRecherche, $lignes)
  )

  let niveauxObjectifsUnsubscribe: Unsubscriber

  updateParamsFromUrl()
  MAJPage()
  surveillerLeChargementDesDonnees()
  addEventListener('popstate', updateParamsFromUrl)
  onDestroy(() => {
    removeEventListener('popstate', updateParamsFromUrl)
  })

  function updateParamsFromUrl () {
    const url = new URL(window.location.href)
    const entries = url.searchParams.entries()
    for (const entry of entries) {
      if (entry[0] === 'niveau') filtre.grade = entry[1]
      if (entry[0] === 'periode') filtre.period = Number(entry[1])
    }
  }

  function surveillerLeChargementDesDonnees () {
    niveauxObjectifsUnsubscribe = niveauxObjectifs.subscribe(() => MAJPage())
    onDestroy(niveauxObjectifsUnsubscribe)
  }

  function MAJPage () {
    if (lesDonneesSontChargees()) {
      MAJLignes()
    }
  }

  function lesDonneesSontChargees () {
    return $niveauxObjectifs.length > 0
  }

  function MAJLignes () {
    const lignesTemp: LineObjective[] = []
    for (const niveau of $niveauxObjectifs) {
      lignesTemp.push({
        grade: niveau.name,
        period: 0,
        theme: { name: '', objectivesPerPeriodCount: [] },
        subTheme: { name: '', objectivesPerPeriodCount: [] },
        reference: '',
        titleAcademic: '',
        title: ''
      })
      for (const theme of niveau.themes) {
        lignesTemp.push({
          grade: niveau.name,
          period: 0,
          theme: {
            name: theme.name,
            objectivesPerPeriodCount: theme.objectivesPerPeriodCount
          },
          subTheme: { name: '', objectivesPerPeriodCount: [] },
          reference: '',
          titleAcademic: '',
          title: ''
        })
        for (const sousTheme of theme.subThemes) {
          lignesTemp.push({
            grade: niveau.name,
            period: 0,
            theme: {
              name: theme.name,
              objectivesPerPeriodCount: theme.objectivesPerPeriodCount
            },
            subTheme: {
              name: sousTheme.name,
              objectivesPerPeriodCount: sousTheme.objectivesPerPeriodCount
            },
            reference: '',
            titleAcademic: '',
            title: ''
          })
          for (const objectif of sousTheme.objectives) {
            lignesTemp.push({
              grade: niveau.name,
              period: objectif.period,
              theme: {
                name: theme.name,
                objectivesPerPeriodCount: theme.objectivesPerPeriodCount
              },
              subTheme: {
                name: sousTheme.name,
                objectivesPerPeriodCount: sousTheme.objectivesPerPeriodCount
              },
              reference: objectif.reference,
              titleAcademic: objectif.titleAcademic,
              title: objectif.title
            })
          }
        }
      }
      lignesTemp.push({
        grade: 'fin',
        period: 0,
        theme: { name: '', objectivesPerPeriodCount: [] },
        subTheme: { name: '', objectivesPerPeriodCount: [] },
        reference: '',
        titleAcademic: '',
        title: ''
      })
    }
    lignes.set(lignesTemp)
  }

  function getLignesFiltrees (texteRecherche: string, lignes: LineObjective[]): LineObjective[] {
    if (texteRecherche === '') return lignes
    const motsCherches = normaliser(texteRecherche).split(' ')
    return lignes.filter((ligne) => {
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
      filtre.grade = grade
    }
    if (periode !== undefined) {
      filtre.period === periode
        ? (filtre.period = 0)
        : (filtre.period = periode)
    }
    window.history.pushState({}, '', `?v=objectifs&niveau=${filtre.grade}&periode=${filtre.period}`)
  }
</script>

<svelte:head>
  <title>Liste des objectifs topmaths</title>
</svelte:head>

<div class="w-screen max-w-screen-lg">
  <LevelsTabsMenu
    activeLevelTab={filtre.grade}
    onLevelsTabsMenuClicked={clicFiltre}
  />
  <div class="is-flex is-justify-content-center pt-2 pb-1" style="overflow:auto">
    <button
      class="button rounded-3xl py-1 px-5 is-link mb-5 mx-1 text-sm md:text-2xl"
      class:is-light={filtre.period !== null &&
        filtre.period !== undefined &&
        filtre.period > 0}
      on:click={() => clicFiltre('', 0)}>Période</button
    >
    {#each [1, 2, 3, 4, 5] as periode}
      <button
        class="button rounded-3xl py-1 px-5 is-link mb-5 mx-1 text-sm md:text-2xl"
        class:is-light={filtre.period !== periode}
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
    {#each $lignesFiltrees as ligne, i}
      {#if ligne.theme.name !== 'Extra'}
        <span>
          {#if ligne.grade !== '' && ligne.grade !== 'fin' && (filtre.grade === 'all' || filtre.grade === ligne.grade) && ligne.theme.name === '' && ligne.subTheme.name === '' && ligne.reference === ''}
            <h1 class="title text-2xl md:text-4xl font-semibold p-2 is-{ligne.grade}">
              {ligne.grade}
            </h1>
          {/if}
          {#if ligne.grade !== 'fin' && (filtre.period === 0 || ligne.theme.objectivesPerPeriodCount[filtre.period - 1] > 0) && (filtre.grade === 'all' || filtre.grade === ligne.grade) && (filtre.theme.name === '' || filtre.theme.name === ligne.theme.name) && ligne.theme.name !== '' && ligne.subTheme.name === '' && ligne.reference === ''}
            <h2 class="subtitle text-xl md:text-3xl pt-2 is-{ligne.grade}">
              {ligne.theme.name}
            </h2>
          {/if}
          {#if ligne.grade !== 'fin' && (filtre.period === 0 || ligne.subTheme.objectivesPerPeriodCount[filtre.period - 1] > 0) && (filtre.grade === 'all' || filtre.grade === ligne.grade) && (filtre.subTheme.name === '' || filtre.subTheme.name === ligne.subTheme.name) && ligne.subTheme.name !== '' && ligne.reference === ''}
            <h3 class="subtitle text-lg md:text-2xl p-4 is-{ligne.grade}">
              {ligne.subTheme.name}
            </h3>
          {/if}
          {#if ligne.grade !== 'fin' && (filtre.period === 0 || filtre.period === ligne.period) && (filtre.grade === 'all' || filtre.grade === ligne.grade) && (filtre.theme.name === '' || filtre.theme.name === ligne.theme.name) && (filtre.subTheme.name === '' || filtre.subTheme.name === ligne.subTheme.name) && ligne.reference !== ''}
            <div
              class="p-1  is-{ligne.grade}"
              class:is-fin={$texteRecherche === '' && ($lignesFiltrees[i + 1].grade === 'fin' || $lignesFiltrees[i + 1].theme.name === 'Extra')}
            >
              <a
                href="/?v=objectif&ref={ligne.reference}"
                on:click={(event) =>
                  goVue(event, 'objectif', ligne.reference ?? '')}
              >
                <div>
                  {ligne.reference} : {$titresProchesDesAttendus ||
                    ligne.title === undefined || ligne.title === ''
                    ? ligne.titleAcademic
                    : ligne.title}<br />
                </div>
              </a>
            </div>
          {/if}
        </span>
      {/if}
      {#if i > 0 && ligne.grade === 'fin' && filtre.grade === 'all'}
        <div>
          <br />
        </div>
      {/if}
    {/each}
  </div>
</div>
