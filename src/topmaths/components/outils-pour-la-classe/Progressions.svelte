<script lang="ts">
  import { modeEnseignant, niveauxSequences, titresProchesDesAttendus } from '../../services/store'
  import { getTheme, goVue, normaliser } from '../../services/outils'
  import type { Unsubscriber } from 'svelte/store'
  import { writable, derived } from 'svelte/store'
  import type { SequenceCalculMental, SequenceObjectif, SequenceQuestionFlash } from '../../services/types'
  import { onDestroy } from 'svelte'
  import LevelsTabsMenu from '../shared/LevelsTabsMenu.svelte'

  interface Ligne {
    niveau: string
    periode: number
    numero: number
    reference: string
    titre: string
    objectifs: SequenceObjectif[]
    questionsFlash: SequenceQuestionFlash[]
    calculsMentaux: SequenceCalculMental[]
  }

  const filtre = {
    niveau: 'tout',
    periode: 0,
    numero: 0,
    reference: '',
    titre: '',
    objectifs: [],
    questionsFlash: [],
    calculsMentaux: []
  } as Ligne
  const texteRecherche = writable<string>('')
  const lignesSequencesNormales = writable<Ligne[]>([])
  const lignesFiltreesSequencesNormales = derived(
    [texteRecherche, lignesSequencesNormales],
    ([$texteRecherche, $lignesSequencesNormales]) =>
      getLignesFiltrees($texteRecherche, $lignesSequencesNormales)
  )
  let niveauxSequencesUnsubscribe: Unsubscriber

  MAJPage()
  surveillerChargementDesDonnees()

  function lesDonneesSontChargees () {
    return $niveauxSequences.length > 0
  }

  function MAJPage () {
    if (lesDonneesSontChargees()) {
      MAJLignesSequencesNormales()
    }
  }

  function MAJLignesSequencesNormales () {
    const lignes = [] as Ligne[]
    for (const niveau of $niveauxSequences) {
      lignes.push({
        niveau: niveau.nom,
        periode: 0,
        numero: 0,
        reference: '',
        titre: '',
        objectifs: [],
        questionsFlash: [],
        calculsMentaux: []
      })
      for (const sequence of niveau.sequences) {
        lignes.push({
          niveau: niveau.nom,
          reference: sequence.reference,
          titre: sequence.titre,
          periode: sequence.periode,
          numero: sequence.numero,
          objectifs: sequence.objectifs,
          questionsFlash: sequence.questionsFlash,
          calculsMentaux: sequence.calculsMentaux
        })
      }
      lignes.push({
        niveau: 'fin',
        periode: 0,
        numero: 0,
        reference: '',
        titre: '',
        objectifs: [],
        questionsFlash: [],
        calculsMentaux: []
      })
    }
    lignesSequencesNormales.set(lignes)
  }

  function surveillerChargementDesDonnees () {
    niveauxSequencesUnsubscribe = niveauxSequences.subscribe(() => MAJPage())
    onDestroy(niveauxSequencesUnsubscribe)
  }

  function getLignesFiltrees (texteRecherche: string, lignes: Ligne[]): Ligne[] {
    if (texteRecherche === '') return lignes
    const motsCherches = normaliser(texteRecherche).split(' ')
    return lignes.filter((ligne) => {
      for (const mot of motsCherches) {
        if (!motTrouve(mot, ligne)) return false
      }
      return true
    })
  }

  function motTrouve (mot: string, ligne: Ligne) {
    if (
      ligne.niveau !== '' &&
      normaliser(ligne.niveau).includes(mot)
    ) { return true }
    if (
      ligne.numero !== 0 &&
      normaliser(ligne.numero.toString()).includes(mot)
    ) { return true }
    if (
      ligne.reference !== '' &&
      normaliser(ligne.reference).includes(mot)
    ) { return true }
    if (
      ligne.titre !== '' &&
      normaliser(ligne.titre).includes(mot)
    ) { return true }
    if (ligne.objectifs.length > 0) {
      for (const objectif of ligne.objectifs) {
        if (normaliser(objectif.reference).includes(mot)) return true
        if (normaliser(objectif.titre).includes(mot)) return true
        if (normaliser(objectif.titreSimplifie).includes(mot)) return true
        if (normaliser(objectif.theme).includes(mot)) return true
      }
    }
    if (ligne.calculsMentaux.length > 0) {
      for (const calculMental of ligne.calculsMentaux) {
        if (normaliser(calculMental.reference).includes(mot)) return true
        if (normaliser(calculMental.titre).includes(mot)) return true
        if (normaliser(calculMental.theme).includes(mot)) return true
      }
    }
    if (ligne.questionsFlash.length > 0) {
      for (const questionFlash of ligne.questionsFlash) {
        if (normaliser(questionFlash.reference).includes(mot)) return true
        if (normaliser(questionFlash.titre).includes(mot)) return true
        if (normaliser(questionFlash.theme).includes(mot)) return true
      }
    }
    return false
  }

  function clicFiltre (niveau: string, periode?: number) {
    if (niveau !== '') filtre.niveau = niveau
    if (periode !== undefined) {
      filtre.periode === periode
        ? (filtre.periode = 0)
        : (filtre.periode = periode)
    }
  }
