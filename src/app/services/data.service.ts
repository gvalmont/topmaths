import { HttpClient } from '@angular/common/http'
import { EventEmitter, Injectable, isDevMode, Output } from '@angular/core'
import { environment } from 'src/environments/environment'
import { Annee } from './modeles/calendrier'
import { Niveau as NiveauObjectif, Objectif } from './modeles/objectifs'
import { Niveau as NiveauSequence, Sequence, SequenceParticuliere } from './modeles/sequences'
import { OutilsService } from './outils.service'

@Injectable({
  providedIn: 'root'
})
export class DataService {
  @Output() dataMAJ: EventEmitter<string> = new EventEmitter()

  niveauxObjectifs: NiveauObjectif[]
  niveauxSequences: NiveauSequence[]
  sequencesParticulieres: SequenceParticuliere[]
  calendrierAnnees: Annee[]
  delaiAvantTelechargement = 6 // secondes
  listeSitesPresentsPolitiqueDeConfidentialite = [
    'https://mathsmentales.net/',
    'https://mathix.org/',
    'https://www.geogebra.org/',
    'https://www.clicmaclasse.fr/'
  ]

  // eslint-disable-next-line no-unused-vars
  constructor (public httpClient: HttpClient, private outilsService: OutilsService) {
    this.niveauxObjectifs = []
    this.niveauxSequences = []
    this.sequencesParticulieres = []
    this.calendrierAnnees = []
    this.miseEnCacheDesDonnees()
  }

  miseEnCacheDesDonnees () {
    this.miseEnCacheNiveauxEtSequences()
    this.miseEnCacheSequencesParticulieres()
    this.miseEnCacheCalendrier()
  }

  miseEnCacheNiveauxEtSequences () {
    if (isDevMode()) {
      this.httpClient.get<NiveauSequence[]>('assets/data/sequences.json?' + environment.appVersion).subscribe(niveauxSequences => {
        this.niveauxSequences = this.preTraitementSequences(niveauxSequences)

        this.httpClient.get<NiveauObjectif[]>('assets/data/objectifs.json?' + environment.appVersion).subscribe(niveauxObjectifs => {
          this.niveauxObjectifs = this.preTraitementObjectifs(niveauxObjectifs)
          this.niveauxSequences = this.postTraitementSequences(this.niveauxSequences, this.niveauxObjectifs)
          this.dataMAJ.emit('niveauxSequences')
          this.dataMAJ.emit('niveauxObjectifs')
          this.checksDeRoutine()
        })
      })
    } else {
      this.httpClient.get<NiveauSequence[]>('assets/data/sequences_modifiees.json?' + environment.appVersion).subscribe(niveauxSequences => {
        this.niveauxSequences = niveauxSequences
        this.dataMAJ.emit('niveauxSequences')

        this.httpClient.get<NiveauObjectif[]>('assets/data/objectifs_modifies.json?' + environment.appVersion).subscribe(niveauxObjectifs => {
          this.niveauxObjectifs = niveauxObjectifs
          this.dataMAJ.emit('niveauxObjectifs')
        })
      })
    }
  }

  miseEnCacheSequencesParticulieres () {
    this.httpClient.get<SequenceParticuliere[]>('assets/data/sequencesParticulieres.json?' + environment.appVersion).subscribe(sequencesParticulieres => {
      this.sequencesParticulieres = sequencesParticulieres
      this.dataMAJ.emit('sequencesParticulieres')
    })
  }

  miseEnCacheCalendrier () {
    this.httpClient.get<Annee[]>('assets/data/calendrier.json?' + environment.appVersion).subscribe(annees => {
      this.calendrierAnnees = annees
      this.dataMAJ.emit('calendrierAnnees')
    })
  }

  preTraitementSequences (niveaux: NiveauSequence[]) {
    for (const niveau of niveaux) {
      for (const sequence of niveau.sequences) {
        sequence.calculsMentaux = this.getCalculsMentauxAvecLiensEtIdDesExercices(sequence)
        sequence.lienQuestionsFlash = this.getLienQuestionsFlash(sequence)
        sequence.lienEvalBrevet = this.getLienEvalBrevet(sequence)
        sequence.telechargementsDisponibles = {
          cours: false,
          resume: false,
          mission: false
        }
      }
    }
    return niveaux
  }

