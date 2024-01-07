<script lang="ts">
  import { retrieveResourceFromUuid } from '../../../../../lib/components/refUtils'
  import type { JSONReferentielObject } from '../../../../../lib/types/referentiels'
  import referentielStatic from '../../../../../json/referentielStatic.json'
  import referentielBibliotheque from '../../../../../json/referentielBibliotheque.json'
    import { afterUpdate } from 'svelte';
  export let uuid: string
  export let exerciseIndex: number
  export let zoomFactor: string
  export let isCorrectionVisible: boolean
  let resourceToDisplay = getResourceToDisplay()

  afterUpdate(() => {
    resourceToDisplay = getResourceToDisplay()
  })

  function getResourceToDisplay () {
    const allStaticRefecentiels = getAllStaticReferenciels()
    return retrieveResourceFromUuid(allStaticRefecentiels, uuid)
  }

  function getAllStaticReferenciels () {
    const allStaticReferentiels: JSONReferentielObject = {
      ...referentielBibliotheque,
      ...referentielStatic
    }
    // on supprime les entrées par thèmes qui entraîne des doublons
    delete allStaticReferentiels['Brevet des collèges par thèmes - APMEP']
    delete allStaticReferentiels['BAC par thèmes - APMEP']
    delete allStaticReferentiels['CRPE (2015-2019) par thèmes - COPIRELEM']
    delete allStaticReferentiels['CRPE (2022-2023) par thèmes']
    delete allStaticReferentiels['E3C par thèmes - APMEP']
    return allStaticReferentiels
  }
</script>

<div class="flex items-center">
  <div class="flex-1 md:max-w-screen-lg mx-auto">
    {#if resourceToDisplay}
      <img src={resourceToDisplay.png} style="width: calc(100% * {zoomFactor}" alt="énoncé" />
    {/if}
    {#if isCorrectionVisible}
      <div
        class="relative border-l-green-600 dark:border-l-green-600 border-l-[3px] text-coopmaths-corpus dark:text-coopmathsdark-corpus mt-6 lg:mt-2 mb-6 py-2 pl-4"
        id="correction{exerciseIndex}"
      >
        <div class="container">
          {#if resourceToDisplay}
              <img
                src={resourceToDisplay.pngCor}
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
        />
      </div>
    {/if}
  </div>
</div>
