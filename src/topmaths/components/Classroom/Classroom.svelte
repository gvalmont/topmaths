<script lang="ts">
  import { reference } from '../../services/store'
  import ClassroomCurriculum from './ClassroomCurriculum.svelte'
  import ClassroomMathador from './ClassroomMathador.svelte'
  import ClassroomSelection from './ClassroomSelection.svelte'

</script>

{#if $reference === 'curriculum'}
  <div class="w-full">
    <ClassroomCurriculum />
  </div>
{:else if $reference === 'mathador'}
  <div class="w-full max-w-screen-lg">
    <ClassroomMathador />
  </div>
{:else}
  <div class="w-full max-w-screen-lg">
    <ClassroomSelection />
  </div>
{/if}
