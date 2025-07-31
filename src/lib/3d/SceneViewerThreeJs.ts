import { BufferGeometryUtils } from 'three/examples/jsm/Addons.js'
import { THREE } from './threeInstance'
import {
  createEdgesFromGeometry,
  createMeshFromGeometry,
  createPrismGeometry,
  createPyramidGeometry,
  createTruncatedPyramidGeometry,
} from './solidesThreeJs'
// ↑ Assurez-vous que ce module est bien installé et importé

/**
 * Classe pour visualiser une scène 3D avec Three.js
 * SceneViewer.ts : Intégration Three.js avec rendu en 3 passes (pointillés, faces, traits pleins)
 * @auhor Jean-Claude LHOTE
 */
export class SceneViewerThreeJs {
  public readonly id: string
  private _container: HTMLElement
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private width: number
  private height: number
  private rig: THREE.Object3D
  private rigPosition: THREE.Vector3
  private cameraDistance: number
  private rigRotationY: number = 0
  private rigRotationX: number = 0
  private minDistance: number = 2
  private maxDistance: number = 20
  private fov: number = 60

  // Ajout des nouvelles options
  private withSky: boolean = false
  private withGrid: boolean = false
  private withAxes: boolean = false
  private withHelpers: boolean = false
  private backgroundColor: string | null = null
  public fullScreenButton: boolean = false
  private zoomLimits: { min: number, max: number } = { min: 2, max: 20 }
  private withEarth: boolean = false

  private raycaster = new THREE.Raycaster()
  private pointer = new THREE.Vector2()
  private selectedObject: THREE.Object3D | null = null
  private mode: 'camera' | 'object' = 'camera'
  private _cameraListenersActive = true
  private _cameraListeners: Array<{ type: string, target: EventTarget, handler: EventListenerOrEventListenerObject }> = []

  constructor ({
    container,
    width,
    height,
    withSky = false,
    backgroundColor = null,
    fullScreenButton = false,
    rigRotationX = 0,
    rigRotationY = 0,
    rigPosition = [0, 0, 0],
    zoomLimits = { min: 2, max: 20 },
    withEarth = false,
    withGrid = false,
    withAxes = false,
    withHelpers = false,
    cameraDistance,
    fov,
    mode
  }: {
    container?: HTMLElement,
    width?: number,
    height?: number,
    withSky?: boolean,
    backgroundColor?: string | null,
    fullScreenButton?: boolean,
    rigRotationX?: number,
    rigRotationY?: number,
    rigPosition?: [number, number, number],
    zoomLimits?: { min: number, max: number },
    withEarth?: boolean,
    withGrid?: boolean,
    withAxes?: boolean,
    withHelpers?: boolean,
    cameraDistance?: number,
    fov?: number,
    mode?: 'camera' | 'object'
  } = {}) {
    // Génère un id unique (préfixe utile pour le debug)
    this.id = 'scenejs-' + (typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 10))
    this._container = container || document.body
    this.width = width ?? 400
    this.height = height ?? 400

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color('#DDD')

