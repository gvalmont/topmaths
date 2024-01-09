<script lang="ts">
  export let urlBouton: string
  export let texteDropdown: string
  export let texteAlternatif: string
  export let size = 2
  export let grandTexte = false
</script>

<div class="tooltip">
  <i
    class="image is-inline-block"
    class:is-16x16={size === 1}
    class:is-24x24={size === 2}
    class:is-32x32={size === 3}
    class:is-48x48={size === 4}
    class:is-64x64={size === 5}
    class:is-96x96={size === 6}
    class:is-128x128={size === 7}
  >
    <img src={urlBouton} alt={texteAlternatif} />
  </i>
  {#if texteDropdown !== ''}
  <span class="tooltiptext is-size-6 has-text-weight-normal"
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
    opacity: 0.8;
  }

  /* Show the tooltip text when you mouse over the tooltip container */
  .tooltip:hover .tooltiptext {
    visibility: visible;
  }
</style>
