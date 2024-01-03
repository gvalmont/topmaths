import { readFileSync } from 'fs'
import * as fs from 'fs'
import * as path from 'path'
import { exec } from 'child_process'

const niveauxSequences = JSON.parse(readFileSync('./src/topmaths/json/sequences_modifiees.json').toString())
const fichesPrecedentes = {
  '6e': {},
  '5e': {},
  '4e': {},
  '3e': {}
}
let fichePrecedenteSequence = {}

for (const niveauSequence of niveauxSequences) {
  for (const sequence of niveauSequence.sequences) {
    if (coursDeUnObjectifTrouve(sequence)) genererTypCoursSequence(sequence)
    genererTypFichesSequence(sequence)
  }
}
compilerTyp()

function coursDeUnObjectifTrouve (sequence) {
  for (const objectif of sequence.objectifs) {
    if (fs.existsSync(`./src/topmaths/typ/cours/objectifs/${objectif.niveau}/${objectif.reference}.typ`)) return true
  }
  return false
}

function genererTypCoursSequence (sequence) {
  let typCoursSequence = ''
  typCoursSequence += `#import "../../../preambule_sequence.typ": * 
`
  typCoursSequence += creerEnTete(sequence)
  for (const objectif of sequence.objectifs) {
    typCoursSequence += genererTypCoursObjectif(objectif, sequence)
  }
  fs.writeFileSync(`./src/topmaths/typ/cours/sequences/${sequence.niveau}/${sequence.reference}.typ`, typCoursSequence, 'utf8')
}

function creerEnTete (sequence) {
  let enTete = `#show: doc => sequence(doc, title: "Séquence ${sequence.numero} : ${sequence.titre}")
#objectifs()[
`
  for (const objectif of sequence.objectifs) {
    const estObjectifExtra = objectif.reference.slice(1, 2) !== 'X'
    if (estObjectifExtra) {
      enTete += `
        - ${objectif.reference} : ${objectif.titreSimplifie === undefined || objectif.titreSimplifie === '' ? objectif.titre : objectif.titreSimplifie}`
    }
  }
  enTete += `
  ]
`
  return enTete
}

function genererTypCoursObjectif (objectif, sequence) {
  if (!fs.existsSync(`./src/topmaths/typ/cours/objectifs/${objectif.niveau}/${objectif.reference}.typ`)) return ''
  let typObjectif = ''
  const titreObjectif = `
= ${objectif.titreSimplifie === undefined || objectif.titreSimplifie === '' ? objectif.titre : objectif.titreSimplifie}
`
  const coursObjectif = fs.readFileSync(`./src/topmaths/typ/cours/objectifs/${objectif.niveau}/${objectif.reference}.typ`, 'utf8')
  if (coursObjectif.includes('image("')) copierImages(objectif, sequence)
  typObjectif += titreObjectif
  typObjectif += coursObjectif
  return typObjectif
}

function copierImages (objectif, sequence) {
  const sourceDir = `./src/topmaths/typ/cours/objectifs/${objectif.niveau}/`
  const destinationDir = `./src/topmaths/typ/cours/sequences/${sequence.niveau}/`
  const filePrefix = objectif.reference
  const fileExtension = '.png'
  fs.readdir(sourceDir, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err)
      return
    }

    files.forEach(file => {
      if (file.startsWith(filePrefix) && file.endsWith(fileExtension)) {
        const sourceFilePath = path.join(sourceDir, file)
        const destinationFilePath = path.join(destinationDir, file)

        fs.copyFile(sourceFilePath, destinationFilePath, err => {
          if (err) {
            console.error('Error copying file:', err)
          }
        })
      }
    })
  })
}

function genererTypFichesSequence (sequence) {
  let nbFichesObjectifs = 0
  for (const objectifSequence of sequence.objectifs) {
    if (objectifSequence.fiches.length > 0) {
      genererTypFichesObjectif(objectifSequence, sequence.niveau)
      nbFichesObjectifs++
    }
  }
  if (nbFichesObjectifs > 0) genererTypFicheSequence(sequence)
}

function genererTypFichesObjectif (objectif, niveauSequence) {
  let indiceFiche = 0
  for (const fiche of objectif.fiches) {
    if (fiche.niveaux.length === 0 || fiche.niveaux.includes(niveauSequence)) {
      genererTypFicheObjectif(niveauSequence, objectif, fiche, indiceFiche)
      fichesPrecedentes[niveauSequence] = fiche
      indiceFiche++
    }
  }
}

function genererTypFicheObjectif (niveauSequence, objectif, fiche, indiceFiche) {
  const nombreTotalDeFiches = getNbFiches(objectif, niveauSequence)
  const plusieursFiches = nombreTotalDeFiches > 1
  const numeroFiche = indiceFiche + 1
  const sousTitre = `Fiche de séance${plusieursFiches ? ' ' + numeroFiche + ' / ' + nombreTotalDeFiches : ''}`
  fiche.reference = objectif.reference + (plusieursFiches ? '-' + numeroFiche : '')
  if (fichesPrecedentes[niveauSequence].reference !== undefined) remplacerPlaceholderMateriel(fiche, niveauSequence)
  let typObjectif = ''
  typObjectif += `#import "../../../preambule_fiche.typ": *
`
  typObjectif += `#show: doc => fiche(doc, titre: "${objectif.reference} : ${objectif.titre}", sousTitre: "${sousTitre}")

`
  typObjectif += getTypLignes('Matériel élève', fiche.materielEleve)
  typObjectif += getTypLignes('Matériel enseignant', fiche.materielEnseignant)
  if (fichesPrecedentes[niveauSequence].prochaineSeance !== undefined) {
    typObjectif += getTypLignes('Suite à la séance précédente', fichesPrecedentes[niveauSequence].prochaineSeance)
  }
  typObjectif += getTypLignes('Début de séance', fiche.debutDeSeance)
  typObjectif += getTypLignes('Déroulé', fiche.deroule)
  typObjectif += getTypLignes('Devoirs', fiche.devoirs)
  typObjectif += getTypLignes('Fin de séance', fiche.finDeSeance)
  typObjectif += 'placeholderMateriel'
  typObjectif += getTypLignes('Notes', fiche.notes)
  fs.writeFileSync(`./src/topmaths/typ/fiches/objectifs/${objectif.niveau}/${niveauSequence}_${fiche.reference}.typ`, typObjectif, 'utf8')
}

