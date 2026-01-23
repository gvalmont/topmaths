<script lang="ts">
  import { onMount } from 'svelte'
  import type { ObjectiveVideo } from '../../../../types/objective'
  import ObjectiveRegularEmbededVideo from './ObjectiveRegularEmbededVideo.svelte'

  export let videos: ObjectiveVideo[] = []
  export let lessonVideos: string[] = []

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
  Cours en vidéo
</h2>
{#each lessonVideos as video}
  <video
    src={video}
    controls
    title="Vidéo d'explication"
    style="width: 100%; height: auto;"
  >
    <track kind="captions" src="" label="Sous-titres non disponibles" />
  </video>
{/each}
{#each videos as video}
  <ObjectiveRegularEmbededVideo
    title={video.title}
    authorName={video.authorName}
    authorLink={video.authorLink}
    videoLink={video.videoLink}
  />
{/each}
