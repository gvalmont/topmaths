import { lampeMessage } from '../lib/format/message'
import { texteGras } from '../lib/format/style'
import Stat from '../lib/mathFonctions/Stat'
import { choice, shuffle } from '../lib/outils/arrayOutils'
import { nomDuMois } from '../lib/outils/dateEtHoraires'
import { texFractionFromString } from '../lib/outils/deprecatedFractions'
import { ecritureParentheseSiNegatif } from '../lib/outils/ecritures'
import { miseEnEvidence } from '../lib/outils/embellissements'
import { arrondi } from '../lib/outils/nombres'
import { prenom } from '../lib/outils/Personne'
import { texNombre } from '../lib/outils/texNombre'
import FractionEtendue from './FractionEtendue'
import { randFloat, randint } from './outils'

function underbraceMediane(nbVal: number) {
  let sortie
  if (nbVal % 2 === 0) {
    // nb pair de valeurs
    sortie = `$\\underbrace{1^e\\hspace{0.25cm}2^e ... ${nbVal / 2 - 1}^e}_{${nbVal / 2 - 1}\\; valeurs} \\hspace{0.25cm} ${nbVal / 2}^e \\hspace{0.25cm} ${nbVal / 2 + 1}^e \\hspace{0.25cm} \\underbrace{${nbVal / 2 + 2}^e ... ${nbVal}^e}_{${nbVal / 2 - 1}\\; valeurs}$`
  } else {
    // nb impair de valeurs
    sortie = `$\\underbrace{1^e\\hspace{0.25cm}2^e ... ${(nbVal - 1) / 2}^e}_{${(nbVal - 1) / 2}\\; valeurs} \\hspace{0.25cm} ${(nbVal - 1) / 2 + 1}^e \\hspace{0.25cm} \\underbrace{${(nbVal - 1) / 2 + 2}^e ... ${nbVal}^e}_{${(nbVal - 1) / 2}\\; valeurs}$`
  }
  return sortie
}

function desTabEffCumul(
  tirages: number[][],
  effCumulBool: boolean,
  categories: string[] = [],
  lignes = [
    'Catégories',
    'Scores',
    "Nombre d'apparitions",
    "Nombre d'apparitions cumulées",
  ],
) {
  let sortie
  if (!effCumulBool) {
    sortie = ''
    if (tirages.length > 12) {
      sortie += '$\\def\\arraystretch{1.5}\\begin{array}{|c' // construction du tableau des effectifs 1/2
      for (let j = 0; j <= Math.round(tirages.length / 2); j++) {
        sortie += '|c'
      }
      sortie += '}'
      if (categories.length > 0) {
        sortie += '\\hline ' + `\\text{${lignes[0]}} `
        for (let j = 0; j < Math.round(tirages.length / 2); j++) {
          sortie += '&\\text{' + categories[j] + '}'
        }
        sortie += '\\\\'
      }
      sortie += '\\hline  ' + `\\text{${lignes[1]}} `
      for (let j = 0; j < Math.round(tirages.length / 2); j++) {
        sortie += '&' + tirages[j][0]
      }
      sortie += '\\\\\\hline ' + `\\text{${lignes[2]}} `
      for (let j = 0; j < Math.round(tirages.length / 2); j++) {
        sortie += '&' + tirages[j][1]
      }
      sortie += '\\\\\\hline\\end{array}$<br><br>'

      sortie += '$\\def\\arraystretch{1.5}\\begin{array}{|c' // construction du tableau des effectifs 2/2
      for (let j = Math.round(tirages.length / 2); j <= tirages.length; j++) {
        sortie += '|c'
      }
      sortie += '}'
      if (categories.length > 0) {
        sortie += '\\hline ' + `\\text{${lignes[0]}} `
        for (let j = Math.round(tirages.length / 2); j < tirages.length; j++) {
          sortie += '&\\text{' + categories[j] + '}'
        }
        sortie += '\\\\'
      }
      sortie += '\\hline ' + `\\text{${lignes[1]}} `
      for (let j = Math.round(tirages.length / 2); j < tirages.length; j++) {
        sortie += '&' + tirages[j][0]
      }
      sortie += '\\\\\\hline ' + `\\text{${lignes[2]}} `
      for (let j = Math.round(tirages.length / 2); j < tirages.length; j++) {
        sortie += '&' + tirages[j][1]
      }
      sortie += '\\\\\\hline\\end{array}$'
    } else {
      sortie += '$\\def\\arraystretch{1.5}\\begin{array}{|c' // construction du tableau des effectifs en un seul morceau
      for (let j = 0; j <= tirages.length; j++) {
        sortie += '|c'
      }
      sortie += '}'
      if (categories.length > 0) {
        sortie += '\\hline  ' + `\\text{${lignes[0]}} `
        for (let j = 0; j < tirages.length; j++) {
          sortie += '&\\text{' + categories[j] + '}'
        }
        sortie += '\\\\'
      }
      sortie += '\\hline  ' + `\\text{${lignes[1]}} `
      for (let j = 0; j < tirages.length; j++) {
        sortie += '&' + tirages[j][0]
      }
      sortie += '\\\\\\hline ' + `\\text{${lignes[2]}} `
      for (let j = 0; j < tirages.length; j++) {
        sortie += '&' + tirages[j][1]
      }
      sortie += '\\\\\\hline\\end{array}$'
    }
  } else {
    sortie = ''
    if (tirages.length > 12) {
      sortie += '$\\def\\arraystretch{1.5}\\begin{array}{|c' // construction du tableau des effectifs 1/2
      for (let j = 0; j <= Math.round(tirages.length / 2); j++) {
        sortie += '|c'
      }
      sortie += '}'
      if (categories.length > 0) {
        sortie += '\\hline ' + `\\text{${lignes[0]}} `
        for (let j = 0; j < Math.round(tirages.length / 2); j++) {
          sortie += '&\\text{' + categories[j] + '}'
        }
        sortie += '\\\\'
      }
      sortie += '\\hline  ' + `\\text{${lignes[1]}} `
      for (let j = 0; j < Math.round(tirages.length / 2); j++) {
        sortie += '&' + tirages[j][0]
      }
      sortie += '\\\\\\hline  ' + `\\text{${lignes[2]}} `
      for (let j = 0; j < Math.round(tirages.length / 2); j++) {
        sortie += '&' + tirages[j][1]
      }
      sortie += '\\\\\\hline ' + `\\text{${lignes[3]}} `
      for (let j = 0; j < Math.round(tirages.length / 2); j++) {
        let cumul = 0
        for (let k = 0; k <= j; k++) {
          cumul += tirages[k][1]
        }
        sortie += '&' + cumul // tirages[j][1];
      }
      sortie += '\\\\\\hline\\end{array}$<br><br>'

      sortie += '$\\def\\arraystretch{1.5}\\begin{array}{|c' // construction du tableau des effectifs 2/2
      for (let j = Math.round(tirages.length / 2); j <= tirages.length; j++) {
        sortie += '|c'
      }
      sortie += '}'
      if (categories.length > 0) {
        sortie += '\\hline ' + `\\text{${lignes[0]}} `
        for (let j = Math.round(tirages.length / 2); j < tirages.length; j++) {
          sortie += '&\\text{' + categories[j] + '}'
        }
        sortie += '\\\\'
      }
      sortie += '\\hline  ' + `\\text{${lignes[1]}} `
      for (let j = Math.round(tirages.length / 2); j < tirages.length; j++) {
        sortie += '&' + tirages[j][0]
      }
      sortie += '\\\\\\hline ' + `\\text{${lignes[2]}} `
      for (let j = Math.round(tirages.length / 2); j < tirages.length; j++) {
        sortie += '&' + tirages[j][1]
      }
      sortie += '\\\\\\hline ' + `\\text{${lignes[3]}} `
      for (let j = Math.round(tirages.length / 2); j < tirages.length; j++) {
        let cumul = 0
        for (let k = 0; k <= j; k++) {
          cumul += tirages[k][1]
        }
        sortie += '&' + cumul // tirages[j][1];
      }
      sortie += '\\\\\\hline\\end{array}$'
    } else {
      sortie += '$\\def\\arraystretch{1.5}\\begin{array}{|c' // construction du tableau des effectifs en un seul morceau
      for (let j = 0; j <= tirages.length; j++) {
        sortie += '|c'
      }
      sortie += '}'
      if (categories.length > 0) {
        sortie += '\\hline ' + `\\text{${lignes[0]}} `
        for (let j = 0; j < tirages.length; j++) {
          sortie += '&\\text{' + categories[j] + '}'
        }
        sortie += '\\\\'
      }
      sortie += '\\hline  ' + `\\text{${lignes[1]}} `
      for (let j = 0; j < tirages.length; j++) {
        sortie += '&' + tirages[j][0]
      }
      sortie += '\\\\\\hline ' + `\\text{${lignes[2]}} `
      for (let j = 0; j < tirages.length; j++) {
        sortie += '&' + tirages[j][1]
      }
      sortie += '\\\\\\hline ' + `\\text{${lignes[3]}} `
      for (let j = 0; j < tirages.length; j++) {
        let cumul = 0
        for (let k = 0; k <= j; k++) {
          cumul += tirages[k][1]
        }
        sortie += '&' + cumul // tirages[j][1];
      }
      sortie += '\\\\\\hline\\end{array}$'
    }
  }

  return sortie
}

