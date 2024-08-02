<script lang="ts">
  import { isTeacherMode, units, isTitleAcademicPreferred } from '../../services/store'
  import { normalize } from '../../services/shared'
  import { buildThemeFromReference } from '../../services/reference'
  import { goToView } from '../../services/navigation'
  import { writable, derived } from 'svelte/store'
  import type { UnitMentalCalculation, UnitObjective, UnitFlashQuestion, Unit } from '../../types/unit'
  import LevelsTabsMenu from '../shared/LevelsTabsMenu.svelte'
  import type { LineGrade } from '../../types/grade'

  interface Ligne {
    grade: LineGrade
    period: number
    number: number
    reference: string
    title: string
    objectives: UnitObjective[]
    flashQuestions: UnitFlashQuestion[]
    mentalCalculations: UnitMentalCalculation[]
  }

  const filtre = {
    grade: 'all',
    period: 0,
    number: 0,
    reference: '',
    title: '',
    objectives: [],
    flashQuestions: [],
    mentalCalculations: []
  } as Ligne
  const texteRecherche = writable<string>('')
  const lignesFiltreesSequencesNormales = derived(
    [texteRecherche, units],
    ([$texteRecherche, $units]) =>
      getLignesFiltrees($texteRecherche, $units)
  )

  function getLignesFiltrees (texteRecherche: string, lignes: Unit[]): Ligne[] {
    if (texteRecherche === '') return lignes
    const motsCherches = normalize(texteRecherche).split(' ')
    return lignes.filter((ligne) => {
      for (const mot of motsCherches) {
        if (!motTrouve(mot, ligne)) return false
      }
      return true
    })
  }

  function motTrouve (mot: string, ligne: Ligne) {
    if (
      ligne.grade !== '' &&
      normalize(ligne.grade).includes(mot)
    ) { return true }
    if (
      ligne.number !== 0 &&
      normalize(ligne.number.toString()).includes(mot)
    ) { return true }
    if (
      ligne.reference !== '' &&
      normalize(ligne.reference).includes(mot)
    ) { return true }
    if (
      ligne.title !== '' &&
      normalize(ligne.title).includes(mot)
    ) { return true }
    if (ligne.objectives.length > 0) {
      for (const objectif of ligne.objectives) {
        if (normalize(objectif.reference).includes(mot)) return true
        if (normalize(objectif.titleAcademic).includes(mot)) return true
        if (normalize(objectif.title).includes(mot)) return true
        if (normalize(objectif.theme).includes(mot)) return true
      }
    }
    if (ligne.mentalCalculations.length > 0) {
      for (const calculMental of ligne.mentalCalculations) {
        if (normalize(calculMental.reference).includes(mot)) return true
        if (normalize(calculMental.titleAcademic).includes(mot)) return true
        if (normalize(calculMental.theme).includes(mot)) return true
      }
    }
    if (ligne.flashQuestions.length > 0) {
      for (const questionFlash of ligne.flashQuestions) {
        if (normalize(questionFlash.reference).includes(mot)) return true
        if (normalize(questionFlash.titleAcademic).includes(mot)) return true
        if (normalize(questionFlash.theme).includes(mot)) return true
      }
    }
    return false
  }

  function clicFiltre (niveau: LineGrade, period?: number) {
    if (niveau !== '') filtre.grade = niveau
    if (period !== undefined) {
      filtre.period === period
        ? (filtre.period = 0)
        : (filtre.period = period)
    }
  }
</script>

<svelte:head>
  <title>Progressions - topmaths</title>
</svelte:head>

