import './solidesAFrame'

const defaultRigPosition: [number, number, number] = [0, 0, 0]
const defaultCameraDistance = 8
const defaultWidth = 600
const defaultHeight = 400
const defaultFov = 60
const defaultZoomLimits = { min: 2, max: 20 }

function ensureSceneViewerStyle ({ width, height, fullScreenButton }: { width?: number, height?: number, fullScreenButton?: boolean } = {}): void {
  if (!document.getElementById('scene-viewer-style')) {
    const style = document.createElement('style')
    style.id = 'scene-viewer-style'
    style.textContent = `
    ${fullScreenButton
? ''
    : '[data-scene-viewer] a-enter-vr-button, [data-scene-viewer] .a-enter-vr-button { display: none !important; }'
    }
  [data-scene-viewer] {
    cursor: grab;
    user-select: none;
    position: relative;
    width: ${width || defaultWidth}px;
    height: ${height || defaultHeight}px;
  }
  [data-scene-viewer] a-scene, [data-scene-viewer] canvas {
    width: 100% !important;
    height: 100% !important;
    min-height: ${height || defaultHeight}px !important;
  }
  [data-scene-viewer]:active {
    cursor: grabbing;
  }
`
    document.head.appendChild(style)
  }
}
/**
 * Classe pour visualiser une scène 3D avec AFRAME
 * @author Jean-Claude LHOTE
 */
export class SceneViewer {
  private sceneElements: string[] = []
  private camera: string | null = null
  private width: number
  private height: number
  public id: string
  private zoomLimits
  private rigPosition: [number, number, number]
  private cameraDistance: number
  private rigRotationX: number = 0
  private rigRotationY: number = 0
  private fov: number = 60
  private withEarth: boolean = false
  private withSky: boolean = false
  private backgroundColor: string | null = null

  // Ajoute ces propriétés d'instance :
  private currentDistance = 8 // valeur par défaut, ou initialisée dans le constructeur
  private containerElement: HTMLElement | null = null
  private detectCollision = false
  public fullScreenButton: boolean = false

  constructor (options: {
    width?: number,
    height?: number,
    id?: string,
    zoomLimits?: { min: number, max: number },
    rigPosition?: [number, number, number],
    cameraDistance?: number,
    fov?: number,
    rigRotationX?: number,
    rigRotationY?: number,
    withEarth?: boolean,
    withSky?: boolean,
    detectCollision?: boolean,
    backgroundColor?: string | null
    fullScreenButton?: boolean
  } = {}) {
    this.detectCollision = options.detectCollision ?? false
    this.width = options?.width || defaultWidth
    this.height = options?.height || defaultHeight
    this.id = `scene-${options?.id || Math.random().toString(36).substring(2, 9)}`
    this.zoomLimits = options?.zoomLimits || defaultZoomLimits
    this.rigPosition = options?.rigPosition || defaultRigPosition
    this.cameraDistance = options?.cameraDistance || defaultCameraDistance
    this.rigRotationX = options?.rigRotationX || 0
    this.rigRotationY = options?.rigRotationY || 0
    this.fov = options?.fov || defaultFov
    this.withEarth = options?.withEarth ?? false
    this.withSky = options?.withSky ?? false
    this.backgroundColor = options?.backgroundColor ?? null
    this.fullScreenButton = options?.fullScreenButton ?? false
    this.currentDistance = Math.sqrt(
      this.rigPosition[0] ** 2 +
       this.rigPosition[1] ** 2 +
      (this.cameraDistance - this.rigPosition[2]) ** 2
    )
    ensureSceneViewerStyle({ width: this.width, height: this.height, fullScreenButton: this.fullScreenButton })

    // Création du container DOM caché    <div id="${this.id}" style="width: ${this.width}px; height: ${this.height}px;" class="scene-container" data-scene-viewer>
    this.containerElement = document.createElement('div')
    this.containerElement.id = this.id
    this.containerElement.className = 'scene-container'
    this.containerElement.setAttribute('data-scene-viewer', '')
    this.containerElement.style.position = 'relative'
    this.containerElement.style.width = `${this.width}px`
    this.containerElement.style.height = `${this.height}px`
    this.containerElement.style.display = 'none'
    this.containerElement.innerHTML = ''
    document.body.appendChild(this.containerElement)
  }

  public initializeScene (): void {
    const container = this.containerElement
    if (!container) return
    const aScene = container.querySelector('a-scene')
    if (aScene) {
      this.setupCameraRigControls(container as HTMLElement, aScene)
    }
  }

  // MÉTHODE PRINCIPALE : Générer le HTML avec camera rig
  public generateHTML (): string {
    const sceneContent = this.sceneElements.join('\n')

    return `
     <a-scene embedded
           style="width: 100%; height: 100%;"
           vr-mode-ui="enabled: false"
           device-orientation-permission-ui="enabled: false">

      <!-- ASSETS : Préchargement des textures et polices -->
      <a-assets>
        <a-mixin id="text-style" 
             text="font: roboto; align: center; baseline: center; width: 8"
             material="transparent: true"></a-mixin>
      ${this.withEarth
? `
        <!-- Textures de mappemonde -->
        <img id="earthTexture" src="images/earth_day_4096.jpg">
        <img id="earthNormalMap" src="images/earth_normal_2048.jpg"> `
: ''}
        ${this.withSky
? `
        <!-- SKY TEXTURE -->
        <img id="sky" src="images/2k_stars_milky_way.jpg">
        
        `
: ''}
      </a-assets>

     

        ${this.withSky
? `    <!-- SKY ELEMENT -->
      <a-sky src="#sky"></a-sky>`
: this.backgroundColor ? `<a-sky color="${this.backgroundColor}"></a-sky>` : ''}

   <a-entity id="cameraRig-${this.id}" position="${this.rigPosition.join(' ')}" rotation="${this.rigRotationX} ${this.rigRotationY} 0">
        <a-camera 
              position="0 0 ${this.cameraDistance}" 
              fov="${this.fov}"
              look-controls="enabled: false"
              wasd-controls="enabled: false">
        </a-entity>
        </a-entity>

      ${sceneContent}
      </a-scene>
    `
  }

