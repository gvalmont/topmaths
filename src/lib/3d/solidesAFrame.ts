import 'aframe'

// Ajout de la déclaration pour window.THREE
declare global {
  interface Window {
    THREE?: typeof import('three')
  }
}

const THREE = window.THREE ? window.THREE : window.AFRAME ? window.AFRAME.THREE : require('three')
export { THREE }

/**
 * Ce fichier contient des définitions de solides prêts à être utilisés avec SceneViewer (AFRAME version) ou SceneViewerThreeJs (pur Three.js version = rendu bas niveau)
 * @author Jean-claude Lhote
 */
// Components custom pour AFRAME.
AFRAME.registerComponent('zoom-controls', {
  init: function () {
    const sceneEl = this.el.sceneEl
    const cameraRig = sceneEl?.querySelector('#cameraRig') as any
    const camera = sceneEl?.querySelector('[camera]') as any

    if (!cameraRig || !camera) return

    // Variables pour le zoom
    let currentDistance = 8  // Distance initiale

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      const zoomSpeed = 0.2
      currentDistance += e.deltaY * zoomSpeed
      currentDistance = Math.max(2, Math.min(20, currentDistance))

      // Mettre à jour la position de la caméra
      const currentPos = camera.getAttribute('position')
      if (!currentPos) return

      // CORRIGÉ : Meilleur typage pour la position
      let x: number, y: number, z: number

      if (typeof currentPos === 'string') {
        [x, y, z] = currentPos.split(' ').map(Number)
      } else if (currentPos && typeof currentPos === 'object') {
        x = currentPos.x || 0
        y = currentPos.y || 0
        z = currentPos.z || 0
      } else {
        return
      }

      const direction = new THREE.Vector3(x, y, z).normalize()
      const newPos = direction.multiplyScalar(currentDistance)

      camera.setAttribute('position', {
        x: newPos.x,
        y: newPos.y,
        z: newPos.z
      })
    }

    // Attacher au document avec vérification de focus
    document.addEventListener('wheel', handleWheel, { passive: false })
  }
})

// CORRIGÉ : Meilleur typage pour le composant custom-wire-sphere

interface WirePyramidSchema {
  radius: { type: 'number', default: number }
  altitudeSommet: { type: 'number', default: number }
  altitudeBase: { type: 'number', default: number }
  baseNb: { type: 'number', default: number }
  thickness: { type: 'number', default: number }
  color: { type: 'string', default: string }
  topOrBottom: { type: 'string', default: string }
}
export const customWirePyramid = AFRAME.registerComponent('custom-wire-pyramid', {
  schema: {
    radius: { type: 'number', default: 1 },
    altitudeBase: { type: 'number', default: 0 },
    altitudeSommet: { type: 'number', default: 1 },
    baseNb: { type: 'number', default: 3 },
    thickness: { type: 'number', default: 0.01 },
    color: { type: 'string', default: 'black' },
  } as WirePyramidSchema,
  init: function () {
    const group = new THREE.Group()
    const data = this.data as any  // Cast pour éviter les erreurs de type

    const { radius, baseNb, thickness, color, altitudeSommet, altitudeBase } = data
    const vertices: number[][] = []
    vertices.push([0, altitudeSommet, 0])
    for (let i = 0; i <= baseNb; i++) { // ici on double le sommet 0 pour pouvoir boucler le polygone de base donc on en a baseNb+1
      const angle = 2 * Math.PI * i / baseNb
      const x = radius * Math.cos(angle)
      const z = radius * Math.sin(angle)
      vertices.push([x, altitudeBase, z])
    }
    const pairsToConnect: number[][] = []
    for (let i = 1; i <= baseNb; i++) {
      pairsToConnect.push([0, i]) // seulement baseNb arêtes latérales
      pairsToConnect.push([i, i + 1]) // et baseNb arêtes à la base
    }
    // création des arêtes

    for (const [i1, i2] of pairsToConnect) {
      const start = new THREE.Vector3(...vertices[i1])
      const end = new THREE.Vector3(...vertices[i2])
      const direction = new THREE.Vector3().subVectors(end, start)
      const length = direction.length()
      const geometry = new THREE.CylinderGeometry(thickness, thickness, length, 8)
      const material = new THREE.MeshBasicMaterial({ color })
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
      const axis = new THREE.Vector3(0, 1, 0)
      const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction.clone().normalize())
      const cylinder = new THREE.Mesh(geometry, material)
      cylinder.position.copy(mid)
      cylinder.quaternion.copy(quaternion)
      group.add(cylinder)
    }
    this.el.setObject3D('tubeEdges', group)
  },
  remove: function () {
    this.el.removeObject3D('tubeEdges')
  }
})

