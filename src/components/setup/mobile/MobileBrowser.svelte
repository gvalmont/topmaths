<script lang="ts">
  import {
    endingLabel,
    endingReference,
    mobileMenuSections,
    nodeLabel,
    resolveNode,
    splitChildren,
  } from '../../../lib/components/mobileMenu'
  import { exercicesParams } from '../../../lib/stores/generalStore'
  import { getLang } from '../../../lib/stores/languagesStore'
  import {
    isExerciceItemInReferentiel,
    isTool,
    type JSONReferentielEnding,
    type ReferentielInMenu,
  } from '../../../lib/types/referentiels'
  import MobileCarouselCards from '../start/presentationalComponents/carousel/MobileCarouselCards.svelte'
  import MobileTile from './MobileTile.svelte'

  /**
   * Navigation par tuiles de la vue mobile.
   *
   * Le chemin courant (`path`) est composé de l'identifiant de la rubrique
   * (`college`, `lycee`), puis de l'identifiant du niveau, puis des clés
   * successives dans le référentiel associé à ce niveau.
   */
  type Props = {
    path: string[]
    referentiels: ReferentielInMenu[]
    navigate: (path: string[]) => void
    addExercise: (ending: JSONReferentielEnding) => void
  }

  const { path, referentiels, navigate, addExercise }: Props = $props()

  const lang = getLang()

  const section = $derived(mobileMenuSections.find((s) => s.id === path[0]))
  const entry = $derived(section?.entries.find((e) => e.id === path[1]))
  const node = $derived(
    entry === undefined
      ? undefined
      : resolveNode(referentiels, entry.referentiel, [
          ...entry.path,
          ...path.slice(2),
        ]),
  )
  const children = $derived(splitChildren(node))

  /**
   * Compte le nombre de fois où une ressource est déjà dans la sélection.
   * Les exercices MathALÉA et les outils sont distingués par leur `id` car
   * plusieurs références peuvent partager un même `uuid`.
   */
  function selectedCount(ending: JSONReferentielEnding): number {
    return $exercicesParams.filter((item) => {
      if (item.uuid !== ending.uuid) return false
      if (isExerciceItemInReferentiel(ending) || isTool(ending)) {
        return item.id === ending.id
      }
      return true
    }).length
  }
</script>

{#if path.length === 0}
  <!-- Accueil : actualités puis choix de la rubrique -->
  {#if lang === 'fr-FR'}
    <MobileCarouselCards />
  {/if}
  <div class="flex flex-col gap-3 p-4">
    {#each mobileMenuSections as menuSection (menuSection.id)}
      <MobileTile
        size="large"
        title={menuSection.title}
        subtitle={menuSection.subtitle}
        icon={menuSection.icon}
        onclick={() => navigate([menuSection.id])}
      />
    {/each}
  </div>
{:else if path.length === 1}
  <!-- Niveaux de la rubrique choisie -->
  <div class="flex flex-col gap-3 p-4">
    {#each section?.entries ?? [] as menuEntry (menuEntry.id)}
      <MobileTile
        title={menuEntry.title}
        onclick={() => navigate([...path, menuEntry.id])}
      />
    {/each}
  </div>
{:else}
  <!-- Thèmes, sous-thèmes puis exercices -->
  <div class="flex flex-col gap-3 p-4">
    {#each children.categories as key (key)}
      <MobileTile
        title={nodeLabel(key)}
        onclick={() => navigate([...path, key])}
      />
    {/each}
    {#if children.endings.length !== 0}
      <ul
        class="flex flex-col rounded-xl overflow-hidden
        border border-coopmaths-canvas-darkest dark:border-coopmathsdark-canvas-darkest
        divide-y divide-coopmaths-canvas-darkest dark:divide-coopmathsdark-canvas-darkest"
      >
        {#each children.endings as [key, ending] (key)}
          {@const count = selectedCount(ending)}
          <li>
            <button
              type="button"
              onclick={() => addExercise(ending)}
              class="w-full flex flex-row items-center justify-between gap-3 px-4 py-3 text-left
              bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark
              active:bg-coopmaths-canvas-darkest dark:active:bg-coopmathsdark-canvas-darkest
              transition-colors duration-150"
            >
              <div
                class="min-w-0 text-coopmaths-corpus dark:text-coopmathsdark-corpus"
              >
                {#if endingReference(ending)}
                  <span
                    class="font-bold text-coopmaths-struct dark:text-coopmathsdark-struct"
                    >{endingReference(ending)}</span
                  >
                  &nbsp;
                {/if}
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html endingLabel(ending)}
              </div>
              {#if count > 0}
                <span
                  class="shrink-0 inline-flex items-center justify-center h-6 min-w-6 px-2 rounded-full
                  bg-coopmaths-warn dark:bg-coopmathsdark-warn
                  text-coopmaths-canvas dark:text-coopmathsdark-canvas text-xs font-bold"
                >
                  {count}
                </span>
              {/if}
            </button>
          </li>
        {/each}
      </ul>
    {/if}
    {#if children.categories.length === 0 && children.endings.length === 0}
      <p
        class="py-8 text-center font-light text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-lightest"
      >
        Aucun exercice dans cette rubrique pour le moment.
      </p>
    {/if}
  </div>
{/if}
