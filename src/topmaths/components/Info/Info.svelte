<script lang="ts">
  import { reference } from '../../services/store'
  import TermsOfUse from './presentationalComponents/InfoTermsOfUse.svelte'
  import SiteInfo from './presentationalComponents/InfoSiteInfo.svelte'
  import LegalNotice from './presentationalComponents/InfoLegalNotice.svelte'
  import PrivacyPolicy from './presentationalComponents/InfoPrivacyPolicy.svelte'
  import { onMount } from 'svelte'
  import { isInfoReference } from '../../types/navigation'
  import { backToHome } from '../../services/navigation'

  onMount(() => {
    if (!isInfoReference($reference)) {
      backToHome()
    }
  })

  $: if ($reference) scrollTo(0, 0)
</script>

<div class="w-full max-w-screen-lg info-container m-10 text-justify">
  {#if $reference === 'site-info'}
    <SiteInfo />
  {:else if $reference === 'legal-notice'}
    <LegalNotice />
  {:else if $reference === 'privacy-policy'}
    <PrivacyPolicy />
  {:else if $reference === 'terms-of-use'}
    <TermsOfUse />
  {/if}
</div>

<style>
  :global(.info-container h1) {
    text-align: center;
    font-size: 2.25rem;
    line-height: 2.5rem;
    font-weight: 800;
    padding-bottom: 1.5rem;
  }
  :global(.info-container h2) {
    font-size: 1.875rem /* 30px */;
    line-height: 2.25rem /* 36px */;
    font-weight: 700;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }
  :global(.info-container h3) {
    font-size: 1.5rem /* 24px */;
    line-height: 2rem /* 32px */;
    font-weight: 600;
    padding-bottom: 1rem;
  }
  :global(.info-container ul > li) {
    margin-left: 1rem;
  }
  :global(.info-container ul) {
    list-style: circle;
    margin-left: 1rem;
  }
  :global(.info-container ul *) {
    text-align: left;
  }
</style>
