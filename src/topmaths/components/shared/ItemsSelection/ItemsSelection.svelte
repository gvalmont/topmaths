<script lang="ts">
  import { writable, derived, type Writable } from 'svelte/store'
  import { goToView } from '../../../services/navigation'
  import { DEFAULT_GRADE, isStringGrade, stringGradeValidKeys, type StringGrade } from '../../../types/grade'
  import type { View } from '../../../types/navigation'
  import GradeSelectionTabs from '../GradeSelectionTabs.svelte'
  import SearchInput from '../SearchInput.svelte'
  import TermSelectionButtons from '../TermSelectionButtons.svelte'
  import { onDestroy, onMount } from 'svelte'
  import { getTitle, normalize } from '../../../services/string'
  import { emptyItem, type Item } from './types'
  import RowRegular from './RowRegular.svelte'
  import RowCurriculum from './RowCurriculum.svelte'
  import { isReviewsDisplayed, isTeacherMode, isTitleAcademicPreferred } from '../../../services/store'
  import InputCheckbox from '../InputCheckbox.svelte'
  import { UNLISTED_THEMES } from '../../../services/environment'
  import { isUnit, type Review, type Unit } from '../../../types/unit'
  import { isObjective, type Objective } from '../../../types/objective'
  import { isSpecialUnit } from '../../../types/specialUnit'
  import { emptyCurriculum, type Curriculum } from '../../../types/curriculum'
  import type { Unsubscriber } from 'svelte/motion'

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

  let isTitleAcademicPreferredUnsubscriber: Unsubscriber

  onMount(() => {
    updateParamsFromUrl()
    addEventListener('popstate', updateParamsFromUrl)
    isTitleAcademicPreferredUnsubscriber = isTitleAcademicPreferred.subscribe(() => {
      filter.set($filter) // to update the view
    })
  })

  onDestroy(() => {
    removeEventListener('popstate', updateParamsFromUrl)
    if (isTitleAcademicPreferredUnsubscriber) isTitleAcademicPreferredUnsubscriber()
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

  function getFilteredReviews (unit: Unit, type: 'consolidation' | 'prerequisite'): Review[] {
    return unit.objectives
      .filter(objective => !UNLISTED_THEMES.includes(objective.theme ?? ''))
      .map(objective => objective.lessonPlans)
      .flat()
      .map(lessonPlan => type === 'consolidation' ? lessonPlan.consolidationReviews : lessonPlan.prerequisiteReviews)
      .flat()
      .reduce<{ seen: Set<string>; filtered: Review[] }>((acc, consolidationReview) => {
        const objectiveReference = consolidationReview.objectiveReference
        if (!acc.seen.has(objectiveReference)) {
          acc.seen.add(objectiveReference)
          acc.filtered.push(consolidationReview)
        }
        return acc
      }, { seen: new Set<string>(), filtered: [] }).filtered
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
{#if (view !== 'unit') && $isTeacherMode}
<span class="absolute">
  <InputCheckbox
    bind:isChecked={$isTitleAcademicPreferred}
  >
    Intitulés proches des attendus de fin d'année
  </InputCheckbox>
  {#if view === 'classroom'}
    <InputCheckbox
      bind:isChecked={$isReviewsDisplayed}
    >
      Afficher les révisions
    </InputCheckbox>
  {/if}
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
          <RowRegular
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
              <RowRegular
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
            <div class="{$isReviewsDisplayed ? 'w-1/4' : 'w-1/3'}">
              Séquence
            </div>
            <div class="{$isReviewsDisplayed ? 'w-1/4' : 'w-2/3'}">
              Objectifs
            </div>
            {#if $isReviewsDisplayed}
              <div class="w-1/4">
                Révisions de consolidation
              </div>
              <div class="w-1/4">
                Révisions de prérequis
              </div>
            {/if}
          </div>
          {#each $filteredItems.filter(item => isUnit(item)).filter(unit => unit.grade === grade).filter(unit => unit.term === term) as unit}
          <div class="flex flex-row border-t is-{unit.grade}
            text-sm md:text-base"
          >
            <div class="flex flex-col justify-center items-center
              {$isReviewsDisplayed ? 'w-1/4' : 'w-1/3'}"
            >
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
            <div class="flex flex-col justify-center items-center
              {$isReviewsDisplayed ? 'w-1/4' : 'w-2/3'}">
                {#each unit.objectives.filter(objective => !UNLISTED_THEMES.includes(objective.theme ?? '')) as objective}
                  <RowCurriculum
                    reference={objective.reference}
                    isKey={objective.isKey}
                    title={getTitle(objective)}
                    {goToView}
                  />
                {/each}
            </div>
            {#if $isReviewsDisplayed}
              <div class="w-1/4 flex flex-col justify-center items-center">
                {#each getFilteredReviews(unit, 'consolidation') as consolidationReview}
                  <RowCurriculum
                    reference={consolidationReview.objectiveReference}
                    title={consolidationReview.description}
                    {goToView}
                  />
                {/each}
              </div>
              <div class="w-1/4 flex flex-col justify-center items-center">
                {#each getFilteredReviews(unit, 'prerequisite') as prerequisiteReview}
                  <RowCurriculum
                    reference={prerequisiteReview.objectiveReference}
                    title={prerequisiteReview.description}
                    {goToView}
                  />
                {/each}
              </div>
            {/if}
          </div>
          {/each}
        {/each}
      {/if}
    </div>
  {/if}
{/each}
