<script lang="ts">
  import { onMount } from 'svelte'
  import type { ObjectiveVideo } from '../../../../types/objective'

  export let videos: ObjectiveVideo[] = []

  onMount(() => {
    videos.forEach((video) => {
      const iframe = document.getElementById(video.videoLink)
      if (!iframe) return
      iframe.addEventListener('load', () => {
        setTimeout(() => {
          iframe.style.display = 'block'
        }, 1000)
      })
    })
  })
</script>

<h2
  class="{videos.length > 0 && videos[0].title ? 'title' : 'subtitle'}
  text-xl md:text-3xl"
>
  Vidéo{videos.length > 1 ? 's' : ''} d'explication
</h2>
{#each videos as video}
  <div class="pb-5">
    {#if video.title}
      <h3
        class="subtitle
        text-lg md:text-2xl"
      >
        {video.title}
      </h3>
    {/if}
    <div class="is-16by9">
      <iframe
        src="{video.videoLink}"
        id="{video.videoLink}"
        title="Vidéo d'explication"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
        style="display: none;"
      ></iframe>
    </div>
    <p>
      Vidéo de
      <a
        href="{video.authorLink}"
        target="_blank"
        rel="noopener noreferrer"
        class="is-interactive is-topmaths"
      >
        <button>
          {video.authorName}
        </button>
      </a>
    </p>
  </div>
{/each}
