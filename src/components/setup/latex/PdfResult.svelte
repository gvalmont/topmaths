<script lang="ts">
  import { onMount } from 'svelte'
  import { tweened } from 'svelte/motion'
  import type Latex from '../../../lib/Latex'
  import {
    buildImagesUrlsList,
    doesLatexNeedsPics,
    getExosContentList,
    getPicsNames,
  } from '../../../lib/Latex'
  import { type LatexFileInfos } from '../../../lib/LatexTypes'
  import PdFviewer from '../../shared/forms/PDFviewer.svelte'

  const { latex, latexFileInfos, autoStart, pdfViewerDisplay } = $props<{
    latex: Latex
    latexFileInfos: LatexFileInfos
    autoStart: boolean
    pdfViewerDisplay: boolean
  }>()

  // Variables locales réactives
  let pdfBlob: Blob | null = $state(null)
  let downloadFilename: string | null = $state(null)
  let pdfUrl: string | null = $state(null)
  let clockAbled = $state(false)
  let errorMessage: string | null = $state(null) // 🟠 <-- nouvelle variable d’état
  let errorLog = $state('') // 🔹 pour stocker le texte brut du serveur

  const original = 60 // secondes
  const timer = tweened(original)

  // fabrique un nom de fichier
  function generateFilename(prefix = 'document', ext = 'pdf') {
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
    const time = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
    return `${prefix}_${date}_${time}.${ext}`
  }

  function downloadAndExtractPDF(blob: Blob, filename: string) {
    pdfBlob = blob
    downloadFilename = filename
  }

  // 🟢 fonction de compilation
  export async function compileToPDF() {
    errorMessage = null // 🧹 reset erreur à chaque tentative
    errorLog = '' // 🔹 reset log d’erreur
    const contents = await latex.getContents(latexFileInfos)
    if (contents.content === '') {
      pdfBlob = null
      downloadFilename = null
      return
    }
    const { latexWithPreamble } = await latex.getFile(latexFileInfos)
    const picsWanted = doesLatexNeedsPics(contents)
    const exosContentList = getExosContentList(latex.exercices)
    const picsNames = getPicsNames(exosContentList)
    const imagesUrls: string[] = picsWanted
      ? buildImagesUrlsList(exosContentList, picsNames)
      : []

    const formData = new FormData()
    formData.append('name', 'document.tex')
    formData.append('originalname', 'document.tex')
    formData.append('file', new Blob([latexWithPreamble]), 'document.tex')

    console.log(latexWithPreamble)

    for (let im = 0; im < imagesUrls.length; im++) {
      const imaUrl = imagesUrls[im].replace(
        'https://coopmaths.fr',
        window.location.origin,
      )
      const visual = await fetch(imaUrl)
      const blob = await visual.blob()
      formData.append('name', imaUrl.split('/').slice(-1)[0])
      formData.append('originalname', imaUrl.split('/').slice(-1)[0])
      formData.append('file', blob, imaUrl.split('/').slice(-1)[0])
    }

    // timer
    timer.set(original)
    clockAbled = true
    const timeValue = setInterval(() => {
      timer.update((n) => {
        if (n > 0) return n - 1
        clearInterval(timeValue)
        return 0
      })
    }, 1000)

    try {
      const res = await fetch('https://latexcompiler.duckdns.org/generate', {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(60 * 1000),
      })
      if (!res.ok) {
        // Récupère le contenu d’erreur (même en 500)
        errorLog = await res.text()
        console.error('Réponse serveur:', res.status, errorLog)
        throw new Error(`Erreur compilation (${res.status})`)
      }
      // if (res.status !== 200) throw new Error('Erreur compilation')
      const blob = await res.blob()
      await downloadAndExtractPDF(blob, generateFilename('document', 'pdf'))
    } catch (err) {
      console.error('Erreur de compilation:', err)
      errorMessage = err instanceof Error ? err.message : String(err)
    } finally {
      clockAbled = false
    }
  }

  $effect(() => {
    if (pdfBlob === null) {
      pdfUrl = null
      return
    }

    const url = URL.createObjectURL(pdfBlob)
    pdfUrl = url

    // cleanup garanti :
    // - avant le prochain effet
    // - à la destruction du composant
    return () => {
      URL.revokeObjectURL(url)
    }
  })

  // auto-lancement
  onMount(() => {
    if (autoStart) compileToPDF()
  })
</script>

<div class="flex flex-col h-full">
  {#if !autoStart}
    <!-- 🟣 Bouton manuel pour lancer la compilation -->
    <div class="m-2 text-center">
      <button
        onclick={compileToPDF}
        class="px-3 py-1 rounded bg-coopmaths-action text-white hover:bg-coopmaths-action-lightest disabled:opacity-50"
        disabled={clockAbled}
      >
        {#if clockAbled}
          Compilation en cours...
        {:else}
          Compiler en PDF
        {/if}
      </button>
    </div>
  {/if}

  {#if clockAbled}
    <div class="loader text-center m-2">
      <progress value={$timer / original}></progress>
      {$timer.toFixed(0)}s
    </div>
  {/if}

  {#if pdfBlob}
    {#if downloadFilename}
      <div class="m-2">
        <a
          href={pdfUrl}
          download={downloadFilename}
          class="px-3 py-1 rounded bg-coopmaths-action text-white hover:bg-coopmaths-action-lightest"
        >
          Télécharger {downloadFilename}
        </a>
      </div>
    {/if}
    {#if pdfViewerDisplay}
      <div class="flex-1 overflow-auto m-2">
        <PdFviewer blob={pdfBlob} />
      </div>
    {/if}
  {/if}

  {#if !pdfBlob && !clockAbled && !errorMessage}
    <div
      class="m-2 text-center text-coopmaths-corpus dark:text-coopmathsdark-corpus"
    >
      Aucun PDF généré
    </div>
  {/if}

  <!-- 🔴 Message d’erreur -->
  {#if errorMessage}
    <div
      class="m-2 p-2 text-center text-red-600 border border-red-400 bg-red-50 rounded"
    >
      ⚠️ Aucun PDF généré : {errorMessage}
    </div>
  {/if}

  {#if errorLog}
    <div
      class="m-2 p-2 border border-gray-300 bg-gray-100 rounded text-left overflow-auto"
    >
      <pre class="text-xs text-gray-800 whitespace-pre-wrap">
        {errorLog}
      </pre>
    </div>
  {/if}
</div>