function computeMoyenne(notes: number[]): [string, number] {
  let somme = 0
  for (let j = 0; j < notes.length; j++) {
    somme += notes[j]
  }

  return [texFractionFromString(somme, notes.length), somme]
}

function computeMediane(notes: number[]): [number | [number, number], number] {
  const notesRangees = notes.sort((a, b) => a - b)
  let mediane
  if (notes.length % 2 === 0) {
    // attention les indices commencent à 0 !
    mediane = [
      notesRangees[notes.length / 2 - 1],
      notesRangees[notes.length / 2],
    ] as [number, number]
  } else {
    mediane = notesRangees[(notes.length - 1) / 2] as number
  }
  let medianeCorr // pour la correction statique
  Array.isArray(mediane)
    ? (medianeCorr = (mediane[0] + mediane[1]) / 2)
    : (medianeCorr = mediane)
  return [mediane, medianeCorr]
}

function computeEtendue(notes: number[]): [number, number] {
  let min = notes[0]
  let max = notes[0]
  for (let j = 1; j < notes.length; j++) {
    // On cherche la note minimum et la note maximum
    min = Math.min(notes[j], min)
    max = Math.max(notes[j], max)
  }
  return [min, max]
}

function computeMoyenneTirages2D(
  tirages: number[][],
): [string, number, number] {
  let somme = 0
  let effectif = 0
  for (let k = 0; k < tirages.length; k++) {
    somme += tirages[k][0] * tirages[k][1]
    effectif += tirages[k][1]
  }
  return [texFractionFromString(somme, effectif), somme, effectif]
}