  preTraitementObjectifs (niveaux: NiveauObjectif[]) {
    for (const niveau of niveaux) {
      for (const theme of niveau.themes) {
        for (const sousTheme of theme.sousThemes) {
          for (const objectif of sousTheme.objectifs) {
            objectif.periode = this.trouverPeriode(objectif)
            objectif.rappelDuCoursImage = this.getRappelDuCoursImage(objectif)
            objectif.lienExercices = this.getLienExercices(objectif)
            objectif.exercices = this.getExercicesAvecLienEtId(objectif)
            objectif.sequences = this.getSequences(objectif)
            objectif.telechargementsDisponibles = {
              entrainement: false,
              test: false
            }
          }
        }
      }
    }
    return this.ajouterObjectifsParThemeParPeriode(niveaux)
  }

  postTraitementSequences (niveauxSequences: NiveauSequence[], niveauxObjectifs: NiveauObjectif[]) {
    for (const niveauSequence of niveauxSequences) {
      for (const sequence of niveauSequence.sequences) {
        sequence.objectifs = this.getObjectifsAvecTitre(sequence, niveauxObjectifs)
        sequence.calculsMentaux = this.getCalculsMentauxAvecPageExiste(sequence, niveauxObjectifs)
        sequence.questionsFlash = this.getQuestionsFlashAvecPageExiste(sequence, niveauxObjectifs)
        sequence.lienEval = this.getLienEval(sequence, niveauxObjectifs)
      }
    }
    return niveauxSequences
  }

  checksDeRoutine () {
    this.checksSequences()
    this.checksObjectifs()
  }

  getCalculsMentauxAvecLiensEtIdDesExercices (sequence: Sequence) {
    let numeroExercice = 1
    for (const calculMental of sequence.calculsMentaux) {
      for (const exercice of calculMental.exercices) {
        exercice.lien = this.getLienExercice(exercice.slug, true)
        exercice.id = sequence.reference + '-' + numeroExercice
        numeroExercice++
      }
    }
    return sequence.calculsMentaux
  }

  getLienQuestionsFlash (sequence: Sequence) {
    let lienQuestionsFlash = environment.urlMathALEA
    for (const questionFlash of sequence.questionsFlash) {
      if (questionFlash.slug !== '') {
        lienQuestionsFlash = lienQuestionsFlash.concat('ex=', questionFlash.slug, ',i=0&')
      }
    }
    lienQuestionsFlash = lienQuestionsFlash.concat('v=e&z=1.5')
    return lienQuestionsFlash
  }

  getLienEvalBrevet (sequence: Sequence) {
    let lienEvalBrevet = ''
    if (sequence.slugEvalBrevet !== undefined && sequence.slugEvalBrevet !== '') {
      lienEvalBrevet = environment.urlMathALEA
      lienEvalBrevet += sequence.slugEvalBrevet
      lienEvalBrevet = lienEvalBrevet.concat('&v=e&z=1.5')
    }
    return lienEvalBrevet
  }

  trouverPeriode (objectif: Objectif) {
    for (const niveau of this.niveauxSequences) {
      for (const sequence of niveau.sequences) {
        for (const sequenceObjectif of sequence.objectifs) {
          if (sequenceObjectif.reference === objectif.reference) {
            return sequence.periode
          }
        }
      }
    }
    return -1
  }

  getRappelDuCoursImage (objectif: Objectif) {
    if (objectif.rappelDuCoursImage === '' || objectif.rappelDuCoursImage === undefined) {
      return ''
    } else {
      return '../assets/img/' + objectif.rappelDuCoursImage
    }
  }

  /**
   * Rassemble tous les exercices de MathALEA d'un objectif en un seul lien
   * @param objectif
   * @returns {string}
   */
  getLienExercices (objectif: Objectif) {
    let lienExercices = environment.urlMathALEA
    let nbExercices = 0
    for (const exercice of objectif.exercices) {
      if (exercice.slug !== '' && exercice.slug.slice(0, 4) !== 'http') {
        lienExercices = lienExercices.concat('ex=', exercice.slug, ',i=0&')
        nbExercices ++
      }
    }
    lienExercices = lienExercices.concat('v=e&z=1.5')
    if (nbExercices === 0) lienExercices = ''
    return lienExercices
  }

