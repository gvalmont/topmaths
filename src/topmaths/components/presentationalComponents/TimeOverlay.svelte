<script lang="ts">
  import { onDestroy, onMount } from 'svelte'

  let intervalId: ReturnType<typeof setTimeout>
  let time: string = ''

  onMount(() => {
    startTimeInterval()
  })

  onDestroy(() => {
    clearTimeInterval()
  })

  function startTimeInterval(): void {
    updateTime()
    intervalId = setInterval(() => {
      updateTime()
    }, 1000)
  }

  function clearTimeInterval(): void {
    clearInterval(intervalId)
  }

  function updateTime(): void {
    const date = new Date()
    const hh = date.getHours().toString().padStart(2, '0')
    const mm = date.getMinutes().toString().padStart(2, '0')

    time = `${hh}:${mm}`
  }

  function toggleTimeOverlaySize(): void {
    const timeOverlayDiv = document.getElementById('timeOverlay')
    if (timeOverlayDiv !== null) {
      if (timeOverlayDiv.style.width === '240px') {
        timeOverlayDiv.style.width = '60px'
        timeOverlayDiv.style.height = '30px'
        timeOverlayDiv.style.fontSize = '18px'
      } else {
        timeOverlayDiv.style.width = '240px'
        timeOverlayDiv.style.height = '120px'
        timeOverlayDiv.style.fontSize = '72px'
      }
    }
  }
</script>

<button
  class="noprint
  text-coopmaths-corpus dark:text-coopmathsdark-corpus"
  tabindex="-1"
  id="timeOverlay"
  on:click={toggleTimeOverlaySize}
>
  {time}
</button>

<style>
  #timeOverlay {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 200;
    width: 60px;
    height: 30px;
    font-size: 18px;
    transition:
      width 1s,
      height 1s,
      font-size 1s;
  }
</style>