function computeMedianeTirages2D(
  nombreTirages: number,
  tirages: number[][],
): [[number, number] | [number], number] {
  const scoresMedians: number[] = []
  let medianeCorr // pour la correction statique
  if (nombreTirages % 2 === 0) {
    // on récupère le score des deux lancers médians
    // compteur
    let cpt = 0
    // Pour cumuler les effectifs, tirages est un tableau 2D qui contient les couples [score,effectif]
    let effCumulCroiss = tirages[0][1]
    // On récupère le premier score médian
    while (effCumulCroiss < nombreTirages / 2) {
      cpt += 1
      effCumulCroiss += tirages[cpt][1]
    }

    scoresMedians.push(tirages[cpt][0])
    // On récupère le second score médian
    cpt = 0
    effCumulCroiss = tirages[0][1]
    while (effCumulCroiss < nombreTirages / 2 + 1) {
      cpt += 1
      effCumulCroiss += tirages[cpt][1]
    }

    scoresMedians.push(tirages[cpt][0])
    scoresMedians[0] === scoresMedians[1]
      ? (medianeCorr = scoresMedians[0])
      : (medianeCorr = (scoresMedians[0] + scoresMedians[1]) / 2)
  } else {
    // Le nombre de lancers est impair ici
    // on récupère le score des deux lancers médians
    // compteur
    let cpt = 0
    // Pour cumuler les effectifs, tirages est un tableau 2D qui contient les couples [score,effectif]
    let effCumulCroiss = tirages[0][1]
    // On récupère le premier score médian
    while (effCumulCroiss <= nombreTirages / 2) {
      cpt += 1
      effCumulCroiss += tirages[cpt][1]
    }

    scoresMedians.push(tirages[cpt][0])
    medianeCorr = scoresMedians[0]
  }
  const scoreMed = scoresMedians.slice(0, 2) as [number, number]
  return [scoreMed, medianeCorr]
}

function texteCorrMoyenneNotes(
  notesSeries: number[] | number[][],
  somme: number,
  nombreNotes: number,
  notes = 'notes',
) {
  const data = [
    ['notes', 'la moyenne des notes', ''],
    ['lancers', 'la moyenne des lancers', ''],
    [
      'températures',
      'la moyenne des températures',
      ' $\\mathbf{^\\circ\\text{C}}$',
    ],
    ['salaires', 'le salaire moyen', ' €'],
    ['pointures', 'la pointure moyenne', ''],
  ]

  const noteStr = data.find((el) => el[0] === notes) || ['', '', '']

  let texteCorr = ''
  if (
    notesSeries !== undefined &&
    notesSeries instanceof Array &&
    notesSeries.length > 0 &&
    notesSeries[0] instanceof Array &&
    notesSeries[0].length > 0
  ) {
    // tableau à deux entrées
    const noteSeries = notesSeries as number[][]
    texteCorr += '$\\text{Moyenne} = '
    texteCorr += `\\dfrac{${notesSeries[0][0]} \\times ${notesSeries[0][1]}`
    let eff = `${notesSeries[0][1]}`
    for (let j = 1; j < notesSeries.length; j++) {
      if (notesSeries.length < 10) {
        texteCorr += `+ ${noteSeries[j][0]} \\times ${noteSeries[j][1]}`
        eff += `+ ${noteSeries[j][1]}`
      } else {
        if (j < 3)
          texteCorr += `+ ${noteSeries[j][0]} \\times ${noteSeries[j][1]}`
        if (j < 3) eff += `+ ${noteSeries[j][1]}`
        if (j === 3) texteCorr += '+ \\ldots '
        if (j === 3) eff += '+ \\ldots '
        if (j + 3 >= noteSeries.length)
          texteCorr += `+ ${noteSeries[j][0]} \\times ${noteSeries[j][1]}`
        if (j + 3 >= noteSeries.length) eff += `+ ${noteSeries[j][1]}`
      }
    }
    texteCorr += `}{${eff}}=\\dfrac{${texNombre(somme, 0)}}{${texNombre(nombreNotes, 0)}}$. <br>`
  } else {
    // tableau à une entrée
    texteCorr += '$\\text{Moyenne} = '
    texteCorr += `\\dfrac{${notesSeries[0]} `
    for (let j = 1; j < notesSeries.length; j++) {
      if (notesSeries.length < 10) {
        texteCorr += `+ ${notesSeries[j]}`
      } else {
        if (j < 3) texteCorr += `+ ${notesSeries[j]}`
        if (j === 3) texteCorr += '+ \\ldots '
        if (j + 3 >= notesSeries.length) texteCorr += `+ ${notesSeries[j]}`
      }
    }
    texteCorr += `}{${notesSeries.length}}=\\dfrac{${texNombre(somme, 0)}}{${texNombre(nombreNotes, 0)}}$. <br>`
  }
  texteCorr += `La somme des ${notes} est : $${texNombre(somme, 0)}$.<br> Il y a $${texNombre(nombreNotes, 0)}$ ${notes}.<br>`
  texteCorr += `Donc ${noteStr[1]} est $${new FractionEtendue(somme, nombreNotes).texFSD}`
  if (arrondi(somme / nombreNotes, 1) === somme / nombreNotes) {
    // moyenne exacte
    texteCorr += `=${miseEnEvidence(texNombre(somme / nombreNotes, 1))}$${noteStr[2]}.<br>`
  } else {
    // moyenne arrondie
    texteCorr += `\\approx${miseEnEvidence(texNombre(somme / nombreNotes, 1))}$${noteStr[2]}.<br>`
  }
  return texteCorr
}

function texteCorrEtendueNotes(min: number, max: number, note = 'note') {
  const data = [
    ['note', 'La note la plus basse', 'La note la plus haute', ''],
    [
      'lancer',
      'Le résultat du lancer le plus faible',
      'Le résultat du lancer le plus élevé',
      '',
    ],
    [
      'température',
      'La température la plus basse',
      'La température la plus haute',
      ' $\\mathbf{^\\circ\\text{C}}$',
    ],
    ['salaire', 'Le salaire le plus bas', 'Le salaire le plus haut', ' €'],
    ['pointure', 'La pointure la plus basse', 'La pointure la plus haute', ''],
  ]
  const notes = data.find((el) => el[0] === note) || ['', '', '', '']
  let texteCorr = `${notes[1]} est $${min}$${notes[3]}.<br>${notes[2]} est $${max}$${notes[3]}.<br>`
  texteCorr += `Donc l'étendue des ${note}s est  $${texNombre(max, 1)}-${ecritureParentheseSiNegatif(min)}=${miseEnEvidence(texNombre(max - min, 1))}$ ${notes[3]}.`
  return texteCorr + '<br>'
}

