<script lang="ts">
  import { onDestroy, tick } from "svelte";
  import IconeTooltipSimple from "../mini-components/IconeTooltipSimple.svelte";
  import { mathaleaRenderDiv } from "../../../lib/mathalea";

  interface Possibilite {
    nombres: number[];
    signes: string[];
    calcul: string;
  }

  interface Solution {
    calculs: string[];
    redaction: string;
  }

  let nombreCible = 0;
  let donnee1 = 0;
  let donnee2 = 0;
  let donnee3 = 0;
  let donnee4 = 0;
  let donnee5 = 0;
  let stringSolutions = "";
  let nombreDeSolutions = -1;
  let solutionsAffichees = false;
  let durees = [] as number[];
  for (let i = 1; i < 61; i++) {
    durees.push(i);
  }
  let tempsRestant = -1;
  let audioDejaJoue = false;
  let minuteurInterval: NodeJS.Timeout;
  let minuteurEnFonctionnement = false;
  relancer();
  lancerMinuteurInterval();

  onDestroy(() => clearInterval(minuteurInterval));

  function lancerMinuteurInterval() {
    minuteurInterval = setInterval(() => {
      const audioElement = <HTMLAudioElement>(document.getElementById("audioElement"))
      const divTempsAffiche = document.getElementById("divTempsAffiche")
      if (audioElement !== null && divTempsAffiche !== null) {
        if (minuteurEnFonctionnement) {
          if (tempsRestant > 0) {
            tempsRestant--
            MAJTempsAffiche()
          }
          if (tempsRestant <= 0) {
            divTempsAffiche.classList.add("shake", "rouge")
            minuteurEnFonctionnement = false
            if (!audioDejaJoue) {
              audioElement.play()
              audioDejaJoue = true
            }
          }
        }
      }
    }, 1000)
  }

  function relancer() {
    nombreCible = randint(0, 99);
    donnee1 = randint(1, 4);
    donnee2 = randint(1, 6);
    donnee3 = randint(1, 8);
    donnee4 = randint(1, 12);
    donnee5 = randint(1, 20);
    stringSolutions = "";
    nombreDeSolutions = -1;
    solutionsAffichees = false;
    resoudreMathador();
  }

  /**
   * Renvoie un nombre entier entre min et max inclus
   * @param min
   * @param max
   * @returns nombre entier entre min et max inclus
   */
  function randint(min: number, max: number) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
  }

  /**
   * Teste toutes les possibilités de calcul utilisant les 5 nombres et les 4 opérations
   * Sélectionne les possibilités qui aboutissent au bon résultat
   * Filtre les possibilités équivalentes (mêmes calculs mais pas dans le même ordre)
   * Modifie le nombre de solutions et le contenu du div des solutions
   */
  function resoudreMathador() {
    const solutions: Solution[] = [];
    const possibilites0: Possibilite = {
      nombres: [donnee1, donnee2, donnee3, donnee4, donnee5],
      signes: ["+", "-", "*", "/"],
      calcul: "",
    };
    const possibilites1 = determinerPossibilites(
      possibilites0.nombres,
      possibilites0.signes
    );
    for (const possibilite1 of possibilites1) {
      if (lesNombresPassentLeFiltre(possibilite1)) {
        const possibilites2 = determinerPossibilites(
          possibilite1.nombres,
          possibilite1.signes
        );
        for (const possibilite2 of possibilites2) {
          if (lesNombresPassentLeFiltre(possibilite2)) {
            const possibilites3 = determinerPossibilites(
              possibilite2.nombres,
              possibilite2.signes
            );
            for (const possibilite3 of possibilites3) {
              if (lesNombresPassentLeFiltre(possibilite3)) {
                const possibilites4 = determinerPossibilites(
                  possibilite3.nombres,
                  possibilite3.signes
                );
                for (const possibilite4 of possibilites4) {
                  if (possibilite4.nombres[0] === nombreCible) {
                    const calculs = [
                      possibilite1.calcul,
                      possibilite2.calcul,
                      possibilite3.calcul,
                      possibilite4.calcul,
                    ];
                    const redaction =
                      " $ " +
                      possibilite1.calcul +
                      " $ <br> $ " +
                      possibilite2.calcul +
                      " $ <br> $ " +
                      possibilite3.calcul +
                      " $ <br> $ " +
                      possibilite4.calcul +
                      " $ ";
                    const solutionCandidate = { calculs, redaction };
                    if (!solutionPresente(solutionCandidate, solutions)) {
                      solutions.push(solutionCandidate);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    stringSolutions = "";
    nombreDeSolutions = solutions.length;
    for (const solution of solutions) {
      stringSolutions += solution.redaction + " <br><br> ";
    }
  }

  /**
   * Coeur de la recherche de solutions.
   * Fait tous les calculs possibles à partir des nombres de poolDeNombres et des signes de signesDisponibles.
   * Dans chaque cas, reconstitue un nouveau pool de nombres en regroupant les nombres inutilisés et le résultat obtenu
   * Renvoie tous ces nouveaux pool de nombres ainsi que les signes disponibles restants dans une liste d'objets possibilités
   * @param poolDeNombres
   * @param signesDisponibles
   * @returns possibilites
   */
  function determinerPossibilites(
    poolDeNombres: number[],
    signesDisponibles: string[]
  ) {
    const possibilites: Possibilite[] = [];
    for (const premierNombre of poolDeNombres) {
      for (const premierSigne of signesDisponibles) {
        const nombresSaufPremier = poolDeNombres.filter(function (value) {
          return value !== premierNombre;
        });
        while (nombresSaufPremier.length < poolDeNombres.length - 1)
          nombresSaufPremier.push(premierNombre); // Si le même nombre apparaissait plusieurs fois on les a tous enlevés. Si c'est le cas, on renfloue nombres1
        const signesSaufLePremier = signesDisponibles.filter(function (value) {
          return value !== premierSigne;
        });
        for (const deuxiemeNombre of nombresSaufPremier) {
          const resultatPremierCalcul = calculer(
            premierNombre,
            deuxiemeNombre,
            premierSigne
          );
          const nombresSauf1et2 = nombresSaufPremier.filter(function (value) {
            return value !== deuxiemeNombre;
          });
          while (nombresSauf1et2.length < nombresSaufPremier.length - 1)
            nombresSauf1et2.push(deuxiemeNombre);
          const nombresSauf1et2AvecResultat1 = nombresSauf1et2;
          nombresSauf1et2AvecResultat1.push(resultatPremierCalcul.resultat);
          possibilites.push({
            nombres: nombresSauf1et2AvecResultat1,
            signes: signesSaufLePremier,
            calcul: resultatPremierCalcul.calcul,
          });
        }
      }
    }
    return possibilites;
  }

  /**
   * Effectue l'opération entre le max de nombre1 et nombre2 et leur min
   * @param nombre1
   * @param nombre2
   * @param operation
   * @returns {resultat: number, calcul: string} resultat est un nombre servant pour la suite des calculs et calcul est une version LateX du calcul servant plus tard pour l'affichage des solutions.
   */
  function calculer(nombre1: number, nombre2: number, operation: string) {
    const max = Math.max(nombre1, nombre2);
    const min = Math.min(nombre1, nombre2);
    switch (operation) {
      case "+":
        return {
          resultat: max + min,
          calcul: `${max} + ${min} = ${max + min}`,
        };
      case "-":
        return {
          resultat: max - min,
          calcul: `${max} - ${min} = ${max - min}`,
        };
      case "*":
        return {
          resultat: max * min,
          calcul: `${max} \\times ${min} = ${max * min}`,
        };
      case "/":
        if (max === 0 || min === 0) {
          return {
            resultat: -1000,
            calcul: "Erreur : signe d'opération inconnu",
          };
        } else {
          return {
            resultat: max / min,
            calcul: `${max} \\div ${min} = ${max / min}`,
          };
        }
      default:
        console.error("Signe d'opération inconnu");
        return {
          resultat: -1000,
          calcul: "Erreur : signe d'opération inconnu",
        };
    }
  }

  /**
   * Renvoie false si :
   * - un nombre n'est pas positif
   * - un nombre n'est pas entier
   * Renvoie true sinon
   * @param possibilite
   * @returns
   */
  function lesNombresPassentLeFiltre(possibilite: Possibilite) {
    for (const nombre of possibilite.nombres) {
      if (nombre < 0) {
        // On vérifie si les nombres sont positifs
        return false;
      }
      if (nombre !== Math.floor(nombre)) {
        // On vérifie si les nombres sont entiers
        return false;
      }
    }
    return true;
  }

  /**
   * Vérifie si une solutionCandidate existe déja dans les solutions
   * @param solutionCandidate
   * @param solutions
   * @returns true si la solutionCandidate existe déjà dans les solutions
   */
  function solutionPresente(
    solutionCandidate: Solution,
    solutions: Solution[]
  ) {
    for (const solution of solutions) {
      let nombreDeCalculsIdentiques = 0;
      for (const calculCandidat of solutionCandidate.calculs) {
        if (solution.calculs.indexOf(calculCandidat) !== -1)
          nombreDeCalculsIdentiques++;
      }
      if (nombreDeCalculsIdentiques === 4) return true;
    }
    return false;
  }

  async function interpreterLaTeX() {
    await tick();
    const divSolutions = document.getElementById("divSolutions");
    if (divSolutions !== null) mathaleaRenderDiv(divSolutions);
  }

  function setupMinuteur(evenementDuree: Event | undefined) {
    if (evenementDuree !== undefined) {
    const dureeEnMin = Number(
      (evenementDuree.target as HTMLInputElement).value.toString().split(" ")[0]
    );
    if (!isNaN(dureeEnMin)) {
      const divTempsAffiche = document.getElementById("divTempsAffiche");
      if (divTempsAffiche !== null) {
        tempsRestant = dureeEnMin * 60;
        MAJTempsAffiche();
        minuteurEnFonctionnement = false;
        audioDejaJoue = false;
        divTempsAffiche.classList.remove("shake", "rouge");
      }
    }
    }
  }

  function lancerMinuteur() {
    minuteurEnFonctionnement = true;
  }

  function arreterMinuteur() {
    minuteurEnFonctionnement = false;
  }

  function MAJTempsAffiche() {
    const divTempsAffiche = document.getElementById("divTempsAffiche");
    if (divTempsAffiche !== null) {
      divTempsAffiche.innerHTML = `${Math.floor(tempsRestant / 60)} : ${
        tempsRestant % 60 < 10 ? "0" : ""
      }${tempsRestant % 60}`;
    }
  }

  function alternerAffichagePoints() {
    const divFondPanneauPoints = document.getElementById("fondPanneauPoints");
    const divContenuPanneauPoints = document.getElementById(
      "contenuPanneauPoints"
    );
    if (divFondPanneauPoints !== null && divContenuPanneauPoints) {
      if (divContenuPanneauPoints.style.opacity === "1") {
        divContenuPanneauPoints.style.opacity = "0%";
        divFondPanneauPoints.style.opacity = "0%";
      } else {
        divContenuPanneauPoints.style.opacity = "100%";
        divFondPanneauPoints.style.opacity = "70%";
      }
    }
  }
</script>

<svelte:head>
  <title>Mathador - topmaths</title>
</svelte:head>

<div class="is-size-5">
  <div id="boutonPoints" class="is-clickable">
    <figure
      on:click={alternerAffichagePoints}
      on:keydown={alternerAffichagePoints}
    >
      <img
        src="topmaths/img/gvalmont/p-circle.svg"
        alt="Symbole P entouré"
      />
    </figure>
  </div>
  <div id="fondPanneauPoints" />
  <div id="contenuPanneauPoints" class="has-text-centered">
    <ul>
      <li>&plus; Addition : 1 pt</li>
      <li>&times; Multiplication : 1 pt</li>
      <li>&minus; Soustraction : 2 pts</li>
      <li>&div; Division : 3 pts</li>
    </ul>
  </div>
  <h1
    class="title is-2 p-5"
    style="color: white; background-color: #5B21B6; border-radius: 50px 0px 50px 0px"
  >
    Mathador
  </h1>
  <div class="is-flex is-align-items-center is-justify-content-center">
    Atteindre &nbsp; <figure
      class="is-flex is-align-items-center is-justify-content-center is-size-3 has-text-weight-semibold"
      style="width: 120px; height: 120px; background-image:url('/topmaths/img/cc0/target-svgrepo-com.svg'); background-position:center, center;background-size: 120px, 120px; color:black;text-shadow: 0px 0px 5px white"
    >
      {nombreCible}
    </figure>
  </div>
  <br />
  <div class="is-flex is-align-items-center is-justify-content-center">
    En utilisant
    <figure
      class="is-flex is-align-items-center is-justify-content-center is-size-4 m-2 carte"
      style="border-color: #FBBF24;"
    >
      {donnee1}
    </figure>
    <figure
      class="is-flex is-align-items-center is-justify-content-center is-size-4 m-2 carte"
      style="border-color: #A3E635;"
    >
      {donnee2}
    </figure>
    <figure
      class="is-flex is-align-items-center is-justify-content-center is-size-4 m-2 carte"
      style="border-color: #22D3EE;"
    >
      {donnee3}
    </figure>
    <figure
      class="is-flex is-align-items-center is-justify-content-center is-size-4 m-2 carte"
      style="border-color: #A78BFA;"
    >
      {donnee4}
    </figure>
    <figure
      class="is-flex is-align-items-center is-justify-content-center is-size-4 m-2 carte"
      style="border-color: #F472B6;"
    >
      {donnee5}
    </figure>
  </div>
  <br />
  <div class="is-flex is-align-items-center is-justify-content-center">
    <div class="b-select m-2 is-size-6">
      <select on:change={() => setupMinuteur(event)}>
        <option>Minuteur</option>
        {#each durees as duree}
          <option>{duree} min</option>
        {/each}
      </select>
    </div>
    <div class="is-flex is-align-items-center is-justify-content-center">
      <div class="is-link">
        {#if minuteurEnFonctionnement}
          <button on:click={arreterMinuteur}>
            <IconeTooltipSimple
              urlBouton="/topmaths/img/cc0/pause-svgrepo-com.svg"
              texteDropdown=""
              texteAlternatif="Pause"
              size={3}
            />
          </button>
        {:else if tempsRestant > 0}
          <button on:click={lancerMinuteur}>
            <IconeTooltipSimple
              urlBouton="/topmaths/img/cc0/play-button-svgrepo-com.svg"
              texteDropdown=""
              texteAlternatif="Play"
              size={3}
            />
          </button>
        {/if}
      </div>
      <div
        class="is-size-4 m-2"
        id="divTempsAffiche"
        class:rouge={tempsRestant <= 0}
      />
    </div>
  </div>
  <br />
  <p class="has-text-grey">
    Il {nombreDeSolutions === -1
      ? "y a ... possibilités"
      : nombreDeSolutions > 1
      ? "y a " + nombreDeSolutions + " possibilités"
      : nombreDeSolutions === 1
      ? "y a 1 possibilité"
      : "n'y a aucune possibilité"} de coup Mathador.
  </p>
  <br />
</div>
<button class="button is-warning" on:click={relancer}>Relancer</button> &nbsp;
&nbsp;
<button
  class="button is-success"
  class:is-inverted={solutionsAffichees}
  on:click={() => {
    solutionsAffichees = !solutionsAffichees;
    interpreterLaTeX();
  }}
>
  {solutionsAffichees
    ? "Cacher les solutions"
    : "Afficher les solutions"}</button
>
<br /><br />
{#if solutionsAffichees}
  <p
    id="divSolutions"
    contenteditable="false"
    bind:innerHTML={stringSolutions}
    class="is-size-5"
  />
{/if}
<br />
<div>
  Si vous ne connaissez pas le super jeu qu'est Mathador, je vous encourage à
  visiter <a
    href="https://www.mathador.fr/index.php"
    target="_blank"
    rel="noopener noreferrer">le site officiel</a
  > !
</div>
<br />
<div class="is-size-7">
  <i
    >Mathador est une marque protégée d'Eric Trouillot et de Réseau Canopé,
    enregistrée en France. Eric Trouillot est le concepteur du jeu Mathador
    que vous pouvez retrouver sur le site www.mathaodr.fr. Le site
    www.topmaths.fr est un site indépendant et n’est pas affilié à
    www.mathador.fr.</i
  >
</div>
<div id="sonDejaJoue" class="cache" />
<audio id="audioElement">
  <source
    src="/topmaths/mp3/BELLHand_Sonnette de velo 2 (ID 0275)_LS.mp3"
    type="audio/mpeg"
  />
  Votre navigateur ne supporte pas les éléments audio.
</audio>

<style>
  .carte {
    width: 45px;
    height: 55px;
    border-style: solid;
    border-width: 5px;
    color: black;
    border-radius: 10px;
  }

  .rouge {
    color: red;
  }

  #boutonPoints {
    position: absolute;
    top: 100px;
    left: 0;
    width: 40px;
    z-index: 150;
  }

  #fondPanneauPoints,
  #contenuPanneauPoints {
    position: absolute;
    top: 100px;
    left: 45px;
    width: 230px;
    height: 150px;
    pointer-events: none;
    transition: opacity 1s;
  }

  #fondPanneauPoints {
    background-color: white;
    opacity: 0%;
  }

  #contenuPanneauPoints {
    font-size: 22px;
    color: black;
    opacity: 0%;
    text-align: left;
  }
</style>
