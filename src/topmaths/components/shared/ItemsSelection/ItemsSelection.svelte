<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import {
    derived,
    writable,
    type Unsubscriber,
    type Writable,
  } from 'svelte/store'
  import { goToView } from '../../../services/navigation'
  import { isReferenceIgnored } from '../../../services/reference'
  import {
    isTeacherMode,
    isTitleAcademicPreferred,
  } from '../../../services/store'
  import { getTitle, normalize } from '../../../services/string'
  import {
    DEFAULT_GRADE,
    isStringGrade,
    stringGradeValidKeys,
    type StringGrade,
  } from '../../../types/grade'
  import type { View } from '../../../types/navigation'
  import { isObjective, type Objective } from '../../../types/objective'
  import { isSpecialUnit } from '../../../types/specialUnit'
  import { isUnit, type Unit, type UnitObjective } from '../../../types/unit'
  import GradeSelectionTabs from '../GradeSelectionTabs.svelte'
  import InputCheckbox from '../InputCheckbox.svelte'
  import SearchInput from '../SearchInput.svelte'
  import TermSelectionButtons from '../TermSelectionButtons.svelte'
  import RowCurriculum from './RowCurriculum.svelte'
  import RowRegular from './RowRegular.svelte'
  import { emptyItem, type Item } from './types'

  export let view: View
  export let items: Writable<Item[]>

  let previousFilter: Item = emptyItem
  let previousSearchString: string = ''
  let previousItems: Item[] = []
  let previousFilteredItems: Item[] = []

  const filter = writable<Item>(emptyItem)
  const searchString = writable<string>('')
  const filteredItems = derived(
    [searchString, filter, items],
    ([$searchString, $filter, $items]) =>
      buildFilteredItems($searchString, $filter, $items),
  )

  let filteredItemsByGrade: { [grade in StringGrade]: Item[] } = {
    tout: [],
    '6e': [],
    '5e': [],
    '4e': [],
    '3e': [],
  }
  $: {
    filteredItemsByGrade = {
      tout: $filteredItems.filter((item) => item.grade === 'tout'),
      '6e': $filteredItems.filter((item) => item.grade === '6e'),
      '5e': $filteredItems.filter((item) => item.grade === '5e'),
      '4e': $filteredItems.filter((item) => item.grade === '4e'),
      '3e': $filteredItems.filter((item) => item.grade === '3e'),
    }
  }

  let unitsByGrade: { [grade in StringGrade]: Unit[] } = {
    tout: [],
    '6e': [],
    '5e': [],
    '4e': [],
    '3e': [],
  }
  $: {
    unitsByGrade = {
      tout: $filteredItems
        .filter((item) => isUnit(item) || isSpecialUnit(item))
        .filter((unit) => unit.grade === 'tout'),
      '6e': $filteredItems
        .filter((item) => isUnit(item) || isSpecialUnit(item))
        .filter((unit) => unit.grade === '6e'),
      '5e': $filteredItems
        .filter((item) => isUnit(item) || isSpecialUnit(item))
        .filter((unit) => unit.grade === '5e'),
      '4e': $filteredItems
        .filter((item) => isUnit(item) || isSpecialUnit(item))
        .filter((unit) => unit.grade === '4e'),
      '3e': $filteredItems
        .filter((item) => isUnit(item) || isSpecialUnit(item))
        .filter((unit) => unit.grade === '3e'),
    }
  }

  let objectivesByGrade: { [grade in StringGrade]: Objective[] } = {
    tout: [],
    '6e': [],
    '5e': [],
    '4e': [],
    '3e': [],
  }
  $: {
    objectivesByGrade = {
      tout: $filteredItems
        .filter((item) => isObjective(item))
        .filter((objective) => objective.grade === 'tout')
        .filter((objective) => !isReferenceIgnored(objective.reference)),
      '6e': $filteredItems
        .filter((item) => isObjective(item))
        .filter((objective) => objective.grade === '6e')
        .filter((objective) => !isReferenceIgnored(objective.reference)),
      '5e': $filteredItems
        .filter((item) => isObjective(item))
        .filter((objective) => objective.grade === '5e')
        .filter((objective) => !isReferenceIgnored(objective.reference)),
      '4e': $filteredItems
        .filter((item) => isObjective(item))
        .filter((objective) => objective.grade === '4e')
        .filter((objective) => !isReferenceIgnored(objective.reference)),
      '3e': $filteredItems
        .filter((item) => isObjective(item))
        .filter((objective) => objective.grade === '3e')
        .filter((objective) => !isReferenceIgnored(objective.reference)),
    }
  }

  let objectivesThemesByGrade: { [grade in StringGrade]: string[] } = {
    tout: [],
    '6e': [],
    '5e': [],
    '4e': [],
    '3e': [],
  }
  $: {
    objectivesThemesByGrade = {
      tout: [
        ...new Set(
          objectivesByGrade['tout'].map((objective) => objective.theme),
        ),
      ],
      '6e': [
        ...new Set(objectivesByGrade['6e'].map((objective) => objective.theme)),
      ],
      '5e': [
        ...new Set(objectivesByGrade['5e'].map((objective) => objective.theme)),
      ],
      '4e': [
        ...new Set(objectivesByGrade['4e'].map((objective) => objective.theme)),
      ],
      '3e': [
        ...new Set(objectivesByGrade['3e'].map((objective) => objective.theme)),
      ],
    }
  }

  let objectivesSubThemesByGradeAndTheme: {
    [grade in StringGrade]: { [theme: string]: string[] }
  } = {
    tout: {},
    '6e': {},
    '5e': {},
    '4e': {},
    '3e': {},
  }
  $: {
    for (const grade of stringGradeValidKeys) {
      objectivesSubThemesByGradeAndTheme[grade] = {}
      for (const theme of objectivesThemesByGrade[grade]) {
        objectivesSubThemesByGradeAndTheme[grade][theme] = [
          ...new Set(
            objectivesByGrade[grade]
              .filter((objective) => objective.theme === theme)
              .map((objective) => objective.subTheme),
          ),
        ]
      }
    }
  }

  let objectivesByGradeAndThemeAndSubTheme: {
    [grade in StringGrade]: {
      [theme: string]: { [subTheme: string]: Objective[] }
    }
  } = {
    tout: {},
    '6e': {},
    '5e': {},
    '4e': {},
    '3e': {},
  }
  $: {
    for (const grade of stringGradeValidKeys) {
      objectivesByGradeAndThemeAndSubTheme[grade] = {}
      for (const theme of objectivesThemesByGrade[grade]) {
        objectivesByGradeAndThemeAndSubTheme[grade][theme] = {}
        for (const subTheme of objectivesSubThemesByGradeAndTheme[grade][
          theme
        ]) {
          objectivesByGradeAndThemeAndSubTheme[grade][theme][subTheme] =
            objectivesByGrade[grade]
              .filter((objective) => objective.theme === theme)
              .filter((objective) => objective.subTheme === subTheme)
        }
      }
    }
  }

  let termsByGrade: { [grade in StringGrade]: number[] } = {
    tout: [],
    '6e': [],
    '5e': [],
    '4e': [],
    '3e': [],
  }
  $: {
    for (const grade of stringGradeValidKeys) {
      const termsSet = new Set<number>()
      for (const unit of unitsByGrade[grade]) {
        if (unit.term > 0) termsSet.add(unit.term)
      }
      termsByGrade[grade] = Array.from(termsSet).sort((a, b) => a - b)
    }
  }

  let unitsByGradeAndTerm: {
    [grade in StringGrade]: { [term: number]: Unit[] }
  } = {
    tout: {},
    '6e': {},
    '5e': {},
    '4e': {},
    '3e': {},
  }
  $: {
    for (const grade of stringGradeValidKeys) {
      unitsByGradeAndTerm[grade] = {}
      for (const term of termsByGrade[grade]) {
        unitsByGradeAndTerm[grade][term] = unitsByGrade[grade].filter(
          (unit) => unit.term === term,
        )
      }
    }
  }

  let isTitleAcademicPreferredUnsubscriber: Unsubscriber

  onMount(() => {
    updateParamsFromUrl()
    addEventListener('popstate', updateParamsFromUrl)
    isTitleAcademicPreferredUnsubscriber = isTitleAcademicPreferred.subscribe(
      () => {
        filter.set($filter) // to update the view
      },
    )
  })

  onDestroy(() => {
    removeEventListener('popstate', updateParamsFromUrl)
    isTitleAcademicPreferredUnsubscriber?.()
  })

  function updateParamsFromUrl(): void {
    const url = new URL(window.location.href)
    const entries = url.searchParams.entries()
    let grade: StringGrade = DEFAULT_GRADE
    let term: number = 0
    let isAutomaticity: boolean = false
    for (const entry of entries) {
      if (entry[0] === 'grade')
        grade = isStringGrade(entry[1]) ? entry[1] : DEFAULT_GRADE
      if (entry[0] === 'term') term = Number(entry[1])
      if (entry[0] === 'options') isAutomaticity = entry[1] === '1'
    }
    if (
      $filter.grade === grade &&
      $filter.term === term &&
      $filter.isAutomaticity === isAutomaticity
    )
      return
    $filter = Object.assign({}, $filter, {
      grade,
      term,
      isAutomaticity,
    })
  }

  function buildFilteredItems(
    searchString: string,
    filter: Item,
    items: Item[],
  ): Item[] {
    if (
      searchString === previousSearchString &&
      filter === previousFilter &&
      items.length === previousItems.length
    ) {
      return previousFilteredItems
    }
    previousSearchString = searchString
    previousFilter = filter
    previousItems = items
    previousFilteredItems = items
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
      .filter((item) => {
        if (!filter.isAutomaticity) return true
        if (isObjective(item)) {
          return item.isAutomaticity === filter.isAutomaticity
        } else {
          if (item.objectives.every((objective) => !objective.isAutomaticity)) {
            return false
          } else {
            item.objectives = item.objectives.filter(
              (objective) => objective.isAutomaticity,
            )
            return true
          }
        }
      })
    return previousFilteredItems
  }

  function isWordFound(word: string, item: Item): boolean {
    return (
      normalize(item.grade).includes(word) ||
      normalize(item.reference).includes(word) ||
      normalize(item.title).includes(word) ||
      (isUnit(item) && normalize(item.number.toString()).includes(word)) ||
      (isObjective(item) && normalize(item.theme).includes(word)) ||
      (isObjective(item) && normalize(item.subTheme).includes(word)) ||
      (isObjective(item) && normalize(item.titleAcademic).includes(word)) ||
      (view === 'classroom' &&
        isUnit(item) &&
        item.objectives.some((objective) =>
          normalize(objective.reference).includes(word),
        )) ||
      (view === 'classroom' &&
        isUnit(item) &&
        item.objectives.some((objective) =>
          normalize(getTitle(objective)).includes(word),
        ))
    )
  }

  type UpdateFilterOptions = {
    grade?: StringGrade
    term?: number
    isAutomaticity?: boolean
  }
  function updateFilter(options: UpdateFilterOptions): void {
    if (
      options.grade === undefined &&
      options.term === undefined &&
      options.isAutomaticity === undefined
    )
      return
    const { grade, term, isAutomaticity } = options
    const newGrade = isStringGrade(grade) ? grade : $filter.grade
    const newTerm = term ?? $filter.term
    const newIsAutomaticity = isAutomaticity ?? $filter.isAutomaticity

    $filter = Object.assign({}, $filter, {
      grade: newGrade,
      term: newTerm,
      isAutomaticity: newIsAutomaticity,
    })

    const optionsString = isAutomaticity ? '&options=1' : ''
    window.history.pushState(
      {},
      '',
      `?v=${view}&grade=${$filter.grade}&term=${$filter.term}${optionsString}`,
    )
  }

  function getObjectivesFromUnit(unit: Unit): UnitObjective[] {
    return unit.objectives.filter(
      (objective) => !isReferenceIgnored(objective.reference),
    )
  }