<div class="text-center">
  <LevelsTabsMenu
    activeLevelTab={filtre.grade}
    onLevelsTabsMenuClicked={clicFiltre}
  />
  <div class="flex justify-center pt-2 pb-1" style="overflow:auto">
    <button
      class="button rounded-3xl py-1 px-5 is-link mb-5 mx-1 text-sm md:text-2xl"
      class:is-light={filtre.period !== null &&
        filtre.period !== undefined &&
        filtre.period > 0}
      on:click={() => clicFiltre('', 0)}>Période</button
    >
    {#each [1, 2, 3, 4, 5] as periode}
      <button
        class="button rounded-3xl py-1 px-5 is-link mb-5 mx-1 text-sm md:text-2xl"
        class:is-light={filtre.period !== periode}
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
  {#if $isTeacherMode}
  <label class="absolute mt-2 ml-2 text-xs md:text-base">
    <input type="checkbox" bind:checked={$isTitleAcademicPreferred} />
      Intitulés proches des attendus de fin d'année
  </label>
  {/if}
  <div class="text-center p-6 text-base">
    {#each $lignesFiltreesSequencesNormales as ligne, i}
      {#if ligne.period !== 0 && ((i === 0 && (filtre.period === 0 || filtre.period === ligne.period) && (filtre.grade === 'all' || filtre.grade === ligne.grade)) || (i > 0 && $lignesFiltreesSequencesNormales[i].period !== $lignesFiltreesSequencesNormales[i - 1].period && ligne.grade !== 'end' && (filtre.grade === 'all' || filtre.grade === ligne.grade) && (filtre.period === 0 || filtre.period === ligne.period)))}
        <h2 class="subtitle text-xl md:text-3xl pt-2 is-{ligne.grade}">
          <span class="has-text-white">
            Période {ligne.period}
          </span>
        </h2>
        <div class="m-3">
          <div class="columns p-1 is-{ligne.grade} is-size-5" style="border-bottom: 1px solid; border-left: 1px solid; border-right: 1px solid; border-color: var(--base{ligne.grade});">
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
        {#if ligne.grade !== '' && ligne.grade !== 'end' && ligne.reference === '' && (filtre.grade === 'all' || filtre.grade === ligne.grade)}
          <h1 class="title text-2xl md:text-4xl font-semibold p-2 is-{ligne.grade}">
            <span class="text-white">
              {ligne.grade}
            </span>
          </h1>
        {/if}
        {#if ligne.reference !== '' && ligne.grade !== 'end' && filtre.period !== null && (ligne.period === filtre.period || filtre.period === 0 || filtre.period === 0) && (filtre.grade === 'all' || filtre.grade === ligne.grade)}
          <div
            class="is-{ligne.grade}"
            class:rounded-b-5xl={i < $lignesFiltreesSequencesNormales.length - 1 && ((filtre.period > 0 && $lignesFiltreesSequencesNormales[i].period !== $lignesFiltreesSequencesNormales[i + 1].period) || $lignesFiltreesSequencesNormales[i + 1].grade === 'end')}
          >
            <div class="m-3">
              <div class="columns is-{ligne.grade} flex" style="border-bottom: 1px solid; border-left: 1px solid; border-right: 1px solid;  border-color: var(--base{ligne.grade});"
              class:rounded-b-5xl={i < $lignesFiltreesSequencesNormales.length - 1 && ((filtre.period > 0 && $lignesFiltreesSequencesNormales[i].period !== $lignesFiltreesSequencesNormales[i + 1].period) || $lignesFiltreesSequencesNormales[i + 1].grade === 'end')}>
                <!-- Séquence -->
                <div class="column is-narrow flex self-center flex-col justify-center" style="width: 150px;">
                  <a
                    href="/?v=sequence&ref={ligne.reference}"
                    on:click={(event) => goToView(event, 'sequence', ligne.reference)}
                    class="colorless"
                  >
                  <div>Séquence {ligne.number}</div>
                  </a>
                  <br>
                  {ligne.title}
                </div>
                <!-- Objectifs -->
                <div class="column is-4 flex flex-col">
                  {#each ligne.objectives as objectif}
                  <div class="columns is-theme-{buildThemeFromReference(objectif.reference)} flex-grow">
                    <div class="column is-narrow flex self-center justify-center">
                      <a
                        href="/?v=objectif&ref={objectif.reference}"
                        on:click={(event) => goToView(event, 'objectif', objectif.reference)}
                        class="colorless"
                      >
                      <div>{objectif.reference}</div>
                      </a>
                    </div>
                    <div class="column flex self-center justify-center">
                      <div>
                        {$isTitleAcademicPreferred || objectif.title === '' ? objectif.titleAcademic : objectif.title}
                      </div>
                    </div>
                  </div>
                  {/each}
                </div>
                {#if ligne.mentalCalculations[0] !== undefined && ligne.mentalCalculations[0].reference !== ''}
                  <!-- Questions Flash -->
                  <div class="column is-4 flex flex-col">
                    {#each ligne.flashQuestions as questionFlash, i}
                      {#if questionFlash.reference !== '' && questionFlash.reference !== '' && (i === 0 || ligne.flashQuestions[i].reference !== ligne.flashQuestions[i - 1].reference)}
                        <div class="columns is-theme-{buildThemeFromReference(questionFlash.reference)} flex flex-grow">
                          <div class="column is-narrow flex self-center justify-center">
                            <a
                              href="/?v=objectif&ref={questionFlash.reference}"
                              on:click={(event) => goToView(event, 'objectif', questionFlash.reference)}
                              class="colorless"
                            >
                              <div>{questionFlash.reference}</div>
                            </a>
                          </div>
                          <div class="column flex self-center justify-center">
                            {$isTitleAcademicPreferred || questionFlash.title === '' ? questionFlash.titleAcademic : questionFlash.title}
                          </div>
                        </div>
                      {/if}
                    {/each}
                  </div>
                  <!-- Calcul Mental -->
                  <div class="column flex flex-col">
                    {#each ligne.mentalCalculations as calculMental}
                      {#if calculMental.reference !== '' && calculMental.reference !== ''}
                        <div class="columns is-theme-{buildThemeFromReference(calculMental.reference)} flex-grow"
                        style="{i < $units.length && ((filtre.period > 0 && $units[i].term !== $units[i + 1].term) || $lignesFiltreesSequencesNormales[i + 1].grade === 'end') ? 'border-radius: 0px 0px 50px 0px;' : ''}">
                          <div class="column is-narrow flex self-center justify-center">
                            <a
                              href="/?v=objectif&ref={calculMental.reference}"
                              on:click={(event) => goToView(event, 'objectif', calculMental.reference)}
                              class="colorless"
                            >
                            <div>{calculMental.reference}</div>
                            </a>
                          </div>
                          <div class="column flex self-center justify-center">
                            <div>
                              {$isTitleAcademicPreferred || calculMental.title === '' ? calculMental.titleAcademic : calculMental.title}
                            </div>
                          </div>
                        </div>
                      {/if}
                    {/each}
                  </div>
                {:else if ligne.mentalCalculations[0] !== undefined && ligne.mentalCalculations[0].exercises[0] !== undefined && ligne.mentalCalculations[0].exercises[0].description !== ''}
                <div class="column flex self-center justify-self-center justify-center">
                  <div
                    contenteditable="false"
                    bind:innerHTML={ligne.mentalCalculations[0].exercises[0].description}
                  ></div>
                </div>
                {/if}
              </div>
            </div>
          </div>
        {/if}
      </div>
      {#if ligne.grade === 'end' && filtre.grade === 'all'}
        <div><br /></div>
      {/if}
    {/each}
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
