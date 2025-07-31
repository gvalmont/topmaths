import { SceneViewer } from './SceneViewer'
import { THREE } from './threeInstance'

export type FaceNode = {
  x: number
  y: number
  parent?: FaceNode
  children: FaceNode[]
  directionFromParent?: 'T' | 'B' | 'L' | 'R'
}
export type objetFace = {
  width?: number;
  height?: number;
  numero: number;
  isFace: boolean;
  collision?: number; // optionnel car pas présent partout
}

export const vraiCubes:(number[][])[] = [
  [[0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0]],
  [[0, 1, 0],
    [0, 1, 1],
    [1, 1, 0],
    [0, 1, 0]],
  [[1, 1, 0],
    [0, 1, 1],
    [0, 1, 0],
    [0, 1, 0]],
  [[1, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
    [0, 1, 0]],
  [[1, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0]],
  [[0, 1, 0],
    [0, 1, 1],
    [1, 1, 0],
    [1, 0, 0]],
  [[1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0]],
  [[0, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0]],
  [[0, 1, 1],
    [0, 1, 0],
    [1, 1, 0],
    [1, 0, 0]],
  [[1, 0],
    [1, 0],
    [1, 1],
    [0, 1],
    [0, 1]],
  [[0, 0, 1],
    [0, 1, 1],
    [1, 1, 0],
    [1, 0, 0]],
]

export const fauxCubes:(number[][])[] = [
  [[1, 0],
    [1, 0],
    [1, 1],
    [1, 0],
    [1, 0]],
  [[1, 0, 0],
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0]],
  [[1, 0],
    [1, 1],
    [1, 0],
    [1, 0],
    [1, 0]],
  [[1, 1],
    [1, 0],
    [1, 1],
    [1, 0]],
  [[1, 0, 1],
    [1, 1, 1],
    [0, 1, 0]],
  [[0, 1, 0],
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0]],
  [[1, 1, 1],
    [0, 1, 0],
    [1, 1, 0]],
  [[1],
    [1],
    [1],
    [1],
    [1],
    [1]],
  [[1, 1],
    [1, 0],
    [1, 0],
    [1, 0],
    [1, 0]],
  [[1, 1],
    [1, 0],
    [1, 0],
    [1, 1]],
  [[0, 1],
    [1, 1],
    [1, 0],
    [1, 0],
    [1, 0]],
  [[1, 1, 1],
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0]],
  [[1, 1],
    [1, 0],
    [1, 1],
    [0, 1]],
  [[1, 1, 1],
    [1, 0, 1],
    [1, 0, 0]],
  [[0, 0, 1],
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0]],
  [[0, 1, 1],
    [1, 1, 0],
    [1, 0, 0],
    [1, 0, 0]],
]

