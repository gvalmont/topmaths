<script lang="ts">
  import {
    lexique as lexiqueStore, texteRecherche

  } from '../../services/store'
  import { normaliser } from '../../services/outils'
  import { writable, derived } from 'svelte/store'
  import type { LexiqueItem } from '../../services/types'
  import { afterUpdate, onDestroy, tick } from 'svelte'
  import { mathaleaRenderDiv } from '../../../lib/mathalea'
  import Collapsible from '../shared/Collapsible.svelte'
  import NotionsEtObjectifsLies from '../shared/NotionsEtObjectifsLies.svelte'

  const lexiqueTampon = writable<LexiqueItem[]>([])
  const lignesFiltrees = derived(
    [texteRecherche, lexiqueTampon],
    ([$texteRecherche, $lexiqueTampon]) =>
      getLignesFiltrees($texteRecherche, $lexiqueTampon)
  )
  let currentWindowWidth: number = document.body.clientWidth

  if (lesDonneesSontChargees()) MAJLexiqueTampon()
  const lexiqueUnsubscribe = lexiqueStore.subscribe(() => MAJLexiqueTampon())
  onDestroy(lexiqueUnsubscribe)

  afterUpdate(async () => {
    await tick()
    const divLignes = document.getElementById('lignes')
    if (divLignes !== null) mathaleaRenderDiv(divLignes)
  })

  function lesDonneesSontChargees () {
    return $lexiqueStore.length > 0
  }

  function MAJLexiqueTampon () {
    const lignes: LexiqueItem[] = []
    for (const item of $lexiqueStore) {
      lignes.push(item)
    }
    lexiqueTampon.set(lignes)
  }

  function getLignesFiltrees (texteRecherche: string, lignes: LexiqueItem[]): LexiqueItem[] {
    if (texteRecherche === '') return lignes
    const motsCherches = normaliser(texteRecherche).split(' ')
    return lignes.filter((ligne) => {
      for (const mot of motsCherches) {
        if (!motTrouve(mot, ligne)) return false
      }
      return true
    })
  }

  function motTrouve (mot: string, ligne: LexiqueItem) {
    if (
      ligne.niveau !== undefined &&
      normaliser(ligne.niveau).includes(mot)
    ) { return true }
    if (
      ligne.titre !== undefined &&
      normaliser(ligne.titre).includes(mot)
    ) { return true }
    if (
      ligne.motsCles !== undefined &&
      normaliser(ligne.motsCles).includes(mot)
    ) { return true }
    for (const objectifLie of ligne.objectifsLies) {
      if (
        ligne.objectifsLies !== undefined &&
        normaliser(objectifLie).includes(mot)
      ) { return true }
    }
    return false
  }

</script>

<svelte:head>
  <title>Lexique - topmaths</title>
</svelte:head>

<svelte:window bind:innerWidth={currentWindowWidth} />

<div class="w-screen max-w-screen-lg">
  <h1 class="title is-2 p-5 mb-6" style="color: white; background-color: #3b82f6; border-radius: 50px 50px 0px 0px">
    Lexique
  </h1>
  <input
    class="p-1"
    style="text-align:center; font-size:x-large;"
    type="text"
    aria-describedby="Champ pour rechercher une définition ou une propriété"
    autocomplete="off"
    placeholder="Recherche"
    bind:value={$texteRecherche}
    on:input
  />
  <div><br /></div>
  <ul id="lignes">
    {#each $lignesFiltrees as ligne}
      <li id="{ligne.slug}" class="box">
        <a href="#{ligne.slug}">
          <h3 class="font-semibold has-text-link">{ligne.titre}</h3>
        </a>
        <div class="columns">
          <div class="column p-0 m-3">
            <div bind:innerHTML={ligne.contenu} contenteditable="false"></div>
            {#if ligne.exemples !== undefined && ligne.exemples.length > 0}
              <Collapsible classesSupplementaires={'exemples'}>
                <h2 slot="header">Exemple{ligne.exemples.length > 1 ? 's' : ''}</h2>
                <ul slot="content" class="mt-0 ml-3">
                  {#each ligne.exemples as exemple, i}
                    <li bind:innerHTML={exemple} contenteditable="false" style="border-color: #bae6fd; {i > 0 ? 'border-width: 1px 0 0 0' : ''}"></li>
                  {/each}
                </ul>
              </Collapsible>
            {/if}
            {#if ligne.remarques !== undefined && ligne.remarques.length > 0}
            <Collapsible classesSupplementaires={'remarques'}>
              <h2 slot="header">Remarque{ligne.remarques.length > 1 ? 's' : ''}</h2>
              <ul slot="content" class="mt-0 ml-3">
                {#each ligne.remarques as remarque, i}
                  <li bind:innerHTML={remarque} contenteditable="false" style="border-color: #bfdbfe; {i > 0 ? 'border-width: 1px 0 0 0' : ''}"></li>
                {/each}
              </ul>
            </Collapsible>
            {/if}
            {#if currentWindowWidth >= 768}
              <NotionsEtObjectifsLies {ligne} />
            {/if}
          </div>
          <div class="column is-narrow p-0 m-3 is-flex is-align-items-center is-justify-content-center" style="width: 200px">
            {#if ligne.avecImage}
              <img src="topmaths/img/lexique/{ligne.slug}.png" alt="Représentation de : {ligne.titre}" />
            {/if}
          </div>
        </div>
        {#if currentWindowWidth < 768}
          <NotionsEtObjectifsLies {ligne} />
        {/if}
      </li>
    {/each}
  </ul>
</div>

<style>
  li {
    padding-top: 5px;
    padding-bottom: 5px;
    list-style: none;
  }
</style>