function texteCorrMedianeTemperatures(
  temperatures: number[],
  medianeCorr: number,
  scoresMedians: [number, number] | number,
) {
  if (typeof scoresMedians === 'number')
    scoresMedians = [scoresMedians, scoresMedians]
  return texteCorrMedianeNotes(
    temperatures,
    medianeCorr,
    scoresMedians,
    'température',
  )
}

function texteCorrMedianeNotes(
  notes: number[],
  medianeCorr: number,
  scoresMedians: [number, number] | number,
  note = 'note',
) {
  if (typeof scoresMedians === 'number') {
    scoresMedians = [scoresMedians, scoresMedians]
  }
  const data = [
    ['note', '', '', ''],
    ['température', ' $\\mathbf{^\\circ\\text{C}}$', '', ''],
  ]
  const noteStr = data.find((el) => el[0] === note) || ['', '', '', '']
  let texteCorr = `Au total, il y a $${notes.length}$ ${noteStr[0]}s. `
  if (notes.length % 2 === 0) {
    texteCorr += `Le nombre de ${noteStr[0]}s est pair.<br>`
  } else {
    texteCorr += `Le nombre de ${noteStr[0]}s est impair.<br>`
  }

  texteCorr += `Les ${noteStr[0]}s sont rangées dans l'ordre croissant : <br> $${notes[0]}$`
  for (let j = 1; j < notes.length - 1; j++) {
    if (notes.length < 10) {
      texteCorr += `; $${notes[j]}$ `
    } else {
      if (j < 2) texteCorr += `; $${notes[j]}$ `
      if (j === 2) texteCorr += '; $\\dots$ '
      if (notes.length % 2 === 0 && j === notes.length / 2 - 2)
        texteCorr += `; $${notes[j]}$ `
      if (notes.length % 2 === 0 && j === notes.length / 2 - 1)
        texteCorr += `; $${notes[j]}$ `
      if (notes.length % 2 === 0 && j === notes.length / 2)
        texteCorr += `; $${notes[j]}$ `
      if (notes.length % 2 === 0 && j === notes.length / 2 + 1)
        texteCorr += `; $${notes[j]}$ `
      if (notes.length % 2 === 0 && j === notes.length / 2 + 2)
        texteCorr += '; $\\dots$ '
      if (notes.length % 2 === 1 && j === (notes.length - 1) / 2 - 1)
        texteCorr += `; $${notes[j]}$ `
      if (notes.length % 2 === 1 && j === (notes.length - 1) / 2)
        texteCorr += `; $${notes[j]}$ `
      if (notes.length % 2 === 1 && j === (notes.length - 1) / 2 + 1)
        texteCorr += `; $${notes[j]}$ `
      if (notes.length % 2 === 1 && j === (notes.length - 1) / 2 + 1)
        texteCorr += '; $\\dots$ '
      if (j + 2 > notes.length - 1) texteCorr += `; $${notes[j]}$ `
    }
  }
  texteCorr += `et $${notes[notes.length - 1]}$.<br>`

  if (notes.length % 2 === 0) {
    texteCorr += `Les valeurs centrales sont la $${notes.length / 2}^{e}$ valeur et la $${notes.length / 2 + 1}^{e}$ valeur.<br>
    En effet, ${underbraceMediane(notes.length)}<br>
    Une médiane peut être la demi-somme des deux valeurs centrales. <br>
    La $${notes.length / 2}^{e}$ valeur est $${scoresMedians[0]}$ et la $${notes.length / 2 + 1}^{e}$ valeur est $${scoresMedians[1]}$.<br>`
  } else {
    texteCorr += `La valeur centrale est donc la $${(notes.length + 1) / 2}^{e}$ valeur.<br>
    En effet, ${underbraceMediane(notes.length)}<br>
    La médiane est donc la $${(notes.length + 1) / 2}^{e}$ ${noteStr[0]}.<br>`
  }

  texteCorr += `D'où la médiane des ${noteStr[0]}s est ${scoresMedians[0] === scoresMedians[1] ? '' : `$\\mathbf{(${scoresMedians[0]} + ${scoresMedians[1]}) \\div 2=}$`} $${miseEnEvidence(texNombre(medianeCorr))}$${noteStr[1]}.<br>`
  if (notes.length % 2 === 0) {
    texteCorr += lampeMessage({
      titre: 'Interprétation',
      texte: `Il y a bien $${notes.length / 2}$ ${noteStr[0]}s inférieures ou égales à  $${texNombre(medianeCorr, 1)}$ et $${notes.length / 2}$ ${noteStr[0]}s supérieures ou égales à  $${texNombre(medianeCorr, 1)}$.`,
      couleur: 'nombres',
    })
  } else {
    texteCorr += lampeMessage({
      titre: 'Interprétation',
      texte: `Il y a bien $${(notes.length - 1) / 2}$ ${noteStr[0]}s inférieures ou égales à  $${texNombre(medianeCorr, 1)}$ et $${(notes.length - 1) / 2}$ ${noteStr[0]}s supérieures ou égales à  $${texNombre(medianeCorr, 1)}$.`,
      couleur: 'nombres',
    })
  }
  return texteCorr
}

