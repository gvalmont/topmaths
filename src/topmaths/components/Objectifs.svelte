<script lang="ts">
  import { modeEnseignant, niveauxObjectifs, titresProchesDesAttendus } from '../services/store'
  import { goVue, normaliser } from '../services/outils'
  import { onDestroy } from 'svelte'
  import type { Unsubscriber } from 'svelte/store'
  import { writable, derived } from 'svelte/store'
  import type { LigneObjectif } from '../services/types'

  const filtre = {
    niveau: 'tout',
    periode: 0,
    theme: { nom: '', nbObjectifsParPeriode: [] },
    sousTheme: { nom: '', nbObjectifsParPeriode: [] },
    reference: '',
    titre: '',
    titreSimplifie: ''
  } as LigneObjectif
  const texteRecherche = writable('')
  const lignes = writable<LigneObjectif[]>([])
  const lignesFiltrees = derived(
    [texteRecherche, lignes],
    ([$texteRecherche, $lignes]) => getLignesFiltrees($texteRecherche, $lignes)
  )

  let niveauxObjectifsUnsubscribe: Unsubscriber

  updateParamsFromUrl()
  MAJPage()
  surveillerLeChargementDesDonnees()
  addEventListener('popstate', updateParamsFromUrl)
  onDestroy(() => {
    removeEventListener('popstate', updateParamsFromUrl)
  })

  function updateParamsFromUrl () {
    const url = new URL(window.location.href)
    const entries = url.searchParams.entries()
    for (const entry of entries) {
      if (entry[0] === 'niveau') filtre.niveau = entry[1]
      if (entry[0] === 'periode') filtre.periode = Number(entry[1])
    }
  }

  function surveillerLeChargementDesDonnees () {
    niveauxObjectifsUnsubscribe = niveauxObjectifs.subscribe(() => MAJPage())
    onDestroy(niveauxObjectifsUnsubscribe)
  }

  function MAJPage () {
    if (lesDonneesSontChargees()) {
      MAJLignes()
    }
  }

  function lesDonneesSontChargees () {
    return $niveauxObjectifs.length > 0
  }

  function MAJLignes () {
    const lignesTemp = []
    for (const niveau of $niveauxObjectifs) {
      lignesTemp.push({
        niveau: niveau.nom,
        periode: 0,
        theme: { nom: '', nbObjectifsParPeriode: [] },
        sousTheme: { nom: '', nbObjectifsParPeriode: [] },
        reference: '',
        titre: '',
        titreSimplifie: ''
      })
      for (const theme of niveau.themes) {
        lignesTemp.push({
          niveau: niveau.nom,
          periode: 0,
          theme: {
            nom: theme.nom,
            nbObjectifsParPeriode: theme.nbObjectifsParPeriode
          },
          sousTheme: { nom: '', nbObjectifsParPeriode: [] },
          reference: '',
          titre: '',
          titreSimplifie: ''
        })
        for (const sousTheme of theme.sousThemes) {
          lignesTemp.push({
            niveau: niveau.nom,
            periode: 0,
            theme: {
              nom: theme.nom,
              nbObjectifsParPeriode: theme.nbObjectifsParPeriode
            },
            sousTheme: {
              nom: sousTheme.nom,
              nbObjectifsParPeriode: sousTheme.nbObjectifsParPeriode
            },
            reference: '',
            titre: '',
            titreSimplifie: ''
          })
          for (const objectif of sousTheme.objectifs) {
            lignesTemp.push({
              niveau: niveau.nom,
              periode: objectif.periode,
              theme: {
                nom: theme.nom,
                nbObjectifsParPeriode: theme.nbObjectifsParPeriode
              },
              sousTheme: {
                nom: sousTheme.nom,
                nbObjectifsParPeriode: sousTheme.nbObjectifsParPeriode
              },
              reference: objectif.reference,
              titre: objectif.titre,
              titreSimplifie: objectif.titreSimplifie
            })
          }
        }
      }
      lignesTemp.push({
        niveau: 'fin',
        periode: 0,
        theme: { nom: '', nbObjectifsParPeriode: [] },
        sousTheme: { nom: '', nbObjectifsParPeriode: [] },
        reference: '',
        titre: '',
        titreSimplifie: ''
      })
    }
    lignes.set(lignesTemp)
  }

  function getLignesFiltrees (texteRecherche: string, lignes: LigneObjectif[]): LigneObjectif[] {
    if (texteRecherche === '') return lignes
    const motsCherches = normaliser(texteRecherche).split(' ')
    return lignes.filter((ligne) => {
      for (const mot of motsCherches) {
        if (!motTrouve(mot, ligne)) return false
      }
      return true
    })
  }

  function motTrouve (mot: string, ligne: LigneObjectif) {
    if (
      ligne.niveau !== undefined &&
      normaliser(ligne.niveau).includes(mot)
    ) { return true }
    if (
      ligne.reference !== undefined &&
      normaliser(ligne.reference).includes(mot)
    ) { return true }
    if (
      ligne.titre !== undefined &&
      normaliser(ligne.titre).includes(mot)
    ) { return true }
    if (
      ligne.titreSimplifie !== undefined &&
      normaliser(ligne.titreSimplifie).includes(mot)
    ) { return true }
    return false
  }

  function clicFiltre (niveau: string, periode?: number) {
    if (niveau !== '') {
      filtre.niveau = niveau
    }
    if (periode !== undefined) {
      filtre.periode === periode
        ? (filtre.periode = 0)
        : (filtre.periode = periode)
    }
    window.history.pushState({}, '', `?v=objectifs&niveau=${filtre.niveau}&periode=${filtre.periode}`)
  }