export const cubesObj:(objetFace[][])[] = [
  [[{ numero: 0, isFace: false }, { numero: 1, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 2, isFace: true }, { numero: 3, isFace: true }, { numero: 4, isFace: true }],
    [{ numero: 0, isFace: false }, { numero: 5, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 0, isFace: false }, { numero: 6, isFace: true }, { numero: 0, isFace: false }]
  ],
  [[{ numero: 0, isFace: false }, { numero: 1, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 0, isFace: false }, { numero: 2, isFace: true }, { numero: 3, isFace: true }],
    [{ numero: 4, isFace: true }, { numero: 5, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 0, isFace: false }, { numero: 6, isFace: true }, { numero: 0, isFace: false }]
  ],
  [[{ numero: 1, isFace: true }, { numero: 2, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 0, isFace: false }, { numero: 3, isFace: true }, { numero: 4, isFace: true }],
    [{ numero: 0, isFace: false }, { numero: 5, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 0, isFace: false }, { numero: 6, isFace: true }, { numero: 0, isFace: false }]
  ],
  [[{ numero: 1, isFace: true }, { numero: 2, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 0, isFace: false }, { numero: 3, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 0, isFace: false }, { numero: 4, isFace: true }, { numero: 5, isFace: true }],
    [{ numero: 0, isFace: false }, { numero: 6, isFace: true }, { numero: 0, isFace: false }]
  ],
  [[{ numero: 1, isFace: true }, { numero: 0, isFace: false }, { numero: 0, isFace: false }],
    [{ numero: 2, isFace: true }, { numero: 3, isFace: true }, { numero: 4, isFace: true }],
    [{ numero: 0, isFace: false }, { numero: 5, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 0, isFace: false }, { numero: 6, isFace: true }, { numero: 0, isFace: false }]
  ],
  [[{ numero: 0, isFace: false }, { numero: 1, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 0, isFace: false }, { numero: 2, isFace: true }, { numero: 3, isFace: true }],
    [{ numero: 4, isFace: true }, { numero: 5, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 6, isFace: true }, { numero: 0, isFace: false }, { numero: 0, isFace: false }]
  ],
  [[{ numero: 1, isFace: true }, { numero: 2, isFace: true }, { numero: 3, isFace: true }],
    [{ numero: 0, isFace: false }, { numero: 4, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 0, isFace: false }, { numero: 5, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 0, isFace: false }, { numero: 6, isFace: true }, { numero: 0, isFace: false }]
  ],
  [[{ numero: 0, isFace: false }, { numero: 1, isFace: true }, { numero: 2, isFace: true }],
    [{ numero: 0, isFace: false }, { numero: 3, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 0, isFace: false }, { numero: 4, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 5, isFace: true }, { numero: 6, isFace: true }, { numero: 0, isFace: false }]
  ],
  [[{ numero: 0, isFace: false }, { numero: 1, isFace: true }, { numero: 2, isFace: true }],
    [{ numero: 0, isFace: false }, { numero: 3, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 4, isFace: true }, { numero: 5, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 6, isFace: true }, { numero: 0, isFace: false }, { numero: 0, isFace: false }]
  ],
  [[{ numero: 1, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 2, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 3, isFace: true }, { numero: 4, isFace: true }],
    [{ numero: 0, isFace: false }, { numero: 5, isFace: true }],
    [{ numero: 0, isFace: false }, { numero: 6, isFace: true }]
  ],
  [[{ numero: 0, isFace: false }, { numero: 0, isFace: false }, { numero: 1, isFace: true }],
    [{ numero: 0, isFace: false }, { numero: 2, isFace: true }, { numero: 3, isFace: true }],
    [{ numero: 4, isFace: true }, { numero: 5, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 6, isFace: true }, { numero: 0, isFace: false }, { numero: 0, isFace: false }]
  ],
]

