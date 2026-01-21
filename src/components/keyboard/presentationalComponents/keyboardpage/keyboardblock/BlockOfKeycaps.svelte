<script lang="ts">
  import { keys } from '../../../lib/keycaps'
  import { GAP_BETWEEN_KEYS, getMode } from '../../../lib/sizes'
  import type { KeyboardBlock } from '../../../types/keyboardContent'
  import { type KeyCap, isSpecialKey } from '../../../types/keycap'
  import Key from './keycap/Keycap.svelte'
  export let innerWidth: number
  export let block: KeyboardBlock
  export let isInLine: boolean = false
  export let clickKeycap: (data: KeyCap, event: MouseEvent) => void

  $: gapsize = GAP_BETWEEN_KEYS[getMode(innerWidth, isInLine)]
</script>

{#if block !== undefined}
  <div
    id="kb-block-{block.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(' ', '-')}"
  >
    {#if isInLine}
      <div
        class="grid customgap h-full"
        style="grid-template-columns: repeat({block.keycaps.inline
          .length}, minmax(0, 1fr)); --gapsize:{gapsize};"
      >
        {#each block.keycaps.inline as key, index (key + '_' + index)}
          <Key
            keyName={key}
            key={keys[key]}
            isSpecial={isSpecialKey(key)}
            {isInLine}
            {innerWidth}
            {clickKeycap}
          />
        {/each}
      </div>
    {:else}
      <div
        class="grid customgap h-full"
        style="grid-template-columns: repeat({block.cols}, minmax(0, 1fr)); --gapsize:{gapsize};"
      >
        {#each block.keycaps.block as key, index (key + '_' + index)}
          <Key
            keyName={key}
            key={keys[key]}
            isSpecial={isSpecialKey(key)}
            {isInLine}
            {innerWidth}
            {clickKeycap}
          />
        {/each}
      </div>
    {/if}
  </div>
{/if}

<style>
  .customgap {
    gap: calc(var(--gapsize) * 1px);
  }
</style>