  getExercicesAvecLienEtId (objectif: Objectif) {
    let numeroExercice = 1
    for (const exercice of objectif.exercices) {
      exercice.lien = this.getLienExercice(exercice.slug)
      exercice.id = objectif.reference + '-' + numeroExercice
      numeroExercice++
    }
    return objectif.exercices
  }

  getSequences (objectif: Objectif) {
    const listeDesSequences = []
    for (const niveauSequence of this.niveauxSequences) {
      for (const sequence of niveauSequence.sequences) {
        for (const sequenceObjectif of sequence.objectifs) {
          if (objectif.reference === sequenceObjectif.reference) {
            listeDesSequences.push({
              reference: sequence.reference,
              titre: sequence.titre
            })
          }
        }
      }
    }
    return listeDesSequences
  }

  ajouterObjectifsParThemeParPeriode (niveaux: NiveauObjectif[]) {
    for (const niveau of niveaux) {
      for (const theme of niveau.themes) {
        let nbObjectifsThemePeriode1 = 0
        let nbObjectifsThemePeriode2 = 0
        let nbObjectifsThemePeriode3 = 0
        let nbObjectifsThemePeriode4 = 0
        let nbObjectifsThemePeriode5 = 0
        for (const sousTheme of theme.sousThemes) {
          let nbObjectifsSousThemePeriode1 = 0
          let nbObjectifsSousThemePeriode2 = 0
          let nbObjectifsSousThemePeriode3 = 0
          let nbObjectifsSousThemePeriode4 = 0
          let nbObjectifsSousThemePeriode5 = 0
          for (const objectif of sousTheme.objectifs) {
            switch (objectif.periode) {
              case 1:
                nbObjectifsThemePeriode1++
                nbObjectifsSousThemePeriode1++
                break
              case 2:
                nbObjectifsThemePeriode2++
                nbObjectifsSousThemePeriode2++
                break
              case 3:
                nbObjectifsThemePeriode3++
                nbObjectifsSousThemePeriode3++
                break
              case 4:
                nbObjectifsThemePeriode4++
                nbObjectifsSousThemePeriode4++
                break
              case 5:
                nbObjectifsThemePeriode5++
                nbObjectifsSousThemePeriode5++
                break
            }
          }
          sousTheme.nbObjectifsParPeriode = [
            nbObjectifsSousThemePeriode1,
            nbObjectifsSousThemePeriode2,
            nbObjectifsSousThemePeriode3,
            nbObjectifsSousThemePeriode4,
            nbObjectifsSousThemePeriode5
          ]
        }
        theme.nbObjectifsParPeriode = [
          nbObjectifsThemePeriode1,
          nbObjectifsThemePeriode2,
          nbObjectifsThemePeriode3,
          nbObjectifsThemePeriode4,
          nbObjectifsThemePeriode5
        ]
      }
    }
    return niveaux
  }

  getObjectifsAvecTitre (sequence: Sequence, niveauxObjectifs: NiveauObjectif[]) {
    for (const objectifSequence of sequence.objectifs) {
      for (const niveauObjectif of niveauxObjectifs) {
        for (const theme of niveauObjectif.themes) {
          for (const sousTheme of theme.sousThemes) {
            for (const objectif of sousTheme.objectifs) {
              if (objectifSequence.reference === objectif.reference) {
                objectifSequence.titre = objectif.titre
                break
              }
            }
          }
        }
      }
    }
    return sequence.objectifs
  }

  getCalculsMentauxAvecPageExiste (sequence: Sequence, niveauxObjectifs: NiveauObjectif[]) {
    for (const calculMental of sequence.calculsMentaux) {
      for (const niveauObjectif of niveauxObjectifs) {
        for (const theme of niveauObjectif.themes) {
          for (const sousTheme of theme.sousThemes) {
            for (const objectif of sousTheme.objectifs) {
              if (calculMental.reference === objectif.reference) {
                calculMental.pageExiste = true
                break
              }
            }
          }
        }
      }
    }
    return sequence.calculsMentaux
  }

  getQuestionsFlashAvecPageExiste (sequence: Sequence, niveauxObjectifs: NiveauObjectif[]) {
    for (const questionFlash of sequence.questionsFlash) {
      for (const niveauObjectif of niveauxObjectifs) {
        for (const theme of niveauObjectif.themes) {
          for (const sousTheme of theme.sousThemes) {
            for (const objectif of sousTheme.objectifs) {
              if (questionFlash.reference === objectif.reference) {
                questionFlash.pageExiste = true
                break
              }
            }
          }
        }
      }
    }
    return sequence.questionsFlash
  }

