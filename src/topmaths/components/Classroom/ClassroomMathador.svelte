<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte'
  import { mathaleaRenderDiv } from '../../../lib/mathalea'
  import { range } from '../../../lib/outils/nombres'
  import { randint } from '../../../modules/outils'
  import AnchorExternal from '../shared/AnchorExternal.svelte'
  import ButtonImage from '../shared/ButtonImage.svelte'

  type Calculation = {
    calculation: string
    result: number
  }

  type Possibility = {
    numbers: number[]
    operations: string[]
    calculation: string
  }

  type Solution = {
    calculations: string[]
    writing: string
  }

  let targetNumber = 0
  let number1 = 0
  let number2 = 0
  let number3 = 0
  let number4 = 0
  let number5 = 0
  let solutions: Solution[] = []
  let isSolutionsDisplayed = false
  let secondsLeft = -1
  let timerInterval: ReturnType<typeof setTimeout> | undefined
  let isTimerActive = false
  let displayTimeDiv: HTMLDivElement
  let solutionsDiv: HTMLDivElement
  let audioElement: HTMLAudioElement
  let pointsInfoBackground: HTMLDivElement
  let pointsInfoText: HTMLDivElement

  onMount(() => {
    reroll()
    startTimerInterval()
  })

  onDestroy(() => clearInterval(timerInterval))

  function startTimerInterval(): void {
    timerInterval = setInterval(() => {
      if (isTimerActive) {
        if (secondsLeft > 0) {
          secondsLeft--
          updateDisplayedTime()
        }
        if (secondsLeft <= 0) {
          isTimerActive = false
          if (audioElement) {
            audioElement.play()
          }
        }
      }
    }, 1000)
  }

  function reroll(): void {
    targetNumber = randint(0, 99)
    number1 = randint(1, 4)
    number2 = randint(1, 6)
    number3 = randint(1, 8)
    number4 = randint(1, 12)
    number5 = randint(1, 20)
    isSolutionsDisplayed = false
    solutions = solveMathador()
    if (solutions.length === 0) reroll()
  }

  function solveMathador(): Solution[] {
    const newSolutions: Solution[] = []
    const possibilities0: Possibility = {
      numbers: [number1, number2, number3, number4, number5],
      operations: ['+', '-', '*', '/'],
      calculation: '',
    }
    const possibilities1 = calculatePossibilities(
      possibilities0.numbers,
      possibilities0.operations,
    )
    for (const possibility1 of possibilities1) {
      const possibilities2 = calculatePossibilities(
        possibility1.numbers,
        possibility1.operations,
      )
      for (const possibility2 of possibilities2) {
        const possibilities3 = calculatePossibilities(
          possibility2.numbers,
          possibility2.operations,
        )
        for (const possibility3 of possibilities3) {
          const possibilities4 = calculatePossibilities(
            possibility3.numbers,
            possibility3.operations,
          )
          for (const possibility4 of possibilities4) {
            if (possibility4.numbers[0] === targetNumber) {
              const calculations = [
                possibility1.calculation,
                possibility2.calculation,
                possibility3.calculation,
                possibility4.calculation,
              ]
              const writing = `
                $ ${possibility1.calculation} $ <br>
                $ ${possibility2.calculation} $ <br>
                $ ${possibility3.calculation} $ <br>
                $ ${possibility4.calculation} $`
              const solutionCandidate = { calculations, writing }
              if (!isSolutionFound(solutionCandidate, newSolutions)) {
                newSolutions.push(solutionCandidate)
              }
            }
          }
        }
      }
    }
    return newSolutions
  }

  function calculatePossibilities(
    numbers: number[],
    signs: string[],
  ): Possibility[] {
    const possibilities: Possibility[] = []
    for (const firstNumber of numbers) {
      for (const firstSign of signs) {
        const numbersWithoutFirst = removeNumberOnce([...numbers], firstNumber)
        for (const secondNumber of numbersWithoutFirst) {
          const firstCalculation = calculate(
            firstNumber,
            secondNumber,
            firstSign,
          )
          const numbersWithout1and2 = removeNumberOnce(
            [...numbersWithoutFirst],
            secondNumber,
          )
          possibilities.push({
            numbers: numbersWithout1and2.concat(firstCalculation.result),
            operations: signs.filter((value) => value !== firstSign),
            calculation: firstCalculation.calculation,
          })
        }
      }
    }
    return possibilities.filter((possibility) =>
      possibility.numbers.every(
        (number) => number >= 0 && number === Math.floor(number),
      ),
    )
  }

  function removeNumberOnce(
    numbers: number[],
    numberToRemove: number,
  ): number[] {
    for (const number of numbers) {
      if (number === numberToRemove) {
        numbers.splice(numbers.indexOf(number), 1)
        return numbers
      }
    }
    return numbers
  }

  function calculate(
    number1: number,
    number2: number,
    operation: string,
  ): Calculation {
    const max = Math.max(number1, number2)
    const min = Math.min(number1, number2)
    switch (operation) {
      case '+':
        return {
          result: max + min,
          calculation: `${max} + ${min} = ${max + min}`,
        }
      case '-':
        return {
          result: max - min,
          calculation: `${max} - ${min} = ${max - min}`,
        }
      case '*':
        return {
          result: max * min,
          calculation: `${max} \\times ${min} = ${max * min}`,
        }
      case '/':
        if (number2 === 0) {
          return {
            result: -1000,
            calculation: 'Erreur : division par zéro',
          }
        } else {
          return {
            result: max / min,
            calculation: `${max} \\div ${min} = ${max / min}`,
          }
        }
      default:
        console.error("Signe d'opération inconnu", number1, number2, operation)
        return {
          result: -1000,
          calculation: "Erreur : signe d'opération inconnu",
        }
    }
  }

  function isSolutionFound(
    solutionCandidate: Solution,
    solutions: Solution[],
  ): boolean {
    return solutions.some((solution) =>
      solution.calculations.every((calculation) =>
        solutionCandidate.calculations.includes(calculation),
      ),
    )
  }

  async function renderSolutionsDiv(): Promise<void> {
    await tick()
    if (solutionsDiv) mathaleaRenderDiv(solutionsDiv, -1)
  }

  function setupTimer(minuts: number): void {
    secondsLeft = minuts * 60
    isTimerActive = false
    updateDisplayedTime()
  }

  function startTimer(): void {
    isTimerActive = true
  }

  function stopTimer(): void {
    isTimerActive = false
  }

  function updateDisplayedTime(): void {
    if (displayTimeDiv) {
      const minutes = Math.floor(secondsLeft / 60)
      const seconds = (secondsLeft % 60).toString().padStart(2, '0')
      displayTimeDiv.textContent = `${minutes} : ${seconds}`
    }
  }

  function toggerPointsInfo(): void {
    if (pointsInfoBackground && pointsInfoText) {
      if (pointsInfoText.style.opacity === '1') {
        pointsInfoText.style.opacity = '0%'
        pointsInfoBackground.style.opacity = '0%'
      } else {
        pointsInfoText.style.opacity = '100%'
        pointsInfoBackground.style.opacity = '70%'
      }
    }
  }