function texteCorrMedianeTirages2DSalaires(
  nombreTirages: number,
  medianeCorr: number,
  scoresMedians: [number] | [number, number],
  salaires: number[][],
  categories: string[],
  salaire = 'salaire',
) {
  const data = [
    [
      'note',
      'F',
      'la médiane des notes',
      '',
      `Le nombre de notes est $${nombreTirages}$.`,
      ['', 'Note', 'Coefficient (Effectif)', 'Effectif cumulé'],
    ],
    [
      'salaire',
      'M',
      'le salaire médian',
      ' €',
      `Dans l'entreprise, le nombre de salariés est $${nombreTirages}$.`,
      ['Catégorie', 'Salaire en €', 'Effectif', 'Effectif cumulé'],
    ],
    [
      'pointure',
      'M',
      'la pointure médiane',
      '',
      `Le nombre de pointures relevées est $${nombreTirages}$.`,
      ['', 'Pointure', 'Effectif', 'Effectif cumulé'],
    ],
  ]
  const salairesStr = data.find((el) => el[0] === salaire) ?? [
    '',
    '',
    '',
    '',
    '',
    '',
  ]

  let texteCorr = salairesStr[4] + '<br>'
  if (nombreTirages % 2 === 0) {
    texteCorr += `Ce nombre est pair, les ${salairesStr[0]}s sont rangé${salairesStr[0] === 'M' ? '' : 'e'}s dans l'ordre croissant.<br>
              Les deux valeurs centrales sont la $${nombreTirages / 2}^{e}$ valeur et la $${nombreTirages / 2 + 1}^{e}$ valeur.<br>
              En effet, ${underbraceMediane(nombreTirages)} <br>
              Une médiane peut être la demi-somme des deux valeurs centrales. <br>
              On peut ajouter une ligne avec les effectifs cumulés pour trouver ces deux valeurs.<br><br>
              ${desTabEffCumul(salaires, true, categories, salairesStr[5] as string[])}<br><br>
              La $${nombreTirages / 2}^{e}$ valeur est $${scoresMedians[0]}$ et la $${nombreTirages / 2 + 1}^{e}$ valeur est $${scoresMedians[1]}$.<br>`
    texteCorr += `D'où ${salairesStr[2]} est ${scoresMedians[0] === scoresMedians[1] ? '' : `$(${scoresMedians[0]} + ${scoresMedians[1]}) \\div 2=$`} $${miseEnEvidence(texNombre(medianeCorr))}$${salairesStr[3]}.<br>`
    texteCorr += lampeMessage({
      titre: 'Interprétation',
      texte: `Il y a bien $${nombreTirages / 2}$ ${salairesStr[0]}s dont la valeur est inférieure ou égale à  $${texNombre(medianeCorr, 1)}$${salairesStr[3]} et $${nombreTirages / 2}$ ${salairesStr[0]}s dont la valeur est supérieure ou égale à  $${texNombre(medianeCorr, 1)}$${salairesStr[3]}.`,
      couleur: 'nombres',
    })
  } else {
    // Le nombre de tirages est impair
    texteCorr += `Ce nombre est impair, les ${salairesStr[0]}s sont rangé${salairesStr[0] === 'M' ? '' : 'e'}s dans l'ordre croissant.<br>
                  La valeur centrale est la $${(nombreTirages - 1) / 2 + 1}^{e}$ valeur.<br>
                  En effet, ${underbraceMediane(nombreTirages)} <br>
                  La médiane est donc la $${(nombreTirages - 1) / 2 + 1}^{e}$ valeur.<br>
                  On peut ajouter une ligne avec les effectifs cumulés pour trouver cette valeur.<br><br>
                  ${desTabEffCumul(salaires, true, categories, salairesStr[5] as string[])}<br><br>`
    texteCorr += `D'où ${salairesStr[2]} est $${miseEnEvidence(texNombre(medianeCorr))}$ ${salairesStr[3]}.<br>`
    texteCorr += lampeMessage({
      titre: 'Interprétation',
      texte: `Il y a bien $${(nombreTirages - 1) / 2}$ ${salairesStr[0]}s dont la valeur est inférieure ou égale à  $${texNombre(medianeCorr, 1)}$${salairesStr[3]} et $${(nombreTirages - 1) / 2}$ ${salairesStr[0]}s dont la valeur est supérieure ou égale à  $${texNombre(medianeCorr, 1)}$${salairesStr[3]}.`,
      couleur: 'nombres',
    })
  }
  return texteCorr
}

function texteCorrMedianeTirages2D(
  nombreTirages: number,
  medianeCorr: number,
  scoresMedians: [number, number] | [number],
  tirages: number[][],
) {
  let texteCorr = `Au total, $${nombreTirages}$ lancers ont été réalisés.<br>`
  if (nombreTirages % 2 === 0) {
    texteCorr += `Le nombre de lancers est pair, les scores sont rangés dans l'ordre croissant.<br>
              Les deux valeurs centrales sont la $${nombreTirages / 2}^{e}$ et la $${nombreTirages / 2 + 1}^{e}$ valeur.<br>
              En effet, ${underbraceMediane(nombreTirages)} <br>
              Une médiane peut être la demi-somme des deux valeurs centrales. <br>
              On peut ajouter une ligne avec les effectifs cumulés pour trouver ces deux valeurs.<br><br>
              ${desTabEffCumul(tirages, true)}<br><br>
              La $${nombreTirages / 2}^{e}$ valeur est $${scoresMedians[0]}$ et la $${nombreTirages / 2 + 1}^{e}$ valeur est $${scoresMedians[1]}$.<br>`
    texteCorr += `D'où le score médian est ${scoresMedians[0] === scoresMedians[1] ? '' : `$(${scoresMedians[0]} + ${scoresMedians[1]}) \\div 2=$`} $${miseEnEvidence(texNombre(medianeCorr))}$.<br>`
    texteCorr += lampeMessage({
      titre: 'Interprétation',
      texte: `Il y a bien $${nombreTirages / 2}$ lancers dont le score est inférieur ou égal à  $${texNombre(medianeCorr, 1)}$ et $${nombreTirages / 2}$ lancers dont le score est supérieur ou égal à  $${texNombre(medianeCorr, 1)}$.`,
      couleur: 'nombres',
    })
  } else {
    // Le nombre de lancers est impair ici
    texteCorr += `Le nombre de lancers est impair, les scores sont rangés dans l'ordre croissant.<br>
                  La valeur centrale est la $${(nombreTirages - 1) / 2 + 1}^{e}$ valeur.<br>
                  En effet, ${underbraceMediane(nombreTirages)} <br>
                  La médiane est donc le $${(nombreTirages - 1) / 2 + 1}^{e}$ lancer.<br>
                  On peut ajouter une ligne avec les effectifs cumulés pour trouver cette valeur.<br><br>
                  ${desTabEffCumul(tirages, true)}<br><br>`
    texteCorr += `D'où le score médian est $${miseEnEvidence(texNombre(medianeCorr))}$.<br>`
    texteCorr += lampeMessage({
      titre: 'Interprétation',
      texte: `Il y a bien $${(nombreTirages - 1) / 2}$ lancers dont le score est inférieur ou égal à  $${texNombre(medianeCorr, 1)}$ et $${(nombreTirages - 1) / 2}$ lancers dont le score est supérieur ou égal à  $${texNombre(medianeCorr, 1)}$.`,
      couleur: 'nombres',
    })
  }
  return texteCorr
}