</script>

<GradeSelectionTabs
  activeLevelTab={$filter.grade}
  onClick={(grade) => updateFilter({ grade })}
/>
<TermSelectionButtons
  selectedTerm={$filter.term}
  on:change={(e) => {
    const term = e.detail
    updateFilter({ term })
  }}
/>
<SearchInput bind:searchString={$searchString} />
{#if view !== 'unit'}
  <button
    class="print-hidden my-4 mx-1 rounded transition-all duration-300 border border-[#ec8b0c] {$filter.isAutomaticity
      ? 'bg-[#fffabb]'
      : ''}
    w-8 h-8
    text-base md:text-xl"
    on:click={() => {
      updateFilter({ isAutomaticity: !$filter.isAutomaticity })
    }}
  >
    ⚡️
  </button>
  {#if $isTeacherMode}
    <span class="print-hidden absolute">
      <InputCheckbox bind:isChecked={$isTitleAcademicPreferred}>
        Intitulés du programme
      </InputCheckbox>
    </span>
  {/if}
{/if}
{#each stringGradeValidKeys as grade}
  {#if filteredItemsByGrade[grade].length > 0}
    <div
      class="is-{grade} grade-container my-8
        rounded-4xl md:rounded-5xl
        {view === 'classroom' ? 'border' : ''}"
    >
      <h1
        class="title
        text-2xl md:text-4xl
        rounded-t-4xl md:rounded-t-5xl"
      >
        {grade === DEFAULT_GRADE ? 'Séquences particulières' : grade}
      </h1>
      {#if view === 'unit'}
        {#each unitsByGrade[grade] as unit}
          <RowRegular item={unit} {view} {goToView} />
        {/each}
      {/if}
      {#if view === 'objective'}
        {#each objectivesThemesByGrade[grade] as theme}
          <h2
            class="title
            text-xl md:text-3xl"
          >
            {theme}
          </h2>
          {#each objectivesSubThemesByGradeAndTheme[grade][theme] as subTheme}
            <h3
              class="subtitle
              text-l md:text-2xl"
            >
              {subTheme}
            </h3>
            {#each objectivesByGradeAndThemeAndSubTheme[grade][theme][subTheme] as objective}
              <RowRegular item={objective} {view} {goToView} />
            {/each}
          {/each}
        {/each}
      {/if}
      {#if view === 'classroom'}
        {#each termsByGrade[grade] as term, termIndex}
          <h2
            class="title
            text-xl md:text-3xl"
          >
            Période {term}
          </h2>
          <div class="flex flex-row">
            <div class="w-1/3">Séquence</div>
            <div class="w-2/3">Objectifs</div>
          </div>
          {#each unitsByGradeAndTerm[grade][term] as unit, unitIndex}
            <div
              class="flex flex-row border-t is-{unit.grade}
            text-sm md:text-base"
            >
              <div
                class="flex flex-col justify-center items-center
              w-1/3"
              >
                <div class="flex flex-row grow w-full">
                  <div class="w-1/4 flex items-center justify-center">
                    <a
                      class="is-interactive"
                      href="?v=unit&ref={unit.reference}"
                      on:click={(event) =>
                        goToView(event, 'unit', unit.reference)}
                    >
                      {unit.reference}
                    </a>
                  </div>
                  <div class="w-3/4 flex items-center justify-start text-left">
                    {unit.title}
                  </div>
                </div>
              </div>
              <div
                class="flex flex-col justify-center items-center
              w-2/3"
              >
                {#each getObjectivesFromUnit(unit) as objective, objectiveIndex}
                  <RowCurriculum
                    {objective}
                    gradeTeached={unit.grade}
                    {goToView}
                    isLastRow={termIndex === termsByGrade[grade].length - 1 &&
                      unitIndex ===
                        unitsByGradeAndTerm[grade][term].length - 1 &&
                      objectiveIndex === getObjectivesFromUnit(unit).length - 1}
                  />
                {/each}
              </div>
            </div>
          {/each}
        {/each}
      {/if}
    </div>
  {/if}
{/each}
