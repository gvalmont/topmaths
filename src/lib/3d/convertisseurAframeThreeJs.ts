import { THREE } from './threeInstance'

/**
 * Convertit les propriétés d'un composant solide A-Frame en options pour addCustomElement (SceneViewerThreeJs)
 * @param componentName Nom du composant A-Frame
 * @param data Propriétés du composant (schema ou data)
 * @returns Options pour addCustomElement
 */
export function convertAFrameComponentToThreeJsOptions (componentName: string, data: any): {
  object3D: THREE.Object3D,
  position?: [number, number, number]
} {
  switch (componentName) {
    case 'cube-trois-couleurs': {
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
      return { object3D: mesh, position: data.position || [0, 0, 0] }
    }
    case 'cube-edges': {
      const geometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(data.size, data.size, data.size))
      const material = new THREE.LineBasicMaterial({ color: data.color })
      const mesh = new THREE.LineSegments(geometry, material)
      return { object3D: mesh, position: data.position || [0, 0, 0] }
    }
    case 'cube-tube-edges':
      return { object3D: createCubeTubeEdges(data), position: data.position || [0, 0, 0] }
    case 'cube-trois-couleurs-tube-edges':
      return { object3D: createCubeTroisCouleursTubeEdges(data), position: data.position || [0, 0, 0] }
    default: {
      const geometry = new THREE.BoxGeometry(data.size || 1, data.size || 1, data.size || 1)
      const material = new THREE.MeshBasicMaterial({ color: data.color || '#ffffff' })
      const mesh = new THREE.Mesh(geometry, material)
      return { object3D: mesh, position: data.position || [0, 0, 0] }
    }
  }
}

// Exemple d'utilitaire pour cube-tube-edges
function createCubeTubeEdges (data: any) {
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
    const geometry = new THREE.CylinderGeometry(data.thickness, data.thickness, length, 8)
    const material = new THREE.MeshBasicMaterial({ color: data.color })
    const cylinder = new THREE.Mesh(geometry, material)
    cylinder.position.copy(mid)
    cylinder.quaternion.copy(quaternion)
    group.add(cylinder)
  }
  return group
}

// Exemple pour cube-trois-couleurs-tube-edges
function createCubeTroisCouleursTubeEdges (data: any) {
  // Même logique que dans le composant A-Frame
  // ...copie la logique du composant ici...
  // Retourne un THREE.Group
  // (voir code du composant dans solidesAFrame.ts)
  // Tu peux réutiliser la logique de createCubeTubeEdges et ajouter le mesh coloré
  const group = new THREE.Group()
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
  group.add(mesh)
  // Ajoute les arêtes tubulaires
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
  return group
}