function getNbFiches (objectif, niveauSequence) {
  let nbFiches = 0
  for (const fiche of objectif.fiches) {
    if (fiche.niveaux.length === 0) nbFiches++
    else {
      for (const niveauFiche of fiche.niveaux) {
        if (niveauFiche === niveauSequence) nbFiches++
      }
    }
  }
  return nbFiches
}

function remplacerPlaceholderMateriel (fiche, niveauSequence) {
  const cheminFichePrecedente = `./src/topmaths/typ/fiches/objectifs/${fichesPrecedentes[niveauSequence].reference.slice(0, 1) + 'e'}/${niveauSequence}_${fichesPrecedentes[niveauSequence].reference}.typ`
  const data = fs.readFileSync(cheminFichePrecedente, 'utf8')
  let replacementString = ''
  if (fiche.materielEleve.length > 0) {
    replacementString += `#titreCategorie("Matériel à emmener la prochaine fois") :\\
`
    for (const materiel of fiche.materielEleve) {
      replacementString += `- ${materiel}\\
`
    }
  }
  const updatedData = data.replace('placeholderMateriel', replacementString)
  fs.writeFileSync(cheminFichePrecedente, updatedData, 'utf8')
}

function getTypLignes (titre, lignes) {
  let typLignes = ''
  if (lignes.length > 0) {
    if (titre !== '') {
      typLignes += `#titreCategorie("${titre}") :\\
`
    }
    for (const ligne of lignes) {
      if (titre === 'Matériel enseignant') {
        if (ligne.includes('_Cours') || ligne.includes('_Fiche') || ligne.includes('_Poly') || ligne.includes('_Presentation') || ligne.includes('Entrainement_') || ligne.includes('_Diaporama')) {
          const mots = ligne.split(' ')
          const nomFichier = mots.shift()
          let reste = ''
          if (mots[0] !== undefined) reste = mots.join(' ')
          typLignes += `- #lien("${nomFichier}")${reste !== '' ? ' ' + reste : ''}\\
`
        } else {
          typLignes += `- ${ligne}\\
`
        }
      } else {
        if (ligne.startsWith('-')) {
          typLignes += `  ${ligne}\\
`
        } else {
          typLignes += `- ${ligne}\\
`
        }
      }
    }
  }
  return typLignes
}

function genererTypFicheSequence (sequence) {
  let typSequence = ''
  typSequence += `#import "../../../preambule_fiche.typ": *
`
  typSequence += `#show: doc => fiche(doc, titre: "Séquence ${sequence.numero} : ${sequence.titre}", sousTitre: "Fiche de séquence", paysage: true)

#table(
  columns: 1,
  inset: 0pt,
  align: horizon,
  `
  let numeroSeance = 1
  for (const objectif of sequence.objectifs) {
    for (const fiche of objectif.fiches) {
      typSequence += `[ #titreObjectif("Séance ${numeroSeance} - ${objectif.reference} : ${objectif.titre}")\\
#v(-2em)
#block(inset: 10pt, [
`
      typSequence += getTypLignes('Matériel élève', fiche.materielEleve)
      typSequence += getTypLignes('Matériel enseignant', fiche.materielEnseignant)
      if (fichePrecedenteSequence.prochaineSeance !== undefined) {
        typSequence += getTypLignes('Suite à la séance précédente', fichePrecedenteSequence.prochaineSeance)
      }
      typSequence += getTypLignes('Début de séance', fiche.debutDeSeance)
      typSequence += getTypLignes('Déroulé', fiche.deroule)
      typSequence += getTypLignes('Devoirs', fiche.devoirs)
      typSequence += getTypLignes('Fin de séance', fiche.finDeSeance)
      typSequence += '])], '
      fichePrecedenteSequence = fiche
      numeroSeance++
    }
  }
  typSequence = typSequence.slice(0, typSequence.length - 2) + ')'
  fs.writeFileSync(`./src/topmaths/typ/fiches/sequences/${sequence.niveau}/${sequence.reference}.typ`, typSequence, 'utf8')
}

function compilerTyp () {
  runShellScript('tasks/compilerTyp.sh', () => {
    copierAutresPdf()
  })
}

function copierAutresPdf () {
  runShellScript('tasks/copierAutresPdf.sh', () => {})
}

function runShellScript (scriptPath, callback) {
  const child = exec(scriptPath, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing ${scriptPath}: ${error.message}`)
      console.error(stderr) // Log the standard error output
      return
    }
    // Log the standard output
    console.log(`${scriptPath} output:
${stdout}`)
    callback()
  })

  child.on('exit', (code) => {
    console.log(`${scriptPath} exited with code ${code}`)
  })
}
