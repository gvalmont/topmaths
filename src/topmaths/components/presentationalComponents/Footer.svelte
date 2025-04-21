<script lang="ts">
  import AnchorExternal from '../shared/AnchorExternal.svelte'
  import ButtonInternalLink from '../shared/ButtonInternalLink.svelte'

  const year = new Date().getFullYear()
</script>

<footer class="text-center w-full
  pt-3 md:pt-6
  pb-6 md:pb-12
  text-xs md:text-base
  bg-topmaths-canvas-dark"
>
  <p>
    <b>topmaths</b> © {year} de
    <AnchorExternal href="https://forge.apps.education.fr/valmontguillaume">
      Guillaume Valmont
    </AnchorExternal>
    et des
    <AnchorExternal href="https://coopmaths.fr/a_propos/">
      contributeurs de MathALÉA
    </AnchorExternal>
  </p>
  <p>
    <ButtonInternalLink view="info" reference="site-info">
      Informations sur le site
    </ButtonInternalLink>
    -
    <ButtonInternalLink view="info" reference="legal-notice">
      Mentions légales
    </ButtonInternalLink>
    -
    <ButtonInternalLink view="info" reference="privacy-policy">
      Politique de confidentialité
    </ButtonInternalLink>
    -
    <ButtonInternalLink view="info" reference="terms-of-use">
      CGU
    </ButtonInternalLink>
  </p>
</footer>
