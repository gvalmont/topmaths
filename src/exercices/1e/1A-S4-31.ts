// 1A-S4-31.ts — exemple QCM minimal autoportant

// ✅ Important: booléen, pas chaîne
export const amcReady = true;

// ⚠️ Adapte le chemin d'import à ton projet
// (ou supprime cet import si randint est déjà dans le scope global)
import { randint } from '../../modules/outils';

// Titre affiché par MathALEA (optionnel selon ton setup)
export const titre = 'QCM — Note sur 20 (distracteurs)';

// Nombre de questions générées par nouvelleVersion
export const nbQuestions = 1;

/**
 * Génère 3 distracteurs uniques dans [0, 20),
 * distincts entre eux et de x, avec préférence pour des valeurs proches de x.
 * Borne les essais pour éviter toute boucle infinie.
 */
function genererDistracteurs(x: number): number[] {
  const S = new Set<number>();
  const MIN = 0;
  const MAX = 20; // exclus

  // essais bornés
  for (let tries = 0; S.size < 3 && tries < 200; tries++) {
    const useDelta = Math.random() < 0.6; // 60% proches de x
    const delta = Math.floor(Math.random() * 11) - 5; // [-5, 5]
    const c = useDelta ? x + delta
                       : Math.floor(Math.random() * (MAX - MIN)) + MIN;

    if (Number.isInteger(c) && c >= MIN && c < MAX && c !== x) {
      S.add(c);
    }
  }

  // Si jamais on n'a pas 3 valeurs, on complète de manière déterministe
  for (let v = 0; S.size < 3 && v < MAX; v++) {
    if (v !== x) S.add(v);
  }

  return Array.from(S);
}

/**
 * Mélange un tableau in-place (Fisher–Yates).
 */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

/**
 * Méthode attendue par le moteur d'exercices MathALEA.
 * On utilise `this` de manière souple (type any) pour rester compatible
 * avec les différents squelettes Exercice/ExerciceQcm existants.
 */
export function nouvelleVersion(this: any) {
  // ✅ Toujours initialiser les structures lues par le moteur QCM
  this.enonces = [];
  this.choixList = [];
  this.reponses = [];     // ← évite l'erreur "this.reponses is undefined"
  this.corrections = [];

  // --- Exemple de génération d'une note correcte x (entier dans [0, 20)) ---
  // Tu peux remplacer par ta propre logique si x est déjà connu ailleurs.
  const x = randint(0, 19, 0); // bornes incluses si ta randint l'est; ajuste si besoin

  // --- Distracteurs uniques et valides ---
  const distracteurs = genererDistracteurs(x); // 3 valeurs

  // --- Construction des choix (on mélange) ---
  const choix = shuffle([...distracteurs, x]); // 4 propositions
  const indexBonneReponse = choix.indexOf(x);  // index de la bonne réponse

  // --- Énoncé et correction (exemple simple) ---
  const enonce = `La note correcte (sur 20) est $${x}$. Choisis la bonne valeur.`;
  const correction = `Bonne réponse : $${x}$. Distracteurs proposés : ${distracteurs.join(', ')}.`;

  // --- Alimentation des structures attendues par ExerciceQcm ---
  this.enonces.push(enonce);
  this.choixList.push(choix);
  // ⚠️ Beaucoup d’exos QCM stockent l’INDEX de la bonne réponse (0..n-1).
  // Si ton moteur attend la valeur elle-même, remplace par: this.reponses.push(x);
  this.reponses.push(indexBonneReponse);
  this.corrections.push(correction);

  // Si ton moteur attend aussi un "consigne" global :
  this.consigne = 'Sélectionne la bonne réponse.';
}