export const customWirePrism = AFRAME.registerComponent('custom-wire-prism', {
  schema: {
    radius: { type: 'number', default: 1 },
    altitudeBase: { type: 'number', default: 0 },
    altitudeSommet: { type: 'number', default: 1 },
    baseNb: { type: 'number', default: 3 },
    thickness: { type: 'number', default: 0.01 },
    color: { type: 'string', default: 'black' },
  } as WirePyramidSchema,
  init: function () {
    const group = new THREE.Group()
    const data = this.data as any  // Cast pour éviter les erreurs de type

    const { radius, baseNb, thickness, color, altitudeSommet, altitudeBase } = data
    const vertices: number[][] = []
    for (let i = 0; i <= baseNb; i++) { // ici on double le sommet 0 pour pouvoir boucler le polygone de base
      const angle = 2 * Math.PI * i / baseNb
      const x = radius * Math.cos(angle)
      const z = radius * Math.sin(angle)
      vertices.push([x, altitudeBase, z], [x, altitudeSommet, z])
    }
    const pairsToConnect: number[][] = []
    for (let i = 0; i < baseNb; i++) { // On ne fait que baseNb
      pairsToConnect.push([i * 2, i * 2 + 1])
      pairsToConnect.push([i * 2, (i + 1) * 2])
      pairsToConnect.push([i * 2 + 1, (i + 1) * 2 + 1])
    }
    // création des arêtes

    for (const [i1, i2] of pairsToConnect) {
      const start = new THREE.Vector3(...vertices[i1])
      const end = new THREE.Vector3(...vertices[i2])
      const direction = new THREE.Vector3().subVectors(end, start)
      const length = direction.length()
      const geometry = new THREE.CylinderGeometry(thickness, thickness, length, 8)
      const material = new THREE.MeshBasicMaterial({ color })
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
      const axis = new THREE.Vector3(0, 1, 0)
      const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction.clone().normalize())
      const cylinder = new THREE.Mesh(geometry, material)
      cylinder.position.copy(mid)
      cylinder.quaternion.copy(quaternion)
      group.add(cylinder)
    }
    this.el.setObject3D('tubeEdges', group)
  },
  remove: function () {
    this.el.removeObject3D('tubeEdges')
  }
})

