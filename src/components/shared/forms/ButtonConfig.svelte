<script lang="ts">
  import Latex, { type LatexFileInfos } from '../../../lib/Latex'
  import ButtonCompileLatexToPDF from '../../shared/forms/ButtonCompileLatexToPDF.svelte'

  export let latex: Latex
  export let latexFileInfos: LatexFileInfos

  let selectedExos: string[] = [] // exos sélectionnés pour appliquer config globale
  let globalConfig = {
    labels: '',
    itemsep: 1,
    blocrep: { enabled: false, nbligs: 5, nbcols: 1 }
  }

  /**
   * Affiche ou ferme si déjà ouvert le code Latex dans une boite de dialogue
   */
  async function dialogConfigToDisplayToggle() {
    const dialog = document.getElementById('configLatex') as HTMLDialogElement
    if (dialog.open) {
      dialog.close()
    } else {
      dialog.showModal()
    }
  }

  function applyGlobalConfig() {
    latexFileInfos.exos = latexFileInfos.exos || {}
    for (const idx of selectedExos) {
      const exoConfig: any = {
        labels: globalConfig.labels,
        itemsep: globalConfig.itemsep
      }

      if (globalConfig.blocrep?.enabled) {
        exoConfig.blocrep = {
          nbligs: globalConfig.blocrep.nbligs,
          nbcols: globalConfig.blocrep.nbcols
        }
      }
      latexFileInfos.exos[idx] = {
        ...latexFileInfos.exos[idx],
        ...exoConfig
      }
    }
  }

  function resetExo(idx: string) {
    if (latexFileInfos.exos) {
      delete latexFileInfos.exos[idx]
    }
  }

  function cancelAllChanges() {
    // Réinitialise toutes les configurations des exercices
    latexFileInfos.exos = {};
    selectedExos = [];
    globalConfig = {
      labels: '',
      itemsep: 1,
      blocrep: { enabled: false, nbligs: 5, nbcols: 1 }
    };
  }
</script>



<form
  class="{`${$$props.class || 'flex flex-col md:flex-row mx-4 pb-4 md:pb-8 md:space-x-4 space-y-3 justify-center md:justify-start items-center'}`}"
  target="_blank"
>
  <button
    id="btn_config"
    type="submit"
    on:click|preventDefault="{dialogConfigToDisplayToggle}"
    class="px-2 py-1 rounded-md text-coopmaths-canvas dark:text-coopmathsdark-canvas bg-coopmaths-action hover:bg-coopmaths-action-lightest dark:bg-coopmathsdark-action dark:hover:bg-coopmathsdark-action-lightest"
  >
    Paramétrer
  </button>
</form>

<dialog
  class="fixed rounded-xl p-6 bg-coopmaths-canvas text-coopmaths-corpus left-[2%] top-[2%] w-[96%] h-[96%] dark:bg-coopmathsdark-canvas-dark dark:text-coopmathsdark-corpus-light shadow-lg"
  id="configLatex"