</script>

<svelte:head>
  <title>Mathador - topmaths</title>
</svelte:head>

<h1
  class="title rounded-tl-3xl rounded-br-3xl p-4 font-semibold
    text-white dark:text-violet-800
    bg-violet-800 dark:bg-inherit dark:border-violet-800 dark:border-4
    text-2xl md:text-4xl"
>
  Mathador
</h1>
<div class="p-8">
  <div class="relative">
    <div class="absolute top-0 left-0 z-50">
      <ButtonImage
        color="link"
        imageSrc="/topmaths/img/gvalmont/p-circle.svg"
        imageAlt="Symbole P entouré"
        class="border-2 size-10 md:size-14 rounded-full p-0"
        on:click={toggerPointsInfo}
      />
    </div>
    <div bind:this={pointsInfoBackground} id="points-info-background"></div>
    <div
      bind:this={pointsInfoText}
      id="points-info-text"
      class="text-center
        text-base md:text-xl
        ml-2 md:ml-5"
    >
      <ul>
        <li>&plus; Addition : 1 pt</li>
        <li>&times; Multiplication : 1 pt</li>
        <li>&minus; Soustraction : 2 pts</li>
        <li>&div; Division : 3 pts</li>
      </ul>
    </div>
    <div class="flex items-center justify-center">
      Atteindre &nbsp;
      <figure
        class="flex items-center justify-center font-semibold
          text-2xl md:text-4xl
          size-24 md:size-32"
        style="background-image:url('/topmaths/img/cc0/target-svgrepo-com.svg'); background-position:center;"
      >
        {targetNumber}
      </figure>
    </div>
  </div>
  <div
    class="flex items-center justify-center
    p-6 md:p-8"
  >
    En utilisant
    <div
      class="flex flex-row
      text-lg md:text-2xl"
    >
      <figure
        class="flex items-center justify-center m-2 carte border-[#FBBF24]"
      >
        {number1}
      </figure>
      <figure
        class="flex items-center justify-center m-2 carte border-[#A3E635]"
      >
        {number2}
      </figure>
      <figure
        class="flex items-center justify-center m-2 carte border-[#22D3EE]"
      >
        {number3}
      </figure>
      <figure
        class="flex items-center justify-center m-2 carte border-[#A78BFA]"
      >
        {number4}
      </figure>
      <figure
        class="flex items-center justify-center m-2 carte border-[#F472B6]"
      >
        {number5}
      </figure>
    </div>
  </div>
  <div class="flex flex-row justify-center items-center">
    <div class="is-link is-interactive">
      <select
        class="border border-is-link
        bg-topmaths-canvas
        text-base md:text-lg"
        on:change={(event) => {
          const select = event.currentTarget as HTMLSelectElement
          const minuts = Number(select.value)
          if (minuts > 0) setupTimer(minuts)
          select.value = ''
        }}
      >
        <option value="">Minuteur</option>
        {#each range(9) as i}
          <option value={i + 1}>{i + 1} min</option>
        {/each}
      </select>
    </div>
    <div class="is-link ml-2 flex justify-center">
      {#if isTimerActive}
        <ButtonImage
          color="link"
          class="border-2 p-0 size-8 md:size-10"
          imageSrc="/topmaths/img/cc0/pause-svgrepo-com.svg"
          imageAlt="Pause"
          imageClass="size-6 md:size-8"
          on:click={stopTimer}
        />
      {:else if secondsLeft > 0}
        <ButtonImage
          color="link"
          class="border-2 p-0 size-8 md:size-10"
          imageSrc="/topmaths/img/cc0/play-button-svgrepo-com.svg"
          imageAlt="Play"
          imageClass="size-6 md:size-8"
          on:click={startTimer}
        />
      {/if}
    </div>
    <div
      bind:this={displayTimeDiv}
      class="ml-2
        text-lg md:text-2xl
        {secondsLeft <= 0 ? 'text-red-500 shake' : ''}"
    ></div>
  </div>
  <br />
  <p class="has-text-grey">
    Il {solutions.length > 1
      ? 'y a ' + solutions.length + ' possibilités'
      : solutions.length === 1
        ? 'y a 1 possibilité'
        : "n'y a aucune possibilité"} de coup Mathador.
  </p>
</div>
<button class="button border is-tout rounded-lg py-2 px-4" on:click={reroll}>
  Relancer
</button>
<button
  class="button border is-green rounded-lg py-2 px-4 ml-4 mb-8"
  on:click={() => {
    isSolutionsDisplayed = !isSolutionsDisplayed
    renderSolutionsDiv()
  }}
>
  {isSolutionsDisplayed ? 'Cacher les solutions' : 'Afficher les solutions'}
</button>
{#if isSolutionsDisplayed}
  <p bind:this={solutionsDiv} class="is-size-5">
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html solutions.map((solution) => solution.writing).join('<br><br>')}
  </p>
{/if}
<div
  class="p-8
  text-sm md:text-base"
>
  Si vous ne connaissez pas le super jeu qu'est Mathador, je vous encourage à
  visiter
  <AnchorExternal href="https://www.mathador.fr/index.php">
    le site officiel
  </AnchorExternal>
  !
</div>
<div
  class="p-4
  text-xs md:text-sm"
>
  <i>
    Mathador est une marque protégée d'Eric Trouillot et de Réseau Canopé,
    enregistrée en France. Eric Trouillot est le concepteur du jeu Mathador que
    vous pouvez retrouver sur le site
    <AnchorExternal href="https://www.mathador.fr">
      www.mathador.fr
    </AnchorExternal>. Le site
    <AnchorExternal href="https://topmaths.fr">Topmaths</AnchorExternal>
    est un site indépendant et n’est pas affilié à
    <AnchorExternal href="https://www.mathador.fr">
      www.mathador.fr
    </AnchorExternal>.
  </i>
</div>
<audio bind:this={audioElement}>
  <source
    src="/topmaths/mp3/BELLHand_Sonnette de velo 2 (ID 0275)_LS.mp3"
    type="audio/mpeg"
  />
  Votre navigateur ne supporte pas les éléments audio.
</audio>

<style lang="scss">
  @use '../../styles/tailwind-colors.scss';
  .carte {
    width: 35px;
    height: 45px;
    border-style: solid;
    border-width: 5px;
    border-radius: 10px;
  }

  @media (min-width: 768px) {
    .carte {
      width: 45px;
      height: 55px;
    }
  }

  #points-info-background,
  #points-info-text {
    position: absolute;
    top: 0;
    left: 25px;
    width: 210px;
    height: 150px;
    pointer-events: none;
    transition: opacity 1s;
  }

  #points-info-background {
    background-color: tailwind-colors.$topmaths-canvas-default;
    opacity: 0%;
  }

  #points-info-text {
    opacity: 0%;
    text-align: center;
  }

  .shake {
    /* Start the shake animation and make the animation last for 0.5 seconds */
    animation: shake 0.5s;

    /* When the animation is finished, start again */
    animation-iteration-count: infinite;
  }

  @keyframes shake {
    0% {
      transform: translate(1px, 1px) rotate(0deg);
    }

    10% {
      transform: translate(-1px, -2px) rotate(-1deg);
    }

    20% {
      transform: translate(-3px, 0px) rotate(1deg);
    }

    30% {
      transform: translate(3px, 2px) rotate(0deg);
    }

    40% {
      transform: translate(1px, -1px) rotate(1deg);
    }

    50% {
      transform: translate(-1px, 2px) rotate(-1deg);
    }

    60% {
      transform: translate(-3px, 1px) rotate(0deg);
    }

    70% {
      transform: translate(3px, 1px) rotate(-1deg);
    }

    80% {
      transform: translate(-1px, -1px) rotate(1deg);
    }

    90% {
      transform: translate(1px, 2px) rotate(0deg);
    }

    100% {
      transform: translate(1px, -2px) rotate(-1deg);
    }
  }
</style>