interface WireTrucatedPyramidSchema {
  radiusBase: { type: 'number', default: number }
  radiusTop: { type: 'number', default: number }
  altitudeBase: { type: 'number', default: number }
  altitudeTop: { type: 'number', default: number }
  baseNb: { type: 'number', default: number }
  thickness: { type: 'number', default: number }
  color: { type: 'string', default: string }
}
export const customWireTruncatedPyramid = AFRAME.registerComponent('custom-wire-truncated-pyramid', {
  schema: {
    radiusBase: { type: 'number', default: 1 },
    radiusTop: { type: 'number', default: 0.5 },
    altitudeBase: { type: 'number', default: 0 },
    altitudeTop: { type: 'number', default: 1 },
    baseNb: { type: 'number', default: 3 },
    thickness: { type: 'number', default: 0.01 },
    color: { type: 'string', default: 'black' },
  } as WireTrucatedPyramidSchema,
  init: function () {
    const group = new THREE.Group()
    const data = this.data as any  // Cast pour éviter les erreurs de type

    const { radiusBase, radiusTop, baseNb, thickness, color, altitudeTop, altitudeBase } = data
    const vertices: number[][] = []
    for (let i = 0; i <= baseNb; i++) { // ici on double le sommet 0 pour pouvoir boucler le polygone de base
      const angle = 2 * Math.PI * i / baseNb
      const x = radiusBase * Math.cos(angle)
      const z = radiusBase * Math.sin(angle)
      vertices.push([x, altitudeBase, z], [x * radiusTop / radiusBase, altitudeTop, z * radiusTop / radiusBase])
    }
    // création des arêtes
    const pairsToConnect: number[][] = []
    for (let i = 0; i < baseNb; i++) { // On ne fait que baseNb
      pairsToConnect.push([i * 2, i * 2 + 1])
      pairsToConnect.push([i * 2, ((i + 1) * 2) % (2 * baseNb)])
      pairsToConnect.push([i * 2 + 1, ((i + 1) * 2 + 1) % (2 * baseNb)])
    }

    for (const [i1, i2] of pairsToConnect) {
      const start = new THREE.Vector3(...vertices[i1])
      const end = new THREE.Vector3(...vertices[i2])
      const direction = new THREE.Vector3().subVectors(end, start)
      const length = direction.length()
      const geometry = new THREE.CylinderGeometry(thickness, thickness, length, 8)
      const material = new THREE.MeshBasicMaterial({ color })
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
      const axis = new THREE.Vector3(0, 1, 0)
      const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction.clone().normalize())
      const cylinder = new THREE.Mesh(geometry, material)
      cylinder.position.copy(mid)
      cylinder.quaternion.copy(quaternion)
      group.add(cylinder)
    }
    this.el.setObject3D('tubeEdges', group)
  },
  remove: function () {
    this.el.removeObject3D('tubeEdges')
  }
})