export const fauxCubesObj:(objetFace[][])[] = [
  [[{ numero: 1, isFace: true, collision: 6 }, { numero: 0, isFace: false }],
    [{ numero: 2, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 3, isFace: true }, { numero: 4, isFace: true }],
    [{ numero: 5, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 6, isFace: true }, { numero: 0, isFace: false }]
  ], // fait
  [[{ numero: 1, isFace: true }, { numero: 0, isFace: false }, { numero: 0, isFace: false }],
    [{ numero: 2, isFace: true }, { numero: 3, isFace: true }, { numero: 4, isFace: true, collision: 6 }],
    [{ numero: 5, isFace: true }, { numero: 0, isFace: false }, { numero: 0, isFace: false }],
    [{ numero: 6, isFace: true }, { numero: 0, isFace: false }, { numero: 0, isFace: false }]
  ], // fait
  [[{ numero: 1, isFace: true, collision: 6 }, { numero: 0, isFace: false }],
    [{ numero: 2, isFace: true }, { numero: 3, isFace: true }],
    [{ numero: 4, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 5, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 6, isFace: true }, { numero: 0, isFace: false }]
  ], // fait
  [[{ numero: 1, isFace: true }, { numero: 2, isFace: true, collision: 5 }],
    [{ numero: 3, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 4, isFace: true }, { numero: 5, isFace: true }],
    [{ numero: 6, isFace: true }, { numero: 0, isFace: false }]
  ], // fait
  [[{ numero: 1, isFace: true, collision: 2 }, { numero: 0, isFace: false }, { numero: 2, isFace: true }],
    [{ numero: 3, isFace: true }, { numero: 4, isFace: true }, { numero: 5, isFace: true }],
    [{ numero: 0, isFace: false }, { numero: 6, isFace: true }, { numero: 0, isFace: false }]
  ], // fait
  [[{ numero: 0, isFace: false }, { numero: 1, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 2, isFace: true }, { numero: 3, isFace: true }, { numero: 4, isFace: true, collision: 6 }],
    [{ numero: 5, isFace: true }, { numero: 0, isFace: false }, { numero: 0, isFace: false }],
    [{ numero: 6, isFace: true }, { numero: 0, isFace: false }, { numero: 0, isFace: false }]
  ], // fait
  [[{ numero: 1, isFace: true, collision: 5 }, { numero: 2, isFace: true }, { numero: 3, isFace: true }],
    [{ numero: 0, isFace: false }, { numero: 4, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 5, isFace: true }, { numero: 6, isFace: true }, { numero: 0, isFace: false }]
  ], // fait
  [[{ numero: 1, isFace: true, collision: 5 }],
    [{ numero: 2, isFace: true, collision: 6 }],
    [{ numero: 3, isFace: true }],
    [{ numero: 4, isFace: true }],
    [{ numero: 5, isFace: true }],
    [{ numero: 6, isFace: true }]
  ], // fait
  [[{ numero: 1, isFace: true, collision: 6 }, { numero: 2, isFace: true }],
    [{ numero: 3, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 4, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 5, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 6, isFace: true }, { numero: 0, isFace: false }]
  ], // fait
  [[{ numero: 1, isFace: true }, { numero: 2, isFace: true, collision: 6 }],
    [{ numero: 3, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 4, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 5, isFace: true }, { numero: 6, isFace: true }]
  ], // fait
  [[{ numero: 0, isFace: false }, { numero: 1, isFace: true, collision: 6 }],
    [{ numero: 2, isFace: true }, { numero: 3, isFace: true }],
    [{ numero: 4, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 5, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 6, isFace: true }, { numero: 0, isFace: false }]
  ], // fait
  [[{ numero: 1, isFace: true }, { numero: 2, isFace: true }, { numero: 3, isFace: true, collision: 6 }],
    [{ numero: 4, isFace: true }, { numero: 0, isFace: false }, { numero: 0, isFace: false }],
    [{ numero: 5, isFace: true }, { numero: 0, isFace: false }, { numero: 0, isFace: false }],
    [{ numero: 6, isFace: true }, { numero: 0, isFace: false }, { numero: 0, isFace: false }]
  ], // fait
  [[{ numero: 1, isFace: true }, { numero: 2, isFace: true, collision: 5 }],
    [{ numero: 3, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 4, isFace: true }, { numero: 5, isFace: true }],
    [{ numero: 0, isFace: false }, { numero: 6, isFace: true }]
  ], // fait
  [[{ numero: 1, isFace: true }, { numero: 2, isFace: true }, { numero: 3, isFace: true, collision: 6 }],
    [{ numero: 4, isFace: true, collision: 5 }, { numero: 0, isFace: false }, { numero: 5, isFace: true }],
    [{ numero: 6, isFace: true }, { numero: 0, isFace: false }, { numero: 0, isFace: false }]
  ], // fait ce patron ci dessus risque de poser problème a l'animation
  [[{ numero: 0, isFace: false }, { numero: 0, isFace: false }, { numero: 1, isFace: true }],
    [{ numero: 2, isFace: true }, { numero: 3, isFace: true }, { numero: 4, isFace: true, collision: 6 }],
    [{ numero: 5, isFace: true }, { numero: 0, isFace: false }, { numero: 0, isFace: false }],
    [{ numero: 6, isFace: true }, { numero: 0, isFace: false }, { numero: 0, isFace: false }]
  ], // fait
  [[{ numero: 0, isFace: false }, { numero: 1, isFace: true }, { numero: 2, isFace: true, collision: 6 }],
    [{ numero: 3, isFace: true }, { numero: 4, isFace: true }, { numero: 0, isFace: false }],
    [{ numero: 5, isFace: true }, { numero: 0, isFace: false }, { numero: 0, isFace: false }],
    [{ numero: 6, isFace: true }, { numero: 0, isFace: false }, { numero: 0, isFace: false }]
  ], // fait
]

