<script lang="ts">
  import type { Unit } from '../../../../types/unit'
  import ListItemPdfDownload from '../../../shared/ListItemPdfDownload.svelte'

  export let unit: Unit
  export let isPersonalMode: boolean
</script>

<h2
  class="subtitle
  text-xl md:text-3xl"
>
  Téléchargements
</h2>
<ul class="p-6">
  <ListItemPdfDownload
    href={unit.downloadLinks.lessonLink}
    label="Télécharger le cours"
    grade={unit.grade}
  />
  <ListItemPdfDownload
    href={unit.downloadLinks.lessonSummaryLink}
    label="Télécharger le résumé"
    grade={unit.grade}
  />
  <ListItemPdfDownload
    href={unit.downloadLinks.missionLink}
    label="Télécharger la mission"
    grade={unit.grade}
  />
  <ListItemPdfDownload
    displayCondition={!!(isPersonalMode && unit.downloadLinks.lessonPlanLink)}
    href={unit.downloadLinks.lessonPlanLink}
    label="Télécharger la fiche"
    grade={unit.grade}
  />
</ul>
