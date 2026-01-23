<script lang="ts">
  export let title: string = ''
  export let authorName: string = ''
  export let authorLink: string = ''
  export let videoLink: string = ''
</script>

<div class="pb-5">
  {#if title}
    <h3
      class="subtitle
        text-lg md:text-2xl"
    >
      {title}
    </h3>
  {/if}
  <div class="is-16by9">
    <iframe
      src={videoLink}
      id={videoLink}
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
      href={authorLink}
      target="_blank"
      rel="noopener noreferrer"
      class="is-interactive is-topmaths"
    >
      <button>
        {authorName}
      </button>
    </a>
  </p>
</div>
