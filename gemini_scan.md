# Svelte 5 Migration Analysis

## Overview

The project has updated its dependencies to Svelte 5 (`package.json` shows `^5.46.1`), but the codebase is predominantly using Svelte 4 syntax. While the application may run (Svelte 5 supports Svelte 4 syntax in "compatibility mode" for the most part), a full migration to Runes is required for future-proofing and performance.

## Critical Issues & "Mistakes"

### 1. `SvelteComponent` Deprecation (Partially Fixed)
The migration plan identified a blocker where `SvelteComponent` is no longer exported.
- **Status**: Fixed in `src/components/shared/exercice/Exercice.svelte` by switching to `import type { Component } from 'svelte'`.
- **Action**: Ensure all other files (like `src/lib/mathalea.ts`) are compatible with the new `Component` type.

### 2. Widespread Legacy Props Syntax (`export let`)
Almost all components still use `export let` instead of the `swvelte 5` `$props()` rune.
- **Files**: >500 occurrences.
- **Example**: `src/components/shared/forms/ButtonToggle.svelte`
  ```svelte
  export let value: boolean = true // Legacy
  ```
- **Migration**:
  ```svelte
  let { value = $bindable(true) } = $props(); // Svelte 5
  ```

### 3. Legacy Event Dispatching (`createEventDispatcher`)
Components are still using `createEventDispatcher`, which is deprecated in favor of callback props.
- **Files**: ~29 components (e.g., `src/components/shared/forms/ButtonToggle.svelte`).
- **Example**:
  ```svelte
  const dispatch = createEventDispatcher();
  dispatch('toggle'); // Legacy
  ```
- **Migration**:
  ```svelte
  let { ontoggle } = $props();
  ontoggle(); // Svelte 5
  ```

### 4. Legacy Reactivity (`$:`)
The project relies heavily on the legacy `$:` syntax for derived state and side effects.
- **Files**: ~63 occurrences.
- **Example**: `src/components/display/eleve/Eleve.svelte`
  ```svelte
  $: exerciseTitle = buildExoTitle(...) // Legacy
  ```
- **Migration**:
  ```svelte
  let exerciseTitle = $derived(buildExoTitle(...)); // Svelte 5
  ```

### 5. Legacy Lifecycle Hooks
Components use `beforeUpdate` and `afterUpdate` which are deprecated.
- **Files**: `src/components/display/eleve/Eleve.svelte`
- **Example**:
  ```svelte
  afterUpdate(() => { ... }) // Legacy
  ```
- **Migration**:
  ```svelte
  $effect(() => { ... }); // Svelte 5
  ```

### 6. Legacy Event Listeners (`on:event`)
The `on:click` syntax is deprecated in favor of standard HTML attributes.
- **Example**: `<button on:click={toggle}>`
- **Migration**: `<button onclick={toggle}>`

## Recommendations

1.  **Prioritize "Phase 1.5" and "Phase 2"**: Finish migrating simple components (buttons, icons) to use `$props`.
2.  **Refactor Events**: Systematically replace `createEventDispatcher` with callback props in the `shared/forms` components.
3.  **Address Complex Reactivity**: `Eleve.svelte` is a high-risk file. Migrate its lifecycle hooks and `$:` statements carefully, using `$effect` and `$derived`.
4.  **Component Instantiation**: Verify that `getSvelteComponent` in `src/lib/mathalea.ts` returns a valid Svelte 5 component compatible with `mount`.

## Scan Details
- **Svelte Version**: 5.46.1
- **Key Files Checked**: `src/lib/mathalea.ts`, `src/components/shared/exercice/Exercice.svelte`, `src/components/display/eleve/Eleve.svelte`
- **Migration Status**: **In Progress (Early Stage)**. Dependencies are updated, but syntax is largely legacy.
