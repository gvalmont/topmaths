<script lang="ts">
  export let dropdownText: string
</script>

<div
  class="tooltip
  {$$props.class}"
>
  <slot />
  {#if dropdownText}
    <span
      class="tooltiptext
      text-sm md:text-base"
    >
      {dropdownText}
    </span>
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
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;

    /* Position the tooltip text - see examples below! */
    position: absolute;
    z-index: 1;
    pointer-events: none;
  }

  .tooltiptext {
    width: 120px;
    opacity: 0.92;
  }

  /* Show the tooltip text when you mouse over the tooltip container */
  .tooltip:hover .tooltiptext {
    visibility: visible;
  }
</style>
