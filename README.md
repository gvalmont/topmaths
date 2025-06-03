# Topmaths

Code source du site [Topmaths](https://topmaths.fr) dont le but est d'organiser ma sélection d'exercices de [MathALÉA](https://coopmaths.fr/alea) pour les rendre facilement accessibles à mes élèves et moi.

Vous pouvez avoir votre propre version de Topmaths avec vos propres sélections d'exercices / progressions etc. en modifiant juste quelques fichiers comme expliqué [ici](https://topmaths.fr/?v=info&ref=site-info#own-version)

## Avoir votre propre version de Topmaths

### Résumé

Pour adapter Topmaths à vos progressions, il suffit de télécharger le code disponible sur ce dépôt et de modifier les quelques fichiers suivants :

- [calendar.json](https://forge.apps.education.fr/valmontguillaume/topmaths/-/blob/main/src/topmaths/json/calendar.json?ref_type=heads) avec le calendrier scolaire de votre établissement
- [curriculum.json](https://forge.apps.education.fr/valmontguillaume/topmaths/-/blob/main/src/topmaths/json/curriculum.json?ref_type=heads) avec le nombre de séquences par période
- [objectives.json](https://forge.apps.education.fr/valmontguillaume/topmaths/-/blob/main/src/topmaths/json/objectives.json?ref_type=heads) avec les liens des exercices de [MathALÉA](https://coopmaths.fr/alea/) correspondants à chacun des objectifs de vos séquences
- [units.json](https://forge.apps.education.fr/valmontguillaume/topmaths/-/blob/main/src/topmaths/json/units.json?ref_type=heads) indiquant les noms des séquences et les objectifs associés
- [special_units.json](https://forge.apps.education.fr/valmontguillaume/topmaths/-/blob/main/src/topmaths/json/special_units.json?ref_type=heads) pour référencer des pages HTML à part qui apparaîtront dans les "Séquences particulières".

Tout le site se construit automatiquement à partir de ces fichiers. Il n'est pas exclu de faire une interface graphique de configuration mais je trouve les fichiers texte comme ceux-ci tellement plus pratiques 😇.

### Procédure détaillée

- Je vous conseille d'installer [Visual Studio Code](https://code.visualstudio.com/Download) pour modifier plus efficacement ces fichiers et pour les manipulations suivantes
- Pour pouvoir télécharger et installer toutes les dépendances nécessaires, vous aurez besoin de Node.js.
  - Pour Windows et MacOS, téléchargez et installez la version LTS en suivant ce lien : [https://nodejs.org/fr](https://nodejs.org/fr).
  - Pour Linux, vous trouverez les instructions d'installation ici : [https://github.com/nodesource/distributions/blob/master/README.md](https://github.com/nodesource/distributions/blob/master/README.md).
- Télécharger [topmaths-main.zip](https://forge.apps.education.fr/valmontguillaume/topmaths/-/archive/main/topmaths-main.zip), le décompresser et l'ouvrir dans Visual Studio Code.
- Pour installer toutes les dépendances, il faudra ouvrir le terminal s'il ne l'est pas déjà (CTRL + J ou CMD + J)
  - Sur Windows, saisir :
    - `Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser`
    - `npm install -g pnpm`
    - `pnpm install`
  - Sur Mac et Linux, saisir :
    - `sudo npm install -g pnpm`
    - `pnpm install`
- Tout le nécessaire est maintenant installé !
  - Il ne reste plus qu'à modifier les fichiers suivants dans le dossier `src/topmaths/json/` :
    - [calendar.json](https://forge.apps.education.fr/valmontguillaume/topmaths/-/blob/main/src/topmaths/json/calendar.json?ref_type=heads) avec le calendrier scolaire de votre établissement
    - [curriculum.json](https://forge.apps.education.fr/valmontguillaume/topmaths/-/blob/main/src/topmaths/json/curriculum.json?ref_type=heads) avec le nombre de séquences par période
    - [objectives.json](https://forge.apps.education.fr/valmontguillaume/topmaths/-/blob/main/src/topmaths/json/objectives.json?ref_type=heads) avec les liens des exercices de [MathALÉA](https://coopmaths.fr/alea/) correspondants à chacun des objectifs de vos séquences
    - [units.json](https://forge.apps.education.fr/valmontguillaume/topmaths/-/blob/main/src/topmaths/json/units.json?ref_type=heads) indiquant les noms des séquences et les objectifs associés
    - [special_units.json](https://forge.apps.education.fr/valmontguillaume/topmaths/-/blob/main/src/topmaths/json/special_units.json?ref_type=heads) pour référencer des pages HTML à part qui apparaîtront dans les "Séquences particulières".
    - (Des fichiers sont grisés car ils sont générés automatiquement et ne sont pas à modifier)
  - Vous pouvez visualiser vos modifications en direct grâce à `pnpm start`
  - Pour mettre votre site en ligne, il suffit de faire `pnpm build` et d'envoyer sur votre site tous les fichiers du dossier "dist" via votre logiciel FTP préféré (le mien c'est FileZilla 😁).

## Participer au projet

N'hésitez pas à [ouvrir un ticket](https://forge.apps.education.fr/valmontguillaume/topmaths/-/issues/new) si vous rencontrez un problème ou voulez me faire part d'une idée d'amélioration.

Vous pouvez aussi m'envoyer un mail à <contact@topmaths.fr>