/* const matrice = [
[{ width: 1, height: 1,numero: 1, isFace: true, collision: 5}],
[{ width: 1, height: 1,numero: 2, isFace: true, collision: 6}],
[{ width: 1, height: 1,numero: 3, isFace: true}],
[{ width: 1, height: 1,numero: 4, isFace: true}],
[{ width: 1, height: 1,numero: 5, isFace: true}],
[{ width: 1, height: 1,numero: 6, isFace: true}]
] */

function getVoisins (matrice: objetFace[][], x: number, y: number) {
  const dirs = [
    { dx: 0, dy: -1, dir: 'T' },
    { dx: 0, dy: 1, dir: 'B' },
    { dx: -1, dy: 0, dir: 'L' },
    { dx: 1, dy: 0, dir: 'R' }
  ] as const
  return dirs
    .filter(({ dx, dy }) => matrice[y + dy]?.[x + dx]?.isFace)
    .map(({ dx, dy, dir }) => ({ x: x + dx, y: y + dy, dir }))
}

// 1. Trouver la face pivot (celle avec le plus de voisins)
export function findPivot (matrice: objetFace[][]) {
  let maxVoisins = -1
  let pivot = { x: 0, y: 0 }
  for (let y = 0; y < matrice.length; y++) {
    for (let x = 0; x < matrice[0].length; x++) {
      if (matrice[y][x].isFace) {
        const voisins = getVoisins(matrice, x, y)
        if (voisins.length > maxVoisins) {
          maxVoisins = voisins.length
          pivot = { x, y }
        }
      }
    }
  }
  return pivot
}

// 2. Construire l’arbre des faces
export function buildFaceTree (matrice: objetFace[][], x: number, y: number, parent?: FaceNode, directionFromParent?: 'T' | 'B' | 'L' | 'R', visited = new Set<string>()): FaceNode {
  const key = `${x},${y}`
  if (visited.has(key)) return null as any
  visited.add(key)
  const node: FaceNode = { x, y, parent, children: [], directionFromParent }
  for (const voisin of getVoisins(matrice, x, y)) {
    if (!visited.has(`${voisin.x},${voisin.y}`)) {
      // Ajoute ce log :
      if (Math.abs(voisin.x - x) + Math.abs(voisin.y - y) !== 1) {
        console.warn(`Parent (${x},${y}) et enfant (${voisin.x},${voisin.y}) ne sont pas adjacents !`)
      }
      const child = buildFaceTree(matrice, voisin.x, voisin.y, node, voisin.dir, visited)
      if (child) node.children.push(child)
    }
  }
  return node
}

