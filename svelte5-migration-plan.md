# Svelte 5 Migration Plan for MathALÉA

## Overview

- **Current**: Svelte 4.2.20
- **Target**: Svelte 5 (latest stable)
- **Strategy**: Incremental migration, keep stores as-is
- **Components**: 159 Svelte files to migrate

---

## Phase 1: Dependency Updates

### 1.1 Update package.json

**File**: `./package.json`

```json
{
  "devDependencies": {
    "svelte": "^5.0.0",
    "@sveltejs/vite-plugin-svelte": "^4.0.0",
    "svelte-check": "^4.0.0"
  }
}
```

Remove `svelte-preprocess` (replaced by `vitePreprocess`).

### 1.2 Update svelte.config.js

**File**: `./svelte.config.js`

```javascript
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  preprocess: [vitePreprocess()]
}
```

### 1.3 Check third-party Svelte libraries

| Package | Current | Action |
|---------|---------|--------|
| `svelte-gestures` | 4.0.0 | Update to ^5.0.0 |
| `simple-svelte-autocomplete` | 2.5.2 | Check Svelte 5 compatibility |

### 1.4 Validation

```bash
pnpm install
pnpm check        # Document errors
pnpm build        # Build succeeds

# E2E tests (requires dev server)
pnpm dev &        # Start dev server in background
sleep 5           # Wait for server to start
pnpm test:e2e:views
pnpm test:e2e:interactivity
pnpm test:e2e:consistency
kill %1           # Kill dev server
```

### 1.4 Results (2025-12-20)

| Step | Status | Notes |
|------|--------|-------|
| `pnpm install` | ✅ Success | Lockfile up to date |
| `pnpm check` | ⚠️ 1271 errors, 53 warnings | Expected - components not yet migrated |
| `pnpm build` | ✅ Success | Requires `NODE_OPTIONS="--max-old-space-size=8192"` |
| E2E tests | ❌ Blocking error | `SvelteComponent` not exported from Svelte 5 |

#### Blocking Issue: `SvelteComponent` Export Removed

**Error**: `The requested module 'svelte.js' does not provide an export named 'SvelteComponent'`

In Svelte 5, `SvelteComponent` is no longer exported. Files using it:

- `src/lib/mathalea.ts`
- `src/components/shared/exercice/Exercice.svelte`
- `src/components/setup/start/presentationalComponents/sideMenu/searchBlock/SearchBlock.svelte`
- `src/components/setup/start/presentationalComponents/sideMenu/SideMenu.svelte`
- `src/components/display/can/presentationalComponents/Race.svelte`

**Fix**: Replace `SvelteComponent` with `Component` from `svelte`:

```typescript
// Before (Svelte 4)
import { SvelteComponent } from 'svelte'
type MyComponent = typeof SvelteComponent

// After (Svelte 5)
import type { Component } from 'svelte'
type MyComponent = Component
```

#### Fix Applied: svelte-gestures API Change

The `svelte-gestures` v5 renamed `swipe` to `useSwipe`:

**File**: `src/components/display/can/presentationalComponents/NavigationButtons.svelte`

```diff
- import { swipe } from 'svelte-gestures'
+ import { useSwipe } from 'svelte-gestures'

- use:swipe="{{ timeframe: 300, minSwipeDistance: 60 }}"
+ use:useSwipe="{{ timeframe: 300, minSwipeDistance: 60 }}"
```

---

## Phase 1.5: Fix SvelteComponent Breaking Change (Blocker)

In Svelte 5, `SvelteComponent` is no longer exported. This must be fixed before the app can run.

### 1.5.1 Files to Update

| File | Usage |
|------|-------|
| `src/main.ts` | App entry point - uses `new App()` |
| `src/lib/mathalea.ts` | Core engine - dynamic component loading |
| `src/components/shared/exercice/Exercice.svelte` | Exercise wrapper component |
| `src/components/setup/start/presentationalComponents/sideMenu/searchBlock/SearchBlock.svelte` | Search UI |
| `src/components/setup/start/presentationalComponents/sideMenu/SideMenu.svelte` | Side menu |
| `src/components/display/can/presentationalComponents/Race.svelte` | CAN race view |

### 1.5.2 Migration Pattern

