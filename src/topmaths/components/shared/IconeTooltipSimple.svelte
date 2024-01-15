<script lang="ts">
  export let urlBouton: string
  export let texteDropdown: string
  export let texteAlternatif: string
  export let grandTexte = false
</script>

<div class="tooltip">
  <i>
    <img class="size-4 md:size-6" src={urlBouton} alt={texteAlternatif} />
  </i>
  {#if texteDropdown !== ''}
  <span class="tooltiptext text-sm md:text-base"
  class:grand-texte={grandTexte}
    >{texteDropdown}</span
  >
  {/if}
</div>

<style>
  /* https://www.w3schools.com/css/css_tooltip.asp */
  /* Tooltip container */
  .tooltip {
    position: relative;
    display: inline-block;
  }

  /* Tooltip text */
  .tooltip .tooltiptext {
    visibility: hidden;
    background-color: white;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;

    /* Position the tooltip text - see examples below! */
    position: absolute;
    z-index: 1;
  }

  .tooltiptext.grand-texte {
    width: 240px;
    opacity: 1;
  }

  .tooltiptext:not(.grand-texte) {
    width: 120px;
    opacity: 0.92;
  }

  /* Show the tooltip text when you mouse over the tooltip container */
  .tooltip:hover .tooltiptext {
    visibility: visible;
  }
</style>
