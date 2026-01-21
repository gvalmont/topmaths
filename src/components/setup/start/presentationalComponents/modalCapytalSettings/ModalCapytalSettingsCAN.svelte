<script lang="ts">
  import type { CanOptions } from '../../../../../lib/types/can'
  import ButtonToggleAlt from '../../../../shared/forms/ButtonToggleAlt.svelte'
  import FormRadio from '../../../../shared/forms/FormRadio.svelte'
  import InputNumber from '../../../../shared/forms/InputNumber.svelte'
  import InputText from '../../../../shared/forms/InputText.svelte'

  export let canOptions: CanOptions
  export let toggleCan: () => void
</script>

<div
  class="pl-2 pb-2 font-light text-2xl
text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
>
  Course aux nombres
</div>
<div class="flex flex-row justify-start items-center px-4">
  <div
    class="flex flex-col items-start justify-start space-y-2 text-sm font-light
    {canOptions.isChoosen
      ? 'text-coopmaths-corpus-light dark:text-coopmathsdark-corpus'
      : 'text-coopmaths-corpus-light/10 dark:text-coopmathsdark-corpus/10'}"
  >
    <ButtonToggleAlt
      title={'Format CAN'}
      class=""
      id={'config-eleve-format-can-toggle'}
      bind:value={canOptions.isChoosen}
      on:toggle={toggleCan}
      explanations={[
        'Les questions seront posées les unes à la suite des autres en temps limité.',
        'Chaque exercice sera dans un onglet différent',
      ]}
    />
    <div class="flex justify-start flex-row items-center space-x-2">
      <div>Durée&nbsp;:</div>
      <InputNumber
        id="config-eleve-can-nb-questions-input"
        bind:value={canOptions.durationInMinutes}
        isDisabled={!canOptions.isChoosen}
      />
      <div>
        minute{canOptions.durationInMinutes !== undefined &&
        canOptions.durationInMinutes > 1
          ? 's'
          : ''}.
      </div>
    </div>
    <div class="flex justify-start flex-row items-center space-x-2">
      <div>Sous-titre :</div>
      <InputText
        inputID="config-eleve-can-duration-input"
        bind:value={canOptions.subTitle}
        isDisabled={!canOptions.isChoosen}
      />
    </div>
    <ButtonToggleAlt
      title={'Accès aux solutions'}
      id={'config-eleve-solutions-can-toggle'}
      bind:value={canOptions.solutionsAccess}
      isDisabled={!canOptions.isChoosen}
      explanations={[
        'Les élèves auront accès aux solutions dans le format défini ci-dessous.',
        "Les élèves n'auront pas accès aux solutions.",
      ]}
    />
    <FormRadio
      title="can-solutions-config"
      bind:valueSelected={canOptions.solutionsMode}
      isDisabled={!canOptions.isChoosen || !canOptions.solutionsAccess}
      labelsValues={[
        {
          label: 'Solutions rassemblées à la fin.',
          value: 'gathered',
        },
        {
          label: 'Solutions avec les questions.',
          value: 'split',
        },
      ]}
    />
  </div>
</div>
