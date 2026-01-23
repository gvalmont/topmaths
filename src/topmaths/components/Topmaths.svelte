<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import Cart from '../modules/Cart'
  import Storage from '../modules/Storage'
  import { cacheData } from '../services/data'
  import { goToView } from '../services/navigation'
  import {
    isDoubleView,
    isPersonalMode,
    isTeacherMode,
    reference,
    reference2,
    view,
  } from '../services/store'
  import type { CartItem } from '../types/cart'
  import {
    isReference,
    isView,
    type Reference,
    type View,
  } from '../types/navigation'
  import CartComponent from './Cart/Cart.svelte'
  import Classroom from './Classroom/Classroom.svelte'
  import Exercise from './Exercise/Exercise.svelte'
  import Home from './Home/Home.svelte'
  import Info from './Info/Info.svelte'
  import Objective from './Objective/Objective.svelte'
  import Practice from './Practice/Practice.svelte'
  import Footer from './presentationalComponents/Footer.svelte'
  import HeaderMenu from './presentationalComponents/HeaderMenu/HeaderMenu.svelte'
  import InfoDialog from './presentationalComponents/InfoDialog.svelte'
  import Perso from './presentationalComponents/Perso.svelte'
  import TimeOverlay from './presentationalComponents/TimeOverlay.svelte'
  import Student from './Student/Student.svelte'
  import Unit from './Unit/Unit.svelte'

  let isCartEmpty: boolean = true
  let innerWidth: number
  let isMd: boolean
  $: isMd = innerWidth >= 768

  onMount(() => {
    Cart.subscribe(handleCartUpdate)
    addEventListener('popstate', updateParams)
    cacheData()
    updateParams()
  })

  onDestroy(() => {
    Cart.unsubscribe(handleCartUpdate)
    removeEventListener('popstate', updateParams)
  })

  function updateParams(): void {
    updateParamsFromUrl()
    Cart.loadFromStorage()
    isTeacherMode.set(Storage.getTeacherMode())
    isPersonalMode.set(Storage.getPersonalMode())
  }

  function handleCartUpdate(cartItems: CartItem[]): void {
    isCartEmpty = cartItems.length === 0
  }

  function updateParamsFromUrl(): void {
    const url = new URL(window.location.href)
    const entries = url.searchParams.entries()
    let newView: View = 'home'
    let newRef: Reference = ''
    let newRef2: string = ''
    let newIsDoubleView: boolean = false
    for (const entry of entries) {
      if (entry[0] === 'v') {
        const viewCandidate = entry[1]
        if (isView(viewCandidate)) {
          newView = viewCandidate
        }
      }
      if (entry[0] === 'ref') {
        const refCandidate = entry[1]
        if (isReference(refCandidate)) {
          newRef = refCandidate
        }
      }
      if (entry[0] === 'ref2') {
        newRef2 = entry[1]
      }
      if (entry[0] === 'dv') {
        newIsDoubleView = !!entry[1]
      }
    }
    view.set(newView)
    reference.set(newRef)
    reference2.set(newRef2)
    isDoubleView.set(newIsDoubleView)
  }

  function setPersonalMode(isPersonalMode: boolean): void {
    Storage.setPersonalMode(isPersonalMode)
  }
</script>

<svelte:head>
  <title>Topmaths - Les maths au Top !</title>
</svelte:head>

<svelte:window bind:innerWidth />
<div
  id="top"
  class="flex flex-col items-center text-center
    text-base md:text-xl
    text-topmaths-corpus
    bg-topmaths-canvas"
>
  <HeaderMenu view={$view} {goToView} {isCartEmpty} />
  <div
    class="w-full flex justify-center
    pb-8 mb:pb-20"
  >
    {#if $view === 'exercise'}
      {#if $isDoubleView}
        <div class="columns-2">
          <div class="break-inside-avoid-column">
            <Exercise {isMd} />
          </div>
          <div class="break-inside-avoid-column">
            <Exercise {isMd} />
          </div>
        </div>
      {:else}
        <Exercise {isMd} />
      {/if}
    {:else if $view === 'unit'}
      <Unit />
    {:else if $view === 'objective'}
      <Objective />
    {:else if $view === 'practice'}
      <Practice />
    {:else if $view === 'student'}
      <Student />
    {:else if $view === 'classroom'}
      <Classroom />
    {:else if $view === 'cart'}
      <CartComponent />
    {:else if $view === 'info'}
      <Info />
    {:else if $view === 'perso'}
      <Perso isPersonalMode={$isPersonalMode} {setPersonalMode} />
    {:else}
      <Home />
    {/if}
  </div>
  <Footer />
  {#if $isTeacherMode}
    <TimeOverlay />
  {/if}
  <InfoDialog />
</div>
