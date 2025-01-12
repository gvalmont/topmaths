import { miseEnEvidence } from '../../../lib/outils/embellissements'
import ExerciceCan from '../../ExerciceCan'
import { randint } from '../../../modules/outils'
import { fixeBordures, mathalea2d } from '../../../modules/2dGeneralites'
import { context } from '../../../modules/context'
import { choice } from '../../../lib/outils/arrayOutils'
import { pave3d, point3d } from '../../../modules/3d'
import { point } from '../../../lib/2d/points'
import { segment } from '../../../lib/2d/segmentsVecteurs'
import { texNombre } from '../../../lib/outils/texNombre'
import { latex2d } from '../../../lib/2d/textes'

export const titre = 'Calculer une longueur de pavé'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'y3u3x'
export const refs = {
  'fr-fr': [],
  'fr-ch': []
}

/**
 * @author Jean-Claude Lhote

*/
export default class Can2025N5Q30 extends ExerciceCan {
  private enonce (a?: number, b?:number, c?:number) {
    if (a == null || b == null || c == null) {
      a = randint(3, 6)
      b = randint(2, 5, a)
      c = (a * b) % 2 === 0
        ? (a * b) % 5 === 0
            ? choice([6, 8])
            : choice([5, 10, 15])
        : choice([10, 20])
    }
    const A = point3d(0, 0, 0)
    const B = point3d(6, 0, 0)
    const C = point3d(0, 1, 0)
    const D = point3d(0, 0, -3)
    const pav = pave3d(A, B, C, D)
    const s1 = segment(point(-0.3, 0), point(-0.3, -3))
    s1.styleExtremites = '<->'
    const s2 = segment(point(0, -3.3), point(6, -3.3))
    s2.styleExtremites = '<->'
    const s3 = segment(point(6.3, -3.2), point(6.8, -2.8))
    s3.styleExtremites = '>-<'
    const la = latex2d(`${texNombre(a, 0)}\\text{m}`, -0.8, -1.5, { })
    const lb = latex2d(`${texNombre(b, 0)}\\text{m}`, 7.5, -3, { })
    const lc = latex2d('?', 3, -3.6, { })

    const v = a * b * c
    this.reponse = c
    this.question = `${mathalea2d(Object.assign({ pixelsParCm: 30, scale: 0.6 }, fixeBordures([pav.c2d, s1, s2, s3], { rxmin: -1.5, rxmax: 1.5, rymin: -0.5 })), [pav.c2d, s1, s2, s3, la, lb, lc])}
    Le volume de ce pavé droit est de $${v}\\text{ m}^3$.`
    this.correction = `On a : $${a}\\text{ m}\\times${b}\\text{ m}\\times ?\\text{ m}=${v}\\text{ m}^3$, donc $?=${v}\\div(${a}\\times${b})=${miseEnEvidence(c)}\\text{ m}$`
    this.canEnonce = this.question
    this.canReponseACompleter = '$?=\\ldots\\ldots$ m'
    this.optionsChampTexte = { texteApres: ' m' }
    if (this.interactif) {
      this.question += '$?=$'
    } else if (context.isHtml) {
      this.question += '$?=\\ldots$ m'
    }
  }

  nouvelleVersion () {
    this.canOfficielle ? this.enonce(4, 3, 10) : this.enonce()
  }
}