```typescript
// Before (Svelte 4)
import { SvelteComponent } from 'svelte'
type MyComponent = typeof SvelteComponent<{ prop: string }>

// After (Svelte 5)
import type { Component, ComponentProps } from 'svelte'
type MyComponent = Component<{ prop: string }>
```

For dynamic component instantiation:

```typescript
// Before (Svelte 4)
import { SvelteComponent } from 'svelte'
new ComponentClass({ target, props })

// After (Svelte 5)
import { mount, unmount } from 'svelte'
const instance = mount(ComponentClass, { target, props })
// Later: unmount(instance)
```

### 1.5.3 Validation

```bash
# Verify app loads in browser (dev mode)
pnpm dev &
sleep 5
# Open http://localhost:5173/alea/ - should load without errors
curl -s http://localhost:5173/alea/ | grep -q "mathalea" && echo "OK" || echo "FAIL"
kill %1

# Type check and production build
pnpm check
NODE_OPTIONS="--max-old-space-size=8192" pnpm build
```

---

## Phase 2: Simple Components (Low Risk)

### 2.1 Icon Components (8 files)

Migrate `$$props.class` → `$props()`

**Files**:

- `src/components/shared/icons/AmcIcon.svelte`
- `src/components/shared/icons/AnkiIcon.svelte`
- `src/components/shared/icons/LatexIcon.svelte`
- `src/components/shared/icons/MoodleIcon.svelte`
- `src/components/shared/icons/NoInteractivityIcon.svelte`
- `src/components/shared/icons/PdfTextIcon.svelte`
- `src/components/shared/icons/QcmCamIcon.svelte`
- `src/components/shared/icons/StarIcon.svelte`

**Pattern**:

```svelte
<!-- Before -->
<i class="{$$props.class} bx bx-icon"></i>

<!-- After -->
<script lang="ts">
  let { class: className, ...rest } = $props<{ class?: string }>()
</script>
<i class="{className} bx bx-icon" {...rest}></i>
```

### 2.2 Simple Buttons (5 files)

- `src/components/shared/forms/ButtonText.svelte`
- `src/components/shared/forms/ButtonSvg.svelte`
- `src/components/shared/forms/ButtonConfig.svelte`
- `src/components/shared/forms/ButtonOverleaf.svelte`
- `src/components/shared/forms/ButtonTextAction.svelte`

### 2.3 Validation

```bash
pnpm check
pnpm build

# E2E tests (requires dev server)
pnpm dev &
sleep 5
pnpm test:e2e:views
pnpm test:e2e:interactivity
pnpm test:e2e:consistency
kill %1
```

---

## Phase 3: Event Dispatcher Components (Medium Risk)

### 3.1 Form Controls (6 files)

Migrate `createEventDispatcher` → callback props

**Files**:

- `src/components/shared/forms/ButtonToggle.svelte`
- `src/components/shared/forms/ButtonToggleAlt.svelte`
- `src/components/shared/forms/InputNumber.svelte`
- `src/components/shared/forms/CheckboxWithLabel.svelte`
- `src/components/shared/forms/FormRadio.svelte`
- `src/components/shared/forms/RangeSlider.svelte`

**Pattern**:

```svelte
<!-- Before -->
<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  dispatch('toggle')
</script>
<button on:click={toggle}>

<!-- After -->
<script>
  let { ontoggle } = $props<{ ontoggle?: () => void }>()
  ontoggle?.()
</script>
<button onclick={toggle}>
```

### 3.2 Update parent components

Change `on:event` → `onevent` in all parent usages.

### 3.3 Validation

```bash
pnpm check
pnpm build

# E2E tests (requires dev server)
pnpm dev &
sleep 5
pnpm test:e2e:views
pnpm test:e2e:interactivity
pnpm test:e2e:consistency
kill %1
```

---

## Phase 4: Reactive Statement Components (Higher Risk)

### 4.1 Simple Derived (4 files)

Migrate `$:` → `$derived`

**Files**:

- `src/components/shared/ui/Card.svelte`
- `src/components/shared/ui/CardForStatic.svelte`
- `src/components/shared/ui/ChipsList.svelte`
- `src/components/shared/forms/PDFviewer.svelte`

**Pattern**:

```svelte
<!-- Before -->
$: doubled = count * 2

<!-- After -->
let doubled = $derived(count * 2)
```

