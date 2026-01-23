<script lang="ts">
  import { glossary } from '../../../services/store'
  import { normalize } from '../../../services/string'
  import { writable, derived } from 'svelte/store'
  import { mathaleaRenderDiv } from '../../../../lib/mathalea'
  import type { GlossaryUniteItem } from '../../../types/glossary'
  import SearchInput from '../../shared/SearchInput.svelte'
  import StudentGlossaryItem from './presentationalComponents/StudentGlossaryItem.svelte'
  import { tick } from 'svelte'

  const searchString = writable<string>('')
  const filteredItems = derived(
    [searchString, glossary],
    ([$searchString, $glossary]) =>
      buildFilteredItems($searchString, $glossary),
  )

  function buildFilteredItems(
    searchString: string,
    items: GlossaryUniteItem[],
  ): GlossaryUniteItem[] {
    return items.filter((item) => {
      if (searchString === '') return true
      const words = normalize(searchString).split(' ')
      return words.some((word) => isWordFound(word, item))
    })
  }

  function isWordFound(word: string, item: GlossaryUniteItem): boolean {
    return (
      normalize(item.title).includes(word) ||
      item.grades.some((grade) => normalize(grade).includes(word)) ||
      item.keywords.some((keyword) => normalize(keyword).includes(word)) ||
      item.relatedObjectives.some((relatedObjective) =>
        normalize(relatedObjective).includes(word),
      )
    )
  }

  async function goHash(
    event: MouseEvent,
    hashLocation: string,
  ): Promise<void> {
    event.preventDefault()
    searchString.set('')
    await tick()
    const destinationDiv = document.getElementById(hashLocation)
    if (destinationDiv !== null) {
      destinationDiv.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }
</script>

<svelte:head>
  <title>Lexique - topmaths</title>
</svelte:head>

<div
  class="grade-container is-info
  rounded-4xl md:rounded-5xl"
>
  <h1
    class="title mb-8
    text-2xl md:text-4xl
    rounded-t-4xl md:rounded-t-5xl"
  >
    Lexique
  </h1>
  <SearchInput bind:searchString={$searchString} />
  <ul>
    {#each $filteredItems as item}
      <StudentGlossaryItem {item} {mathaleaRenderDiv} {goHash} />
    {/each}
  </ul>
</div>