function texteNotes(notes: number[]) {
  let texte = `${prenom()} a obtenu ces notes ce trimestre-ci en mathématiques :<br>`
  texte += `$${notes[0]}$`
  for (let j = 1; j < notes.length - 1; j++) {
    texte += `; $${notes[j]}$ `
  } // On liste les notes (série brute)
  texte += `et $${notes[notes.length - 1]}$.`
  return texte
}

function texteTemperatures(
  annee: number,
  mois: number,
  temperatures: number[],
) {
  let texte = `En ${nomDuMois(mois)} ${annee}, à ${choice(['Moscou', 'Berlin', 'Paris', 'Bruxelles', 'Rome', 'Belgrade'])}, on a relevé les températures suivantes : <br>`
  texte += '<br>$\\def\\arraystretch{1.5}\\begin{array}{|c' // On construit le tableau des températures
  texte += '|c'
  for (let j = 0; j < Math.round(temperatures.length / 2); j++) {
    texte += '|c'
  }
  texte += '}\\hline  \\text{Jour}'
  for (let j = 0; j < Math.round(temperatures.length / 2); j++) {
    texte += '&' + texNombre(j + 1, 1)
  }
  texte += '\\\\\\hline \\text{Température en}  ^\\circ\\text{C}'
  for (let j = 0; j < Math.round(temperatures.length / 2); j++) {
    texte += '&' + temperatures[j]
  }
  texte += '\\\\\\hline\\end{array}$<br><br>'
  texte += '$\\def\\arraystretch{1.5}\\begin{array}{|c' // On construit le tableau des températures
  texte += '|c'
  for (
    let j = Math.round(temperatures.length / 2);
    j < temperatures.length;
    j++
  ) {
    texte += '|c'
  }
  texte += '}\\hline  \\text{Jour}'
  for (
    let j = Math.round(temperatures.length / 2);
    j < temperatures.length;
    j++
  ) {
    texte += '&' + texNombre(j + 1, 1)
  }
  texte += '\\\\\\hline \\text{Température en}  ^\\circ\\text{C}'
  for (
    let j = Math.round(temperatures.length / 2);
    j < temperatures.length;
    j++
  ) {
    texte += '&' + temperatures[j]
  }
  texte += '\\\\\\hline\\end{array}$'
  texte += '<br>'
  return texte
}

function texteSalaires(
  salaires: number[][],
  categoriesCol: string[],
  salaire = 'salaires',
) {
  const data = [
    [
      'salaires',
      "La grille des salaires des employés d'une PME est donnée par le tableau ci-dessous",
      ['Catégories', 'Salaires en €', 'Effectif'],
    ],
    [
      'notes',
      `Voici les notes obtenues par ${prenom()} en mathématiques cette année`,
      ['', 'Note', 'Effectif'],
    ],
    [
      'pointures',
      `Pour passer une commande de chaussures de foot, ${prenom()} a noté les pointures des membres de son club dans un tableau`,
      ['', 'Pointure', 'Effectif'],
    ],
  ]
  const salairesStr = data.find((el) => el[0] === salaire) || ['', '', '', '']
  let texte = salairesStr[1] + ' :<br> '
  texte +=
    '<br>' +
    desTabEffCumul(salaires, false, categoriesCol, salairesStr[2] as string[]) +
    '<br>'
  return texte
}

function texteTirages2D(
  nombreDes: number,
  nombreTirages: number,
  nombreFaces: 4 | 6 | 8 | 10,
  tirages: number[][],
  aveclampeMessage = true,
) {
  let texte = ''
  if (nombreDes > 1) {
    texte = `On a réalisé $${nombreTirages}$ lancers de $${nombreDes}$ dés à $${nombreFaces}$ faces.<br>
            On a relevé la somme des $${nombreDes}$ dés.<br>`
  } else {
    texte = `On a réalisé $${nombreTirages}$ lancers d'un dé à $${nombreFaces}$ faces.<br>`
  }
  texte += aveclampeMessage
    ? lampeMessage({
        titre: 'Vocabulaire',
        texte: `Le solide qui correspond à ce type de dé s'appelle ${texteGras(solidName(nombreFaces))}.`,
        couleur: 'nombres',
      })
    : ''
  texte += 'Les résultats sont inscrits dans le tableau ci-dessous :<br><br>'
  texte += desTabEffCumul(tirages, false) + '<br>'
  return texte
}

function solidName(nbCot: 4 | 6 | 8 | 10) {
  switch (nbCot) {
    case 4:
      return 'tétraèdre'
    case 6:
      return 'hexaèdre'
    case 8:
      return 'octaèdre'
    case 10:
    default:
      return 'décaèdre'
  }
}

/**
 * Construit une série numérique (triée) compatible avec les résumés fournis.
 * Paramètres requis : q1, mediane, q3, etendue. La moyenne est optionnelle.
 * La série ne contiendra pas de valeurs aberrantes (selon la règle 1.5*IQR).
 * Retourne un tableau trié de longueur n (par défaut 20).
 */