</script>

<svelte:head>
  <title>Liste des objectifs topmaths</title>
</svelte:head>

<div class="container is-max-desktop centre">
  <div class="tabs is-medium is-centered">
    <ul class="tabs-menu is-rounded">
      <li>
        <button
          class="subtitle is-4 px-5 is-tout is-left-side"
          class:is-active={filtre.niveau === 'tout'}
          on:click={() => clicFiltre('tout')}>Tout</button
        >
      </li>
      {#each $lignes as ligne}
        <li>
          {#if ligne.niveau !== '' && ligne.niveau !== 'fin' && ligne.theme.nom === ''}
            <button
              on:click={() => clicFiltre(ligne.niveau ?? '')}
              class:is-active={filtre.niveau === ligne.niveau}
              class="subtitle is-4 px-5 is-{ligne.niveau}"
              class:is-right-side={ligne.niveau === '3e'}>{ligne.niveau}</button
            >
          {/if}
        </li>
      {/each}
    </ul>
  </div>
  <div class="is-flex is-justify-content-center" style="overflow:auto">
    <span
      ><button
        class="button is-rounded is-link mb-5 mx-1 is-medium"
        class:is-light={filtre.periode !== null &&
          filtre.periode !== undefined &&
          filtre.periode > 0}
        on:click={() => clicFiltre('', 0)}>Période</button
      ></span
    >
    {#each [1, 2, 3, 4, 5] as periode}
      <span>
        <button
          class="button is-rounded is-link mb-5 mx-1 is-medium"
          class:is-light={filtre.periode !== periode}
          on:click={() => clicFiltre('', periode)}>{periode}</button
        >
      </span>
    {/each}
  </div>
  <input
    class="p-1"
    style="text-align:center; font-size:x-large;"
    type="text"
    aria-describedby="Champ pour rechercher un objectif"
    autocomplete="off"
    placeholder="Recherche"
    bind:value={$texteRecherche}
    on:input
  />
  {#if $modeEnseignant}
  <label style="position: absolute;">
    <input type="checkbox" bind:checked={$titresProchesDesAttendus} />
      Intitulés proches des attendus de fin d'année
  </label>
  {/if}
  <div><br /></div>
  <div class="container is-max-desktop centre">
    {#each $lignesFiltrees as ligne, i}
      {#if ligne.theme.nom !== 'Extra'}
        <span>
          {#if ligne.niveau !== '' && ligne.niveau !== 'fin' && (filtre.niveau === 'tout' || filtre.niveau === ligne.niveau) && ligne.theme.nom === '' && ligne.sousTheme.nom === '' && ligne.reference === ''}
            <h1 class="title is-2 p-2 is-{ligne.niveau}">
              {ligne.niveau}
            </h1>
          {/if}
          {#if ligne.niveau !== 'fin' && (filtre.periode === 0 || ligne.theme.nbObjectifsParPeriode[filtre.periode - 1] > 0) && (filtre.niveau === 'tout' || filtre.niveau === ligne.niveau) && (filtre.theme.nom === '' || filtre.theme.nom === ligne.theme.nom) && ligne.theme.nom !== '' && ligne.sousTheme.nom === '' && ligne.reference === ''}
            <h2 class="subtitle is-3 pt-2 is-{ligne.niveau}">
              {ligne.theme.nom}
            </h2>
          {/if}
          {#if ligne.niveau !== 'fin' && (filtre.periode === 0 || ligne.sousTheme.nbObjectifsParPeriode[filtre.periode - 1] > 0) && (filtre.niveau === 'tout' || filtre.niveau === ligne.niveau) && (filtre.sousTheme.nom === '' || filtre.sousTheme.nom === ligne.sousTheme.nom) && ligne.sousTheme.nom !== '' && ligne.reference === ''}
            <h3 class="subtitle is-4 p-4 is-{ligne.niveau}">
              {ligne.sousTheme.nom}
            </h3>
          {/if}
          {#if ligne.niveau !== 'fin' && (filtre.periode === 0 || filtre.periode === ligne.periode) && (filtre.niveau === 'tout' || filtre.niveau === ligne.niveau) && (filtre.theme.nom === '' || filtre.theme.nom === ligne.theme.nom) && (filtre.sousTheme.nom === '' || filtre.sousTheme.nom === ligne.sousTheme.nom) && ligne.reference !== ''}
            <div
              class="p-1 is-size-5 is-{ligne.niveau}"
              class:is-fin={$texteRecherche === '' && ($lignesFiltrees[i + 1].niveau === 'fin' || $lignesFiltrees[i + 1].theme.nom === 'Extra')}
            >
              <a
                href="/?v=objectif&ref={ligne.reference}"
                on:click={(event) =>
                  goVue(event, 'objectif', ligne.reference ?? '')}
              >
                <div>
                  {ligne.reference} : {$titresProchesDesAttendus ||
                    ligne.titreSimplifie === undefined || ligne.titreSimplifie === ''
                    ? ligne.titre
                    : ligne.titreSimplifie}<br />
                </div>
              </a>
            </div>
          {/if}
        </span>
      {/if}
      {#if i > 0 && ligne.niveau === 'fin' && filtre.niveau === 'tout'}
        <div>
          <br />
        </div>
      {/if}
    {/each}
  </div>
</div>
