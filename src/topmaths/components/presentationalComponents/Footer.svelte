<script lang="ts">
  import type { TopmathsView } from '../../types/navigation'

  export let goToView: (event: MouseEvent, view: TopmathsView) => void

  const year = new Date().getFullYear()
</script>

<footer class="text-center
  p-6 md:p-12
  pt-3 md:pt-6
  pb-12 md:pb-24
  text-xs md:text-base
  bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
>
  <p>
    <strong>topmaths</strong> © {year} de
    <a href="https://forge.apps.education.fr/valmontguillaume" target="_blank" rel="noopener noreferrer">Guillaume Valmont</a> et des
    <a href="https://coopmaths.fr/a_propos/" target="_blank" rel="noopener noreferrer">contributeurs de MathALÉA</a>
  </p>
  <p>
    <button
      class=""
      on:click={(event) => goToView(event, 'informations')}
    >
      Informations sur le site
    </button>
    -
    <button
      class=""
      on:click={(event) => goToView(event, 'mentions-legales')}
    >
      Mentions légales
    </button>
    -
    <button
      class=""
      on:click={(event) => goToView(event, 'politique-de-confidentialite')}
    >
      Politique de confidentialité
    </button>
    -
    <button
      class=""
      on:click={(event) => goToView(event, 'cgu')}
    >
      CGU
    </button>
  </p>
</footer>