>
<div class="mt-3 text-center">
    <div class="text-3xl font-medium text-coopmaths-warn-dark">
      <span class="header">
        <div class="absolute top-2 right-3">
          <button
            type="button"
            on:click="{() => {
              dialogConfigToDisplayToggle()
            }}"
          >
            <i
              class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest text-xl bx bx-x"
            ></i>
          </button>
        </div>
      </span>
    </div>

    <!-- Config globale -->
    <section class="mb-6 border rounded-lg p-4 bg-gray-50 mx-auto">
      <h3 class="text-lg font-semibold mb-3 text-center">Configuration globale des exercices</h3>
      <div class="flex flex-col gap-3 items-start">
        <label class="flex flex-col w-full text-left">
          Numérotation des questions
          <select bind:value={globalConfig.labels} class="mt-1 border rounded px-2 py-1 w-full">
            <option value="">(aucune)</option>
            <option value="\alph*)">a, b, c, ...</option>
            <option value="\Alph*)">A, B, C, ...</option>
            <option value="\roman*)">i, ii, iii, ...</option>
            <option value="\Roman*)">I, II, III, ...</option>
            <option value="\arabic*)">1, 2, 3, ...</option>
          </select>
        </label>

        <label class="flex flex-col w-full text-left">
          Espace entre les questions
          <input type="number" min="1" max="50" bind:value={globalConfig.itemsep} 
                class="mt-1 border rounded px-2 py-1 w-24" />
        </label>

        <fieldset class="flex flex-col gap-4 w-full">
          <legend class="text-left font-medium">Bloc réponse</legend>

          <!-- Checkbox activation -->
          <label class="flex flex-row items-center gap-2">
            <input 
              type="checkbox" 
              bind:checked={globalConfig.blocrep.enabled} 
              class="h-4 w-4"
            />
            <span>Activer le bloc réponse</span>
          </label>

          <!-- Zone inputs (grisée si désactivée) -->
          <div class:opacity-50={!globalConfig.blocrep.enabled} class:cursor-not-allowed={!globalConfig.blocrep.enabled} class:pointer-events-none={!globalConfig.blocrep.enabled}>
            <label class="flex flex-row items-center gap-2 w-full">
              <span class="w-32 text-left">Nb de lignes</span>
              <input 
                type="number" 
                min="1" 
                bind:value={globalConfig.blocrep.nbligs} 
                class="border rounded px-2 py-1 w-20" 
              />
            </label>

            <label class="flex flex-row items-center gap-2 w-full mt-2">
              <span class="w-32 text-left">Nb de colonnes</span>
              <input 
                type="number" 
                min="1" 
                bind:value={globalConfig.blocrep.nbcols} 
                class="border rounded px-2 py-1 w-20" 
              />
            </label>
          </div>
        </fieldset>

        <label class="flex flex-col w-full">
          Appliquer aux exercices :
          <select multiple bind:value={selectedExos} 
                  class="mt-1 border rounded px-2 py-1 h-24 w-full">
            {#each latex.getExercices() as exo}
              <option value={exo.index}>{exo.index} - {exo.titre}</option>
            {/each}
          </select>
        </label>
      </div>
      <!-- boutons d'action -->
      <!-- Conteneur des boutons -->
      <div class="pt-4 flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-start">
        <button
          type="button"
          on:click={applyGlobalConfig}
          class="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-500"
        >
          Appliquer
        </button>

        <button
          type="button"
          class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          on:click={cancelAllChanges}
        >
          Annuler les changements
        </button>

        <ButtonCompileLatexToPDF
          class="px-4 py-2 rounded-lg pt-2 flex gap-3 bg-coopmaths-action"
          {latex}
          {latexFileInfos}
          id="1"
        />
      </div>
    </section>


    <section class="mb-6 border rounded-lg p-4 bg-gray-50 mx-auto">
      <h3 class="text-lg font-semibold mb-3">Configuration individuelle des exercices</h3>
          {#each latex.getExercices() as exo}
            <fieldset style="margin-top:1rem; border-radius:0.5rem; padding:0.5rem; border:1px solid #ccc;">
              <legend>Exo : {exo.index}</legend>
              <legend>Titre: {exo.titre}</legend>
              <legend>Uuid:{exo.uuid}</legend>
              <label class="flex flex-col text-left">
                Numération des questions
                <select value={latexFileInfos.exos?.[exo.index]?.labels} on:change={(e) => {
                  // Crée l'objet exo si inexistant
                  latexFileInfos.exos = latexFileInfos.exos || {}
                  latexFileInfos.exos[exo.index] = latexFileInfos.exos[exo.index] || {}
                  // @ts-ignore
                  const select = e.target.value
                  latexFileInfos.exos[exo.index].labels = select || undefined
                }}>
                  <option value="">(aucune)</option>
                  <option value="\alph*)">\alph* : a, b, c, ...</option>
                  <option value="\Alph*)">\Alph* : A, B, C, ...</option>
                  <option value="\roman*)">\roman* : i, ii, iii, ...</option>
                  <option value="\Roman*)">\Roman* : I, II, III, ...</option>
                  <option value="\arabic*)">\arabic* : 1, 2, 3, ...</option>
                </select>
              </label>
              <label class="flex flex-col text-left">
                Espace entre les questions
                <input
                  type="number"
                  class="mt-1 border rounded px-2 py-1 w-24"
                  min="0"
                  max="50"
                  on:input={e => {
                    latexFileInfos.exos = latexFileInfos.exos || {};
                    latexFileInfos.exos[exo.index] = latexFileInfos.exos[exo.index] || {};
                    // Récupère la valeur tapée
                    // @ts-ignore
                    let val = e.target.value

                    // Force les bornes
                    if (val < 0) val = 0
                    if (val > 50) val = 50
                    if (latexFileInfos.exos[exo.index] !== undefined) {
                      latexFileInfos.exos[exo.index].itemsep = val
                    }
                  }}
                  value={latexFileInfos.exos?.[exo.index]?.itemsep ?? ''}
                />
              <fieldset>
                <legend>Bloc réponse</legend>
                <label>
                  Nb de lignes
                  <input
                    type="number"
                    class="mt-1 border rounded px-2 py-1 w-24"
                    on:input={e => {
                      latexFileInfos.exos = latexFileInfos.exos || {};
                      latexFileInfos.exos[exo.index] = latexFileInfos.exos[exo.index] || {};
                      latexFileInfos.exos[exo.index].blocrep = latexFileInfos.exos[exo.index].blocrep || { nbligs: 1, nbcols: 1 };  
                      if (latexFileInfos.exos[exo.index].blocrep?.nbligs !== undefined) {
                        // @ts-ignore
                        latexFileInfos.exos[exo.index].blocrep.nbligs = +e.target.value;
                      }
                    }}
                    value={latexFileInfos.exos?.[exo.index]?.blocrep?.nbligs ?? ''}
                  />
                </label>
                <label>
                  Nb de colonnes
                  <input type="number"
                  class="mt-1 border rounded px-2 py-1 w-24"
                  on:input={e => {
                      latexFileInfos.exos = latexFileInfos.exos || {};
                      latexFileInfos.exos[exo.index] = latexFileInfos.exos[exo.index] || {};
                      latexFileInfos.exos[exo.index].blocrep = latexFileInfos.exos[exo.index].blocrep || { nbligs: 1, nbcols: 1 };
                      if (latexFileInfos.exos[exo.index].blocrep?.nbcols !== undefined) {
                        // @ts-ignore
                        latexFileInfos.exos[exo.index].blocrep.nbcols = +e.target.value;
                      }
                    }}
                    value={latexFileInfos.exos?.[exo.index]?.blocrep?.nbcols ?? ''}
                  />
              </fieldset>
            </fieldset>
          {/each}
      </section>
    
      <!-- Card JSON -->
      <div class="w-full mt-6 p-4 border rounded-2xl shadow bg-gray-50">
        <h2 class="text-lg font-bold mb-3">Aperçu JSON</h2>
        <pre class="bg-gray-900 text-green-200 p-3 text-left rounded-lg text-sm overflow-x-auto max-h-80">{JSON.stringify(latexFileInfos.exos, null, 2)}
        </pre>
      </div>
  </div>
</dialog>
