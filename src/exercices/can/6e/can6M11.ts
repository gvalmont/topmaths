import { randint } from '../../../modules/outils'
import ExerciceSimple from '../../ExerciceSimple'
import { fixeBordures, mathalea2d } from '../../../modules/2dGeneralites'
import { SceneViewer } from '../../../lib/3d/SceneViewer'
import { paveLPH3d } from '../../../lib/3d/solides'
import { context } from '../../../modules/context'
export const titre = 'Volume de pavé droit par dénombrement de cubes unités'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDePublication = '04/07/2022'

/**
 * @author Jean-Claude Lhote
 *

 */
export const uuid = 'e332d'

export const refs = {
  'fr-fr': ['can6M11'],
  'fr-ch': []
}
export default class VolumePaveCubes extends ExerciceSimple {
  constructor () {
    super()
    this.typeExercice = 'simple'
    this.besoinFormulaireCaseACocher = ['3D dynamique', false]
    this.sup = false
  }

  nouvelleVersion () {
    const l = randint(2, 5)
    const L = randint(2, 4)
    const h = randint(2, 6, [l, L])
    if (this.sup && context.isHtml) {
      // Attention ! Il ne faut pas donner un Id à la scène, car s'il y a plusieurs questions, il n'y aura qu'un seul Id et donc des conflits.
      const sceneBuilder = new SceneViewer({ width: 400, height: 400, rigPosition: [0, 0, 0], rigRotation: [0, 30, 0] })
      sceneBuilder.addAmbientLight({
        color: '#ffffff',
        intensity: 0.8  // Augmenter l'intensité de la lumière ambiante
      })
      sceneBuilder.addDirectionnalLight({
        color: '#ffffff',
        intensity: 1.2,  // Lumière directionnelle plus forte
        position: [5, 5, 5]
      })

      const dx = L * 0.5
      const dy = l * 0.5
      const dz = h * 0.5
      for (let x = 0; x < L; x++) {
        for (let y = 0; y < l; y++) {
          for (let z = 0; z < h; z++) {
            sceneBuilder.addCubeTroisCouleursABox({
              position: [x - dx, z - dz, y - dy],
              size: 1,
              color1: 'red',
              color2: 'blue',
              color3: 'green'
            })
          }
        }
      }
      const vue = `<div id="emplacementPourSceneViewer${sceneBuilder.id}" style="width: 400px; height: 400px;"></div>`
      this.question = `${vue}<br>`
      document.addEventListener('exercicesAffiches', () => {
        const parent = document.getElementById(`emplacementPourSceneViewer${sceneBuilder.id}`)
        if (parent !== null) {
          sceneBuilder.showSceneAt(parent)
        }
      }, { once: true })
    } else {
      const pave = paveLPH3d(0, 0, 0, 0.75, L, l, h)

      this.question = mathalea2d(Object.assign({}, fixeBordures(pave.c2d)), pave.c2d)
    }
    this.question += 'Ce pavé droit est composé de cubes identiques. En prenant comme unité l\'un de ces cubes, quel est le volume de ce pavé droit ?<br>'
    this.reponse = L * l * h
    this.correction = `Le volume de ce pavé droit est : $${L}\\times ${l}\\times ${h}=${this.reponse}$`
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\dots$ unités'
  }
}
