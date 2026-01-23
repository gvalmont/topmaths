<script lang="ts">
  export let isChecked: boolean // bind with the parent component
</script>

<label
  class="flex items-center mt-5 ml-2 cursor-pointer is-interactive is-link"
>
  <div class="custom-checkbox relative inline-block w-5 h-5 mr-2">
    <input class="opacity-0 w-0 h-0" type="checkbox" bind:checked={isChecked} />
    <span
      class="absolute top-0 left-0 w-5 h-5 bg-transparent rounded transition-all duration-300 border
      border-is-link"
    ></span>
  </div>
  <span
    class="
    text-xs md:text-base"
  >
    <slot />
  </span>
</label>

<style lang="scss">
  @use '../../styles/tailwind-colors.scss';
  .custom-checkbox {
    input:checked + span {
      background-color: tailwind-colors.$is-link-default;

      &::after {
        display: block;
      }
    }

    span::after {
      content: '';
      position: absolute;
      display: none;
      left: 7px;
      top: 3px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }
</style>