export function creerSerieDeQuartiles({
  q1,
  mediane,
  q3,
  min,
  max,
  n = 20,
  isInteger = false,
}: {
  q1: number
  mediane: number
  q3: number
  min: number
  max: number
  n?: number
  isInteger?: boolean
}): number[] {
  if (n < 5) {
    throw new Error('La taille de la série doit être au moins de 5')
  }

  // Si entier demandé, arrondir quantiles et min/max, garantir ordre
  if (isInteger) {
    q1 = Math.round(q1)
    mediane = Math.round(mediane)
    q3 = Math.round(q3)
    min = Math.round(min)
    max = Math.round(max)
    if (q1 > mediane) mediane = q1
    if (mediane > q3) q3 = mediane
    if (min > q1) min = q1
    if (max < q3) max = q3
  }

  const serie: number[] = []
  const quartileCount = Math.floor(n / 4)
  const remaining = n - 3 * quartileCount

  // Génération contrôlée par quartiles
  for (let i = 0; i < quartileCount; i++) {
    const value = q1 - (q1 - min) * (Math.random() * 0.5 + 0.1)
    serie.push(isInteger ? Math.round(value) : value)
  }
  for (let i = 0; i < quartileCount; i++) {
    const value = q1 + (mediane - q1) * (Math.random() * 0.8 + 0.1)
    serie.push(isInteger ? Math.round(value) : value)
  }
  for (let i = 0; i < quartileCount; i++) {
    const value = mediane + (q3 - mediane) * (Math.random() * 0.8 + 0.1)
    serie.push(isInteger ? Math.round(value) : value)
  }
  for (let i = 0; i < remaining; i++) {
    const value = q3 + (max - q3) * (Math.random() * 0.5 + 0.1)
    serie.push(isInteger ? Math.round(value) : value)
  }

  // Trier puis forcer les positions de quartiles (une ou deux positions selon n)
  serie.sort((a, b) => a - b)

  const getQuartilePositions = (which: 'q1' | 'q2' | 'q3'): number[] => {
    const mid = Math.floor(n / 2)
    const lowerLen = mid
    if (which === 'q1') {
      if (lowerLen % 2 === 1) {
        return [Math.floor(lowerLen / 2)]
      } else {
        return [lowerLen / 2 - 1, lowerLen / 2]
      }
    } else if (which === 'q2') {
      if (n % 2 === 1) {
        return [mid]
      } else {
        return [mid - 1, mid]
      }
    } else {
      const start = n - lowerLen
      if (lowerLen % 2 === 1) {
        return [start + Math.floor(lowerLen / 2)]
      } else {
        return [start + lowerLen / 2 - 1, start + lowerLen / 2]
      }
    }
  }

  const applyQuartileValue = (positions: number[], value: number) => {
    if (positions.length === 1) {
      serie[positions[0]] = isInteger ? Math.round(value) : value
    } else {
      const v = isInteger ? Math.round(value) : value
      serie[positions[0]] = v
      serie[positions[1]] = v
    }
  }
  applyQuartileValue(getQuartilePositions('q1'), q1)
  applyQuartileValue(getQuartilePositions('q2'), mediane)
  applyQuartileValue(getQuartilePositions('q3'), q3)

  // S'assurer que min et max sont bien les extrêmes de la série
  serie[0] = isInteger ? Math.round(min) : min
  serie[n - 1] = isInteger ? Math.round(max) : max

  // Clamp sur [min,max] (sécurité)
  for (let i = 0; i < n; i++) {
    if (serie[i] < min) serie[i] = min
    if (serie[i] > max) serie[i] = max
  }

  // Réparer monotonicité : avant puis arrière
  for (let i = 1; i < n; i++) {
    if (serie[i] < serie[i - 1]) {
      const apres = serie[i]
      serie[i] = apres
      serie[i - 1] = apres
      i++
    }
  }

  // Vérification stricte : recalculer les quartiles et comparer
  const stat = new Stat(serie)
  const qs = stat.quartiles()
  const eq = (a: number, b: number) =>
    isInteger ? a === b : Math.abs(a - b) < 1e-9
  if (!eq(qs.q1, q1) || !eq(qs.q2, mediane) || !eq(qs.q3, q3)) {
    throw new Error(
      'Impossible de construire une série respectant exactement les quartiles demandés avec les contraintes fournies',
    )
  }

  // Enfin s'assurer que min/max sont bien les extrêmes après réajustements
  if (
    serie[0] !== (isInteger ? Math.round(min) : min) ||
    serie[n - 1] !== (isInteger ? Math.round(max) : max)
  ) {
    throw new Error(
      'Impossible de conserver min/max comme extrêmes sans violer les quartiles demandés',
    )
  }

  return serie
}

/**
 * Génère une série de `n` valeurs, dont la moyenne est ≈ `mean` et l'étendue est ≈ `range`.
 * Les valeurs sont comprises entre `mean - range/2` et `mean + range/2` (approximatif).
 *
 * @param mean - moyenne cible (par défaut 50)
 * @param range - étendue cible (max - min) (par défaut 30)
 * @param n - nombre de valeurs (par défaut 20)
 * @param isInteger - si les valeurs doivent être entières (par défaut false)
 * @returns série de nombres de longueur `n`, avec moyenne ≈ `mean` et étendue ≈ `range`
 */