  public setRigPosition (pos: [number, number, number]) {
    this.rigPosition = [...pos]
    const aScene = this.containerElement?.querySelector('a-scene')
    // Met à jour la position du rig dans la scène si elle existe déjà
    const cameraRig = aScene?.querySelector(`#cameraRig-${this.id}`) as any
    const camera = aScene?.querySelector('a-camera') as any
    if (cameraRig && camera) {
      this.updateCameraRig(cameraRig, camera)
    }
  }

  private updateCameraRig (cameraRig: any, camera: any): void {
    cameraRig.setAttribute('position', this.rigPosition.join(' '))
    cameraRig.setAttribute('rotation', `${this.rigRotationX} ${this.rigRotationY} 0`)
    camera.setAttribute('position', `0 0 ${this.currentDistance}`)
    if (camera.object3D && camera.object3D.position) {
      camera.object3D.position.set(0, 0, this.currentDistance)
    } else {
      console.warn('Camera object3D not found or position not settable')
    }
  }

  // CONTRÔLES DU CAMERA RIG
  private setupCameraRigControls (
    container: HTMLElement,
    aScene: Element
  ): void {
    const cameraRig = aScene.querySelector(`#cameraRig-${this.id}`) as any
    const camera = aScene.querySelector('a-camera') as any

    if (!cameraRig || !camera) {
      console.warn('Camera rig or camera not found')
      return
    }

    // Variables de contrôle
    let isDragging = false
    let previousMousePosition = { x: 0, y: 0 }
    let isMouseOverContainer = false
    let isFullscreen = false

    // Variables tactiles
    let lastTouchDistance = 0
    let touchStartedInContainer = false

    const initialX = 0
    const initialY = 0
    const initialZ = this.cameraDistance

    const initialDistance = Math.sqrt(
      (initialX - this.rigPosition[0]) ** 2 +
      (initialY - this.rigPosition[1]) ** 2 +
      (initialZ - this.rigPosition[2]) ** 2
    )

    // Remplace les variables locales par les propriétés d'instance :
    this.currentDistance = initialDistance

    // NOUVEAU : Détecter le plein écran
    const checkFullscreen = (): boolean => {
      return !!(document.fullscreenElement ||
                (document as any).webkitFullscreenElement ||
                (document as any).mozFullScreenElement ||
                (document as any).msFullscreenElement)
    }

    // NOUVEAU : Vérifier si la souris est dans le container
    const isMouseInContainer = (e: MouseEvent): boolean => {
      if (isFullscreen) return true // En plein écran, toujours intercepter

      const rect = container.getBoundingClientRect()
      return e.clientX >= rect.left &&
             e.clientX <= rect.right &&
             e.clientY >= rect.top &&
             e.clientY <= rect.bottom
    }

    // NOUVEAU : Vérifier si les touches sont dans le container
    const areTouchesInContainer = (touches: TouchList): boolean => {
      if (isFullscreen) return true // En plein écran, toujours intercepter

      const rect = container.getBoundingClientRect()
      const touchesInContainer = Array.from(touches).every(touch =>
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
      )
      return touchesInContainer
    }

    // === GESTION DU PLEIN ÉCRAN ===
    const handleFullscreenChange = () => {
      isFullscreen = checkFullscreen()
    }

    // Écouter les changements de plein écran
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    // === GESTION DE LA SOURIS ===

    // Détecter l'entrée/sortie du container
    container.addEventListener('mouseenter', () => {
      isMouseOverContainer = true
      container.style.cursor = 'grab'
    })

    container.addEventListener('mouseleave', () => {
      isMouseOverContainer = false
      if (isDragging && !isFullscreen) {
        // Arrêter le drag si on sort du container (sauf en plein écran)
        isDragging = false
        container.style.cursor = 'grab'
      }
    })

    // MouseDown - Seulement si dans le container ou en plein écran
    const handleMouseDown = (e: MouseEvent) => {
      if (!isMouseInContainer(e)) return

      isDragging = true
      previousMousePosition = { x: e.clientX, y: e.clientY }
      container.style.cursor = 'grabbing'
      e.preventDefault()
    }

    // MouseMove - Gérer le drag avec vérifications
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      // En mode plein écran, toujours autoriser
      // Sinon, vérifier que la souris est dans le container
      if (!isFullscreen && !isMouseInContainer(e)) {
        isDragging = false
        container.style.cursor = 'grab'
        return
      }

      const deltaX = previousMousePosition.x - e.clientX
      const deltaY = previousMousePosition.y - e.clientY
      const sensitivity = 0.5

      // Remplace les variables locales par les propriétés d'instance :
      this.rigRotationY += deltaX * sensitivity
      this.rigRotationX += deltaY * sensitivity
      this.rigRotationX = Math.max(-80, Math.min(80, this.rigRotationX))

      this.updateCameraRig(cameraRig, camera)
      previousMousePosition = { x: e.clientX, y: e.clientY }
      e.preventDefault()
    }

    // MouseUp - Arrêter le drag
    const handleMouseUp = () => {
      if (isDragging) {
        isDragging = false
        container.style.cursor = isMouseOverContainer ? 'grab' : 'default'
      }
    }

    // Wheel - SIMPLIFIÉ car déjà sur le container
    const handleWheel: (e: WheelEvent) => void = (e: WheelEvent) => {
      const min = this.zoomLimits.min ?? 2
      const max = this.zoomLimits.max ?? 20
      // Plus besoin de vérifier isMouseInContainer car l'événement vient du container
      e.preventDefault()
      e.stopPropagation()

      const zoomSpeed = 0.01
      // Remplace les variables locales par les propriétés d'instance :
      this.currentDistance += e.deltaY * zoomSpeed
      this.currentDistance = Math.max(min, Math.min(max, this.currentDistance))
      this.updateCameraRig(cameraRig, camera)
    }

