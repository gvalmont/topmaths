<script lang="ts">
  import { reference } from '../../services/store'
  import ClassroomCurriculum from './ClassroomCurriculum.svelte'
  import ClassroomMathador from './ClassroomMathador.svelte'
  import ClassroomSelection from './ClassroomSelection.svelte'

</script>

{#if $reference === 'curriculum'}
  <ClassroomCurriculum />
{:else if $reference === 'mathador'}
  <ClassroomMathador />
{:else}
  <ClassroomSelection />
{/if}