</script>

<svelte:head>
  <title>Progressions - topmaths</title>
</svelte:head>

<div class="w-screen max-w-screen-lg">
  <div class="centre">
    <LevelsTabsMenu
      activeLevelTab={filtre.niveau}
      onLevelsTabsMenuClicked={clicFiltre}
    />
    <div class="flex justify-center pt-2 pb-1" style="overflow:auto">
      <button
        class="button rounded-3xl py-1 px-5 is-link mb-5 mx-1 text-sm md:text-2xl"
        class:is-light={filtre.periode !== null &&
          filtre.periode !== undefined &&
          filtre.periode > 0}
        on:click={() => clicFiltre('', 0)}>Période</button
      >
      {#each [1, 2, 3, 4, 5] as periode}
        <button
          class="button rounded-3xl py-1 px-5 is-link mb-5 mx-1 text-sm md:text-2xl"
          class:is-light={filtre.periode !== periode}
          on:click={() => clicFiltre('', periode)}>{periode}</button
        >
      {/each}
    </div>
    <input
      class="p-1 text-center text-sm md:text-2xl"
      type="text"
      aria-describedby="Champ pour rechercher un objectif ou une séquence"
      autocomplete="off"
      placeholder="Recherche"
      bind:value={$texteRecherche}
      on:input
    />
    {#if $modeEnseignant}
    <label class="absolute mt-2 ml-2 text-xs md:text-base">
      <input type="checkbox" bind:checked={$titresProchesDesAttendus} />
        Intitulés proches des attendus de fin d'année
    </label>
    {/if}
    <div class="centre p-6 text-base">
      {#each $lignesFiltreesSequencesNormales as ligne, i}
        {#if ligne.periode !== 0 && ((i === 0 && (filtre.periode === 0 || filtre.periode === ligne.periode) && (filtre.niveau === 'tout' || filtre.niveau === ligne.niveau)) || (i > 0 && $lignesFiltreesSequencesNormales[i].periode !== $lignesFiltreesSequencesNormales[i - 1].periode && ligne.niveau !== 'fin' && (filtre.niveau === 'tout' || filtre.niveau === ligne.niveau) && (filtre.periode === 0 || filtre.periode === ligne.periode)))}
          <h2 class="subtitle text-xl md:text-3xl pt-2 is-{ligne.niveau}">
            <span class="has-text-white">
              Période {ligne.periode}
            </span>
          </h2>
          <div class="m-3">
            <div class="columns p-1 is-{ligne.niveau} is-size-5" style="border-bottom: 1px solid; border-left: 1px solid; border-right: 1px solid; border-color: var(--base{ligne.niveau});">
              <div class="column is-narrow" style="width: 150px;">
                <h3>Séquence</h3>
              </div>
              <div class="column">
                <h3>Objectifs</h3>
              </div>
              <div class="column is-4">
                <h3>Questions Flash</h3>
              </div>
              <div class="column is-3">
                <h3>Calcul Mental</h3>
              </div>
            </div>
          </div>
        {/if}
        <div>
          {#if ligne.niveau !== '' && ligne.niveau !== 'fin' && ligne.reference === '' && (filtre.niveau === 'tout' || filtre.niveau === ligne.niveau)}
            <h1 class="title text-2xl md:text-4xl font-semibold p-2 is-{ligne.niveau}">
              <span class="text-white">
                {ligne.niveau}
              </span>
            </h1>
          {/if}
          {#if ligne.reference !== '' && ligne.niveau !== 'fin' && filtre.periode !== null && (ligne.periode === filtre.periode || filtre.periode === 0 || filtre.periode === 0) && (filtre.niveau === 'tout' || filtre.niveau === ligne.niveau)}
            <div
              class="is-{ligne.niveau}"
              class:is-fin={i < $lignesSequencesNormales.length && ((filtre.periode > 0 && $lignesSequencesNormales[i].periode !== $lignesSequencesNormales[i + 1].periode) || $lignesSequencesNormales[i + 1].niveau === 'fin')}
            >
              <div class="m-3">
                <div class="columns is-{ligne.niveau} flex" style="border-bottom: 1px solid; border-left: 1px solid; border-right: 1px solid;  border-color: var(--base{ligne.niveau});"
                class:is-fin={i < $lignesSequencesNormales.length && ((filtre.periode > 0 && $lignesSequencesNormales[i].periode !== $lignesSequencesNormales[i + 1].periode) || $lignesSequencesNormales[i + 1].niveau === 'fin')}>
                  <!-- Séquence -->
                  <div class="column is-narrow flex self-center flex-col justify-center" style="width: 150px;">
                    <a
                      href="/?v=sequence&ref={ligne.reference}"
                      on:click={(event) => goVue(event, 'sequence', ligne.reference)}
                      class="colorless"
                    >
                    <div>Séquence {ligne.numero}</div>
                    </a>
                    <br>
                    {ligne.titre}
                  </div>
                  <!-- Objectifs -->
                  <div class="column is-4 flex flex-col">
                    {#each ligne.objectifs as objectif}
                    <div class="columns is-theme-{getTheme(objectif.reference)} flex-grow">
                      <div class="column is-narrow flex self-center justify-center">
                        <a
                          href="/?v=objectif&ref={objectif.reference}"
                          on:click={(event) => goVue(event, 'objectif', objectif.reference)}
                          class="colorless"
                        >
                        <div>{objectif.reference}</div>
                        </a>
                      </div>
                      <div class="column flex self-center justify-center">
                        <div>
                          {$titresProchesDesAttendus || objectif.titreSimplifie === '' ? objectif.titre : objectif.titreSimplifie}
                        </div>
                      </div>
                    </div>
                    {/each}
                  </div>
                  {#if ligne.calculsMentaux[0] !== undefined && ligne.calculsMentaux[0].reference !== ''}
                    <!-- Questions Flash -->
                    <div class="column is-4 flex flex-col">
                      {#each ligne.questionsFlash as questionFlash, i}
                        {#if questionFlash.reference !== '' && questionFlash.reference !== '' && (i === 0 || ligne.questionsFlash[i].reference !== ligne.questionsFlash[i - 1].reference)}
                          <div class="columns is-theme-{getTheme(questionFlash.reference)} flex flex-grow">
                            <div class="column is-narrow flex self-center justify-center">
                              <a
                                href="/?v=objectif&ref={questionFlash.reference}"
                                on:click={(event) => goVue(event, 'objectif', questionFlash.reference)}
                                class="colorless"
                              >
                                <div>{questionFlash.reference}</div>
                              </a>
                            </div>
                            <div class="column flex self-center justify-center">
                              {$titresProchesDesAttendus || questionFlash.titreSimplifie === '' ? questionFlash.titre : questionFlash.titreSimplifie}
                            </div>
                          </div>
                        {/if}
                      {/each}
                    </div>
                    <!-- Calcul Mental -->
                    <div class="column flex flex-col">
                      {#each ligne.calculsMentaux as calculMental}
                        {#if calculMental.reference !== '' && calculMental.reference !== ''}
                          <div class="columns is-theme-{getTheme(calculMental.reference)} flex-grow"
                          style="{i < $lignesSequencesNormales.length && ((filtre.periode > 0 && $lignesSequencesNormales[i].periode !== $lignesSequencesNormales[i + 1].periode) || $lignesSequencesNormales[i + 1].niveau === 'fin') ? 'border-radius: 0px 0px 50px 0px;' : ''}">
                            <div class="column is-narrow flex self-center justify-center">
                              <a
                                href="/?v=objectif&ref={calculMental.reference}"
                                on:click={(event) => goVue(event, 'objectif', calculMental.reference)}
                                class="colorless"
                              >
                              <div>{calculMental.reference}</div>
                              </a>
                            </div>
                            <div class="column flex self-center justify-center">
                              <div>
                                {$titresProchesDesAttendus || calculMental.titreSimplifie === '' ? calculMental.titre : calculMental.titreSimplifie}
                              </div>
                            </div>
                          </div>
                        {/if}
                      {/each}
                    </div>
                  {:else if ligne.calculsMentaux[0] !== undefined && ligne.calculsMentaux[0].exercices[0] !== undefined && ligne.calculsMentaux[0].exercices[0].description !== ''}
                  <div class="column flex self-center justify-self-center justify-center">
                    <div
                      contenteditable="false"
                      bind:innerHTML={ligne.calculsMentaux[0].exercices[0].description}
                    ></div>
                  </div>
                  {/if}
                </div>
              </div>
            </div>
          {/if}
        </div>
        {#if ligne.niveau === 'fin' && filtre.niveau === 'tout'}
          <div><br /></div>
        {/if}
      {/each}
    </div>
  </div>
</div>

<style>
.is-theme-nombres {
  background-color: #f8c8c0;
}
.is-theme-gestion {
  background-color: #c6b9e7;
}
.is-theme-grandeurs {
  background-color: #ffddaf;
}
.is-theme-geo {
  background-color: #aff2ff;
}
a {
  font-weight: 500;
  text-decoration: underline;
  text-decoration-color: var(--colorless);
}
</style>
