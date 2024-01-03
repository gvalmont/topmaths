<script lang="ts">
  import { onDestroy } from 'svelte'
  import { reference } from '../services/store'
  import Sps1 from './sequences/SPS1.svelte'
  import Sps2 from './sequences/SPS2.svelte'
  import SequenceNormale from './sequences/SequenceNormale.svelte'

  let referenceSequence = ''
  const referenceSequenceUnsubscribe = reference.subscribe((reference) => { referenceSequence = reference })
  onDestroy(referenceSequenceUnsubscribe)

</script>

{#if referenceSequence === 'SPS1'}
  <Sps1 />
{:else if referenceSequence === 'SPS2'}
  <Sps2 />
{:else}
  <SequenceNormale referenceSequence={referenceSequence} />
{/if}
