<script lang="ts">
  export let displayCondition: boolean
  export let href: string
  export let label: string
</script>

{#if displayCondition}
<li class="p-1 md:p-2 flex justify-center">
  <a {href}>
    <button class="flex">
      <p>{label} &nbsp;</p>
      <i>
        <img
          class="size-4 md:size-6"
          src="/topmaths/img/cc0/pdf-file-format-symbol-svgrepo-com.svg"
          alt="Fichier PDF"
        />
      </i>
    </button>
  </a>
</li>
{/if}