interface WireSphereSchema {
  radius: { type: 'number', default: number }
  parallels: { type: 'number', default: number }
  meridians: { type: 'number', default: number }
  segments: { type: 'number', default: number }
  parallelColor: { type: 'color', default: string }
  meridianColor: { type: 'color', default: string }
  showParallels: { type: 'boolean', default: boolean }
  showMeridians: { type: 'boolean', default: boolean }
  showEquator: { type: 'boolean', default: boolean }
  equatorColor: { type: 'color', default: string }
  equatorThickness: { type: 'number', default: number }
  showGreenwich: { type: 'boolean', default: boolean }
  greenwichColor: { type: 'color', default: string }
  greenwichThickness: { type: 'number', default: number }
}
export const customWireSphere = AFRAME.registerComponent('custom-wire-sphere', {
  schema: {
    radius: { type: 'number', default: 1 },
    parallels: { type: 'number', default: 8 },
    meridians: { type: 'number', default: 12 },
    segments: { type: 'number', default: 32 },
    parallelColor: { type: 'color', default: '#00ff00' },
    meridianColor: { type: 'color', default: '#ff0000' },
    showParallels: { type: 'boolean', default: true },
    showMeridians: { type: 'boolean', default: true },
    showEquator: { type: 'boolean', default: true },
    equatorColor: { type: 'color', default: '#ffff00' },
    equatorThickness: { type: 'number', default: 0.01 },
    showGreenwich: { type: 'boolean', default: false },
    greenwichColor: { type: 'color', default: '#00ffff' },
    greenwichThickness: { type: 'number', default: 0.01 }
  } as WireSphereSchema,

  init: function () {
    const group = new THREE.Group()
    const data = this.data as any  // Cast pour éviter les erreurs de type

    const {
      radius, parallels, meridians, segments,
      parallelColor, meridianColor,
      showParallels, showMeridians,
      showEquator, equatorColor, equatorThickness,
      showGreenwich, greenwichColor, greenwichThickness
    } = data

    // Parallèles (latitudes) - CORRIGÉ pour inclure l'équateur
    if (showParallels) {
      for (let i = 0; i <= parallels; i++) {
        // CORRIGÉ : Commencer à 0 (équateur) et diviser 90° en parallels sections
        const latitudeDegrees = (i * 90) / (parallels)  // De 0° à 90°
        const theta = (latitudeDegrees * Math.PI) / 180      // Convertir en radians

        const y = radius * Math.sin(theta)     // Hauteur du parallèle
        const r = radius * Math.cos(theta)     // Rayon du parallèle

        // Parallèle nord (+latitude)
        const pointsNorth = []
        for (let j = 0; j <= segments; j++) {
          const phi = (j * 2 * Math.PI) / segments
          pointsNorth.push(new THREE.Vector3(
            r * Math.cos(phi),
            0,
            r * Math.sin(phi)
          ))
        }
        const geoNorth = new THREE.BufferGeometry().setFromPoints(pointsNorth)
        const lineNorth = new THREE.LineLoop(geoNorth, new THREE.LineBasicMaterial({ color: parallelColor }))
        lineNorth.position.y = y
        group.add(lineNorth)

        // Parallèle sud (-latitude) - SAUF pour l'équateur (i=0)
        if (i > 0) {
          const pointsSouth = []
          for (let j = 0; j <= segments; j++) {
            const phi = (j * 2 * Math.PI) / segments
            pointsSouth.push(new THREE.Vector3(
              r * Math.cos(phi),
              0,
              r * Math.sin(phi)
            ))
          }
          const geoSouth = new THREE.BufferGeometry().setFromPoints(pointsSouth)
          const lineSouth = new THREE.LineLoop(geoSouth, new THREE.LineBasicMaterial({ color: parallelColor }))
          lineSouth.position.y = -y
          group.add(lineSouth)
        }
      }
    }

    // Équateur avec épaisseur paramétrable
    if (showEquator) {
      const equatorPoints = []
      for (let j = 0; j <= segments; j++) {
        const phi = (j * 2 * Math.PI) / segments
        equatorPoints.push(new THREE.Vector3(
          radius * Math.cos(phi),
          0,
          radius * Math.sin(phi)
        ))
      }

      const curve = new THREE.CatmullRomCurve3(equatorPoints)
      const tubeGeometry = new THREE.TubeGeometry(curve, segments, equatorThickness, 8, true)
      const tubeMaterial = new THREE.MeshBasicMaterial({ color: equatorColor })
      const equatorTube = new THREE.Mesh(tubeGeometry, tubeMaterial)
      group.add(equatorTube)
    }

    // Méridiens (longitudes) - Incluant toujours Greenwich
    if (showMeridians) {
      // S'assurer qu'un méridien passe par Greenwich (0°)
      const meridianSpacing = 360 / meridians  // En degrés

      for (let i = 0; i < meridians; i++) {
        // Calculer la longitude en degrés, centrée sur Greenwich
        const lonDegrees = i * meridianSpacing
        const phi = (lonDegrees * Math.PI) / 180  // Convertir en radians
        const points = []

        for (let j = 0; j <= segments; j++) {
          const theta = (j * Math.PI) / segments
          const x = radius * Math.sin(theta) * Math.sin(phi)
          const y = radius * Math.cos(theta)
          const z = radius * Math.sin(theta) * Math.cos(phi)
          points.push(new THREE.Vector3(x, y, z))
        }

        const geo = new THREE.BufferGeometry().setFromPoints(points)
        const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: meridianColor }))
        group.add(line)
      }
    }

    // Méridien de Greenwich (longitude = 0°, dans le plan X=0)
    if (showGreenwich) {
      const greenwichPoints = []
      for (let j = 0; j <= segments; j++) {
        const theta = (j * Math.PI) / segments
        greenwichPoints.push(new THREE.Vector3(
          0,
          radius * Math.cos(theta),
          radius * Math.sin(theta)
        ))
      }

      const curve = new THREE.CatmullRomCurve3(greenwichPoints)
      const tubeGeometry = new THREE.TubeGeometry(curve, segments, greenwichThickness, 8, false)
      const tubeMaterial = new THREE.MeshBasicMaterial({ color: greenwichColor })
      const greenwichTube = new THREE.Mesh(tubeGeometry, tubeMaterial)
      group.add(greenwichTube)
    }

    this.el.setObject3D('mesh', group)
  },

  update: function () {
    this.remove()
    this.init()
  },

  remove: function () {
    this.el.removeObject3D('mesh')
  }
})

// Composant billboard personnalisé
AFRAME.registerComponent('billboard', {
  tick: function () {
    const camera = this.el.sceneEl?.camera

    if (camera) {
      const cameraPosition = new THREE.Vector3()
      camera.getWorldPosition(cameraPosition)
      this.el.object3D.lookAt(cameraPosition)
    }
  }
})
/**
 * Composant A-Frame pour afficher des étiquettes géographiques
 */
