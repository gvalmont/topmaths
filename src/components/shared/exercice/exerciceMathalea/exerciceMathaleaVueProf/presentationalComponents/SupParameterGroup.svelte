<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { IExercice } from '../../../../../../lib/types'
  import CheckboxWithLabel from '../../../../forms/CheckboxWithLabel.svelte'
  import InputNumber from '../../../../forms/InputNumber.svelte'
  import InputText from '../../../../forms/InputText.svelte'
  import SelectUnique from '../../../../forms/SelectUnique.svelte'

  export let supIndex: 1 | 2 | 3 | 4 | 5
  export let exercice: IExercice
  export let exerciceIndex: number
  export let supValue: any
  export let formNum: { titre: string; champs: string[] | number } | undefined =
    undefined

  const dispatch = createEventDispatcher()

  $: suffix = supIndex === 1 ? '' : supIndex.toString()

  $: caseACocher =
    exercice[`besoinFormulaire${suffix}CaseACocher` as keyof IExercice]
  $: texte = exercice[`besoinFormulaire${suffix}Texte` as keyof IExercice]

  $: formNumOptions = Array.isArray(formNum?.champs)
    ? formNum.champs.map((entree, i) => ({ label: entree, value: i + 1 }))
    : []

  function handleChange() {
    dispatch('change')
  }
</script>

{#if caseACocher}
  <CheckboxWithLabel
    id="settings-check{supIndex}-{exerciceIndex}"
    bind:isChecked={supValue}
    label={typeof caseACocher !== 'boolean' ? caseACocher[0] : ''}
    on:change={handleChange}
    darkBackground={true}
  />
{/if}

{#if formNum}
  {#if Array.isArray(formNum.champs)}
    <div class="flex flex-col">
      <form
        id="settings-form-formNum{supIndex}-{exerciceIndex}"
        action=""
        autocomplete="off"
      >
        <label
          class="text-sm md:text-normal text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
          for="settings-formNum{supIndex}-{exerciceIndex}"
          >{formNum.titre} :</label
        >
        <SelectUnique
          id="settings-formNum{supIndex}-{exerciceIndex}"
          name="formNum{supIndex}"
          bind:value={supValue}
          options={formNumOptions}
          on:change={handleChange}
          darkBackground={true}
          classAddenda="flex flex-auto border-1 focus:border-1"
        />
      </form>
    </div>
  {:else}
    <div>
      <label
        class="text-sm md:text-normal text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
        for="settings-formNum{supIndex}-{exerciceIndex}"
        >{formNum.titre} :
      </label>
      <InputNumber
        id="settings-formNum{supIndex}-{exerciceIndex}"
        min={1}
        max={formNum.champs}
        bind:value={supValue}
        on:change={handleChange}
        darkBackground={true}
      />
    </div>
  {/if}
{/if}

{#if texte}
  <form
    id="settings-form-formText{supIndex}-{exerciceIndex}"
    name="settings-form-formText{supIndex}"
    autocomplete="off"
    on:submit|preventDefault={handleChange}
  >
    {#if typeof texte !== 'boolean'}
      <div
        class="text-sm md:text-normal text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
      >
        <div>{texte[0]} :</div>
        <div
          class="w-full pl-4 pb-2 whitespace-pre-wrap text-[80%] text-coopmaths-struct-light leading-tight"
        >
          {texte[1]}
        </div>
      </div>
      <InputText
        inputID="settings-formText{supIndex}-{exerciceIndex}"
        bind:value={supValue}
        showTitle={false}
        darkBackground={true}
        classAddenda="w-full"
        on:input={handleChange}
      />
    {/if}
  </form>
{/if}