// 3. Générer la structure A-Frame récursive
export function addFaceRecursive (
  viewer: SceneViewer,
  node: FaceNode,
  taille: number,
  facePositions: Map<string, [number, number, number]>,
  pivotPositions: Map<string, [number, number, number]>,
  parentEntityId?: string,
  faceCount: { value: number } = { value: 0 }
) {
  const EPSILON = 0.002 // taille du gap entre les faces pour faire joli
  const boxWidth = taille - 2 * EPSILON
  const boxDepth = taille - 2 * EPSILON

  const couleurs = [
    '#3498db', // bleu doux
    '#2ecc71', // vert frais
    '#e67e22', // orange pastel
    '#9b59b6', // violet doux
    '#f1c40f', // jaune doux
    '#5dade2'  // bleu clair
  ]
  const colorIndex = faceCount.value % couleurs.length
  faceCount.value++
  const couleur = couleurs[colorIndex]
  const faceId = `face_${node.x}_${node.y}`
  const entityId = `entity_${node.x}_${node.y}`
  let entity = ''

  const key = `${node.x},${node.y}`
  const faceAbsPos = facePositions.get(key) ?? [0, 0, 0]
  const pivotAbsPos = pivotPositions.get(key) ?? [0, 0, 0]
  const parentPivotAbsPos = node.parent ? pivotPositions.get(`${node.parent.x},${node.parent.y}`) ?? [0, 0, 0] : [0, 0, 0]

  if (node.parent && node.directionFromParent) {
    // Position du pivot relatif au pivot parent
    const pivotRelPos: [number, number, number] = [
      pivotAbsPos[0] - parentPivotAbsPos[0],
      pivotAbsPos[1] - parentPivotAbsPos[1],
      pivotAbsPos[2] - parentPivotAbsPos[2]
    ]
    // Position de la face dans son pivot
    const facePos: [number, number, number] = [
      faceAbsPos[0] - pivotAbsPos[0],
      faceAbsPos[1] - pivotAbsPos[1],
      faceAbsPos[2] - pivotAbsPos[2]
    ]
    entity += `<a-entity id="${entityId}" position="${pivotRelPos.join(' ')}" rotation="0 0 0">`
    entity += `<a-box id="${faceId}" position="${facePos.join(' ')}" width="${boxWidth}" height="0.01" depth="${boxDepth}" color="${couleur}"></a-box>`
  } else {
    // Racine
    entity += `<a-entity id="${entityId}" position="${faceAbsPos.join(' ')}" rotation="0 0 0">`
    entity += `<a-box id="${faceId}" position="0 0 0" width="${boxWidth}" height="0.01" depth="${boxDepth}" color="${couleur}"></a-box>`
  }

  for (const child of node.children) {
    entity += addFaceRecursive(viewer, child, taille, facePositions, pivotPositions, entityId, faceCount)
  }
  entity += '</a-entity>'

  if (!parentEntityId) {
    viewer.addMesh(entity)
  }
  return parentEntityId ? entity : ''
}

export function animePliage (node: FaceNode, numExercice = 0, numQuestion = 0, onComplete?: () => void, duration = 4000) {
  let pending = 0
  function recurse (n: FaceNode) {
    if (n.parent && n.directionFromParent) {
      const entityId = `entity_${n.x}_${n.y}`
      let rot = '0 0 0'
      switch (n.directionFromParent) {
        case 'T': rot = '90 0 0'; break
        case 'B': rot = '-90 0 0'; break
        case 'L': rot = '0 0 -90'; break
        case 'R': rot = '0 0 90'; break
      }
      const entity = document.getElementById(entityId)
      if (entity) {
        entity.removeAttribute('animation__fold')
        entity.setAttribute(
          'animation__fold',
          `property: rotation; to: ${rot}; dur: ${duration}; easing: easeInOutQuad`
        )
        pending++
        entity.addEventListener('animationcomplete', function handler (e) {
          const customEvent = e as CustomEvent
          if (customEvent.detail && customEvent.detail.name === 'animation__fold') {
            entity.removeEventListener('animationcomplete', handler)
            pending--
            if (pending === 0 && onComplete) onComplete()
          }
        })
      }
    }
    for (const child of n.children) recurse(child)
  }
  recurse(node)
  // Gestion des boutons
  if (!node.parent) {
    const btnPlier = document.getElementById(`btnPlierEx${numExercice}Q${numQuestion}`)
    const btnDeplier = document.getElementById(`btnDeplierEx${numExercice}Q${numQuestion}`)
    if (btnPlier) btnPlier.setAttribute('disabled', 'true')
    if (btnDeplier) btnDeplier.removeAttribute('disabled')
  }
}