    this.rigPosition = rigPosition ? new THREE.Vector3(...rigPosition) : new THREE.Vector3(0, 0, 0)
    this.minDistance = zoomLimits.min ?? 2
    this.maxDistance = zoomLimits.max ?? 20
    this.withSky = withSky
    this.backgroundColor = backgroundColor
    this.fullScreenButton = fullScreenButton
    this.withEarth = withEarth
    this.withGrid = withGrid ?? false
    this.withAxes = withAxes ?? false
    this.withHelpers = withHelpers ?? false
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.width, this.height)
    this.renderer.setClearColor(0x000000, 0) // Fond transparent
    this.cameraDistance = cameraDistance ?? (this.maxDistance + this.minDistance) / 2
    this.rig = new THREE.Object3D()
    this.rig.position.copy(this.rigPosition)
    this.rig.rotation.y = THREE.MathUtils.degToRad(rigRotationY ?? 0)
    this.rig.rotation.x = THREE.MathUtils.degToRad(rigRotationX ?? 0)
    this.fov = fov ?? 60 // Champ de vision par défaut
    this.scene.add(this.rig)

    this.camera = new THREE.PerspectiveCamera(this.fov, this.width / this.height, 0.1, 1000)
    this.camera.position.set(1, 0.5, this.cameraDistance)
    this.camera.lookAt(this.rig.position)

    this.rig.add(this.camera)
    if (withSky) {
      this.addSky()
    } else if (backgroundColor) {
      this.scene.background = new THREE.Color(backgroundColor)
    } else {
      this.scene.background = new THREE.Color('#DDD') // couleur par défaut
    }
    if (withEarth) {
      this.addEarth()
    }
    if (withGrid) { this.renderer = new THREE.WebGLRenderer({ antialias: true }) }
    if (withAxes) {
      this.addRepere3d()
      const axesHelper = new THREE.AxesHelper(5)
      axesHelper.name = 'axes-helper'
      this.scene.add(axesHelper)
    }
    if (withHelpers) {
      const gridHelper = new THREE.GridHelper(10, 10)
      gridHelper.name = 'grid-helper'
      this.scene.add(gridHelper)
    }

    if (fullScreenButton) {
      this.addFullscreenButton()
    }
    this.renderer.setSize(this.width, this.height)
    // Ajoute l'id sur le canvas pour le retrouver dans le DOM
    this.renderer.domElement.id = this.id
    this.renderer.domElement.style.display = 'none'
    this._container.appendChild(this.renderer.domElement)
    // 4. Lumière
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(2, 3, 1)
    this.scene.add(light)
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.4))

    this.animate()

    // Gestion du mode de contrôle : 'camera' ou 'objet'
    if (mode === 'camera') {
      this._cameraListenersActive = false
      this.setModeCamera()
    } else {
      this._cameraListenersActive = true
      this.setModeObject()
    }
  }

  set container (newContainer: HTMLElement) {
    if (this._container && this.renderer.domElement.parentNode === this._container) {
      this._container.removeChild(this.renderer.domElement)
      // Supprime aussi le bouton fullscreen de l'ancien container s'il existe
      const oldBtn = this._container.querySelector('.scenejs-fullscreen-btn')
      if (oldBtn) this._container.removeChild(oldBtn)
      // Retire l'ancien listener fullscreenchange
      this._container.removeEventListener('fullscreenchange', this._onFullscreenChange)
    }
    this._container = newContainer
    this._container.appendChild(this.renderer.domElement)
    this.renderer.domElement.style.display = 'block'
    // Ajoute le bouton fullscreen si besoin
    if (this.fullScreenButton) {
      this.addFullscreenButton()
    }
    // Ajoute le listener fullscreenchange sur le nouveau container
    this._container.addEventListener('fullscreenchange', this._onFullscreenChange)
  }

  get container () {
    return this._container
  }

  private applyPolygonOffset (mesh: THREE.Mesh) {
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    for (const mat of materials) {
      mat.polygonOffset = true
      mat.polygonOffsetFactor = 1
      mat.polygonOffsetUnits = 1
    }
  }

  setModeCamera () {
    this.mode = 'camera'
    this._enableCameraListeners(true)
    this.renderer.domElement.style.cursor = 'grab'
  }

  setModeObject () {
    this.mode = 'object'
    this._enableCameraListeners(false)
    this.renderer.domElement.style.cursor = 'pointer'
  }

  private _addCameraListeners () {
    if (this._cameraListenersActive) return
    const canvas = this.renderer.domElement

    let isDragging = false
    let previousMousePosition = { x: 0, y: 0 }
    let lastTouchDistance = 0

    // Drag souris
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      previousMousePosition = { x: e.clientX, y: e.clientY }
      canvas.style.cursor = 'grabbing'
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const deltaX = e.clientX - previousMousePosition.x
      const deltaY = e.clientY - previousMousePosition.y
      this.rigRotationY -= deltaX * 0.5
      this.rigRotationX -= deltaY * 0.5
      this.rigRotationX = Math.max(-80, Math.min(80, this.rigRotationX))
      previousMousePosition = { x: e.clientX, y: e.clientY }
    }
    const onMouseUp = () => {
      isDragging = false
      canvas.style.cursor = 'grab'
    }

    // Molette zoom
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      this.cameraDistance += e.deltaY * 0.01
      this.cameraDistance = Math.max(this.minDistance, Math.min(this.maxDistance, this.cameraDistance))
    }

    // Touches
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      } else if (e.touches.length === 2) {
        const [t1, t2] = e.touches
        lastTouchDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY)
      }
    }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging) {
        const deltaX = e.touches[0].clientX - previousMousePosition.x
        const deltaY = e.touches[0].clientY - previousMousePosition.y
        this.rigRotationY -= deltaX * 0.5
        this.rigRotationX -= deltaY * 0.5
        this.rigRotationX = Math.max(-80, Math.min(80, this.rigRotationX))
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      } else if (e.touches.length === 2) {
        const [t1, t2] = e.touches
        const currentDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY)
        const delta = currentDistance - lastTouchDistance
        this.cameraDistance -= delta * 0.01
        this.cameraDistance = Math.max(this.minDistance, Math.min(this.maxDistance, this.cameraDistance))
        lastTouchDistance = currentDistance
      }
    }
    const onTouchEnd = () => {
      isDragging = false
      lastTouchDistance = 0
    }

    // Ajout des listeners
    canvas.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('wheel', onWheel)
    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd, { passive: false })

    this._cameraListeners = [
      { type: 'mousedown', target: canvas, handler: onMouseDown as EventListenerOrEventListenerObject },
      { type: 'mousemove', target: document, handler: onMouseMove as EventListenerOrEventListenerObject },
      { type: 'mouseup', target: document, handler: onMouseUp as EventListenerOrEventListenerObject },
      { type: 'wheel', target: canvas, handler: onWheel as EventListenerOrEventListenerObject },
      { type: 'touchstart', target: canvas, handler: onTouchStart as EventListenerOrEventListenerObject },
      { type: 'touchmove', target: canvas, handler: onTouchMove as EventListenerOrEventListenerObject },
      { type: 'touchend', target: canvas, handler: onTouchEnd as EventListenerOrEventListenerObject },
    ]
    this._cameraListenersActive = true
  }

  private _removeCameraListeners () {
    if (!this._cameraListenersActive) return
    for (const { type, target, handler } of this._cameraListeners) {
      target.removeEventListener(type, handler)
    }
    this._cameraListeners = []
    this._cameraListenersActive = false
  }

  private _enableCameraListeners (enable: boolean) {
    // Ajoute ou retire les listeners de navigation caméra
    if (enable && !this._cameraListenersActive) {
      this._addCameraListeners()
      this._cameraListenersActive = true
    } else if (!enable && this._cameraListenersActive) {
      this._removeCameraListeners()
      this._cameraListenersActive = false
    }
  }

  addSky () {
  // Vérifie si le sky existe déjà pour éviter les doublons
    if (this.scene.getObjectByName('sky-sphere')) return

    const geometry = new THREE.SphereGeometry(100, 64, 64)
    const texture = new THREE.TextureLoader().load('images/2k_stars_milky_way.jpg')
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide // Important pour voir la texture depuis l'intérieur
    })
    const sky = new THREE.Mesh(geometry, material)
    sky.name = 'sky-sphere'
    this.scene.add(sky)
  }

  addWireframePrism (
    sides: number,
    radius: number,
    bottom: number,
    top: number,
    withBottomBase = false,
    withTopBase = false,
    material?: THREE.Material | THREE.Material[]
  ) {
    const geometry = createPrismGeometry(sides, radius, bottom, top, withBottomBase, withTopBase)
    const mesh = createMeshFromGeometry(geometry, material)
    this.applyPolygonOffset(mesh)
    const edgesDashed = createEdgesFromGeometry(geometry, true)
    const edgesSolid = createEdgesFromGeometry(geometry, false)

    mesh.renderOrder = 0
    edgesDashed.renderOrder = 1
    edgesSolid.renderOrder = 2

    this.scene.add(mesh)
    this.scene.add(edgesDashed)
    this.scene.add(edgesSolid)
  }

  addWireframePyramid (
    sides: number,
    radius: number,
    bottom: number,
    top: number,
    withBase = false,
    material?: THREE.Material | THREE.Material[]
  ) {
    const geometry = createPyramidGeometry(sides, radius, bottom, top, withBase)
    // Le mesh doit être créé avec dashed = false et le material
    const mesh = createMeshFromGeometry(geometry, material)
    this.applyPolygonOffset(mesh)
    const edgesDashed = createEdgesFromGeometry(geometry, true)
    const edgesSolid = createEdgesFromGeometry(geometry, false)

    mesh.renderOrder = 0
    edgesDashed.renderOrder = 1
    edgesSolid.renderOrder = 2

    this.scene.add(mesh)
    this.scene.add(edgesDashed)
    this.scene.add(edgesSolid)
  }

  addWireframeTruncatedPyramid (
    sides: number,
    bottomRadius: number,
    topRadius: number,
    bottom: number,
    top: number,
    withBottomBase = false,
    withTopBase = false,
    material?: THREE.Material | THREE.Material[]
  ): void {
    const geometry = createTruncatedPyramidGeometry(sides, bottomRadius, topRadius, bottom, top, withBottomBase, withTopBase)
    const mesh = createMeshFromGeometry(geometry, material)
    this.applyPolygonOffset(mesh)
    const edgesDashed = createEdgesFromGeometry(geometry, true)
    const edgesSolid = createEdgesFromGeometry(geometry, false)

    mesh.renderOrder = 0
    edgesDashed.renderOrder = 1
    edgesSolid.renderOrder = 2

    this.scene.add(mesh)
    this.scene.add(edgesDashed)
    this.scene.add(edgesSolid)
  }

  /**
   * Ajoute à la scène un solide wireframe composé de plusieurs géométries fusionnées,
   * en supprimant les doublons de sommets et d'arêtes.
   */
  addWireframeUnion (
    geometries: THREE.BufferGeometry[],
    material?: THREE.Material | THREE.Material[]
  ) {
    // Fusionne les géométries (suppression des sommets dupliqués)
    const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries, true)
    // Génère le mesh et les arêtes à partir de la géométrie fusionnée
    const mesh = createMeshFromGeometry(mergedGeometry, material)
    this.applyPolygonOffset(mesh)
    const edgesDashed = createEdgesFromGeometry(mergedGeometry, true)
    const edgesSolid = createEdgesFromGeometry(mergedGeometry, false)

    mesh.renderOrder = 0
    edgesDashed.renderOrder = 1
    edgesSolid.renderOrder = 2

    this.scene.add(mesh)
    this.scene.add(edgesDashed)
    this.scene.add(edgesSolid)
  }

  /**
   * Ajoute un repère 3D (axes X, Y, Z) à la scène.
   * @param options Options de personnalisation du repère
   */
  addRepere3d (options: {
    longueur?: number, // Longueur de chaque axe (par défaut 2)
    couleurs?: { x?: string, y?: string, z?: string }, // Couleurs des axes
    graduations?: boolean, // Afficher les graduations
    graduationStep?: number, // Pas entre graduations
    graduationLength?: number, // Longueur des graduations
    graduationColor?: string, // Couleur des graduations
    fleche?: 'cone' | 'arrow' | 'none', // Forme de la flèche
    flecheTaille?: number, // Taille de la flèche
    flecheLargeur?: number, // Largeur de la flèche
    symetrie?: 'positive' | 'centered', // Axe [0, L] ou [-L, L]
  } = {}) {
    const {
      longueur = 2,
      couleurs = { x: '#ff0000', y: '#00ff00', z: '#0000ff' },
      graduations = false,
      graduationStep = 0.2,
      graduationLength = 0.08,
      graduationColor = '#888',
      fleche = 'cone',
      flecheTaille = 0.12,
      flecheLargeur = 0.05,
      symetrie = 'centered'
    } = options

    const axes = [
      { dir: new THREE.Vector3(1, 0, 0), color: couleurs.x || '#ff0000', name: 'X' },
      { dir: new THREE.Vector3(0, 1, 0), color: couleurs.y || '#00ff00', name: 'Y' },
      { dir: new THREE.Vector3(0, 0, 1), color: couleurs.z || '#0000ff', name: 'Z' }
    ]

    const group = new THREE.Group()
    const min = symetrie === 'centered' ? -longueur : 0
    const max = longueur

    for (const axis of axes) {
      // Axe principal
      const start = axis.dir.clone().multiplyScalar(min)
      const end = axis.dir.clone().multiplyScalar(max)
      const geometry = new THREE.BufferGeometry().setFromPoints([start, end])
      const material = new THREE.LineBasicMaterial({ color: axis.color })
      const line = new THREE.Line(geometry, material)
      group.add(line)

      // Flèche à l'extrémité positive
      if (fleche !== 'none') {
        const arrowPos = axis.dir.clone().multiplyScalar(max)
        if (fleche === 'cone') {
          const coneGeom = new THREE.ConeGeometry(flecheLargeur, flecheTaille, 16)
          const coneMat = new THREE.MeshBasicMaterial({ color: axis.color })
          const cone = new THREE.Mesh(coneGeom, coneMat)
          cone.position.copy(arrowPos)
          // Orienter la flèche
          if (axis.name === 'X') cone.rotation.z = -Math.PI / 2
          if (axis.name === 'Z') cone.rotation.x = Math.PI / 2
          group.add(cone)
        } else if (fleche === 'arrow') {
          const arrowHelper = new THREE.ArrowHelper(axis.dir, axis.dir.clone().multiplyScalar(max - flecheTaille), flecheTaille, axis.color, flecheTaille, flecheLargeur)
          group.add(arrowHelper)
        }
      }

      // Graduations
      if (graduations) {
        for (let t = min + graduationStep; t < max; t += graduationStep) {
          // Ne pas dessiner la graduation à l'origine ni à l'extrémité
          if (Math.abs(t) < 1e-6 || Math.abs(t - max) < 1e-6) continue
          const gradPos = axis.dir.clone().multiplyScalar(t)
          let gradDir1, gradDir2
          if (axis.name === 'X') {
            gradDir1 = new THREE.Vector3(0, graduationLength / 2, 0)
            gradDir2 = new THREE.Vector3(0, -graduationLength / 2, 0)
          } else if (axis.name === 'Y') {
            gradDir1 = new THREE.Vector3(graduationLength / 2, 0, 0)
            gradDir2 = new THREE.Vector3(-graduationLength / 2, 0, 0)
          } else {
            gradDir1 = new THREE.Vector3(graduationLength / 2, 0, 0)
            gradDir2 = new THREE.Vector3(-graduationLength / 2, 0, 0)
          }
          const gradGeom = new THREE.BufferGeometry().setFromPoints([
            gradPos.clone().add(gradDir1),
            gradPos.clone().add(gradDir2)
          ])
          const gradMat = new THREE.LineBasicMaterial({ color: graduationColor })
          const gradLine = new THREE.Line(gradGeom, gradMat)
          group.add(gradLine)
        }
      }
    }

    this.scene.add(group)
    return group
  }

  addEarth ({
    position = [0, 0, 0],
    radius = 1,
    diffuseMap = 'images/earth_day_4096.jpg',
    normalMap = 'images/earth_normal_2048.jpg',
    bumpMap = '',
    specularMap = '',
    emissiveMap = '',
    normalScale = 0.5,
    bumpScale = 0.1,
    greenwichAlignment = -90,
    segmentsWidth = 64,
    segmentsHeight = 32,
  }: {
    position?: [number, number, number],
    radius?: number,
    diffuseMap?: string,
    normalMap?: string,
    bumpMap?: string,
    specularMap?: string,
    emissiveMap?: string,
    normalScale?: number,
    bumpScale?: number,
    greenwichAlignment?: number,
    segmentsWidth?: number,
    segmentsHeight?: number,
  } = {}) {
    const loader = new THREE.TextureLoader()
    const materialParams: THREE.MeshStandardMaterialParameters = {
      map: loader.load(diffuseMap),
      color: 0xffffff,
      // metalness: 0.4, // optionnel
      // roughness: 0.7, // optionnel
    }
    if (normalMap) materialParams.normalMap = loader.load(normalMap)
    if (bumpMap) {
      materialParams.bumpMap = loader.load(bumpMap)
      materialParams.bumpScale = bumpScale
    }
    if (emissiveMap) materialParams.emissiveMap = loader.load(emissiveMap)
    if (normalMap) materialParams.normalScale = new THREE.Vector2(normalScale, normalScale)

    const geometry = new THREE.SphereGeometry(radius, segmentsWidth, segmentsHeight)
    const material = new THREE.MeshStandardMaterial(materialParams)
    const earth = new THREE.Mesh(geometry, material)
    earth.position.set(...position)
    earth.rotation.y = THREE.MathUtils.degToRad(greenwichAlignment)
    earth.name = 'earth-sphere'
    this.scene.add(earth)
    return earth
  }

  /**
   * Ajoute une grille de placement à la scène.
   * @param options Options de personnalisation de la grille
   */
  addGrid (options: {
    size?: number,         // Taille totale de la grille (par défaut 10)
    divisions?: number,    // Nombre de divisions (par défaut 10)
    colorCenterLine?: string | number, // Couleur de la ligne centrale (par défaut '#444')
    colorGrid?: string | number,       // Couleur des lignes de la grille (par défaut '#bbb')
    y?: number             // Hauteur de la grille (par défaut 0)
  } = {}) {
    const {
      size = 10,
      divisions = 10,
      colorCenterLine = '#444',
      colorGrid = '#bbb',
      y = 0
    } = options

    // Supprime une ancienne grille si besoin
    const oldGrid = this.scene.getObjectByName('scene-grid')
    if (oldGrid) this.scene.remove(oldGrid)

    const grid = new THREE.GridHelper(size, divisions, colorCenterLine, colorGrid)
    grid.name = 'scene-grid'
    grid.position.y = y
    this.scene.add(grid)
    return grid
  }
  /**
   * Active le glisser-déposer magnétique des objets Mesh.
   * Les objets doivent être passés en paramètre.
   * @param objects Liste des objets Mesh à rendre déplaçables
   */

  enableMagneticDragging (objects: THREE.Object3D[]) {
    let dragNormal: THREE.Vector3 | null = null
    const offset = new THREE.Vector3()
    const plane = new THREE.Plane()
    const intersection = new THREE.Vector3()
    let isDragging = false

    const getBestPlaneNormal = (camera: THREE.Camera): THREE.Vector3 => {
      const normals = [
        new THREE.Vector3(0, 1, 0), // XZ
        new THREE.Vector3(0, 0, 1), // XY
        new THREE.Vector3(1, 0, 0)  // YZ
      ]
      const camDir = new THREE.Vector3()
      camera.getWorldDirection(camDir).normalize()
      let bestNormal = normals[0]
      let maxDot = Math.abs(camDir.dot(normals[0]))
      for (let i = 1; i < normals.length; i++) {
        const dot = Math.abs(camDir.dot(normals[i]))
        if (dot > maxDot) {
          maxDot = dot
          bestNormal = normals[i]
        }
      }
      return bestNormal
    }

    const updatePointer = (event: PointerEvent | TouchEvent) => {
      const rect = this.renderer.domElement.getBoundingClientRect()
      let x: number, y: number
      if ('clientX' in event) {
        x = event.clientX - rect.left
        y = event.clientY - rect.top
      } else if ('touches' in event && event.touches.length > 0) {
        x = event.touches[0].clientX - rect.left
        y = event.touches[0].clientY - rect.top
      } else {
        x = 0
        y = 0
      }
      this.pointer.x = (x / rect.width) * 2 - 1
      this.pointer.y = -(y / rect.height) * 2 + 1
    }

    const onPointerDown = (event: PointerEvent) => {
      updatePointer(event)
      this.raycaster.setFromCamera(this.pointer, this.camera)
      const intersects = this.raycaster.intersectObjects(objects, true)
      if (intersects.length > 0) {
        let selected = intersects[0].object
        // Remonte jusqu'à trouver un objet du tableau passé (peu importe le type)
        while (selected.parent && !objects.includes(selected)) {
          selected = selected.parent
        }
        // Sélectionne l'objet du tableau (groupe ou mesh)
        if (objects.includes(selected)) {
          this.selectedObject = selected
        } else {
          this.selectedObject = null
        }
        dragNormal = getBestPlaneNormal(this.camera)
        if (this.selectedObject) {
          plane.setFromNormalAndCoplanarPoint(dragNormal, this.selectedObject.position)
          this.raycaster.ray.intersectPlane(plane, intersection)
          offset.copy(intersection).sub(this.selectedObject.position as THREE.Vector3)
          isDragging = true
          this._enableCameraListeners(false)
        }
      } else {
        this._enableCameraListeners(true)
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!this.selectedObject || !dragNormal || !isDragging) {
        // Si pas d'objet sélectionné ou pas de drag en cours, ignore le mouvement
        return
      }
      updatePointer(event)
      this.raycaster.setFromCamera(this.pointer, this.camera)
      plane.setFromNormalAndCoplanarPoint(dragNormal, this.selectedObject.position)
      this.raycaster.ray.intersectPlane(plane, intersection)
      const pos = intersection.clone().sub(offset)

      // Magnétisme sur le centre des cases
      if (dragNormal.equals(new THREE.Vector3(0, 1, 0))) { // XZ
        this.selectedObject.position.set(
          Math.round(pos.x) + 0.5,
          0.5,
          Math.round(pos.z) + 0.5
        )
      } else if (dragNormal.equals(new THREE.Vector3(0, 0, 1))) { // XY
        this.selectedObject.position.set(
          Math.round(pos.x) + 0.5,
          Math.round(pos.y) + 0.5,
          this.selectedObject.position.z
        )
      } else if (dragNormal.equals(new THREE.Vector3(1, 0, 0))) { // YZ
        this.selectedObject.position.set(
          this.selectedObject.position.x,
          Math.round(pos.y) + 0.5,
          Math.round(pos.z) + 0.5
        )
      }
    }

    const onPointerUp = () => {
      this.selectedObject = null
      dragNormal = null
      isDragging = false
      this._enableCameraListeners(true) // Réactive la rotation caméra
    }

    this.renderer.domElement.addEventListener('pointerdown', onPointerDown, { capture: true })
    this.renderer.domElement.addEventListener('pointermove', onPointerMove, { capture: true })
    this.renderer.domElement.addEventListener('pointerup', onPointerUp, { capture: true })
    this.renderer.domElement.addEventListener('pointercancel', onPointerUp, { capture: true })
    this.renderer.domElement.addEventListener('touchend', onPointerUp, { capture: true })
  }

  animate () {
    // Appliquer la rotation du rig
    this.rig.rotation.y = THREE.MathUtils.degToRad(this.rigRotationY)
    this.rig.rotation.x = THREE.MathUtils.degToRad(this.rigRotationX)
    // Mettre à jour la distance caméra
    this.camera.position.set(1, 0.5, this.cameraDistance)
    this.camera.lookAt(this.rig.position)
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(() => this.animate())
  }

  showSceneAt (parentElement: HTMLElement) {
    this.container = parentElement
  }

  setRigPosition (x: number, y: number, z: number) {
    this.rig.position.set(x, y, z)
  }

  addFullscreenButton ({
    text = 'Plein écran',
    style = {}
  }: {
    text?: string,
    style?: Partial<CSSStyleDeclaration>
  } = {}) {
    // Vérifie si le bouton existe déjà
    if (this._container.querySelector('.scenejs-fullscreen-btn')) return

    const btn = document.createElement('button')
    btn.innerText = text
    btn.type = 'button'
    btn.className = 'scenejs-fullscreen-btn'
    btn.style.position = 'absolute'
    btn.style.bottom = '5px'
    btn.style.left = '20px'
    btn.style.zIndex = '20'
    btn.style.padding = '2px 6px'
    btn.style.fontSize = '1rem'
    btn.style.borderRadius = '6px'
    btn.style.border = '1px solid #888'
    btn.style.background = '#fff'
    btn.style.cursor = 'pointer'
    btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'
    Object.assign(btn.style, style)

    btn.onclick = () => {
      const elem = this._container
      if (!document.fullscreenElement) {
        elem.requestFullscreen?.()
      } else {
        document.exitFullscreen?.()
      }
    }

    // Positionne le bouton dans le conteneur parent (qui doit être en position: relative)
    this._container.style.position = 'relative'
    this._container.appendChild(btn)

    const updateButtonIcon = () => {
      const isFullScreen = document.fullscreenElement === this._container
      btn.innerHTML = isFullScreen
        ? '<i class="bx bx-exit-fullscreen text-2xl text-gray-700 hover:text-blue-500 transition-colors"></i>'
        : '<i class="bx bx-fullscreen text-2xl text-gray-700 hover:text-blue-500 transition-colors"></i>'
    }

    // Met à jour l'icône au chargement
    updateButtonIcon()

    // Met à jour l'icône lors du changement d'état plein écran
    this._container.addEventListener('fullscreenchange', updateButtonIcon)
  }

  private _onFullscreenChange = () => {
    if (document.fullscreenElement === this._container) {
      this._resizeRendererToContainer()
    } else {
      this._resizeRendererToInitial()
    }
  }

  private _resizeRendererToContainer () {
    const width = this._container.clientWidth
    const height = this._container.clientHeight
    this.renderer.setSize(width, height)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
  }

  private _resizeRendererToInitial () {
    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
  }

  addCustomElement ({
    object3D,
    position = [0, 0, 0]
  }: {
    object3D: THREE.Object3D,
    position?: [number, number, number]
  }) {
    object3D.position.set(...position)
    this.scene.add(object3D)
    return object3D
  }
}