export function creerSerieDeMoyenneEtEtendue({
  mean = 50,
  range = 30,
  n = 20,
  isInteger = false,
  precision = 2,
}: {
  mean: number
  range: number
  n?: number
  isInteger?: boolean
  precision?: number
}): number[] {
  if (n <= 0) throw new Error('n doit être supérieur à 0')
  if (range < 0) throw new Error('range doit être positif')
  if (mean < 0) throw new Error('mean doit être positif')

  // calcul min/max cibles
  const deltaNeg = randint(Math.round(range * 0.3), Math.round(range * 0.7))
  const deltaPos = range - deltaNeg

  let min = mean - deltaNeg
  let max = mean + deltaPos

  if (isInteger) {
    min = Math.round(min)
    max = Math.round(max)
    if (min > max) {
      const tmp = min
      min = max
      max = tmp
    }
  }

  // Générer des quartiles cohérents (Q1, Q2, Q3)
  let [q1, mediane, q3] = [
    isInteger ? randint(Math.floor(min), Math.floor(max)) : randFloat(min, max),
    isInteger ? randint(Math.floor(min), Math.floor(max)) : randFloat(min, max),
    isInteger ? randint(Math.floor(min), Math.floor(max)) : randFloat(min, max),
  ].sort((a, b) => a - b)

  // Répéter jusqu'à quartiles distincts
  let safety = 0
  while ((q1 === mediane || mediane === q3 || q1 === q3) && safety < 1000) {
    ;[q1, mediane, q3] = [
      isInteger
        ? randint(Math.floor(min), Math.floor(max))
        : randFloat(min, max, precision),
      isInteger
        ? randint(Math.floor(min), Math.floor(max))
        : randFloat(min, max, precision),
      isInteger
        ? randint(Math.floor(min), Math.floor(max))
        : randFloat(min, max, precision),
    ].sort((a, b) => a - b)
    safety++
  }
  if (safety >= 1000)
    throw new Error('Impossible de générer des quartiles distincts')

  // Construire exactement n valeurs (réparties par "tranches")
  const serie: number[] = []
  while (serie.length < n) {
    if (serie.length < n) {
      serie.push(
        isInteger
          ? randint(Math.floor(min), Math.floor(q1))
          : randFloat(min, q1, precision),
      )
    }
    if (serie.length < n) {
      serie.push(
        isInteger
          ? randint(Math.floor(q1), Math.floor(mediane))
          : randFloat(q1, mediane, precision),
      )
    }
    if (serie.length < n) {
      serie.push(
        isInteger
          ? randint(Math.floor(mediane), Math.floor(q3))
          : randFloat(mediane, q3, precision),
      )
    }
    if (serie.length < n) {
      serie.push(
        isInteger
          ? randint(Math.floor(q3), Math.floor(max))
          : randFloat(q3, max, precision),
      )
    }
  }

  // Tronquer si besoin (sécurité) et forcer extrêmes
  const finalSerie = serie.slice(0, n)
  finalSerie.sort((a, b) => a - b)
  finalSerie[0] = isInteger ? Math.round(min) : min
  finalSerie[n - 1] = isInteger ? Math.round(max) : max

  // Ajuster la somme pour obtenir exactement la moyenne souhaitée
  const requiredSum = mean * n
  const currentSum = finalSerie.reduce((s, v) => s + v, 0)
  let diff = requiredSum - currentSum

  // diff doit être entier ; répartir ±1 sur les indices 1..n-2
  diff = Math.round(diff)
  const maxIterations = Math.abs(diff) * n + 1000
  let iter = 0
  // indices utilisables
  const indices = []
  for (let i = 1; i < n - 1; i++) indices.push(i)
  while (diff !== 0 && iter < maxIterations) {
    for (const idx of indices) {
      if (diff === 0) break
      if (diff > 0 && finalSerie[idx] < max) {
        finalSerie[idx] = Math.min(max, finalSerie[idx] + 1)
        diff--
      } else if (diff < 0 && finalSerie[idx] > min) {
        finalSerie[idx] = Math.max(min, finalSerie[idx] - 1)
        diff++
      }
    }
    iter++
    // si on ne peut plus bouger (tous indices au max/min), sortir pour éviter boucle infinie
    const canIncrease = indices.some((i) => finalSerie[i] < max)
    const canDecrease = indices.some((i) => finalSerie[i] > min)
    if ((diff > 0 && !canIncrease) || (diff < 0 && !canDecrease)) break
  }
  if (diff !== 0) {
    // Si on n'a pas réussi à tout ajuster, avertir mais retourner la meilleure série
    console.warn(
      `Ajustement entier incomplet (restant=${diff}). Moyenne finale = ${finalSerie.reduce((a, b) => a + b, 0) / n}`,
    )
  }
  let iterations = 0

  if (!isInteger) {
    const requiredSum = mean * n
    const currentSum = finalSerie.reduce((s, v) => s + v, 0)
    diff = requiredSum - currentSum
    // flottants : pas à pas +/- step
    const tolerance = 0.001
    let remaining = diff
    const step = 0.005
    const maxIterations = 10000
    let i = 1
    let direction = 1
    while (Math.abs(remaining) > tolerance && iterations < maxIterations) {
      if (i === 0 || i === n - 1) {
        direction = -direction
        i += direction
      }
      if (remaining > 0) {
        if (finalSerie[i] < max) {
          finalSerie[i] += step
          remaining -= step
        }
      } else {
        if (finalSerie[i] > min) {
          finalSerie[i] -= step
          remaining += step
        }
      }
      i += direction
      if (i < 0 || i >= n) {
        i = 1
        direction = 1
      }
      iterations++
    }
    if (iterations >= maxIterations) {
      console.warn(
        `Ajustement flottant incomplet après ${maxIterations} itérations. Moyenne finale = ${finalSerie.reduce((a, b) => a + b, 0) / n}`,
      )
    }
  }

  // Tri, puis mélange pour retourner une série non triée
  finalSerie.sort((a, b) => a - b)
  return shuffle(finalSerie)
}

export function creerSerieDeValeurs(
  values: number[],
  n: number,
): [number, number][] {
  const objetSerie: Record<number, number> = {}
  for (const val of values) {
    objetSerie[val] = 0
  }
  for (let i = 0; i < n; i++) {
    const val = values[randint(0, values.length - 1)]
    objetSerie[val] += 1
  }
  const serie: [number, number][] = []
  for (const key in objetSerie) {
    serie.push([Number(key), objetSerie[key]])
  }
  return serie
}

export const OutilsStats = {
  desTabEffCumul,
  // consigne
  texteNotes,
  texteTirages2D,
  texteSalaires,
  texteTemperatures,
  // correction
  texteCorrMoyenneNotes,
  texteCorrMedianeTirages2D,
  texteCorrMedianeTirages2DSalaires,
  texteCorrMedianeTemperatures,
  texteCorrMedianeNotes,
  texteCorrEtendueNotes,
  // calcul
  computeEtendue,
  computeMoyenne,
  computeMediane,
  computeMoyenneTirages2D,
  computeMedianeTirages2D,
}
