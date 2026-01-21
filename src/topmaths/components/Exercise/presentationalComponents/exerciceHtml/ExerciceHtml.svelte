<script lang="ts">
  import { onMount } from 'svelte'
  import type TypeExercice from '../../../../../exercices/Exercice'
  export let exercise: TypeExercice
  export let indiceExercice: number
  export let indiceLastExercice: number

  let divExercice: HTMLDivElement

  const headerExerciceProps = {
    title: exercise.titre,
    id: '',
    indiceExercice,
    indiceLastExercice,
    interactifReady: false,
    randomReady: true,
    settingsReady: false,
    correctionReady: false,
  }

  onMount(async () => {
    if (exercise.html != null) {
      divExercice.appendChild(exercise.html)
    }
    const addedToDom = new window.Event('addedToDom', { bubbles: true })
    divExercice.children[0].dispatchEvent(addedToDom)
  })

  $: {
    headerExerciceProps.indiceExercice = indiceExercice
    headerExerciceProps.indiceLastExercice = indiceLastExercice
  }
</script>

<section
  id="insert-html-{indiceExercice}"
  class="mt-6 mb-2 ml-2 lg:mx-5 w-full"
>
  <div bind:this={divExercice}></div>
</section>