interface GeographicLabelSchema {
  text: { type: 'string', default: string }
  color: { type: 'color', default: string }
  size: { type: 'number', default: number }
  width: { type: 'number', default: number }
  align: { type: 'string', default: string }
  baseline: { type: 'string', default: string }
  font: { type: 'string', default: string }
  orientation: { type: 'string', default: string }
  customRotation: { type: 'vec3', default: { x: number, y: number, z: number } }
}

export const geographicLabel = AFRAME.registerComponent('geographic-label', {
  schema: {
    text: { type: 'string', default: 'Label' },
    color: { type: 'color', default: '#000000' },
    size: { type: 'number', default: 0.5 },
    width: { type: 'number', default: 8 },
    align: { type: 'string', default: 'center' },
    baseline: { type: 'string', default: 'center' },
    font: { type: 'string', default: 'dejavu' },
    orientation: { type: 'string', default: 'billboard' },
    customRotation: { type: 'vec3', default: { x: 0, y: 0, z: 0 } }
  } as GeographicLabelSchema,

  init: function () {
    const data = this.data as any  // Cast pour éviter les erreurs de type

    this.el.setAttribute('text', {
      value: data.text,
      color: data.color || '#000000',
      align: data.align,
      baseline: data.baseline,
      width: data.width,
      font: data.font
    })

    this.applyOrientation()
  },

  applyOrientation: function () {
    const data = this.data as any
    const { orientation, customRotation } = data

    if (orientation === 'custom') {
      this.el.removeAttribute('billboard')
      this.el.setAttribute('rotation', {
        x: customRotation.x,
        y: customRotation.y,
        z: customRotation.z
      })
    } else {
      this.el.removeAttribute('rotation')
      this.el.setAttribute('billboard', '')
    }
  },

  update: function () {
    const data = this.data as any

    this.el.setAttribute('text', 'value', data.text)
    this.el.setAttribute('text', 'color', data.color || '#000000')
    this.el.setAttribute('text', 'width', data.width)
    this.el.setAttribute('text', 'font', data.font)

    this.applyOrientation()
  }
})

AFRAME.registerComponent('cube-trois-couleurs', {
  schema: {
    size: { type: 'number', default: 1 },
    color1: { type: 'color', default: '#ff0000' },
    color2: { type: 'color', default: '#00ff00' },
    color3: { type: 'color', default: '#fbff83ff' }
  },
  init: function () {
    const data = this.data
    const geometry = new THREE.BoxGeometry(data.size, data.size, data.size)
    // 6 faces : [right, left, top, bottom, front, back]
    const materials = [
      new THREE.MeshStandardMaterial({ color: data.color1 }), // +X
      new THREE.MeshStandardMaterial({ color: data.color1 }), // -X
      new THREE.MeshStandardMaterial({ color: data.color2 }), // +Y
      new THREE.MeshStandardMaterial({ color: data.color2 }), // -Y
      new THREE.MeshStandardMaterial({ color: data.color3 }), // +Z
      new THREE.MeshStandardMaterial({ color: data.color3 })  // -Z
    ]
    const mesh = new THREE.Mesh(geometry, materials)
    this.el.setObject3D('mesh', mesh)
  },
  update: function () {
    this.remove()
    this.init()
  },
  remove: function () {
    this.el.removeObject3D('mesh')
  }
})

AFRAME.registerComponent('cube-edges', {
  schema: {
    size: { type: 'number', default: 1 },
    color: { type: 'color', default: '#000' }
  },
  init: function () {
    const geometry = new THREE.BoxGeometry(this.data.size, this.data.size, this.data.size)
    const edges = new THREE.EdgesGeometry(geometry)
    const material = new THREE.LineBasicMaterial({ color: this.data.color })
    const line = new THREE.LineSegments(edges, material)
    this.el.setObject3D('edges', line)
  },
  remove: function () {
    this.el.removeObject3D('edges')
  }
})