export function animeDepliage (
  node: FaceNode,
  numExercice = 0,
  numQuestion = 0,
  onComplete?: () => void,
  duration = 4000
) {
  let pending = 0
  function recurse (n: FaceNode) {
    if (n.parent && n.directionFromParent) {
      const entityId = `entity_${n.x}_${n.y}`
      const rot = '0 0 0'
      const entity = document.getElementById(entityId)
      if (entity) {
        entity.removeAttribute('animation__unfold')
        entity.setAttribute(
          'animation__unfold',
          `property: rotation; to: ${rot}; dur: ${duration}; easing: easeInOutQuad`
        )
        pending++
        entity.addEventListener('animationcomplete', function handler (e) {
          const customEvent = e as CustomEvent
          if (customEvent.detail && customEvent.detail.name === 'animation__unfold') {
            entity.removeEventListener('animationcomplete', handler)
            pending--
            if (pending === 0 && onComplete) onComplete()
          }
        })
      }
    }
    for (const child of n.children) recurse(child)
  }
  recurse(node)
  // Gestion des boutons
  if (!node.parent) {
    const btnPlier = document.getElementById(`btnPlierEx${numExercice}Q${numQuestion}`)
    const btnDeplier = document.getElementById(`btnDeplierEx${numExercice}Q${numQuestion}`)
    if (btnDeplier) btnDeplier.setAttribute('disabled', 'true')
    if (btnPlier) btnPlier.removeAttribute('disabled')
  }
}
const EPSILON = 0.001 // ou 0.005 selon le rendu souhaité

export function getAbsolutePositions (tree: FaceNode, taille: number, pos: [number, number, number] = [0, 0, 0], positions = new Map<string, [number, number, number]>()) {
  const key = `${tree.x},${tree.y}`
  positions.set(key, pos)
  for (const child of tree.children) {
    let offset: [number, number, number] = [0, 0, 0]
    switch (child.directionFromParent) {
      case 'T': offset = [0, 0, -(taille + EPSILON)]; break
      case 'B': offset = [0, 0, taille + EPSILON]; break
      case 'L': offset = [-(taille + EPSILON), 0, 0]; break
      case 'R': offset = [taille + EPSILON, 0, 0]; break
    }
    getAbsolutePositions(child, taille, [
      pos[0] + offset[0],
      pos[1] + offset[1],
      pos[2] + offset[2]
    ], positions)
  }
  return positions
}

export function getPivotPositions (
  node: FaceNode,
  taille: number,
  facePositions: Map<string, [number, number, number]>,
  pivotPositions: Map<string, [number, number, number]>
) {
  const key = `${node.x},${node.y}`
  const faceAbsPos = facePositions.get(key) ?? [0, 0, 0]
  let pivotAbsPos: [number, number, number]
  if (!node.parent) {
    pivotAbsPos = faceAbsPos
  } else {
    const parentKey = `${node.parent.x},${node.parent.y}`
    const parentFaceAbsPos = facePositions.get(parentKey) ?? [0, 0, 0]
    pivotAbsPos = [
      (parentFaceAbsPos[0] + faceAbsPos[0]) / 2,
      (parentFaceAbsPos[1] + faceAbsPos[1]) / 2,
      (parentFaceAbsPos[2] + faceAbsPos[2]) / 2
    ]
  }
  pivotPositions.set(key, pivotAbsPos)
  for (const child of node.children) {
    getPivotPositions(child, taille, facePositions, pivotPositions)
  }
  return pivotPositions
}

export const blinkColors = [
  '#ff0000', // rouge vif
  '#00ff00', // vert fluo
  '#0000ff', // bleu électrique
  '#ffff00', // jaune pétant
  '#ff00ff', // magenta
  '#00ffff', // cyan
  '#ff8800', // orange vif
  '#ff0080', // rose flashy
  '#00ff88', // vert menthe
  '#8800ff'  // violet flashy
]
/**
 *
 * @param box La fonction qui fait clignoter les faces
 * @param color
 * @param times
 * @param interval
 * @returns
 */
