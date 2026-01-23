<script lang="ts">
  let collapsibleButton: HTMLButtonElement
  let collapsibleContent: HTMLElement
  let rotativeCross: HTMLImageElement
  let isActive: boolean = false

  function collapsibleOnClick(): void {
    collapsibleButton.classList.toggle('active')
    toggleMaxHeight(collapsibleContent)
    rotativeCross.classList.toggle('active')
    isActive = collapsibleButton.classList.contains('active')
  }

  function toggleMaxHeight(contentElement: HTMLElement): void {
    if (contentElement.style.maxHeight) {
      contentElement.style.maxHeight = ''
    } else {
      contentElement.style.maxHeight = contentElement.scrollHeight + 'px'
    }
  }
</script>

<div class="mt-1 collapsible-container">
  <button
    bind:this={collapsibleButton}
    class="{$$props.class} button collapsible flex items-center is-interactive
      bg-sky-100 hover:bg-sky-200
      dark:border dark:border-is-info"
    on:click={collapsibleOnClick}
  >
    <img
      bind:this={rotativeCross}
      class="w-4 h-4 ml-2"
      src="topmaths/img/cc0/plus-alt-svgrepo-com.svg"
      alt="croix"
    />
    <h4
      class="ml-2
        text-topmaths-corpus dark:text-inherit"
    >
      <slot name="header" />
    </h4>
  </button>
  <div
    bind:this={collapsibleContent}
    class="content
      border-info-200
      {isActive ? 'border ' : ''}"
  >
    <slot name="content" />
  </div>
</div>

<style lang="scss">
  @use '../../styles/tailwind-colors.scss';

  .collapsible {
    cursor: pointer;
    width: 100%;
    border-radius: 10px;
    transition: border-radius 0.3s ease;
  }
  .active {
    border-radius: 10px 10px 0 0;
    transition: none;
  }

  .content {
    padding: 0 18px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
    border-radius: 0 0 10px 10px;
  }

  button img {
    transform: rotate(0deg);
    transition: transform 0.3s ease-out;
  }
  button.active img {
    transform: rotate(135deg);
    transition: transform 0.3s ease-out;
  }
</style>
