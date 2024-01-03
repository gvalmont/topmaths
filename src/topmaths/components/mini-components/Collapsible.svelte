<script lang="ts">
  export let classesSupplementaires = ''

  function collapsibleOnClick () {
    this.classList.toggle('active')
    const contentElement = this.nextElementSibling
    toggleMaxHeight(contentElement)
    const croixRotative = this.firstElementChild
    croixRotative.classList.toggle('active')
  }

  function toggleMaxHeight (contentElement: HTMLElement) {
    if (contentElement.style.maxHeight) {
      contentElement.style.maxHeight = null
    } else {
      contentElement.style.maxHeight = contentElement.scrollHeight + 'px'
    }
  }
</script>

<div class="mt-1 collapsible-container">
  <button type="button" class="collapsible is-flex is-align-items-center {classesSupplementaires}" on:click={collapsibleOnClick}>
    <i class="image is-16x16 ml-2">
      <img src="assets/topmaths/img/cc0/plus-alt-svgrepo-com.svg" alt="simple croix" />
    </i>
    <h4 class="ml-2"><slot name="header"></slot></h4>
  </button>
  <div class="content {classesSupplementaires}">
    <slot name="content"></slot>
  </div>
</div>

<style>
  .collapsible {
    cursor: pointer;
    width: 100%;
    border-radius: 10px;
  } .collapsible.exemples {
      background-color: #e0f2fe;
    } .collapsible.exemples:hover {
        background-color: #bae6fd;
      }
    .collapsible.remarques {
      background-color: #dbeafe;
    } .collapsible.remarques:hover {
        background-color: #bfdbfe;
      }

  .active {
    border-radius: 10px 10px 0 0;
  } .active.exemples {
      background-color: #bae6fd;
    }
    .active.remarques {
      background-color: #bfdbfe;
    }

  .content {
    padding: 0 18px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
    border-radius: 0 0 10px 10px;
  } .content.exemples {
      background-color: #f0f9ff;
    }
    .content.remarques {
      background-color: #eff6ff;
    }

  .image {
    transform: rotate(0deg);
    transition: transform 0.3s ease-out;
  } .image.active {
      transform: rotate(135deg);
      transition: transform 0.3s ease-out;
    }
</style>
