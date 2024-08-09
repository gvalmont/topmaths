<script lang="ts">
  import { writable, derived, type Writable } from 'svelte/store'
  import { goToView } from '../../../services/navigation'
  import { DEFAULT_GRADE, isStringGrade, stringGradeValidKeys, type StringGrade } from '../../../types/grade'
  import type { View } from '../../../types/navigation'
  import GradeSelectionTabs from '../GradeSelectionTabs.svelte'
  import SearchInput from '../SearchInput.svelte'
  import TermSelectionButtons from '../TermSelectionButtons.svelte'
  import { onDestroy, onMount } from 'svelte'
  import { getTitle, normalize } from '../../../services/shared'
  import { emptyItem, type Item } from './types'
  import Row from './Row.svelte'
  import { isTeacherMode, isTitleAcademicPreferred } from '../../../services/store'
  import InputCheckbox from '../InputCheckbox.svelte'
  import { UNLISTED_THEMES } from '../../../services/environment'
  import { isUnit, type Unit } from '../../../types/unit'
  import { isObjective, type Objective } from '../../../types/objective'
  import { isSpecialUnit } from '../../../types/specialUnit'
  import { emptyCurriculum, type Curriculum } from '../../../types/curriculum'
  import { buildThemeFromReference } from '../../../services/reference'

  export let view: View
  export let items: Writable<Item[]>
  export let curriculum: Curriculum = emptyCurriculum

  const filter = writable<Item>(emptyItem)
  const searchString = writable<string>('')
  const filteredItems = derived(
    [searchString, filter, items],
    ([$searchString, $filter, $items]) =>
      buildFilteredItems($searchString, $filter, $items)
  )

  let objectives: Objective[]
  $: objectives = $filteredItems.filter(item => isObjective(item))

  let units: Unit[]
  $: units = $filteredItems.filter(item => isUnit(item) || isSpecialUnit(item))

  onMount(() => {
    updateParamsFromUrl()
    addEventListener('popstate', updateParamsFromUrl)
  })

  onDestroy(() => {
    removeEventListener('popstate', updateParamsFromUrl)
  })

  function updateParamsFromUrl (): void {
    const url = new URL(window.location.href)
    const entries = url.searchParams.entries()
    let newGrade: StringGrade = DEFAULT_GRADE
    let newTerm: number = 0
    for (const entry of entries) {
      if (entry[0] === 'grade') newGrade = isStringGrade(entry[1]) ? entry[1] : DEFAULT_GRADE
      if (entry[0] === 'term') newTerm = Number(entry[1])
    }
    $filter.grade = newGrade
    $filter.term = newTerm
  }

  function buildFilteredItems (searchString: string, filter: Item, items: Item[]): Item[] {
    return items
      .filter((item) => {
        if (searchString === '') return true
        const words = normalize(searchString).split(' ')
        return words.some((word) => isWordFound(word, item))
      })
      .filter((item) => {
        return filter.grade === DEFAULT_GRADE || item.grade === filter.grade
      })
      .filter((item) => {
        return filter.term === 0 || item.term === filter.term
      })
  }

  function isWordFound (mot: string, item: Item): boolean {
    return normalize(item.grade).includes(mot) ||
    normalize(item.reference).includes(mot) ||
    normalize(item.title).includes(mot) ||
    (isUnit(item) && normalize(item.number.toString()).includes(mot)) ||
    (isObjective(item) && normalize(item.theme).includes(mot)) ||
    (isObjective(item) && normalize(item.subTheme).includes(mot)) ||
    (isObjective(item) && normalize(item.titleAcademic).includes(mot))
  }

  function updateFilter (grade: StringGrade, term?: number): void {
    $filter.grade = grade
    if (term !== undefined) {
      $filter.term = term
    }
    window.history.pushState({}, '', `?v=${view}&grade=${$filter.grade}&term=${$filter.term}`)
  }
</script>

<GradeSelectionTabs
  activeLevelTab={$filter.grade}
  onClick={updateFilter}
/>
<TermSelectionButtons
  selectedTerm={$filter.term}
  on:change={(e) => {
    const term = e.detail
    updateFilter($filter.grade, term)
  }}
/>
<SearchInput
  bind:searchString={$searchString}