  getLienEval (sequence: Sequence, niveauxObjectifs: NiveauObjectif[]) {
    const slugsObjectif = this.getSlugsObjectifsSequence(sequence, niveauxObjectifs)
    let lienEval = environment.urlMathALEA
    for (const slug of slugsObjectif) {
      if (slug.slice(0, 4) !== 'http' && slug !== '') {
        lienEval = lienEval.concat('ex=', slug, ',i=0&')
      }
    }
    lienEval = lienEval.concat('v=e&z=1.5')
    return lienEval
  }

  checksSequences () {
    const listeExercicesDeBrevet = []
    let nbDoublonsTrouves = 0
    for (const niveau of this.niveauxSequences) {
      for (const sequence of niveau.sequences) {
        if (sequence.slugEvalBrevet !== undefined && sequence.slugEvalBrevet !== "") {
          const listeExosAvecEx = sequence.slugEvalBrevet.split("&")
          for (const exoAvecEx of listeExosAvecEx) {
            const exo = exoAvecEx.slice(3)
            for (const exerciceDeBrevet of listeExercicesDeBrevet) {
              if (exo === exerciceDeBrevet) {
                console.log(exo + ' présent en double')
                nbDoublonsTrouves++
              }
            }
            listeExercicesDeBrevet.push(exo)
          }
        }
      }
    }
    if (nbDoublonsTrouves === 0) console.log('Pas de doublons d\'exercices de brevet trouvés')
  }

  checksObjectifs () {
    const listeHTTP = []
    for (const niveau of this.niveauxObjectifs) {
      for (const theme of niveau.themes) {
        for (const sousTheme of theme.sousThemes) {
          for (const objectif of sousTheme.objectifs) {
            for (const exercice of objectif.exercices) {
              if (exercice.slug.slice(0, 4) === 'http') {
                listeHTTP.push(exercice.slug)
              }
            }
          }
        }
      }
    }
    const listeAbsents = []
    for (const site of listeHTTP) {
      let trouve = false
      for (const sitePresent of this.listeSitesPresentsPolitiqueDeConfidentialite) {
        if (site.slice(0, sitePresent.length) === sitePresent) {
          trouve = true
          break
        }
      }
      if (!trouve) listeAbsents.push(site)
    }
    if (listeAbsents.length > 0) console.log('Sites absents de la politique de confidentialité :', listeAbsents)
  }

  /**
   * Construit le lien d'un exercice à partir de son slug
   * @param slug version raccourcie de l'url dans le cas de MathALEA, lien complet sinon
   * @param calculMental true si utilisation dans un calcul mental pour afficher le diaporama des exercices de MathALEA
   * @returns {string}
   */
  getLienExercice (slug: string|undefined, calculMental = false) {
    let lien = ''
    if (slug !== undefined) {
      if (this.outilsService.estMathsMentales(slug)) {
        lien = slug + '&embed=' + environment.origine
      } else if (slug.slice(0, 4) === 'http') {
        lien = slug
      } else { // c'est un exercice MathALEA
        lien = `${environment.urlMathALEA}ex=${slug},i=0`
        lien = lien.replace(/&ex=/g, ',i=0&ex=') // dans le cas où il y aurait plusieurs exercices dans le même slug
        if (calculMental) {
          lien += '&v=diap&duree=20'
        } else {
          lien+= '&v=e&z=1.5'
        }
      }
    }
    return lien
  }

  getSlugsObjectifsSequence (sequence: Sequence, niveauxObjectifs: NiveauObjectif[]) {
    const slugsObjectif = []
    for (const objectifSequence of sequence.objectifs) {
      for (const niveauObjectif of niveauxObjectifs) {
        for (const theme of niveauObjectif.themes) {
          for (const sousTheme of theme.sousThemes) {
            for (const objectif of sousTheme.objectifs) {
              if (objectifSequence.reference === objectif.reference) {
                for (const exercice of objectif.exercices) {
                  slugsObjectif.push(exercice.slug)
                }
                break
              }
            }
          }
        }
      }
    }
    return slugsObjectif
  }