    // === GESTION TACTILE CORRIGÉE ===

    // TouchStart - utiliser areTouchesInContainer pour décider si on capture
    const handleTouchStart = (e: TouchEvent) => {
      // En plein écran, toujours intercepter
      if (isFullscreen) {
        touchStartedInContainer = true
      } else {
        touchStartedInContainer = areTouchesInContainer(e.touches)
      }

      if (!touchStartedInContainer) {
        // Ne pas capturer, laisser le scroll natif
        return
      }

      if (e.touches.length === 1) {
        isDragging = true
        const touch = e.touches[0]
        previousMousePosition = { x: touch.clientX, y: touch.clientY }
      } else if (e.touches.length === 2) {
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        lastTouchDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        )
      }

      e.preventDefault()
    }

    // TouchMove - ne traiter que si le geste a commencé dans le container
    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartedInContainer) return

      if (e.touches.length === 1 && isDragging) {
        const touch = e.touches[0]
        const deltaX = previousMousePosition.x - touch.clientX
        const deltaY = previousMousePosition.y - touch.clientY
        const sensitivity = 0.5

        // Remplace les variables locales par les propriétés d'instance :
        this.rigRotationY += deltaX * sensitivity
        this.rigRotationX -= deltaY * sensitivity
        this.rigRotationX = Math.max(-80, Math.min(80, this.rigRotationX))

        this.updateCameraRig(cameraRig, camera)
        previousMousePosition = { x: touch.clientX, y: touch.clientY }
      } else if (e.touches.length === 2) {
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const currentTouchDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        )

        if (lastTouchDistance > 0) {
          const zoomSpeed = 0.01
          const deltaDistance = currentTouchDistance - lastTouchDistance
          // Remplace les variables locales par les propriétés d'instance :
          this.currentDistance -= deltaDistance * zoomSpeed
          this.currentDistance = Math.max(2, Math.min(20, this.currentDistance))
          this.updateCameraRig(cameraRig, camera)
        }

        lastTouchDistance = currentTouchDistance
      }

      e.preventDefault()
    }

    // TouchEnd - idem
    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartedInContainer) return

      if (e.touches.length === 0) {
        isDragging = false
        lastTouchDistance = 0
        touchStartedInContainer = false
      }
      e.preventDefault()
    }

    // === ATTACHER LES ÉVÉNEMENTS ===

    // Événements souris - sur container et document
    container.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    // Attacher les événements tactiles sur le container
    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: false })

    // Fonction pour attacher le handler wheel au canvas de la scène
    function attachWheelToCanvas () {
      const canvas = aScene.querySelector('canvas')
      if (canvas) {
        canvas.addEventListener('wheel', handleWheel, { passive: false })
        ;(container as any).__sceneCleanup = () => {
          canvas.removeEventListener('wheel', handleWheel)
        }
      } else {
        // Utilise un MutationObserver pour attendre le
        setTimeout(attachWheelToCanvas, 100)
      }
    }

    // Appel initial
    attachWheelToCanvas()

    // === NETTOYAGE ===
    const cleanup = () => {
      container.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      container.removeEventListener('wheel', handleWheel)           // CHANGÉ : container
      container.removeEventListener('touchstart', handleTouchStart) // CHANGÉ : container
      container.removeEventListener('touchmove', handleTouchMove)   // CHANGÉ : container
      container.removeEventListener('touchend', handleTouchEnd)     // CHANGÉ : container
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }

    // Optionnel : Exposer la fonction de nettoyage
    ;(container as any).__sceneCleanup = cleanup
  }

  public addBox ({
    position = [0, 0.5, 0],
    color = '#4CC3D9',
    width = 1,
    height = 1,
    depth = 1,
    wireframe = false,
  }: {
    position?: [number, number, number] | string;
    color?: string;
    width?: number;
    height?: number;
    depth?: number;
    wireframe?: boolean | 'edges';
  } = {}): void {
    const posStr = Array.isArray(position) ? position.join(' ') : position
    const materialAttr = wireframe
      ? `material="color: ${color}; wireframe: true"`
      : `color="${color}"`

    this.sceneElements.push(`
      <a-box position="${posStr}" ${materialAttr} width="${width}" height="${height}" depth="${depth}"></a-box>
    `)
  }

  public addPlane ({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    width = 10,
    height = 10,
    color = '#7BC8A4',
  } = {}): void {
    const posStr = Array.isArray(position) ? position.join(' ') : position
    const rotStr = Array.isArray(rotation) ? rotation.join(' ') : rotation
    this.sceneElements.push(`
      <a-plane position="${posStr}" rotation="${rotStr}" width="${width}" height="${height}" color="${color}"></a-plane>
    `)
  }

  // SPHÈRE
  public addSphere ({
    position = [0, 0, 0],
    rotation = [0, 0, 0], // NOUVEAU
    radius = 1,
    color = '#EF2D5E',
    segmentsWidth = 18,
    segmentsHeight = 36,
    wireframe = false,
    texture = '',
    textureRepeat = [1, 1],
    opacity = 1,
  }: {
    position?: [number, number, number] | string;
    rotation?: [number, number, number] | string; // NOUVEAU
    color?: string;
    radius?: number;
    segmentsWidth?: number;
    segmentsHeight?: number;
    wireframe?: boolean | 'edges';
    texture?: string;
    textureRepeat?: [number, number];
    opacity?: number;
  } = {}): void {
    const posStr = Array.isArray(position) ? position.join(' ') : position
    const rotStr = Array.isArray(rotation) ? rotation.join(' ') : rotation // NOUVEAU

    let materialAttr = ''
    if (texture) {
      materialAttr = `material="src: ${texture}; 
                              color: ${color}; 
                              transparent: ${opacity < 1}; 
                              opacity: ${opacity};
                              repeat: ${textureRepeat[0]} ${textureRepeat[1]}"`
    } else if (wireframe) {
      materialAttr = `material="color: ${color}; wireframe: true"`
    } else {
      materialAttr = `color="${color}"`
    }

    this.sceneElements.push(`
      <a-sphere position="${posStr}" 
                rotation="${rotStr}"          
                ${materialAttr}
                radius="${radius}" 
                segments-width="${segmentsWidth}"
                segments-height="${segmentsHeight}"></a-sphere>
    `)
  }

  // CYLINDRE
  public addCylinder ({
    position = [0, 0, 0],
    radius = 1,
    height = 2,
    color = '#FFC65D',
    segmentsRadial = 36,
    segmentsHeight = 1,
    openEnded = false,
    thetaStart = 0,
    thetaLength = 360,
    wireframe = false,
  }: {
    position?: [number, number, number] | string;
    color?: string;
    radius?: number;
    height?: number;
    segmentsRadial?: number;
    segmentsHeight?: number;
    openEnded?: boolean;
    thetaStart?: number;
    thetaLength?: number;
    wireframe?: boolean | 'edges';
  } = {}): void {
    const posStr = Array.isArray(position) ? position.join(' ') : position
    const materialAttr = wireframe
      ? `material="color: ${color}; wireframe: true"`
      : `color="${color}"`

    this.sceneElements.push(`
      <a-cylinder position="${posStr}" 
                  ${materialAttr}
                  radius="${radius}" 
                  height="${height}" 
                  segments-radial="${segmentsRadial}"
                  segments-height="${segmentsHeight}"
                  open-ended="${openEnded}"
                  theta-start="${thetaStart}"
                  theta-length="${thetaLength}"></a-cylinder>
    `)
  }

  // CÔNE
  public addCone ({
    position = [0, 0, 0],
    radiusBottom = 1,
    radiusTop = 0.1,
    height = 2,
    color = '#7BC8A4',
    segmentsRadial = 36,
    segmentsHeight = 1,
    openEnded = false,
    thetaStart = 0,
    thetaLength = 360,
    wireframe = false,
  }: {
    position?: [number, number, number] | string;
    color?: string;
    radiusBottom?: number;
    radiusTop?: number;
    height?: number;
    segmentsRadial?: number;
    segmentsHeight?: number;
    openEnded?: boolean;
    thetaStart?: number;
    thetaLength?: number;
    wireframe?: boolean | 'edges';
  } = {}): void {
    const posStr = Array.isArray(position) ? position.join(' ') : position
    const materialAttr = wireframe
      ? `material="color: ${color}; wireframe: true"`
      : `color="${color}"`
    this.sceneElements.push(`
      <a-cone position="${posStr}" 
              radius-bottom="${radiusBottom}" 
              ${materialAttr}
              radius-top="${radiusTop}" 
              height="${height}" 
              color="${color}"
              segments-radial="${segmentsRadial}"
              segments-height="${segmentsHeight}"
              open-ended="${openEnded}"
              theta-start="${thetaStart}"
              theta-length="${thetaLength}"></a-cone>
    `)
  }

  // TORE (TORUS)
  public addTorus ({
    position = [0, 0, 0],
    radius = 1,
    radiusTubular = 0.2,
    color = '#43A047',
    segmentsRadial = 36,
    segmentsTubular = 32,
    arc = 360,
    wireframe = false,
  }: {
    position?: [number, number, number] | string;
    color?: string;
    radius?: number;
    radiusTubular?: number;
    segmentsRadial?: number;
    segmentsTubular?: number;
    arc?: number;
    wireframe?: boolean | 'edges';
  } = {}): void {
    const materialAttr = wireframe
      ? `material="color: ${color}; wireframe: true"`
      : `color="${color}"`
    const posStr = Array.isArray(position) ? position.join(' ') : position
    this.sceneElements.push(`
      <a-torus position="${posStr}" 
                ${materialAttr}
               radius="${radius}" 
               radius-tubular="${radiusTubular}" 
               color="${color}"
               segments-radial="${segmentsRadial}"
               segments-tubular="${segmentsTubular}"
               arc="${arc}"></a-torus>
    `)
  }

  // DODÉCAÈDRE
  public addDodecahedron ({
    position = [0, 0, 0],
    radius = 1,
    color = '#FF6D00',
    wireframe = false,
  }: {
    position?: [number, number, number] | string;
    color?: string;
    radius?: number;
    wireframe?: boolean | 'edges';
  } = {}): void {
    const materialAttr = wireframe
      ? `material="color: ${color}; wireframe: true"`
      : `color="${color}"`
    const posStr = Array.isArray(position) ? position.join(' ') : position
    this.sceneElements.push(`
      <a-dodecahedron position="${posStr}" 
                      ${materialAttr}
                      radius="${radius}" 
                      color="${color}"></a-dodecahedron>
    `)
  }

  // ICOSAÈDRE
  public addIcosahedron ({
    position = [0, 0, 0],
    radius = 1,
    color = '#E91E63',
    wireframe = false,
  }: {
    position?: [number, number, number] | string;
    color?: string;
    radius?: number;
    wireframe?: boolean | 'edges';
  } = {}): void {
    const materialAttr = wireframe
      ? `material="color: ${color}; wireframe: true"`
      : `color="${color}"`
    const posStr = Array.isArray(position) ? position.join(' ') : position
    this.sceneElements.push(`
      <a-icosahedron position="${posStr}" 
                      ${materialAttr}
                     radius="${radius}" 
                     color="${color}"></a-icosahedron>
    `)
  }

  // OCTAÈDRE
  public addOctahedron ({
    position = [0, 0, 0],
    radius = 1,
    color = '#9C27B0',
    wireframe = false,
  }: {
    position?: [number, number, number] | string;
    color?: string;
    radius?: number;
    wireframe?: boolean | 'edges';
  } = {}): void {
    const materialAttr = wireframe
      ? `material="color: ${color}; wireframe: true"`
      : `color="${color}"`
    const posStr = Array.isArray(position) ? position.join(' ') : position
    this.sceneElements.push(`
      <a-octahedron position="${posStr}"
                    ${materialAttr}
                    radius="${radius}" 
                    color="${color}"></a-octahedron>
    `)
  }

  // TÉTRAÈDRE
  public addTetrahedron ({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    radius = 1,
    color = '#3F51B5',
    wireframe = false,
  }: {
    position?: [number, number, number] | string;
    rotation?: [number, number, number] | string;
    color?: string;
    radius?: number;
    wireframe?: boolean | 'edges';
  } = {}): void {
    const materialAttr = wireframe
      ? `material="color: ${color}; wireframe: true"`
      : `color="${color}"`
    const posStr = Array.isArray(position) ? position.join(' ') : position
    this.sceneElements.push(`
      <a-tetrahedron position="${posStr}" 
                      rotation="${Array.isArray(rotation) ? rotation.join(' ') : rotation}"
                      ${materialAttr}
                     radius="${radius}" 
                     color="${color}"></a-tetrahedron>
    `)
  }

  // ANNEAU (RING)
  public addRing ({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    radiusInner = 0.5,
    radiusOuter = 1,
    color = '#4CAF50',
    segmentsTheta = 32,
    segmentsPhi = 8,
    thetaStart = 0,
    thetaLength = 360,
    wireframe = false,
  }: {
    position?: [number, number, number] | string;
    color?: string;
    rotation?: [number, number, number] | string;
    radiusInner?: number;
    radiusOuter?: number;
    segmentsTheta?: number;
    segmentsPhi?: number;
    thetaStart?: number;
    thetaLength?: number;

    wireframe?: boolean | 'edges';
  } = {}): void {
    const materialAttr = wireframe
      ? `material="color: ${color}; wireframe: true"`
      : `color="${color}"`
    const posStr = Array.isArray(position) ? position.join(' ') : position
    const rotStr = Array.isArray(rotation) ? rotation.join(' ') : rotation
    this.sceneElements.push(`
      <a-ring position="${posStr}" 
              ${materialAttr}
              rotation="${rotStr}"
              radius-inner="${radiusInner}" 
              radius-outer="${radiusOuter}" 
              color="${color}"
              segments-theta="${segmentsTheta}"
              segments-phi="${segmentsPhi}"
              theta-start="${thetaStart}"
              theta-length="${thetaLength}"></a-ring>
    `)
  }

  // CERCLE
  public addCircle ({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    radius = 1,
    color = '#FF5722',
    segments = 32,
    thetaStart = 0,
    thetaLength = 360,
    wireframe = false,
  }: {
    position?: [number, number, number] | string;
    color?: string;
    rotation?: [number, number, number] | string;
    radius?: number;
    segments?: number;
    thetaStart?: number;
    thetaLength?: number;
    wireframe?: boolean | 'edges';
  } = {}): void {
    const materialAttr = wireframe
      ? `material="color: ${color}; wireframe: true"`
      : `color="${color}"`
    const posStr = Array.isArray(position) ? position.join(' ') : position
    const rotStr = Array.isArray(rotation) ? rotation.join(' ') : rotation
    this.sceneElements.push(`
      <a-circle position="${posStr}" 
                ${materialAttr}
                rotation="${rotStr}"
                radius="${radius}" 
                color="${color}"
                segments="${segments}"
                theta-start="${thetaStart}"
                theta-length="${thetaLength}"></a-circle>
    `)
  }

  // TRIANGLE
  public addTriangle ({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    vertexA = [0, 0.5, 0],
    vertexB = [-0.5, -0.5, 0],
    vertexC = [0.5, -0.5, 0],
    color = '#795548',
    wireframe = false,
  }: {
    position?: [number, number, number] | string;
    color?: string;
    rotation?: [number, number, number] | string;
    vertexA?: [number, number, number] | string;
    vertexB?: [number, number, number] | string;
    vertexC?: [number, number, number] | string;
    wireframe?: boolean | 'edges';
  } = {}): void {
    const materialAttr = wireframe
      ? `material="color: ${color}; wireframe: true"`
      : `color="${color}"`
    const posStr = Array.isArray(position) ? position.join(' ') : position
    const rotStr = Array.isArray(rotation) ? rotation.join(' ') : rotation
    const vertexAStr = Array.isArray(vertexA) ? vertexA.join(' ') : vertexA
    const vertexBStr = Array.isArray(vertexB) ? vertexB.join(' ') : vertexB
    const vertexCStr = Array.isArray(vertexC) ? vertexC.join(' ') : vertexC
    this.sceneElements.push(`
      <a-triangle position="${posStr}" 
                  ${materialAttr}
                  rotation="${rotStr}"
                  vertex-a="${vertexAStr}" 
                  vertex-b="${vertexBStr}" 
                  vertex-c="${vertexCStr}" 
                  color="${color}"></a-triangle>
    `)
  }

  // TEXTE 3D - VERSION AVEC COMPOSANT CUSTOM
  public addText ({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    value = 'Hello World',
    color = '#ffffff',
    font = 'roboto',
    fontSize = 5,
    align = 'center',
    baseline = 'center',
    width = 5,
    wrapCount = 40,
    useCustomComponent = false, // Option pour utiliser le composant custom
  } = {}): void {
    const posStr = Array.isArray(position) ? position.join(' ') : position
    const rotStr = Array.isArray(rotation) ? rotation.join(' ') : rotation

    if (useCustomComponent) {
      // Utiliser le composant geographic-label
      this.sceneElements.push(`
        <a-entity position="${posStr}" 
                  rotation="${rotStr}"
                  geographic-label="text: ${value}; 
                                   color: ${color}; 
                                   size: ${fontSize}; 
                                   width: ${width}; 
                                   align: ${align}; 
                                   baseline: ${baseline}"
                  scale="${fontSize} ${fontSize} 1"></a-entity>
      `)
    } else {
      // Utiliser la méthode standard A-Frame
      this.sceneElements.push(`
        <a-entity position="${posStr}" 
                  rotation="${rotStr}"
                  text="value: ${value}; 
                        color: ${color}; 
                        font: ${font}; 
                        fontSize: ${fontSize}; 
                        align: ${align}; 
                        baseline: ${baseline}; 
                        width: ${width}; 
                        wrapCount: ${wrapCount}"></a-entity>
      `)
    }
  }

  // COURBE (utilise a-curve et a-curve-point)
  public addCurve ({
    id = 'curve',
    points = [
      [0, 0, 0],
      [1, 1, 1],
      [2, 0, 2],
    ],
    type = 'CatmullRom',
  } = {}): void {
    // Points de la courbe
    const curvePoints = points
      .map((point, index) => {
        const pos = Array.isArray(point) ? point.join(' ') : point
        return `<a-curve-point id="curve-point-${index}" position="${pos}"></a-curve-point>`
      })
      .join('\n')

    // IDs des points pour la courbe
    const pointIds = points
      .map((_, index) => `#curve-point-${index}`)
      .join(' ')

    this.sceneElements.push(`
      ${curvePoints}
      <a-curve id="${id}" curve="type: ${type}; points: ${pointIds}"></a-curve>
    `)
  }

  public addAmbientLight ({ color = '#404040', intensity = 0.4 } = {}): void {
    this.sceneElements.push(`
      <a-light type="ambient" color="${color}" intensity="${intensity}"></a-light>
    `)
  }

  public addDirectionnalLight ({
    color = '#ffffff',
    intensity = 1,
    position = [0, 1, 0],
  } = {}): void {
    const posStr = Array.isArray(position) ? position.join(' ') : position
    this.sceneElements.push(`
      <a-light type="directional" color="${color}" intensity="${intensity}" position="${posStr}"></a-light>
    `)
  }

  public addPointLight ({
    color = '#ffffff',
    intensity = 1,
    position = [0, 1, 0],
  } = {}): void {
    const posStr = Array.isArray(position) ? position.join(' ') : position
    this.sceneElements.push(`
      <a-light type="point" color="${color}" intensity="${intensity}" position="${posStr}"></a-light>
    `)
  }

  public addMesh (htmlString: string): void {
    this.sceneElements.push(htmlString)
  }

  // Méthode pour ajouter votre sphère wireframe personnalisée
  public addCustomWireSphere ({
    position = [0, 0, 0],
    radius = 1,
    parallels = 4,
    meridians = 8,
    segments = 32,
    parallelColor = '#cccccc',
    meridianColor = '#cccc00',
    showParallels = true,
    showMeridians = true,
    showEquator = true,
    equatorColor = '#ffff00',
    equatorThickness = 0.02, // NOUVEAU
    showGreenwich = false,
    greenwichColor = '#00ffff',
    greenwichThickness = 0.02, // NOUVEAU
  }: {
    position?: [number, number, number] | string;
    radius?: number;
    parallels?: number; // Nombre de parallèles (hors équateur)
    meridians?: number; // Nombre de méridiens
    segments?: number; // Résolution (lissage des courbes)
    parallelColor?: string; // Couleur des parallèles
    meridianColor?: string; // Couleur des méridiens
    showParallels?: boolean;
    showMeridians?: boolean;
    showEquator?: boolean;
    equatorColor?: string; // Couleur de l'équateur
    equatorThickness?: number;
    showGreenwich?: boolean; // Afficher le méridien de Greenwich
    greenwichColor?: string; // Couleur du méridien de Greenwich
    greenwichThickness?: number;
  } = {}): void {
    const posStr = Array.isArray(position) ? position.join(' ') : position

    this.sceneElements.push(`
      <a-entity position="${posStr}" 
                custom-wire-sphere="
                  radius: ${radius}; 
                  parallels: ${parallels}; 
                  meridians: ${meridians}; 
                  segments: ${segments};
                  parallelColor: ${parallelColor}; 
                  meridianColor: ${meridianColor};
                  showParallels: ${showParallels};
                  showMeridians: ${showMeridians};
                  showEquator: ${showEquator};
                  equatorColor: ${equatorColor};
                  equatorThickness: ${equatorThickness};
                  showGreenwich: ${showGreenwich};
                  greenwichColor: ${greenwichColor};
                  greenwichThickness: ${greenwichThickness}
                "></a-entity>
    `)
  }

  // Méthode pour ajouter un point géographique sur une sphère
  public addGeographicPoint ({
    spherePosition = [0, 0, 0],
    sphereRadius = 1,
    latitude = 0,
    longitude = 0,
    altitude = 0,
    pointRadius = 0.03,
    pointColor = '#ff0000',
    label = '',
    labelColor = '#FFFFFF',
    labelOffset = 0.2,
    labelSize = 0.5,
    font = 'images/Arial Bold-msdf.json',
    transparent = true, // Transparence par défaut pour le label
  }: {
    spherePosition?: [number, number, number] | string;
    sphereRadius?: number;
    latitude?: number;
    longitude?: number;
    altitude?: number;
    pointRadius?: number;
    pointColor?: string;
    label?: string;
    labelColor?: string;
    labelOffset?: number;
    labelSize?: number;
    font?: string;
    transparent?: boolean; // Transparence pour le label
  } = {}): void {
    // Convertir la position de la sphère
    const spherePos = Array.isArray(spherePosition)
      ? spherePosition
      : [0, 0, 0]

    // Convertir latitude/longitude en radians
    const latRad = (latitude * Math.PI) / 180
    const lonRad = (longitude * Math.PI) / 180

    // CALCUL CORRIGÉ - coordonnées sphériques géographiques
    const r = sphereRadius + altitude

    const x = spherePos[0] + r * Math.cos(latRad) * Math.sin(lonRad)
    const y = spherePos[1] + r * Math.sin(latRad)
    const z = spherePos[2] + r * Math.cos(latRad) * Math.cos(lonRad)

    // Ajouter le point (petit cube)
    this.addBox({
      position: [x, y, z],
      width: pointRadius * 2,
      height: pointRadius * 2,
      depth: pointRadius * 2,
      color: pointColor,
    })

    // Ajouter le label si fourni
    if (label) {
      // Position du texte légèrement décalée
      const labelR = r + labelOffset
      const labelX =
        spherePos[0] + labelR * Math.cos(latRad) * Math.sin(lonRad)
      const labelY = spherePos[1] + labelR * Math.sin(latRad)
      const labelZ =
        spherePos[2] + labelR * Math.cos(latRad) * Math.cos(lonRad)

      // MODIFIÉ : Transmettre useCustomDegree
      this.addGeographicLabel({
        position: [labelX, labelY, labelZ],
        text: label,
        color: labelColor,
        size: labelSize,
        font,
        transparent
      })
    }
  }

  // Méthode pour ajouter plusieurs points géographiques d'un coup
  public addGeographicPoints ({
    spherePosition = [0, 0, 0],
    sphereRadius = 1,
    points = [],
    defaultPointRadius = 0.03,
    defaultPointColor = '#ff0000',
    defaultLabelColor = '#ffffff',
    defaultLabelOffset = 0.2,
    defaultLabelSize = 0.5,
    defaultFont = 'sourcecodepro',
    transparent = true        // NOUVEAU : Transparence par défaut
  }: {
    spherePosition?: [number, number, number] | string;
    sphereRadius?: number;
    points?: Array<{
      latitude: number;
      longitude: number;
      altitude?: number;
      pointRadius?: number; // VÉRIFIER : pointRadius
      pointColor?: string;
      label?: string;
      labelColor?: string;
      labelOffset?: number;
      labelSize?: number;
      font?: string;
      transparent?: boolean; // Transparence pour le label
    }>;
    defaultPointRadius?: number;
    defaultPointColor?: string;
    defaultLabelColor?: string;
    defaultLabelOffset?: number;
    defaultLabelSize?: number;
    defaultFont?: string;
    transparent?: boolean;    // NOUVEAU
  } = {}): void {
    points.forEach(point => {
      this.addGeographicPoint({
        spherePosition,
        sphereRadius,
        latitude: point.latitude,
        longitude: point.longitude,
        altitude: point.altitude || 0,
        pointRadius: point.pointRadius || defaultPointRadius,
        pointColor: point.pointColor || defaultPointColor,
        label: point.label || '',
        labelColor: point.labelColor || defaultLabelColor,
        labelOffset: point.labelOffset || defaultLabelOffset,
        labelSize: point.labelSize || defaultLabelSize,
        font: point.font || defaultFont,
        transparent: point.transparent !== undefined ? point.transparent : transparent  // NOUVEAU
      })
    })
  }

  // Méthode générique pour ajouter n'importe quel composant custom
  public addCustomComponent ({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    componentName,
    componentProps = {},
  }: {
    position?: [number, number, number] | string;
    rotation?: [number, number, number] | string;
    componentName: string;
    componentProps?: Record<string, any>;
  }): void {
    const posStr = Array.isArray(position) ? position.join(' ') : position
    const rotStr = Array.isArray(rotation) ? rotation.join(' ') : rotation

    // Convertir les props en string A-Frame
    const propsStr = Object.entries(componentProps)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ')

    this.sceneElements.push(`
      <a-entity position="${posStr}" 
                rotation="${rotStr}"
                ${String(componentName)}="${propsStr}"></a-entity>
    `)
  }

  public setSize (width: number, height: number): void {
    this.width = width
    this.height = height
  }

  // Nouvelle méthode spécifique pour les labels géographiques
  public addGeographicLabel ({
    position = [0, 0, 0],
    text = 'Label',
    color = '#000000',
    size = 0.5,
    width = 8,
    align = 'center',
    baseline = 'center',
    font = 'dejavu',
    orientation = 'billboard',
    customRotation = [0, 0, 0],
    useCustomDegree = true,
    transparent = true,        // NOUVEAU : Option de transparence
  }: {
    position?: [number, number, number] | string;
    text?: string;
    color?: string;
    size?: number;
    width?: number;
    align?: string;
    baseline?: string;
    font?: string;
    orientation?: 'billboard' | 'custom';
    customRotation?: [number, number, number];
    useCustomDegree?: boolean;
    transparent?: boolean;    // NOUVEAU
  } = {}): void {
    const posStr = Array.isArray(position) ? position.join(' ') : position
    const rotStr = Array.isArray(customRotation) ? `${customRotation[0]} ${customRotation[1]} ${customRotation[2]}` : customRotation
    // Détecter si c'est une police MSDF
    // Détecter si c'est une police MSDF

    this.sceneElements.push(`
      <a-text position="${posStr}" 
              ${orientation === 'billboard' ? 'billboard=""' : `rotation="${rotStr}"`}
              value="${text}"
              color="${color}"
              font="${font}"
              align="${align}"
              baseline="${baseline}"
              width="${width}"
              shader="msdf"
              negate="false"
              ${transparent ? 'material="transparent: true; alphaTest: 0.1; side: double"' : ''}
              scale="${size} ${size} 1"></a-text>
    `)
  }

  public addRealisticEarthSphere ({
    position = [0, 0, 0],
    radius = 1,
    diffuseMap = '#earthTexture', // Texture principale
    normalMap = '#earthNormalMap', // Relief
    bumpMap = '', // Alternative à normal map
    specularMap = '', // Réflexion (océans brillants)
    emissiveMap = '', // Lumières des villes (texture night)
    normalScale = 0.5,
    bumpScale = 0.1,
    greenwichAlignment = -90,
    segmentsWidth = 64,
    segmentsHeight = 32,
  }: {
    position?: [number, number, number] | string;
    radius?: number;
    diffuseMap?: string;
    normalMap?: string;
    bumpMap?: string;
    specularMap?: string;
    emissiveMap?: string;
    normalScale?: number;
    bumpScale?: number;
    greenwichAlignment?: number;
    segmentsWidth?: number;
    segmentsHeight?: number;
  } = {}): void {
    const posStr = Array.isArray(position) ? position.join(' ') : position

    let materialProps = `src: ${diffuseMap}; 
                         shader: standard;
                         color: white`

    if (normalMap) {
      materialProps += `; normalMap: ${normalMap}; normalScale: ${normalScale} ${normalScale}`
    }

    if (bumpMap) {
      materialProps += `; bumpMap: ${bumpMap}; bumpScale: ${bumpScale}`
    }

    if (specularMap) {
      materialProps += `; specularMap: ${specularMap}`
    }

    if (emissiveMap) {
      materialProps += `; emissiveMap: ${emissiveMap}`
    }

    this.sceneElements.push(`
      <a-sphere position="${posStr}" 
                rotation="0 ${greenwichAlignment} 0"
                radius="${radius}"
                segments-width="${segmentsWidth}"
                segments-height="${segmentsHeight}"
                material="${materialProps}"></a-sphere>
    `)
  }

  public addCubeTroisCouleurs ({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    size = 1,
    color1 = '#ff0000',
    color2 = '#00ff00',
    color3 = '#0000ff',
    wireframe = false,
  }: {
    position?: [number, number, number] | string;
    rotation?: [number, number, number] | string;
    size?: number;
    color1?: string;
    color2?: string;
    color3?: string;
    wireframe?: boolean | 'edges';
  } = {}): void {
    const posStr = Array.isArray(position) ? position.join(' ') : position
    const rotStr = Array.isArray(rotation) ? rotation.join(' ') : rotation
    const s = size / 2

    this.sceneElements.push(`
      <a-entity position="${posStr}" rotation="${rotStr}">
        <!-- Faces colorées -->
        <a-plane position="${s} 0 0" rotation="0 90 0" width="${size}" height="${size}" color="${color1}"></a-plane>
        <a-plane position="-${s} 0 0" rotation="0 -90 0" width="${size}" height="${size}" color="${color1}"></a-plane>
        <a-plane position="0 ${s} 0" rotation="-90 0 0" width="${size}" height="${size}" color="${color2}"></a-plane>
        <a-plane position="0 -${s} 0" rotation="90 0 0" width="${size}" height="${size}" color="${color2}"></a-plane>
        <a-plane position="0 0 ${s}" rotation="0 0 0" width="${size}" height="${size}" color="${color3}"></a-plane>
        <a-plane position="0 0 -${s}" rotation="0 180 0" width="${size}" height="${size}" color="${color3}"></a-plane>
        ${
          wireframe
            ? `<a-box width="${size}" height="${size}" depth="${size}" color="#000" material="color: #000; wireframe: false; opacity: 0.5; transparent: true" visible="true"></a-box>`
            : ''
        }
      </a-entity>
    `)
  }

  public addCubeTroisCouleursABox ({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    size = 1,
    color1 = '#ff0000',
    color2 = '#00ff00',
    color3 = '#0000ff',
  }: {
    position?: [number, number, number] | string;
    rotation?: [number, number, number] | string;
    size?: number;
    color1?: string;
    color2?: string;
    color3?: string;
  } = {}): void {
    const posStr = Array.isArray(position) ? position.join(' ') : position
    const rotStr = Array.isArray(rotation) ? rotation.join(' ') : rotation
    this.sceneElements.push(`
      <a-entity position="${posStr}" rotation="${rotStr}"
        cube-trois-couleurs="size: ${size}; color1: ${color1}; color2: ${color2}; color3: ${color3}"
         cube-tube-edges="size:1; color:#000; thickness:0.02">
      </a-entity>
    `)
  }

  public showSceneAt (parent: HTMLElement) {
    if (this.containerElement) {
      parent.appendChild(this.containerElement)
      this.renderScene()
      this.containerElement.style.display = 'block'
    }
  }

  public renderScene (): void {
    if (this.containerElement) {
    // Nettoyage : retire l'ancienne scène si présente
      const oldScene = this.containerElement.querySelector('a-scene')
      if (oldScene) {
        oldScene.parentNode?.removeChild(oldScene)
      }
      // this.initializeScene()
      this.containerElement.innerHTML = this.generateHTML()
      const aScene = this.containerElement.querySelector('a-scene')
      if (aScene) {
        this.setupCameraRigControls(this.containerElement as HTMLElement, aScene)
      }
    }
  }

  public destroy () {
    if (this.containerElement && (this.containerElement as any).__sceneCleanup) {
      (this.containerElement as any).__sceneCleanup()
    }
    if (this.containerElement && this.containerElement.parentNode) {
      this.containerElement.parentNode.removeChild(this.containerElement)
    }
  }

  public addHtmlButton ({
    id,
    text = 'Bouton',
    onClick,
    style = {}
  }: {
    id: string,
    text?: string,
    onClick?: (ev: MouseEvent) => void,
    style?: Partial<CSSStyleDeclaration>
  }) {
    // S'assure que la scène est déjà rendue
    if (!this.containerElement) return
    let overlay = this.containerElement.querySelector('.scene-viewer-overlay') as HTMLDivElement
    if (!overlay) {
      overlay = document.createElement('div')
      overlay.className = 'scene-viewer-overlay'
      overlay.style.position = 'absolute'
      overlay.style.top = '0'
      overlay.style.left = '0'
      overlay.style.width = '100%'
      overlay.style.height = '100%'
      overlay.style.pointerEvents = 'none'
      overlay.style.zIndex = '10'
      this.containerElement.appendChild(overlay)
    }
    const btn = document.createElement('button')
    btn.id = id
    btn.innerText = text
    btn.type = 'button'
    btn.style.pointerEvents = 'auto'
    btn.style.position = 'absolute'
    btn.style.bottom = '5px'
    btn.style.left = '20px'
    btn.style.zIndex = '20'
    btn.style.padding = '8px 16px'
    btn.style.fontSize = '1rem'
    btn.style.borderRadius = '6px'
    btn.style.border = '1px solid #888'
    btn.style.background = '#fff'
    btn.style.cursor = 'pointer'
    btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'
    if (style) {
      Object.assign(btn.style, style)
    }
    if (onClick) btn.addEventListener('click', onClick)
    overlay.appendChild(btn)
  }
}
