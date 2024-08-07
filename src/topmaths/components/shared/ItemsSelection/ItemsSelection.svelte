<script lang="ts">
  import { writable, derived, type Writable } from 'svelte/store'
  import { goToView } from '../../../services/navigation'
  import { isStringGrade, stringGradeValidKeys, type StringGrade } from '../../../types/grade'
  import type { View } from '../../../types/navigation'
  import GradeSelectionTabs from '../GradeSelectionTabs.svelte'
  import SearchInput from '../SearchInput.svelte'
  import TermSelectionButtons from '../TermSelectionButtons.svelte'
  import { onDestroy, onMount } from 'svelte'
  import { normalize } from '../../../services/shared'
  import { emptyItem, type Item } from './types'
  import Row from './Row.svelte'
  import { isTeacherMode, isTitleAcademicPreferred } from '../../../services/store'
  import InputCheckbox from '../InputCheckbox.svelte'
  import { UNLISTED_THEMES } from '../../../services/environment'
  import { isUnit, type Unit } from '../../../types/unit'
  import { isObjective, type Objective } from '../../../types/objective'
  import { isSpecialUnit } from '../../../types/specialUnit'

  export let view: View
  export let items: Writable<Item[]>

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
    let newGrade: StringGrade = 'tout'
    let newTerm: number = 0
    for (const entry of entries) {
      if (entry[0] === 'grade') newGrade = isStringGrade(entry[1]) ? entry[1] : 'tout'
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
        return filter.grade === 'tout' || item.grade === filter.grade
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
        rounded-4xl md:rounded-5xl"
    >
      <h1 class="title
        text-2xl md:text-4xl
        rounded-t-4xl md:rounded-t-5xl"
      >
        {grade === 'tout' ? 'Séquences particulières' : grade}
      </h1>
      {#each units.filter(unit => unit.grade === grade) as unit}
        <Row
          item={unit}
          view={view}
          {goToView}
        />
      {/each}
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
    </div>
  {/if}
{/each}