### 4.2 Keyboard Components (5 files)

Complex reactivity with store subscriptions.

- `src/components/keyboard/Keyboard.svelte`
- `src/components/keyboard/presentationalComponents/keyboardpage/KeyboardPage.svelte`
- `src/components/keyboard/presentationalComponents/keyboardpage/keyboardblock/BlockOfKeycaps.svelte`
- `src/components/keyboard/presentationalComponents/keyboardpage/keyboardblock/keycap/Keycap.svelte`
- `src/components/keyboard/presentationalComponents/alphanumeric/Alphanumeric.svelte`

### 4.3 Diaporama Components (4 files)

- `src/components/setup/diaporama/Diaporama.svelte`
- `src/components/setup/diaporama/slideshowPlay/SlideshowPlay.svelte`
- `src/components/setup/diaporama/slideshowOverview/SlideshowOverview.svelte`
- `src/components/setup/diaporama/slideshowSettings/SlideshowSettings.svelte`

**Pattern for side effects**:

```svelte
<!-- Before -->
$: {
  // side effect code
}

<!-- After -->
$effect(() => {
  // side effect code
})
```

### 4.4 Validation

```bash
pnpm check
pnpm build

# E2E tests (requires dev server)
pnpm dev &
sleep 5
pnpm test:e2e:views
pnpm test:e2e:interactivity
pnpm test:e2e:consistency
kill %1
```

---

## Phase 5: Core Application Components (Highest Risk)

### 5.1 Main Views (3 files)

- `src/components/display/eleve/Eleve.svelte` - Most complex
- `src/components/display/can/Can.svelte`
- `src/components/setup/start/Start.svelte`

**Lifecycle migration**:

```svelte
<!-- Before -->
beforeUpdate(() => { ... })
afterUpdate(() => { ... })

<!-- After -->
$effect.pre(() => { ... })  // before DOM
$effect(() => { ... })       // after DOM
```

### 5.2 Exercise Components (4 files)

- `src/components/shared/exercice/Exercice.svelte`
- `src/components/shared/exercice/exerciceMathalea/ExerciceMathalea.svelte`
- `src/components/shared/exercice/exerciceMathalea/exerciceMathaleaVueProf/ExerciceMathaleaVueProf.svelte`
- `src/components/shared/exercice/exerciceMathalea/exerciceMathaleaVueEleve/ExerciceMathaleaVueEleve.svelte`

### 5.3 App Component

- `src/components/App.svelte`

### 5.4 Full Validation

```bash
pnpm check
pnpm build

# E2E tests (requires dev server)
pnpm dev &
sleep 5
pnpm test:e2e:views
pnpm test:e2e:interactivity
pnpm test:e2e:consistency
kill %1
```

---

## Phase 6: Third-Party Library Updates

### 6.1 svelte-gestures

Update API for Svelte 5 if needed.

**File**: `src/components/display/can/presentationalComponents/NavigationButtons.svelte`

### 6.2 Remaining Libraries

Test and update as needed:

- `simple-svelte-autocomplete`

---

## Rollback Strategy

1. **Per-phase commits**: Tag each phase `svelte5-phase-N`
2. **Component-level**: Svelte 5 supports mixed syntax - keep problematic components in Svelte 4 syntax
3. **Full rollback**: Revert package.json and run `pnpm install`

---

## Key Migration Patterns Summary

| Svelte 4 | Svelte 5 |
|----------|----------|
| `export let prop` | `let { prop } = $props()` |
| `$$props.class` | `let { class: className } = $props()` |
| `$: derived = x * 2` | `let derived = $derived(x * 2)` |
| `$: { sideEffect() }` | `$effect(() => { sideEffect() })` |
| `createEventDispatcher` | Callback props (`onclick`, etc.) |
| `on:click={fn}` | `onclick={fn}` |
| `beforeUpdate` | `$effect.pre()` |
| `afterUpdate` | `$effect()` |

**Note**: Stores with `$` prefix continue to work unchanged.

---

## Critical Files

1. `package.json` - Dependency updates
2. `svelte.config.js` - Preprocessor change
3. `src/components/display/eleve/Eleve.svelte` - Most complex component
4. `src/components/setup/start/Start.svelte` - Main entry point
5. `src/components/keyboard/Keyboard.svelte` - Complex reactivity
