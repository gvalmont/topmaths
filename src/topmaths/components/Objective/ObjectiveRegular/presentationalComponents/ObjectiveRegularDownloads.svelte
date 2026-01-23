<script lang="ts">
  import { isStringGrade, type StringGrade } from '../../../../types/grade'
  import { isEmptyArrayRecord } from '../../../../types/shared'
  import ListItemPdfDownload from '../../../shared/ListItemPdfDownload.svelte'

  export let grade: StringGrade
  export let practiceSheetLink: string
  export let testSheetLink: string
  export let lessonPlanLinks: Record<StringGrade, string[]>
  export let isPersonalMode: boolean
  export let isTeacherMode: boolean
</script>

<h2
  class="subtitle
  text-xl md:text-3xl"
>
  Téléchargements
</h2>
<ul class="p-6">
  <ListItemPdfDownload
    displayCondition={!!practiceSheetLink}
    href={practiceSheetLink}
    label="Télécharger la feuille d'entraînement"
    {grade}
  />
  <ListItemPdfDownload
    displayCondition={isTeacherMode && !!testSheetLink}
    href={testSheetLink}
    label="Télécharger les tests"
    {grade}
  />
  {#if isPersonalMode && !isEmptyArrayRecord(lessonPlanLinks)}
    {#each Object.keys(lessonPlanLinks) as grade}
      {#if isStringGrade(grade) && lessonPlanLinks[grade].length > 0}
        {#each lessonPlanLinks[grade] as lessonPlanLink, i}
          <ListItemPdfDownload
            displayCondition={true}
            href={lessonPlanLink}
            label="Télécharger la fiche {lessonPlanLinks[grade].length > 1
              ? i + 1
              : ''} pour le niveau {grade}"
            {grade}
          />
        {/each}
      {/if}
    {/each}
  {/if}
</ul>
