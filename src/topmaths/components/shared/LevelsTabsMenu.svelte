<script lang="ts">
  export let activeLevelTab: string
  export let onLevelsTabsMenuClicked: (level: string) => void

  const levels = ['tout', '6e', '5e', '4e', '3e']
</script>

<div class="overflow-scrolling-touch flex overflow-hidden overflow-x-auto">
  <ul class="flex flex-grow justify-center tabs-menu is-full-rounded mb-6">
    {#each levels as level}
      <li>
        <button
          on:click={() => onLevelsTabsMenuClicked(level)}
          class="subtitle text-base py-1 md:py-2 md:text-2xl px-3 md:px-5 is-{level}"
          class:is-active={activeLevelTab === level}
          class:rounded-tl-3xl={level === levels[0]}
          class:rounded-bl-3xl={level === levels[0]}
          class:rounded-tr-3xl={level === levels[levels.length - 1]}
          class:rounded-br-3xl={level === levels[levels.length - 1]}
        >
          {level.charAt(0).toUpperCase() + level.slice(1)}
        </button
        >
      </li>
    {/each}
    <li />
  </ul>
</div>
