<script lang="ts">
  import IconeTooltipSimple from '../mini-components/IconeTooltipSimple.svelte'

  interface Question {
    question: string;
    reponseA: string;
    reponseB: string;
    reponseC: string;
    reponseD: string;
  }

  interface Image {
    url: string;
    fileName: string;
  }

  const MAX_QUESTIONS = 8
  const PARTIES = [
    'forme',
    'yeux',
    'bouche',
    'nez',
    'oreilles',
    'bras',
    'jambes',
    'accessoires'
  ]
  let titre = ''
  let enonce =
    'Trouve les réponses aux questions posées, dessine le portrait du personnage obtenu sur une feuille blanche (ou au dos du sujet). Les réponses seront justifiées sur une copie simple.'
  let questions = [
    { question: '', reponseA: '', reponseB: '', reponseC: '', reponseD: '' }
  ] as Question[]

  function compilerSurOverleaf () {
    const images = getImages()
    const LaTeX = getLaTeX()
    const URIEncodedLaTeX =
      'data:text/plain;base64,' + btoa(unescape(encodeURIComponent(LaTeX)))
    let urlOverleaf = 'https://www.overleaf.com/docs?'
    for (const image of images) {
      urlOverleaf +=
        'snip_uri[]=' + image.url + '&snip_name[]=' + image.fileName + '&'
    }
    urlOverleaf +=
      'snip_uri[]=' + URIEncodedLaTeX + '&snip_name[]=topmaths.tex'
    cliquerVers(urlOverleaf)
  }

  function getImages (): Image[] {
    const images = []
    for (let i = 0; i < questions.length; i++) {
      for (let j = 1; j < 5; j++) {
        images.push({
          url: `https://topmaths.fr/assets/img/parties/${PARTIES[i]}/${PARTIES[i]}${j}.png`,
          fileName: `${PARTIES[i]}${j}.png`
        })
      }
    }
    return images
  }

  function getLaTeX (): string {
    let texte = `\\documentclass{article}
    \\usepackage{ProfCollege}
    \\usepackage[a4paper,margin=1cm,noheadfoot]{geometry}
    \\setlength{\\parindent}{0pt}
    \\usepackage{graphicx}
    \\usepackage{fancyhdr,lastpage}
    \\pagestyle{fancy}
    \\usepackage{fancybox}
    \\setlength{\\headheight}{12.0pt}
    \\setlength{\\footskip}{12.0pt}
    \\fancyhead[C]{\\textbf{Nom \\dotfill Prénom \\dotfill Classe \\dotfill}}
    \\begin{document}
    `
    if (titre !== '') {
      texte += `~
       \\begin{center}
          \\Large\\textbf{${titre}}
       \\end{center}
       `
    }
    if (enonce !== '') {
      texte += `${enonce}\\\\
    `
    }
    texte += `\\QCM[Alterne,Reponses=4,Largeur=2.25cm]{%
    `
    let i = 0
    for (const question of questions) {
      texte += `${question.question}&\\includegraphics[width=\\linewidth]{${PARTIES[i]}1} ${question.reponseA}&\\includegraphics[width=\\linewidth]{${PARTIES[i]}2} ${question.reponseB}&\\includegraphics[width=\\linewidth]{${PARTIES[i]}3} ${question.reponseC}&\\includegraphics[width=\\linewidth]{${PARTIES[i]}4} ${question.reponseD}&1,%
      `
      i++
    }

    texte += `}
    \\end{document}`
    return texte
  }

  function cliquerVers (url: string) {
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute('href', url)
    downloadAnchorNode.setAttribute('target', '_blank')
    downloadAnchorNode.setAttribute('rel', 'noopener noreferrer')
    document.body.appendChild(downloadAnchorNode) // required for firefox
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  function ajouterQuestionApres (i: number) {
    questions.splice(i + 1, 0, {
      question: '',
      reponseA: '',
      reponseB: '',
      reponseC: '',
      reponseD: ''
    })
    questions = questions
  }

  function copierQuestion (i: number) {
    const question = questions[i]
    questions.splice(i + 1, 0, {
      question: question.question,
      reponseA: question.reponseA,
      reponseB: question.reponseB,
      reponseC: question.reponseC,
      reponseD: question.reponseD
    })
    questions = questions
  }

  function supprimerQuestion (i: number) {
    questions.splice(i, 1)
    questions = questions
  }
</script>

<svelte:head>
  <title>Générateur de portraits de monstres - topmaths</title>
</svelte:head>

<div class="container is-max-desktop centre">
  <div class="is-link">
    <input
      type="text"
      class="form-control is-inline-block"
      style="width: 50%;"
      id="titre"
      aria-describedby="titre"
      bind:value={titre}
      placeholder="Titre"
    />
    &nbsp;
    <IconeTooltipSimple
      urlBouton="/topmaths/img/cc0/info-circle-svgrepo-com.svg"
      texteDropdown="Les champs peuvent être complétés en LaTeX. Ne pas oublier de placer les formules mathématiques entre deux $"
      texteAlternatif="un i dans un cercle"
      grandTexte={true}
    />
  </div>
  <br />
  <div>
    <input
      type="text"
      class="form-control"
      style="width: 100%;"
      id="enonce"
      aria-describedby="enonce"
      bind:value={enonce}
      placeholder="Énoncé"
    />
  </div>
  <br />
  <div>
    {#each questions as question, i}
      <div>
        <div class="is-flex is-justify-content-center is-align-items-center">
          {i + 1} : &nbsp;<input
            type="text"
            class="form-control"
            id="question{i}"
            bind:value={question.question}
            placeholder="Question"
          />
          &nbsp; A : &nbsp;<input
            type="text"
            class="form-control reponse"
            id="reponseA{i}"
            bind:value={question.reponseA}
            placeholder="Réponse"
          />
          &nbsp; B : &nbsp;<input
            type="text"
            class="form-control reponse"
            id="reponseB{i}"
            bind:value={question.reponseB}
            placeholder="Réponse"
          />
          &nbsp; C : &nbsp;<input
            type="text"
            class="form-control reponse"
            id="reponseC{i}"
            bind:value={question.reponseC}
            placeholder="Réponse"
          />
          &nbsp; D : &nbsp;<input
            type="text"
            class="form-control reponse"
            id="reponseD{i}"
            bind:value={question.reponseD}
            placeholder="Réponse"
          />
          {#if questions.length < MAX_QUESTIONS - 1}
            <span class="is-link">
              &nbsp; <button on:click={() => ajouterQuestionApres(i)}
                ><i
                  ><img
                    class="image is-24x24 is-inline-block"
                    src="../../../topmaths/img/cc0/plus-circle-1425-svgrepo-com.svg"
                    alt="Signe + entouré"
                  /></i
                ></button
              >
            </span>
          {:else}
            <span>
              &nbsp; <i
                ><img
                  class="image is-24x24 is-inline-block"
                  src="../../../topmaths/img/cc0/plus-circle-1425-svgrepo-com.svg"
                  alt="Signe + entouré"
                /></i
              >
            </span>
          {/if}
          {#if questions.length < MAX_QUESTIONS - 1}
          <span class="is-link">
              &nbsp; <button on:click={() => copierQuestion(i)}
                ><i
                  ><img
                    class="image is-24x24 is-inline-block"
                    src="../../../topmaths/img/cc0/copy-document-svgrepo-com.svg"
                    alt="Signe 'Copie' entouré"
                  /></i
                ></button
              >
            </span>
          {:else}
            <span>
              &nbsp; <i
                ><img
                  class="image is-24x24 is-inline-block"
                  src="../../../topmaths/img/cc0/copy-document-svgrepo-com.svg"
                  alt="Signe 'Copier' entouré"
                /></i
              >
            </span>
          {/if}
          {#if questions.length > 1}
          <span class="is-link">
              &nbsp; <button on:click={() => supprimerQuestion(i)}
                ><i
                  ><img
                    class="image is-24x24 is-inline-block"
                    src="../../../topmaths/img/cc0/minus-round-svgrepo-com.svg"
                    alt="Signe - entouré"
                  /></i
                ></button
              >
            </span>
          {:else}
            <span>
              &nbsp; <i
                ><img
                  class="image is-24x24 is-inline-block"
                  src="../../../topmaths/img/cc0/minus-round-svgrepo-com.svg"
                  alt="Signe - entouré"
                /></i
              >
            </span>
          {/if}
        </div>
        <div class="p-1" />
      </div>
    {/each}
  </div>
  <br /><br />
  <div>
    <button class="button is-green is-outlined" on:click={compilerSurOverleaf}>
      Compiler en PDF sur Overleaf.com
    </button>
  </div>
  <br /><br />
  <div class="is-size-7">D'après une idée originale de Stéphanie Moure</div>
</div>

<style>
  .reponse {
    width: 100px;
  }
</style>
