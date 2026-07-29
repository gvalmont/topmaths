import { describe, expect, it } from 'vitest'
import { pointAbstrait } from '../lib/2d/PointAbstrait'
import Alea2iep from './Alea2iep'

describe('Alea2iep.regleSegment', () => {
  it('centers the ruler around a horizontal segment before drawing it', () => {
    const iep = new Alea2iep()

    iep.regleSegment(pointAbstrait(0, 0), pointAbstrait(4, 0))

    const xml = iep.script()
    expect(xml).toContain(
      '<action objet="regle" mouvement="rotation_translation" angle="0" abscisse="-165" ordonnee="300" tempo="5" sens="5" vitesse="10" />',
    )
    expect(xml).toContain(
      '<action objet="regle" mouvement="montrer" abscisse="0" ordonnee="300" tempo="5" />',
    )
    expect(xml).toContain(
      '<action abscisse="120" ordonnee="300" epaisseur="2" couleur="#216D9A" mouvement="tracer" objet="crayon" tempo="5" vitesse="10"    id="1" />',
    )
  })

  it('keeps the centered ruler orientation independent from the point order', () => {
    const iep = new Alea2iep()

    iep.regleSegment(pointAbstrait(4, 0), pointAbstrait(0, 0))

    const xml = iep.script()
    expect(xml).toContain(
      '<action objet="regle" mouvement="rotation_translation" angle="0" abscisse="-165" ordonnee="300" tempo="5" sens="5" vitesse="10" />',
    )
    expect(xml).not.toContain(
      '<action objet="regle" mouvement="rotation" angle="-180" tempo="5" sens="5" />',
    )
  })

  it('rotates the ruler before translating it to the next centered segment', () => {
    const iep = new Alea2iep()

    iep.regleSegment(pointAbstrait(0, 0), pointAbstrait(4, 0))
    iep.regleSegment(pointAbstrait(0, 0), pointAbstrait(0, 4))

    expect(iep.script()).toContain(
      '<action objet="regle" mouvement="rotation_translation" angle="-90" abscisse="0" ordonnee="465" tempo="5" sens="5" vitesse="10" />',
    )
  })

  it('can place the ruler zero on the first point for measured segments', () => {
    const iep = new Alea2iep()

    iep.regleSegment(pointAbstrait(0, 0), pointAbstrait(4, 0), {
      zeroSurPremierPoint: true,
    })

    const xml = iep.script()
    expect(xml).toContain(
      '<action objet="regle" mouvement="rotation_translation" angle="0" abscisse="0" ordonnee="300" tempo="5" sens="5" vitesse="10" />',
    )
    expect(xml).not.toContain(
      '<action objet="regle" mouvement="montrer" abscisse="-165" ordonnee="300" tempo="5" />',
    )
  })

  it('keeps the ruler visible between polygon sides', () => {
    const iep = new Alea2iep()

    iep.polygoneTracer(
      pointAbstrait(0, 0),
      pointAbstrait(4, 0),
      pointAbstrait(4, 3),
      pointAbstrait(0, 3),
    )

    const xml = iep.script()
    expect(xml.match(/objet="regle" mouvement="montrer"/g)).toHaveLength(1)
    expect(xml.match(/objet="regle" mouvement="masquer"/g)).toHaveLength(1)
    expect(xml.match(/objet="regle" mouvement="rotation_translation"/g))
      .toHaveLength(4)
  })
})
