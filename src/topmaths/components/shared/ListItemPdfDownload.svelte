<script lang="ts">
  import type { StringGrade } from '../../types/grade'
  import TextImage from './TextImage.svelte'

  // eslint-disable-next-line no-undef-init
  export let displayCondition: boolean | undefined = undefined
  export let href: string
  export let label: string
  export let grade: StringGrade
</script>

{#if displayCondition ?? !!href}
  <li class="flex justify-center
    p-1 md:p-2"
  >
    <a {href}>
      <TextImage
        imageSrc="/topmaths/img/cc0/pdf-file-format-symbol-svgrepo-com.svg"
        imageAlt="Fichier PDF"
        color={grade}
      >
      {label}
      </TextImage>
    </a>
  </li>
{/if}
