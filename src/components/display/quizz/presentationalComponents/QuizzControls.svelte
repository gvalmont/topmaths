<script lang="ts">
  import type {
    QuizzMode,
    QuizzScoring,
    QuizzStatus,
  } from '../../../../modules/quizz/types'

  /**
   * Barre de contrôle du quizz : actions contextuelles (révéler, suivant,
   * score, recommencer) plus réglages permanents (sons, quitter).
   * En mode solo, seuls « Suivant » et les réglages sont pertinents.
   */
  export let status: QuizzStatus | null
  export let mode: QuizzMode
  export let scoring: QuizzScoring
  export let sound: boolean
  export let canGoNext: boolean
  export let onReveal: () => void
  export let onNext: () => void
  export let onLeaderboard: () => void
  export let onRestart: () => void
  export let onEdit: () => void
  export let onQuit: () => void
  export let onToggleSound: () => void

  const buttonClass =
    'px-4 py-2 rounded-xl font-bold shadow text-sm md:text-base ' +
    'text-coopmaths-canvas bg-coopmaths-action ' +
    'hover:bg-coopmaths-action-lightest ' +
    'dark:bg-coopmathsdark-action dark:hover:bg-coopmathsdark-action-lightest ' +
    'dark:text-coopmathsdark-canvas'
  const secondaryClass =
    'px-4 py-2 rounded-xl font-bold shadow text-sm md:text-base ' +
    'text-coopmaths-canvas bg-coopmaths-struct ' +
    'hover:bg-coopmaths-struct-light ' +
    'dark:bg-coopmathsdark-struct dark:hover:bg-coopmathsdark-struct-light'
</script>

<div class="fixed bottom-4 right-4 z-20 flex flex-row items-center gap-2">
  {#if status === 'SELECT_ANSWER' && mode === 'projection'}
    <button type="button" class={buttonClass} on:click={onReveal}>
      Révéler
    </button>
  {/if}
  {#if status === 'SHOW_RESULT' && mode === 'solo'}
    {#if canGoNext}
      <button type="button" class={buttonClass} on:click={onNext}>
        Suivant
      </button>
    {:else}
      <button type="button" class={buttonClass} on:click={onLeaderboard}>
        Terminer
      </button>
    {/if}
  {/if}
  {#if status === 'SHOW_RESPONSES'}
    {#if scoring !== 'none'}
      <button type="button" class={secondaryClass} on:click={onLeaderboard}>
        Score
      </button>
    {/if}
    {#if canGoNext}
      <button type="button" class={buttonClass} on:click={onNext}>
        Question suivante
      </button>
    {:else}
      <button type="button" class={buttonClass} on:click={onLeaderboard}>
        Terminer
      </button>
    {/if}
  {/if}
  {#if status === 'SHOW_LEADERBOARD' && canGoNext}
    <button type="button" class={buttonClass} on:click={onNext}>
      Question suivante
    </button>
  {/if}
  {#if status === 'FINISHED'}
    <button type="button" class={secondaryClass} on:click={onEdit}>
      Modifier le quizz
    </button>
    <button type="button" class={buttonClass} on:click={onRestart}>
      Recommencer
    </button>
  {/if}
  <button
    type="button"
    class="flex items-center justify-center h-10 w-10 rounded-xl shadow
    bg-coopmaths-canvas dark:bg-coopmathsdark-canvas
    text-coopmaths-struct dark:text-coopmathsdark-struct"
    title={sound ? 'Couper les sons' : 'Activer les sons'}
    aria-label={sound ? 'Couper les sons' : 'Activer les sons'}
    on:click={onToggleSound}
  >
    <i class="bx {sound ? 'bx-volume-full' : 'bx-volume-mute'} text-xl"></i>
  </button>
  <button
    type="button"
    class="flex items-center justify-center h-10 w-10 rounded-xl shadow
    bg-coopmaths-canvas dark:bg-coopmathsdark-canvas
    text-coopmaths-struct dark:text-coopmathsdark-struct"
    title="Quitter le quizz"
    aria-label="Quitter le quizz"
    on:click={onQuit}
  >
    <i class="bx bx-x text-2xl"></i>
  </button>
</div>
