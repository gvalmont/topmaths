<script>
  import AnchorExternal from '../../shared/AnchorExternal.svelte'
</script>

<h1>Informations sur le site</h1>
<section>
  <h2>Genèse du site</h2>
  <h3>Un besoin</h3>
  <p>
    D'abord dans le but d'individualiser les apprentissages, puis dans le but de
    permettre à mes élèves d'avoir accès à autant d'exercices corrigés que
    nécessaire pour leur travail personnel, j'utilisais beaucoup les exercices
    générés par
    <AnchorExternal href="https://coopmaths.fr/alea/">MathALÉA</AnchorExternal>
    .
  </p>
  <p>
    En revanche, une fois un grand nombre d'exercices choisis et paramétrés, il
    devenait difficile de s'organiser et bien que je puisse les mettre dans les
    devoirs à faire sur Pronote, une fois la date passée il était compliqué pour
    mes élèves d'y revenir. J'ai aussi essayé de leur faire coller des QR-Codes
    sur leurs cahiers mais la gestion de ces QR-Codes étaient beaucoup trop
    compliqués entre les classes qui avaient déjà eus le QR-Code, celles qui ne
    l'avaient pas eus, les élèves qui m'en demandait un autre plus tard parce
    qu'ils étaient absents quand je l'ai distribué, ou parce qu'ils l'avaient
    perdus, c'était beaucoup trop compliqué.
  </p>
  <br />
  <h3>Un site</h3>
  <p>
    J'ai commencé par un site Wordpress et j'appréciais le fait de pouvoir
    joindre des vidéos d'explications aux exercices générés. Mais je trouvais la
    navigation dans le site très lourde et les exercices y étaient mal intégrés.
    J'ai alors développé un site à partir d'une page blanche ou presque (il y
    avait quand même le gros moteur d'Angular derrière) et là j'ai pu obtenir
    tout ce que je voulais : une navigation très fluide, intuitive, des liens
    facilement partageables, faciles à copier pour compléter mes cahiers de
    textes, j'ai commencé à automatiser de plus en plus de tâche et j'ai trouvé
    le résultat génial.
  </p>
  <br />
  <h3>Des évolutions</h3>
  <p>
    Au cours de sa vie, le site a beaucoup évolué. Il est passé par des moments
    où les élèves pouvaient créer des comptes, modifier leur avatar, se
    regrouper en équipe, étaient en compétition avec les autres élèves avec des
    classements régulièrement réinitialisés mais je n'obtenais pas le résultat
    escompté. Vu que l'objectif était de gagner des points, les élèves (y
    compris les meilleurs) optaient toujours pour la facilité. Ils ne
    développaient pas leurs compétences en s'attaquant à des nouveaux exercices
    - bien qu'ils leurs rapportaient plus de points - mais se contentaient de
    faire en boucle les exercices les plus faciles. J'ai donc rendu le site
    beaucoup plus sobre en enlevant toute allusion à un quelconque score et ai
    aussi retiré la possibilité de saisir les réponses sur le site. Bien que
    déroutés le premier jour, je leur dis juste qu'il faut faire les exercices
    sur leur cahier et ils ont exactement le comportement attendu. Ils font les
    exercices comme les exercices habituels (pas en tapant une réponse ou en
    cochant une case au hasard) et utilisent le site pour s'entraîner sur ce
    qu'on a vus en classe et pour préparer les évaluations. Bingo !
  </p>
  <br />
  <h3>Une ultime évolution</h3>
  <p>
    MathALÉA évoluant de son côté, une nouvelle version basée sur le moteur Vite
    + Svelte a été développée. Plutôt que de juste mettre à jour mes liens pour
    qu'ils pointent vers cette nouvelle version, j'ai été plus audacieux. Je
    suis parti du code de MathALÉA et ai reconstruit topmaths par dessus ! En
    plus d'avoir des chargements instantannés, j'ai surtout obtenu l'avantage
    d'avoir un accès direct aux données et je peux maintenant les modifier comme
    je l'entends, pour avoir une charte graphique que je préfère et pour
    automatiser toujours plus de tâches 😉.
  </p>
</section>
<section>
  <h2>Codes sources</h2>
  <p>
    L'écrasante majorité des exercices présents sur ce site proviennent du
    générateur d'exercices
    <AnchorExternal href="https://coopmaths.fr/alea/">MathALÉA</AnchorExternal>
    .
  </p>
  <p>
    Le code source de MathALÉA est disponible sur la
    <AnchorExternal href="https://forge.apps.education.fr/">
      Forge des Communs Numériques Éducatifs
    </AnchorExternal>
    à l'adresse suivante&nbsp;:
    <AnchorExternal href="https://forge.apps.education.fr/coopmaths/mathalea">
      https://forge.apps.education.fr/coopmaths/mathalea
    </AnchorExternal>
    .
  </p>
  <br />
  <p>
    Bien qu'une première version de topmaths était construite séparément de
    MathALÉA et se contentait d'importer ses exercices, dans un soucis
    d'efficacité la version actuelle a été construite par-dessus MathALÉA et en
    est juste une couche supplémentaire.
  </p>
  <p>
    <AnchorExternal href="https://forge.apps.education.fr/">
      Forge des Communs Numériques Éducatifs
    </AnchorExternal>
    à l'adresse suivante&nbsp;:
    <AnchorExternal
      href="https://forge.apps.education.fr/valmontguillaume/topmaths"
    >
      https://forge.apps.education.fr/valmontguillaume/topmaths
    </AnchorExternal>
    .
  </p>
</section>
<section>
  <h2>Avoir votre propre version de topmaths</h2>
  <p>
    Si vous souhaitez avoir votre propre version de topmaths, vous pouvez suivre
    les instructions affichées sur
    <AnchorExternal
      href="https://forge.apps.education.fr/valmontguillaume/topmaths#avoir-votre-propre-version-de-topmaths"
    >
      la page du projet
    </AnchorExternal>
    .
  </p>
</section>
