<script lang="ts">
  import type { JSONReferentielEnding } from '../../../../../lib/types/referentiels'

  export let resource: JSONReferentielEnding | null
  export let exerciseIndex: number
  export let zoomFactor: string
  export let isCorrectionVisible: boolean
</script>

<div class="flex items-center">
  <div class="flex-1 md:max-w-screen-lg mx-auto">
    {#if resource}
      <img
        src="static/{resource.uuid.split('_')[0]}/{resource.uuid.split(
          '_',
        )[1]}/tex/png/{resource.uuid}.png"
        style="width: calc(100% * {zoomFactor}"
        alt="énoncé"
      />
    {/if}
    {#if isCorrectionVisible}
      <div
        class="relative border-l-green-600 dark:border-l-green-600 border-l-[3px] text-coopmaths-corpus dark:text-coopmathsdark-corpus mt-6 lg:mt-2 mb-6 py-2 pl-4"
        id="correction{exerciseIndex}"
      >
        <div class="container">
          {#if resource}
            <img
              src="static/{resource.uuid.split('_')[0]}/{resource.uuid.split(
                '_',
              )[1]}/tex/png/{resource.uuid}_cor.png"
              class="p-2"
              style="width: calc(100% * {zoomFactor}"
              alt="correction"
            />
          {/if}
        </div>
        <div
          class="absolute flex flex-row py-[1.5px] px-3 rounded-t-md justify-center items-center -left-[3px] -top-[15px] bg-green-600 dark:bg-coopmathsdark-struct font-semibold text-xs text-coopmaths-canvas dark:text-coopmathsdark-canvas"
        >
          Correction
        </div>
        <div
          class="absolute border-green-600 dark:border-coopmathsdark-struct bottom-0 left-0 border-b-[3px] w-4"
        ></div>
      </div>
    {/if}
  </div>
</div>
