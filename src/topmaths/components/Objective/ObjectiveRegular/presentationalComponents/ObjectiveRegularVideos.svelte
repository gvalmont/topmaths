<script lang="ts">
  import type { ObjectiveVideo } from '../../../../types/objective'

  export let videos: ObjectiveVideo[] = []

</script>

<h2 class="{videos.length > 0 && videos[0].title ? 'title' : 'subtitle'}
  text-xl md:text-3xl"
>
  Vidéo{videos.length > 1 ? 's' : ''} d'explication
</h2>
{#each videos as video}
  <div class="pb-5">
    {#if video.title}
      <h3 class="subtitle
        text-lg md:text-2xl"
      >
        {video.title}
      </h3>
    {/if}
    <div class="is-16by9">
      <iframe
        src={video.videoLink}
        title="Vidéo d'explication"
        allow="fullscreen"
      />
    </div>
    <p>
      Vidéo de
      <a
        href={video.authorLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button>
          {video.authorName}
        </button>
      </a>
    </p>
  </div>
{/each}