  telechargerJSON () {
    for (const niveau of this.niveauxSequences) {
      for (const sequence of niveau.sequences) {
        localStorage.setItem(sequence.reference, JSON.stringify(sequence))
        this.lancementVerifTelechargementsDisponibles(sequence.reference, 'cours')
        this.lancementVerifTelechargementsDisponibles(sequence.reference, 'resume')
        this.lancementVerifTelechargementsDisponibles(sequence.reference, 'mission')
      }
    }
    for (const niveau of this.niveauxObjectifs) {
      for (const theme of niveau.themes) {
        for (const sousTheme of theme.sousThemes) {
          for (const objectif of sousTheme.objectifs) {
            localStorage.setItem(objectif.reference, JSON.stringify(objectif))
            this.lancementVerifTelechargementsDisponibles(objectif.reference, 'entrainement')
            this.lancementVerifTelechargementsDisponibles(objectif.reference, 'test')
          }
        }
      }
    }
    setTimeout(() => {
      this.niveauxSequences = this.recuperationTelechargementsDisponiblesSequences(this.niveauxSequences)
      this.niveauxObjectifs = this.recuperationTelechargementsDisponiblesObjectifs(this.niveauxObjectifs)
      this.downloadObjectAsJson(this.niveauxSequences, 'sequences_modifiees')
      this.downloadObjectAsJson(this.niveauxObjectifs, 'objectifs_modifies')
    }, this.delaiAvantTelechargement * 1000)
  }

  lancementVerifTelechargementsDisponibles (reference: string, type: string) {
    const lien = `assets/${type}/${reference.charAt(0) === 'S' ? reference.slice(1, 2) : reference.slice(0, 1)}e/${type.charAt(0).toUpperCase() + type.slice(1)}_${reference}.pdf`
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        verifTelechargementsDisponibles(reference, type)
      }
    }
    xhttp.open("HEAD", lien, true)
    xhttp.send()

    function verifTelechargementsDisponibles (reference: string, type: string) {
      const itemString = localStorage.getItem(reference)
      if (itemString !== null) {
        let item = JSON.parse(itemString)
        while (typeof item !== 'object') item = JSON.parse(item) // https://stackoverflow.com/questions/42494823/json-parse-returns-string-instead-of-object
        switch (type) {
          case 'cours':
            item.telechargementsDisponibles.cours = true
            break
          case 'resume':
            item.telechargementsDisponibles.resume = true
            break
          case 'mission':
            item.telechargementsDisponibles.mission = true
            break
          case 'entrainement':
            item.telechargementsDisponibles.entrainement = true
            break
          case 'test':
            item.telechargementsDisponibles.test = true
            break
        }
        localStorage.setItem(reference, JSON.stringify(item))
      }
    }
  }

  recuperationTelechargementsDisponiblesSequences (niveaux: NiveauSequence[]) {
    for (const niveau of niveaux) {
      for (const sequence of niveau.sequences) {
        const sequenceString = localStorage.getItem(sequence.reference)
        if (sequenceString !== null) {
          let sequenceJSON: Sequence = JSON.parse(sequenceString)
          while (typeof sequenceJSON !== 'object') sequenceJSON = JSON.parse(sequenceJSON) // https://stackoverflow.com/questions/42494823/json-parse-returns-string-instead-of-object
          sequence.telechargementsDisponibles = sequenceJSON.telechargementsDisponibles
        }
      }
    }
    return niveaux
  }

  recuperationTelechargementsDisponiblesObjectifs (niveaux: NiveauObjectif[]) {
    for (const niveau of niveaux) {
      for (const theme of niveau.themes) {
        for (const sousTheme of theme.sousThemes) {
          for (const objectif of sousTheme.objectifs) {
            const objectifString = localStorage.getItem(objectif.reference)
            if (objectifString !== null) {
              let objectifJSON: Objectif = JSON.parse(objectifString)
              while (typeof objectifJSON !== 'object') objectifJSON = JSON.parse(objectifJSON) // https://stackoverflow.com/questions/42494823/json-parse-returns-string-instead-of-object
              objectif.telechargementsDisponibles = objectifJSON.telechargementsDisponibles
            }
          }
        }
      }
    }
    return niveaux
  }

  downloadObjectAsJson (exportObj: object, exportName: string){ // https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj))
    var downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href",     dataStr)
    downloadAnchorNode.setAttribute("download", exportName + ".json")
    document.body.appendChild(downloadAnchorNode) // required for firefox
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }
}