AFRAME.registerComponent('cube-tube-edges', {
  schema: {
    size: { type: 'number', default: 1 },
    color: { type: 'color', default: '#000' },
    thickness: { type: 'number', default: 0.03 }
  },
  init: function () {
    const { size, color, thickness } = this.data
    const group = new THREE.Group()
    const s = size / 2

    // Les 8 sommets du cube
    const vertices = [
      [s, s, s], [s, s, -s], [s, -s, s], [s, -s, -s],
      [-s, s, s], [-s, s, -s], [-s, -s, s], [-s, -s, -s]
    ]

    // Les 12 arêtes (paires d'indices dans vertices)
    const edges = [
      [0, 1], [0, 2], [0, 4],
      [1, 3], [1, 5],
      [2, 3], [2, 6],
      [3, 7],
      [4, 5], [4, 6],
      [5, 7],
      [6, 7]
    ]

    for (const [i1, i2] of edges) {
      const start = new THREE.Vector3(...vertices[i1])
      const end = new THREE.Vector3(...vertices[i2])
      const direction = new THREE.Vector3().subVectors(end, start)
      const length = direction.length()
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
      const axis = new THREE.Vector3(0, 1, 0)
      const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction.clone().normalize())
      const geometry = new THREE.CylinderGeometry(thickness, thickness, length, 8)
      const material = new THREE.MeshBasicMaterial({ color })
      const cylinder = new THREE.Mesh(geometry, material)
      cylinder.position.copy(mid)
      cylinder.quaternion.copy(quaternion)
      group.add(cylinder)
    }

    this.el.setObject3D('tubeEdges', group)
  },
  remove: function () {
    this.el.removeObject3D('tubeEdges')
  }
})

AFRAME.registerComponent('cube-trois-couleurs-tube-edges', {
  schema: {
    size: { type: 'number', default: 1 },
    color1: { type: 'color', default: '#ff0000' },
    color2: { type: 'color', default: '#00ff00' },
    color3: { type: 'color', default: '#fbff83' },
    edgeColor: { type: 'color', default: '#000' },
    edgeThickness: { type: 'number', default: 0.03 }
  },
  init: function () {
    const data = this.data
    // Cube trois couleurs
    const geometry = new THREE.BoxGeometry(data.size, data.size, data.size)
    const materials = [
      new THREE.MeshStandardMaterial({ color: data.color1 }),
      new THREE.MeshStandardMaterial({ color: data.color1 }),
      new THREE.MeshStandardMaterial({ color: data.color2 }),
      new THREE.MeshStandardMaterial({ color: data.color2 }),
      new THREE.MeshStandardMaterial({ color: data.color3 }),
      new THREE.MeshStandardMaterial({ color: data.color3 })
    ]
    const mesh = new THREE.Mesh(geometry, materials)
    this.el.setObject3D('mesh', mesh)

    // Arêtes tubulaires
    const group = new THREE.Group()
    const s = data.size / 2
    const vertices = [
      [s, s, s], [s, s, -s], [s, -s, s], [s, -s, -s],
      [-s, s, s], [-s, s, -s], [-s, -s, s], [-s, -s, -s]
    ]
    const edges = [
      [0, 1], [0, 2], [0, 4],
      [1, 3], [1, 5],
      [2, 3], [2, 6],
      [3, 7],
      [4, 5], [4, 6],
      [5, 7],
      [6, 7]
    ]
    for (const [i1, i2] of edges) {
      const start = new THREE.Vector3(...vertices[i1])
      const end = new THREE.Vector3(...vertices[i2])
      const direction = new THREE.Vector3().subVectors(end, start)
      const length = direction.length()
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
      const axis = new THREE.Vector3(0, 1, 0)
      const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction.clone().normalize())
      const geometry = new THREE.CylinderGeometry(data.edgeThickness, data.edgeThickness, length, 8)
      const material = new THREE.MeshBasicMaterial({ color: data.edgeColor })
      const cylinder = new THREE.Mesh(geometry, material)
      cylinder.position.copy(mid)
      cylinder.quaternion.copy(quaternion)
      group.add(cylinder)
    }
    this.el.setObject3D('tubeEdges', group)
  },
  update: function () {
    this.remove()
    this.init()
  },
  remove: function () {
    this.el.removeObject3D('mesh')
    this.el.removeObject3D('tubeEdges')
  }
})