/>
{#if view === 'objective' && $isTeacherMode}
<span class="absolute">
  <InputCheckbox
    bind:isChecked={$isTitleAcademicPreferred}
  />
</span>
{/if}
{#each stringGradeValidKeys as grade}
  {#if $filteredItems.filter(item => item.grade === grade).length > 0}
    <div class="is-{grade} grade-container my-8
        rounded-4xl md:rounded-5xl
        {view === 'classroom' ? 'border' : ''}"
    >
      <h1 class="title
        text-2xl md:text-4xl
        rounded-t-4xl md:rounded-t-5xl"
      >
        {grade === DEFAULT_GRADE ? 'Séquences particulières' : grade}
      </h1>
      {#if view === 'unit'}
        {#each units.filter(unit => unit.grade === grade) as unit}
          <Row
            item={unit}
            {view}
            {goToView}
          />
        {/each}
      {/if}
      {#if view === 'objective'}
        {#each [...new Set(objectives.filter(objective => objective.grade === grade).map(objective => objective.theme).filter(theme => !UNLISTED_THEMES.includes(theme ?? '')))] as theme}
          <h2 class="title
            text-xl md:text-3xl"
          >
            {theme}
          </h2>
          {#each [...new Set(objectives.filter(objective => objective.grade === grade).filter(objective => objective.theme === theme).map(objective => objective.subTheme))] as subTheme}
            <h3 class="subtitle
              text-l md:text-2xl"
            >
              {subTheme}
            </h3>
            {#each objectives.filter(item => item.grade === grade).filter(item => item.theme === theme).filter(item => item.subTheme === subTheme) as objective}
              <Row
                item={objective}
                view={view}
                {goToView}
              />
            {/each}
          {/each}
        {/each}
      {/if}
      {#if view === 'classroom'}
        {#each Object.keys(curriculum.tout.unitsPerTerm).map(Number).map(termIndex => termIndex + 1).filter(term => $filteredItems.filter(item => isUnit(item)).filter(unit => unit.grade === grade).filter(unit => unit.term === term).length > 0) as term}
          <h2 class="title
            text-xl md:text-3xl"
          >
            Période {term}
          </h2>
          <div class="flex flex-row">
            <div class="w-1/4">
              Séquence
            </div>
            <div class="w-3/4">
              Objectifs
            </div>
          </div>
          {#each $filteredItems.filter(item => isUnit(item)).filter(unit => unit.grade === grade).filter(unit => unit.term === term) as unit}
          <div class="flex flex-row border-t is-{unit.grade}
            text-sm md:text-base"
          >
            <div class="w-1/4 flex flex-col justify-center items-center">
              <div class="flex flex-row grow w-full">
                <div class="w-1/4 flex items-center justify-center">
                  <a
                    class="is-interactive"
                    href='?v=unit&ref={unit.reference}'
                    on:click={(event) => goToView(event, 'unit', unit.reference)}
                  >
                    {unit.reference}
                  </a>
                </div>
                <div class="w-3/4 flex items-center justify-start text-left">
                  {unit.title}
                </div>
              </div>
            </div>
            <div class="w-3/4 flex flex-col justify-center items-center">
                {#each unit.objectives.filter(objective => !UNLISTED_THEMES.includes(objective.theme ?? '')) as objective}
                  <div class="flex flex-row grow w-full is-theme-{buildThemeFromReference(objective.reference)}">
                    <div class="w-1/12 flex items-center justify-center">
                      <a
                        class="is-interactive"
                        href='?v=objective&ref={objective.reference}'
                        on:click={(event) => goToView(event, 'objective', objective.reference)}
                      >
                        {objective.reference}
                      </a>
                    </div>
                    <div class="w-11/12 flex items-center justify-start text-left">
                      {getTitle(objective)}
                    </div>
                  </div>
                {/each}
            </div>
          </div>
          {/each}
        {/each}
      {/if}
    </div>
  {/if}
{/each}

<style lang="scss">
  @import '../../../styles/tailwind-colors.scss';

  @mixin theme-style($class-name, $main-color, $light-color) {
    .#{$class-name} {
      background-color: #{$light-color};
        a {
          color: $topmaths-corpus-default;
          text-decoration: underline;
          :global(.dark) & {
            color: #{$main-color};
          }
        }
      :global(.dark) & {
        background-color: $topmathsdark-canvas-default;
        color: #{$main-color};
      }
    }
  }

  @include theme-style('is-theme-nombres', #e99384, #f8c8c0);
  @include theme-style('is-theme-gestion', #9f84e4, #c6b9e7);
  @include theme-style('is-theme-grandeurs', #deb273, #ffddaf);
  @include theme-style('is-theme-geo', #7bd9ec, #aff2ff);
</style>
