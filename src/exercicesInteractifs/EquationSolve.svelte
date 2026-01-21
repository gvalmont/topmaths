<script>
  import katex from 'katex'
  import { ChangeTypes } from 'mathsteps'
  import { afterUpdate } from 'svelte'
  import HeaderExerciceVueProf from '../components/shared/exercice/shared/headerExerciceVueProf/HeaderExerciceVueProf.svelte'
  import CheckboxWithLabel from '../components/shared/forms/CheckboxWithLabel.svelte'
  import InputText from '../components/shared/forms/InputText.svelte'
  import SelectMultiple from '../components/shared/forms/SelectMultiple.svelte'
  import SelectUnique from '../components/shared/forms/SelectUnique.svelte'
  import Exercice from '../exercices/Exercice'
  import { loadMathLive } from '../modules/loaders'
  import { resoudre } from '../modules/outilsMathjs'

  export let indiceExercice
  export let indiceLastExercice

  export const titre = "Test du solveur d'équations"
  // Cette ressource n'a pas d'uuid ou de ref
  // Son accès est défini dans uuidsRessources.json

  const headerExerciceProps = {
    title: '',
    isInteractif: false,
    settingsReady: false,
    interactifReady: false,
    randomReady: false,
    correctionReady: false,
  }

  const exercice = new Exercice()
  exercice.id = 'EquationSolve'
  exercice.numeroExercice = indiceExercice
  exercice.interactif = true

  // Objet d’options bindé aux champs
  let options = {
    comment: false,
    color: '#ff0000',
    comments: {},
    reduceSteps: false,
    formatSolution: 'decimal',
    substeps: false,
    changeType: [],
    produitsencroix: false,
    verifications: false,
    variables: {},
  }

  // Quelques exemples prédéfinis
  const exemples = [
    { label: 'Choisis un exemple...', value: '' },
    { label: '2x + 5 = 15', value: '2x+5=15' },
    { label: '3x - 7 = 11', value: '3x-7=11' },
    { label: 'x/2 + 4 = 10', value: 'x/2+4=10' },
    { label: '5(x - 1) = 20', value: '5(x-1)=20' },
    { label: '5x - 8 = 10x + 7', value: '5x - 8 = 10x + 7' },
    { label: '5x - 8 >= 8x + 7', value: '5x - 8 >= 8x + 7' },
    { label: '5x - 8 = 10x + 4', value: '5x - 8 = 10x + 4' },
    { label: '5x - 8 >= 10x + 4', value: '5x - 8 >= 10x + 4' },
    { label: '5(x - 8) >= 10x + 7', value: '5(x - 8) >= 10x + 7' },
    { label: '5(x - 8) >= 8x + 7', value: '5(x - 8) >= 8x + 7' },
    { label: '5/x = 7/3', value: '5/x = 7/3' },
    { label: '5/x + 4 = 7/3', value: '5/x + 4 = 7/3' },
  ]

  let types = Object.values(ChangeTypes).sort((a, b) => a.localeCompare(b))
  const typesOptions = types.map((t) => ({ label: t, value: t }))

  const formatSolutionOptions = [
    { label: 'decimal', value: 'decimal' },
    { label: 'fraction', value: 'fraction' },
    { label: '2 (base n°)', value: '2' },
    { label: '5 (base n°)', value: '5' },
  ]

  function handleTypesChange(event) {
    options.changeType = event.detail
  }

  let saisie = ''
  let resultat1 = ''
  let resultat2 = ''

  function choisirExemple(event) {
    const value = event.detail
    if (value) {
      saisie = value // ⬅️ ça remplace la variable
    }
  }

  function valider() {
    const resu = resoudre(saisie, options)
    resultat1 = katex.renderToString(resu.equation)
    resultat2 = katex.renderToString(
      `\\begin{aligned}\n${resu.printSteps.join('\\\\\n')}\n\\end{aligned}`,
    )
    // resultat2 = katex.renderToString(resu.texteCorr);
  }

  afterUpdate(() => {
    loadMathLive()
  })
</script>

<div class="text-coopmaths-corpus dark:text-coopmathsdark-corpus">
  <HeaderExerciceVueProf
    {indiceExercice}
    {indiceLastExercice}
    id="EquationSolve"
    {...headerExerciceProps}
  />

  <br />
  <form
    on:submit|preventDefault={valider}
    style="display:flex; gap:0.5rem; align-items:center;"
  >
    <InputText
      inputID="equation-solve-saisie"
      bind:value={saisie}
      placeholder="Tape quelque chose…"
      showTitle={false}
    />
    <button type="submit" disabled={!saisie.trim()}> Valider </button>
  </form>
  <!-- Liste déroulante d'exemples -->
  <label>
    Exemple :
    <SelectUnique
      id="equation-solve-exemple"
      value=""
      options={exemples}
      on:change={choisirExemple}
    />
  </label>
  <!-- Options -->
  <h3>Options de résolution</h3>
  <div
    style="display:grid; grid-template-columns: 1fr 1fr; gap:0.5rem; max-width:600px;"
  >
    <CheckboxWithLabel
      id="equation-solve-comment"
      bind:isChecked={options.comment}
      label="comment"
    />

    <label>
      Couleur : <input type="color" bind:value={options.color} />
    </label>

    <CheckboxWithLabel
      id="equation-solve-reduceSteps"
      bind:isChecked={options.reduceSteps}
      label="reduceSteps"
    />

    <label>
      formatSolution :
      <SelectUnique
        id="equation-solve-formatSolution"
        bind:value={options.formatSolution}
        options={formatSolutionOptions}
      />
    </label>

    <CheckboxWithLabel
      id="equation-solve-substeps"
      bind:isChecked={options.substeps}
      label="substeps"
    />

    <label>
      changeType (séparés par ,) :
      <InputText
        inputID="equation-solve-changeType-text"
        showTitle={false}
        on:input={(e) =>
          (options.changeType = e.detail.currentTarget.value
            .split(',')
            .map((x) => x.trim())
            .filter(Boolean))}
      />
    </label>

    <label>
      changeType (sélection multiple) :
      <SelectMultiple
        id="equation-solve-changeType"
        size={4}
        value={options.changeType}
        options={typesOptions}
        on:change={handleTypesChange}
      />
    </label>

    <CheckboxWithLabel
      id="equation-solve-produitsencroix"
      bind:isChecked={options.produitsencroix}
      label="produitsencroix"
    />

    <CheckboxWithLabel
      id="equation-solve-verifications"
      bind:isChecked={options.verifications}
      label="verifications"
    />
  </div>

  <!-- Affichage du résultat -->
  <section style="margin-top:1rem;">
    <h3 style="margin:0 0 .25rem 0;">Equation :</h3>
    <div style="padding:.5rem; border:1px solid #ddd; border-radius:.5rem;">
      {@html resultat1}
    </div>

    <!-- Si tu veux interpréter la saisie comme du HTML, utilise {@html} -->
    <!-- ⚠️ Attention : n'utilise pas {@html} avec du contenu non fiable (XSS). -->
    <h3 style="margin:.75rem 0 .25rem 0;">Résolution :</h3>
    <div style="padding:.5rem; border:1px solid #ddd; border-radius:.5rem;">
      {@html resultat2}
    </div>
  </section>
</div>
