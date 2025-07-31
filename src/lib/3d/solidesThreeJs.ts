import { THREE } from './threeInstance'
// Three.js pur pour créer un prisme polygonal utilisable dans une scène Three.js en perspective avec arêtes cachées en pointillés.
export function createPrismGeometry (
  sides: number,
  radius: number,
  bottom: number,
  top: number,
  withBottomBase = false,
  withTopBase = false
): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry()
  const vertices: number[] = []
  const base: THREE.Vector3[] = []
  const topBase: THREE.Vector3[] = []

  // Sommets des deux bases
  for (let i = 0; i < sides; i++) {
    const theta = (i / sides) * Math.PI * 2
    const x = radius * Math.cos(theta)
    const z = radius * Math.sin(theta)
    base.push(new THREE.Vector3(x, bottom, z))
    topBase.push(new THREE.Vector3(x, top, z))
  }

  // Triangulation de la base inférieure
  if (withBottomBase) {
    for (let i = 1; i < sides - 1; i++) {
      vertices.push(
        base[0].x, base[0].y, base[0].z,
        base[i].x, base[i].y, base[i].z,
        base[i + 1].x, base[i + 1].y, base[i + 1].z
      )
    }
  }

  // Triangulation de la base supérieure
  if (withTopBase) {
    for (let i = 1; i < sides - 1; i++) {
      vertices.push(
        topBase[0].x, topBase[0].y, topBase[0].z,
        topBase[i + 1].x, topBase[i + 1].y, topBase[i + 1].z,
        topBase[i].x, topBase[i].y, topBase[i].z
      )
    }
  }

  // Side faces (un seul rectangle par côté, découpé en 2 triangles)
  for (let i = 0; i < sides; i++) {
    const a = base[i]
    const b = base[(i + 1) % sides]
    const c = topBase[(i + 1) % sides]
    const d = topBase[i]

    // Premier triangle
    vertices.push(
      a.x, a.y, a.z,
      b.x, b.y, b.z,
      d.x, d.y, d.z
    )
    // Second triangle
    vertices.push(
      b.x, b.y, b.z,
      c.x, c.y, c.z,
      d.x, d.y, d.z
    )
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.computeVertexNormals()
  return geometry
}

export function createPyramidGeometry (
  sides: number,
  radius: number,
  bottom: number,
  top: number,
  withBase = false // <-- nouveau paramètre, false par défaut
): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry()
  const vertices: number[] = []
  const apex = new THREE.Vector3(0, top, 0)
  const base: THREE.Vector3[] = []

  for (let i = 0; i < sides; i++) {
    const theta = (i / sides) * Math.PI * 2
    const x = radius * Math.cos(theta)
    const z = radius * Math.sin(theta)
    base.push(new THREE.Vector3(x, bottom, z))
  }

  // Base face (triangulation) si demandé
  if (withBase) {
    for (let i = 1; i < sides - 1; i++) {
      vertices.push(
        base[0].x, base[0].y, base[0].z,
        base[i].x, base[i].y, base[i].z,
        base[i + 1].x, base[i + 1].y, base[i + 1].z
      )
    }
  }

  // Side faces
  for (let i = 0; i < sides; i++) {
    const a = base[i]
    const b = base[(i + 1) % sides]
    vertices.push(
      a.x, a.y, a.z,
      b.x, b.y, b.z,
      apex.x, apex.y, apex.z
    )
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.computeVertexNormals()
  return geometry
}

export function createTruncatedPyramidGeometry (
  sides: number,
  bottomRadius: number,
  topRadius: number,
  bottom: number,
  top: number,
  withBottomBase = false,
  withTopBase = false
): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry()
  const vertices: number[] = []
  const bottomVerts: THREE.Vector3[] = []
  const topVerts: THREE.Vector3[] = []

  for (let i = 0; i < sides; i++) {
    const theta = (i / sides) * Math.PI * 2
    bottomVerts.push(new THREE.Vector3(
      bottomRadius * Math.cos(theta),
      bottom,
      bottomRadius * Math.sin(theta)
    ))
    topVerts.push(new THREE.Vector3(
      topRadius * Math.cos(theta),
      top,
      topRadius * Math.sin(theta)
    ))
  }

  // Bottom face (triangulation) si demandé
  if (withBottomBase) {
    for (let i = 1; i < sides - 1; i++) {
      vertices.push(
        bottomVerts[0].x, bottomVerts[0].y, bottomVerts[0].z,
        bottomVerts[i].x, bottomVerts[i].y, bottomVerts[i].z,
        bottomVerts[i + 1].x, bottomVerts[i + 1].y, bottomVerts[i + 1].z
      )
    }
  }

  // Top face (triangulation) si demandé
  if (withTopBase) {
    for (let i = 1; i < sides - 1; i++) {
      vertices.push(
        topVerts[0].x, topVerts[0].y, topVerts[0].z,
        topVerts[i + 1].x, topVerts[i + 1].y, topVerts[i + 1].z,
        topVerts[i].x, topVerts[i].y, topVerts[i].z
      )
    }
  }

  // Side faces (un seul rectangle par côté, découpé en 2 triangles)
  for (let i = 0; i < sides; i++) {
    const a = bottomVerts[i]
    const b = bottomVerts[(i + 1) % sides]
    const c = topVerts[(i + 1) % sides]
    const d = topVerts[i]

    // Premier triangle
    vertices.push(
      a.x, a.y, a.z,
      b.x, b.y, b.z,
      d.x, d.y, d.z
    )
    // Second triangle
    vertices.push(
      b.x, b.y, b.z,
      c.x, c.y, c.z,
      d.x, d.y, d.z
    )
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.computeVertexNormals()
  return geometry
}
export function createMeshFromGeometry (
  geometry: THREE.BufferGeometry,
  material?: THREE.Material | THREE.Material[]
): THREE.Mesh {
  const mat = material ?? new THREE.MeshStandardMaterial({ color: '#fff' })
  return new THREE.Mesh(geometry, mat)
}

export function createEdgesFromGeometry (
  geometry: THREE.BufferGeometry,
  dashed = false
): THREE.LineSegments {
  const edges = new THREE.EdgesGeometry(geometry)
  let material: THREE.Material
  if (dashed) {
    material = new THREE.LineDashedMaterial({
      color: 0x000000,
      dashSize: 0.05,
      gapSize: 0.025,
      depthTest: false,
      transparent: true,
      opacity: 0.5 // ou 0.5 si tu veux atténuer les pointillés
    })
  } else {
    material = new THREE.LineBasicMaterial({
      color: 0x000000,
      depthTest: true,
      transparent: true,
      opacity: 1
    })
  }
  const line = new THREE.LineSegments(edges, material)
  if (dashed && line.computeLineDistances) line.computeLineDistances()
  return line
}
