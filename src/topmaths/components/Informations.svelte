<div class="container is-max-desktop centre">
  <h1 class="title is-1">Informations sur le site</h1>
  <section class="section">
    <h2 class="title is-2">Genèse du site</h2>
    <h3 class="subtitle is-3">Un besoin</h3>
    <p>
      D'abord dans le but d'individualiser les apprentissages, puis dans le but
      de permettre à mes élèves d'avoir accès à autant d'exercices corrigés que
      nécessaire pour leur travail personnel, j'utilisais beaucoup les exercices
      générés par <a href="https://coopmaths.fr/alea/">MathALÉA</a>.
    </p>
    <p>
      En revanche, une fois un grand nombre d'exercices choisis et paramétrés,
      il devenait difficile de s'organiser et bien que je puisse les mettre dans
      les devoirs à faire sur Pronote, une fois la date passée il était
      compliqué pour mes élèves d'y revenir. J'ai aussi essayé de leur faire
      coller des QR-Codes sur leurs cahiers mais la gestion de ces QR-Codes
      étaient beaucoup trop compliqués entre les classes qui avaient déjà eus le
      QR-Code, celles qui ne l'avaient pas eus, les élèves qui m'en demandait un
      autre plus tard parce qu'ils étaient absents quand je l'ai distribué, ou
      parce qu'ils l'avaient perdus, c'était beaucoup trop compliqué.
    </p>
    <br>
    <h3 class="subtitle is-3">Un site</h3>
    <p>
      J'ai commencé par un site Wordpress et j'appréciais le fait de pouvoir
      joindre des vidéos d'explications aux exercices générés. Mais je trouvais
      la navigation dans le site très lourde et les exercices y étaient mal
      intégrés. J'ai alors développé un site à partir d'une page blanche ou
      presque (il y avait quand même le gros moteur d'Angular derrière) et là
      j'ai pu obtenir tout ce que je voulais : une navigation très fluide,
      intuitive, des liens facilement partageables, faciles à copier pour
      compléter mes cahiers de textes, j'ai commencé à automatiser de plus en
      plus de tâche et j'ai trouvé le résultat génial.
    </p>
    <br>
    <h3 class="subtitle is-3">Des évolutions</h3>
    <p>
      Au cours de sa vie, le site a beaucoup évolué. Il est passé par des
      moments où les élèves pouvaient créer des comptes, modifier leur avatar,
      se regrouper en équipe, étaient en compétition avec les autres élèves avec
      des classements régulièrement réinitialisés mais je n'obtenais pas le
      résultat escompté. Vu que l'objectif était de gagner des points, les
      élèves (y compris les meilleurs) optaient toujours pour la facilité. Ils
      ne développaient pas leurs compétences en s'attaquant à des nouveaux
      exercices - bien qu'ils leurs rapportaient plus de points - mais se
      contentaient de faire en boucle les exercices les plus faciles. J'ai donc
      rendu le site beaucoup plus sobre en enlevant toute allusion à un
      quelconque score et ai aussi retiré la possibilité de saisir les réponses
      sur le site. Bien que déroutés le premier jour, je leur dis juste qu'il
      faut faire les exercices sur leur cahier et ils ont exactement le
      comportement attendu. Ils font les exercices comme les exercices habituels
      (pas en tapant une réponse ou en cochant une case au hasard) et utilisent
      le site pour s'entraîner sur ce qu'on a vus en classe et pour préparer les
      évaluations. Bingo !
    </p>
    <br>
    <h3 class="subtitle is-3">Une ultime évolution</h3>
    <p>
      MathALÉA évoluant de son côté, une nouvelle version basée sur le moteur
      Vite + Svelte a été développée. Plutôt que de juste mettre à jour mes
      liens pour qu'ils pointent vers cette nouvelle version, j'ai été plus
      audacieux. Je suis parti du code de MathALÉA et ai reconstruit topmaths
      par dessus ! En plus d'avoir des chargements instantannés, j'ai surtout
      obtenu l'avantage d'avoir un accès direct aux données et je peux
      maintenant les modifier comme je l'entends, pour avoir une charte
      graphique que je préfère et pour automatiser toujours plus de tâches 😉.
    </p>
  </section>
  <section class="section">
    <h2 class="title is-2">Codes sources</h2>
    <p>
      L'écrasante majorité des exercices présents sur ce site proviennent du
      générateur d'exercices <a href="https://coopmaths.fr/alea/">MathALÉA</a>.
    </p>
    <p>
      Le code source de MathALÉA est disponible sur la
      <a href="https://forge.aeif.fr/framaka/que-la-forge-soit-avec-toi"
        >Forge des Communs Numériques Éducatifs</a
      >
      à l'adresse suivante&nbsp;:
      <a href="https://forge.aeif.fr/coopmaths/mathalea"
        >https://forge.aeif.fr/coopmaths/mathalea</a
      >.
    </p>
    <br />
    <p>
      Bien qu'une première version de topmaths était construite séparément de
      MathALÉA et se contentait d'importer ses exercices, dans un soucis
      d'efficacité la version actuelle a été construite par-dessus MathALÉA et
      en est juste une couche supplémentaire.
    </p>
    <p>
      Le code source de topmaths est lui aussi disponible sur la
      <a href="https://forge.aeif.fr/framaka/que-la-forge-soit-avec-toi"
        >Forge des Communs Numériques Éducatifs</a
      >
      à l'adresse suivante&nbsp;:
      <a href="https://forge.aeif.fr/gvalmont/topmathalea"
        >https://forge.aeif.fr/gvalmont/topmathalea</a
      >.
    </p>
  </section>
  <section class="section">
    <h2 class="title is-2">Avoir votre propre version de topmaths</h2>
    <h3 class="title is-3">Résumé</h3>
    <p>
      Pour adapter topmaths à vos progressions, il suffit de télécharger le code
      disponible sur <a href="https://forge.aeif.fr/gvalmont/topmathalea"
        >https://forge.aeif.fr/gvalmont/topmathalea</a
      >
      et de modifier les deux fichiers
      <a
        href="https://forge.aeif.fr/gvalmont/topmathalea/-/blob/main/src/json/topmaths/objectifs.json"
        >Objectifs</a
      >
      et
      <a
        href="https://forge.aeif.fr/gvalmont/topmathalea/-/blob/main/src/json/topmaths/sequences.json"
        >Séquences</a
      >, tout le site se construit automatiquement à partir de ces fichiers. Il
      n'est pas exclu de faire une interface graphique de configuration mais je
      trouve les fichiers texte comme ceux-ci tellement plus pratiques 😇.
    </p>
    <br />
    <h3 class="title is-3">Procédure détaillée</h3>
    <ul>
      <li>
        Je vous conseille d'installer <a
          href="https://code.visualstudio.com/Download">Visual Studio Code</a
        > pour modifier plus efficacement ces fichiers et pour les manipulations
        suivantes
      </li>
      <li>
        Pour pouvoir télécharger et installer toutes les dépendances
        nécessaires, vous aurez besoin Node.js.
        <ul>
          <li>
            Pour Windows et MacOS, téléchargez et installez la version LTS en
            suivant <a href="https://nodejs.org/fr">ce lien</a>.
          </li>
          <li>
            Pour les distributions Linux basées sur Debian (comme Ubuntu),
            ouvrir un terminal et saisir :
            <ul>
              <li>sudo apt-get install curl apt-transport-https lsb-release</li>
              <li>
                sudo curl -sL https://deb.nodesource.com/setup_14.x | sudo -E
                bash -
              </li>
              <li>sudo apt-get install -y nodejs</li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        Télécharger <a
          href="https://forge.aeif.fr/gvalmont/topmathalea/-/archive/main/topmathalea-main.zip"
          >"topmathalea-main.zip"</a
        >, le décompresser et l'ouvrir dans Visual Studio Code.
      </li>
      <li>
        Pour installer toutes les dépendances, il faudra ouvrir le terminal s'il
        ne l'est pas déjà (CTRL + J ou CMD + J)
        <ul>
          <li>
            Sur Windows, saisir :
            <ul>
              <li>
                Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope
                CurrentUser
              </li>
              <li>npm install -g pnpm</li>
              <li>pnpm install</li>
            </ul>
          </li>
          <li>
            Sur Mac et Linux, saisir :
            <ul>
              <li>sudo npm install -g pnpm</li>
              <li>pnpm install</li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        Tout le nécessaire est maintenant installé !
        <ul>
          <li>
            Les fichiers de configuration permettant de paramétrer vos
            progressions et vos choix d'exercices sont situés dans le dossier
            "src/json/topmaths/".
            <ul>
              <li>
                objectif_modifies.json et sequences_modifiees.json sont grisés
                car ils sont générés automatiquement et ne sont pas à modifier
              </li>
              <li>
                sequences.json liste l'ensemble de vos séquences et le moteur
                ira chercher les détails de chacun de leurs objectifs dans le
                fichier objectifs.json à partir de leur référence.
              </li>
              <li>
                sequencesParticulieres.json permet de lister des séquences
                supplémentaires, hors de cette moulinette, qui seraient donc à
                coder en HTML
              </li>
              <li>
                calendrier.json permet d'avoir des exercices au hasard qui
                collent à votre progression et serait probablement à modifier
                car j'y ai mis le calendrier scolaire de la Réunion 😅
              </li>
            </ul>
          </li>
          <li>
            Vous pouvez visualiser vos modifications en direct grâce à "pnpm
            start"
          </li>
          <li>
            Pour mettre votre site en ligne, il suffit de faire "pnpm build" et
            d'envoyer sur votre site tous les fichiers du dossier "dist" via
            votre logiciel FTP préféré (le mien c'est FileZilla 😁).
          </li>
        </ul>
      </li>
    </ul>
  </section>
</div>

<style>
  ul > li {
    margin-left: 10px;
  }
  ul {
    list-style: circle;
  }
  ul * {
    text-align: left;
  }
</style>