AFRAME.registerComponent('wire-pyramid-faces', {
  schema: {
    radius: { type: 'number', default: 0.7 },
    altitudeBase: { type: 'number', default: 0 },
    altitudeSommet: { type: 'number', default: 1 },
    baseNb: { type: 'number', default: 3 },
    thickness: { type: 'number', default: 0.01 },
    color: { type: 'string', default: 'black' },
    faceColor: { type: 'color', default: '#ffcc00' },
    opacity: { type: 'number', default: 0.7 }
  },
  init: function () {
    const group = new THREE.Group()
    const data = this.data

    // --- Faces opaques ---
    const geometry = new THREE.BufferGeometry()
    const vertices: number[] = []
    const base: Array<any> = []
    const apex = new THREE.Vector3(0, data.altitudeSommet, 0)
    for (let i = 0; i < data.baseNb; i++) {
      const angle = 2 * Math.PI * i / data.baseNb
      const x = data.radius * Math.cos(angle)
      const z = data.radius * Math.sin(angle)
      base.push(new THREE.Vector3(x, data.altitudeBase, z))
    }
    // Faces latérales
    for (let i = 0; i < data.baseNb; i++) {
      const a = base[i]
      const b = base[(i + 1) % data.baseNb]
      vertices.push(
        a.x, a.y, a.z,
        b.x, b.y, b.z,
        apex.x, apex.y, apex.z
      )
    }
    // Base (optionnel, ici toujours présente)
    for (let i = 1; i < data.baseNb - 1; i++) {
      vertices.push(
        base[0].x, base[0].y, base[0].z,
        base[i].x, base[i].y, base[i].z,
        base[i + 1].x, base[i + 1].y, base[i + 1].z
      )
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geometry.computeVertexNormals()
    const mat = new THREE.MeshLambertMaterial({
      color: data.faceColor,
      transparent: true,
      opacity: data.opacity,
      side: THREE.DoubleSide
    })
    const mesh = new THREE.Mesh(geometry, mat)
    group.add(mesh)

    // --- Arêtes filaires (reprend la logique de custom-wire-pyramid) ---
    const verticesWire: number[][] = []
    verticesWire.push([0, data.altitudeSommet, 0])
    for (let i = 0; i <= data.baseNb; i++) {
      const angle = 2 * Math.PI * i / data.baseNb
      const x = data.radius * Math.cos(angle)
      const z = data.radius * Math.sin(angle)
      verticesWire.push([x, data.altitudeBase, z])
    }
    const pairsToConnect: number[][] = []
    for (let i = 1; i <= data.baseNb; i++) {
      pairsToConnect.push([0, i])
      pairsToConnect.push([i, i + 1])
    }
    for (const [i1, i2] of pairsToConnect) {
      const start = new THREE.Vector3(...verticesWire[i1])
      const end = new THREE.Vector3(...verticesWire[i2])
      const direction = new THREE.Vector3().subVectors(end, start)
      const length = direction.length()
      const geometry = new THREE.CylinderGeometry(data.thickness, data.thickness, length, 8)
      const material = new THREE.MeshBasicMaterial({ color: data.color })
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
      const axis = new THREE.Vector3(0, 1, 0)
      const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction.clone().normalize())
      const cylinder = new THREE.Mesh(geometry, material)
      cylinder.position.copy(mid)
      cylinder.quaternion.copy(quaternion)
      group.add(cylinder)
    }

    this.el.setObject3D('mesh', group)
  },
  remove: function () {
    this.el.removeObject3D('mesh')
  }
})
export const AframeRegisteredComponent = ['cube-trois-couleurs', 'cube-edges', 'cube-tube-edges', 'cube-trois-couleurs-tube-edges', 'custom-wire-sphere', 'custom-wire-pyramid', 'custom-wire-prism', 'custom-wire-truncated-pyramid', 'geographic-label', 'billboard', 'zoom-controls', 'wire-pyramid-faces'] as const
export type AframeRegisteredComponentsType = Partial<typeof AframeRegisteredComponent>
