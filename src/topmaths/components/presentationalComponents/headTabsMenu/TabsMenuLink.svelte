<script lang="ts">
  export let displayCondition: boolean = true
  export let activeCondition: boolean
  export let destinationVue: string
  export let color: string
  export let imgSrc: string
  export let imgAlt: string
  export let isMd: boolean
  export let onHeadTabsMenuClicked: (event: MouseEvent, vue: string) => void

</script>

{#if displayCondition}
  <a href='?v={destinationVue}' style="padding: 0;">
    <li class:is-actif={activeCondition}>
      <button class="tabs-menu-link is-{color} py-2 md:py-3 px-3 md:px-4" on:click={(event) => onHeadTabsMenuClicked(event, destinationVue)}>
        <i class="image is-{isMd ? '48x48' : '32x32'}">
          <img src={imgSrc} alt={imgAlt}/>
        </i>
      </button>
    </li>
  </a>
{/if}
