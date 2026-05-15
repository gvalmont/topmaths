<script lang="ts">
  import type { StringGrade } from '../../types/grade'
  import SvgIcon from './SvgIcon.svelte'

  // eslint-disable-next-line no-undef-init
  export let displayCondition: boolean | undefined = undefined
  export let href: string
  export let label: string
  export let grade: StringGrade
</script>

{#if displayCondition ?? !!href}
  <li
    class="flex justify-center
    p-1 md:p-2"
  >
    <a
      class="is-interactive is-{grade} flex flex-row"
      {href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
      <SvgIcon
        class="ml-2 size-4 md:size-6"
        src="/topmaths/img/cc0/pdf-file-format-symbol-svgrepo-com.svg"
        alt="Fichier PDF"
      />
    </a>
  </li>
{/if}