export function blinkABox (box: Element, color = '#ff0000', times = 26, interval = 200) {
  let count = 0
  let stopped = false
  const originalColor = String(box.getAttribute('color'))
  function stop () {
    stopped = true
    box.setAttribute('color', originalColor)
  }
  const blink = () => {
    if (stopped) return
    box.setAttribute('color', count % 2 === 0 ? color : '#ffffff')
    count++
    if (count < times * 2) setTimeout(blink, interval)
    else box.setAttribute('color', originalColor)
  }
  blink()
  return stop
}

export function affichePatron3D (matrice: objetFace[][], idPrefix = 'patron3d'): { viewer: SceneViewer, tree: FaceNode } {
  const pivot = findPivot(matrice)
  const viewer = new SceneViewer({ width: 400, height: 400, id: idPrefix, rigPosition: [pivot.x, 1, pivot.y], detectCollision: true })
  const taille = 1.5
  const tree = buildFaceTree(matrice, pivot.x, pivot.y)
  const facePositions = getAbsolutePositions(tree, taille, [pivot.x, 0, pivot.y], new Map<string, [number, number, number]>())
  const pivotsPositions = getPivotPositions(tree, taille, facePositions, new Map<string, [number, number, number]>())

  addFaceRecursive(viewer, tree, taille, facePositions, pivotsPositions)

  viewer.addAmbientLight({ color: '#ffffff', intensity: 0.6 })
  viewer.addDirectionnalLight({ position: [2, 5, 2], color: '#ffffff', intensity: 0.8 })
  // Retourne aussi l'arbre pour l'animation
  return { viewer, tree }
}

export function ajouteListeners (numeroExercice: number, i: number, viewer: SceneViewer, tree: FaceNode, immediate = false) {
  function build () {
    const emplacementCorrection = document.getElementById(`emplacementPourSceneViewerEx${numeroExercice}Q${i}Correction`)
    if (emplacementCorrection) {
      viewer.showSceneAt(emplacementCorrection)

      viewer.addHtmlButton({
        id: `btnDeplierEx${numeroExercice}Q${i}`,
        text: 'Déplier',
        style: { left: '120px' },
        onClick: () => animeDepliage(
          tree,
          numeroExercice,
          i,
          () => { stopBlinkers.forEach(stop => stop()) },
          4000
        )
      })
      viewer.addHtmlButton({
        id: `btnPlierEx${numeroExercice}Q${i}`,
        text: 'Plier',
        onClick: () => {
          animePliage(tree, numeroExercice, i, () => {
            const scene = emplacementCorrection.querySelector('a-scene')
            if (scene) {
              scene.dispatchEvent(new CustomEvent('pliageTermine', {
                detail: { numExercice: numeroExercice, numQuestion: i }
              }))
            }
          })
        }
      })
      const scene = emplacementCorrection.querySelector('a-scene')

      if (scene) {
        scene.addEventListener('pliageTermine', () => {
          const boxes = Array.from(emplacementCorrection.querySelectorAll('a-box'))
          for (let i = 0; i < boxes.length; i++) {
            for (let j = i + 1; j < boxes.length; j++) {
              const boxA = boxes[i]
              const boxB = boxes[j]
              const a = boxA.object3D
              const b = boxB.object3D
              const boxA3 = new THREE.Box3().setFromObject(a)
              const boxB3 = new THREE.Box3().setFromObject(b)
              const intersection = boxA3.clone().intersect(boxB3)
              const size = new THREE.Vector3()
              intersection.getSize(size)
              const volume = size.x * size.y * size.z
              if (volume > 0.005) {
                stopBlinkers.push(blinkABox(boxA, blinkColors[i % blinkColors.length]))
                stopBlinkers.push(blinkABox(boxB, blinkColors[i % blinkColors.length]))
              }
            }
          }
        })
      }
    }
  }
  const stopBlinkers: (() => void)[] = []
  if (immediate) {
    build()
  } else {
    document.addEventListener('correctionsAffichees', () => {
      build()
    })
  }
}
