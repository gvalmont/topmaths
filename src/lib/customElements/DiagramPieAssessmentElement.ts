import { context } from '../../modules/context'
import type { IExercice } from '../types'
import MathaleaCustomElement, {
  registerMathaleaCustomElement,
} from './MathaleaCustomElement'

export type PieAssessmentShape = 'pie' | 'semi-pie'
export type PieAssessmentMode = 'auto' | 'angle' | 'effectif' | 'label'
export type PieAssessmentColumn = 'label' | 'effectif' | 'angle'

export type PieAssessmentItem = {
  label: string
  effectif: number
  angle: number | null
}

export type PieAssessmentState = {
  version: 1
  shape: PieAssessmentShape
  mode: PieAssessmentMode
  title: string
  targetAngle: number
  tolerance: number
  infosStatus: boolean
  hiddenColumns: PieAssessmentColumn[]
  items: PieAssessmentItem[]
}

export type PieAssessmentSerializedState = {
  version: 1
  kind: 'diagram-pie-assessment'
  shape: PieAssessmentShape
  mode: PieAssessmentMode
  targetAngle: number
  hiddenColumns?: PieAssessmentColumn[]
  infosStatus: boolean
  items: Array<{
    label: string
    effectif: number
    angle: number | null
  }>
}

export type PieAssessmentVerificationResult = {
  isOk: boolean
  feedback: string
  score: { nbBonnesReponses: number; nbReponses: number }
}

export type PieAssessmentVerificationContext = {
  exercice: IExercice
  questionIndex: number
  element: DiagramPieAssessmentElement
  expectedRaw: unknown
  actualRaw: string
  expected: PieAssessmentExpected | null
  actual: PieAssessmentExpected
}

export type PieAssessmentVerificationCallback = (
  context: PieAssessmentVerificationContext,
) => PieAssessmentVerificationResult

export type PieAssessmentCreateOptions = {
  id?: string
  numeroExercice: number
  questionIndex: number
  title?: string
  shape?: PieAssessmentShape
  mode?: PieAssessmentMode
  targetAngle?: number
  tolerance?: number
  infosStatus?: boolean
  hiddenColumns?: PieAssessmentColumn[]
  items: Array<{ label: string; effectif: number; angle?: number | null }>
  interactivityOn?: boolean
  verifyCallbackName?: string
  verifyCallback?: PieAssessmentVerificationCallback
}

type PieAssessmentExpected = {
  labels: string[]
  effectifs: number[]
  angles: number[]
}

export type PieAssessmentOptions = Omit<
  PieAssessmentCreateOptions,
  'numeroExercice' | 'questionIndex'
>

const PIE_COLORS = [
  '#2563eb',
  '#16a34a',
  '#f59e0b',
  '#dc2626',
  '#7c3aed',
  '#0891b2',
  '#ea580c',
  '#0f766e',
]

const DEFAULT_STATE: PieAssessmentState = {
  version: 1,
  shape: 'pie',
  mode: 'angle',
  title: '',
  targetAngle: 360,
  tolerance: 0,
  infosStatus: false,
  hiddenColumns: [],
  items: [
    { label: 'A', effectif: 1, angle: null },
    { label: 'B', effectif: 1, angle: null },
  ],
}

function safeText(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function safeNumber(value: unknown, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function normalizeAngle(value: unknown): number | null {
  if (value == null || value === '') return null
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return null
  return Math.max(0, Math.trunc(parsed))
}

function sanitizeIntegerInput(rawValue: string): string {
  if (rawValue.trim() === '') return ''
  const normalized = rawValue.replace(',', '.')
  const [integerPart] = normalized.split('.')
  const digitsOnly = integerPart.replaceAll(/[^0-9]/g, '')
  return digitsOnly
}

function normalizeItems(value: unknown): PieAssessmentItem[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => {
      if (item == null || typeof item !== 'object') return null
      const raw = item as {
        label?: unknown
        effectif?: unknown
        angle?: unknown
      }
      return {
        label: safeText(raw.label),
        effectif: safeNumber(raw.effectif, 0),
        angle: normalizeAngle(raw.angle),
      }
    })
    .filter((item): item is PieAssessmentItem => item != null)
}

function parseJsonAttribute<T>(raw: string | null, fallback: T): T {
  if (raw == null || raw.trim() === '') return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function parseBooleanAttribute(raw: string | null, fallback: boolean): boolean {
  if (raw == null) return fallback
  const normalized = raw.trim().toLowerCase()
  if (normalized === 'true') return true
  if (normalized === 'false') return false
  return fallback
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function effectiveTargetAngle(
  shape: PieAssessmentShape,
  configured: number,
): number {
  const fallback = shape === 'semi-pie' ? 180 : 360
  if (!Number.isFinite(configured) || configured <= 0) return fallback
  return configured
}

function stableObject(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((item) => stableObject(item))
  if (value == null || typeof value !== 'object') return value
  const keys = Object.keys(value as Record<string, unknown>).sort()
  const out: Record<string, unknown> = {}
  for (const key of keys) {
    out[key] = stableObject((value as Record<string, unknown>)[key])
  }
  return out
}

function stringifyStable(value: unknown): string {
  return JSON.stringify(stableObject(value))
}

function parseAngles(raw: unknown): number[] | null {
  if (Array.isArray(raw)) {
    return raw
      .map((value) => safeNumber(value, NaN))
      .filter((n) => Number.isFinite(n))
  }

  let parsed: unknown = raw
  if (typeof raw === 'string') {
    if (raw.trim() === '') return null
    try {
      parsed = JSON.parse(raw)
    } catch {
      return null
    }
  }

  if (parsed == null || typeof parsed !== 'object') return null

  const objectValue = parsed as {
    items?: Array<{ angle?: unknown }>
    angles?: unknown[]
  }

  if (Array.isArray(objectValue.angles)) {
    return objectValue.angles
      .map((value) => safeNumber(value, NaN))
      .filter((n) => Number.isFinite(n))
  }

  if (Array.isArray(objectValue.items)) {
    return objectValue.items.map((item) => safeNumber(item.angle, 0))
  }

  return null
}

function parseEffectifs(raw: unknown): number[] | null {
  if (Array.isArray(raw)) {
    return raw
      .map((value) => safeNumber(value, NaN))
      .filter((n) => Number.isFinite(n))
  }

  let parsed: unknown = raw
  if (typeof raw === 'string') {
    if (raw.trim() === '') return null
    try {
      parsed = JSON.parse(raw)
    } catch {
      return null
    }
  }

  if (parsed == null || typeof parsed !== 'object') return null

  const objectValue = parsed as {
    items?: Array<{ effectif?: unknown }>
    effectifs?: unknown[]
  }

  if (Array.isArray(objectValue.effectifs)) {
    return objectValue.effectifs
      .map((value) => safeNumber(value, NaN))
      .filter((n) => Number.isFinite(n))
  }

  if (Array.isArray(objectValue.items)) {
    return objectValue.items.map((item) => safeNumber(item.effectif, 0))
  }

  return null
}

function parseLabels(raw: unknown): string[] | null {
  if (Array.isArray(raw)) {
    return raw.map((value) => safeText(value))
  }

  let parsed: unknown = raw
  if (typeof raw === 'string') {
    if (raw.trim() === '') return null
    try {
      parsed = JSON.parse(raw)
    } catch {
      return null
    }
  }

  if (parsed == null || typeof parsed !== 'object') return null

  const objectValue = parsed as {
    items?: Array<{ label?: unknown }>
    labels?: unknown[]
  }

  if (Array.isArray(objectValue.labels)) {
    return objectValue.labels.map((value) => safeText(value))
  }

  if (Array.isArray(objectValue.items)) {
    return objectValue.items.map((item) => safeText(item.label))
  }

  return null
}

function parseHiddenColumns(raw: string | null): PieAssessmentColumn[] {
  if (raw == null || raw.trim() === '') return []

  const candidates: unknown = raw.trim().startsWith('[')
    ? parseJsonAttribute<unknown>(raw, [])
    : raw.split(',').map((value) => value.trim())

  if (!Array.isArray(candidates)) return []

  return candidates
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter(
      (value): value is PieAssessmentColumn =>
        value === 'label' || value === 'effectif' || value === 'angle',
    )
}

function normalizeLabel(value: string): string {
  return value.trim().toLowerCase()
}

export class DiagramPieAssessmentElement extends MathaleaCustomElement {
  static readonly elementTag = 'diagram-pie-assessment'

  private static readonly verificationCallbacks = new Map<
    string,
    PieAssessmentVerificationCallback
  >()

  private state: PieAssessmentState = structuredClone(DEFAULT_STATE)

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  static get observedAttributes(): string[] {
    return [
      'title',
      'shape',
      'mode',
      'target-angle',
      'tolerance',
      'infos-status',
      'hidden-columns',
      'items',
      'interactivity-on',
    ]
  }

  static create({
    id,
    numeroExercice,
    questionIndex,
    title = '',
    shape = 'pie',
    mode = 'angle',
    targetAngle,
    tolerance = 0,
    infosStatus = false,
    hiddenColumns = [],
    items,
    interactivityOn = true,
    verifyCallbackName,
    verifyCallback,
  }: PieAssessmentCreateOptions): string {
    const callbackName =
      verifyCallbackName ??
      (verifyCallback == null
        ? undefined
        : `${DiagramPieAssessmentElement.elementTag}Ex${numeroExercice}Q${questionIndex}-verification`)

    if (verifyCallback != null && callbackName != null) {
      DiagramPieAssessmentElement.registerVerificationCallback(
        callbackName,
        verifyCallback,
      )
    }

    const target = targetAngle ?? (shape === 'semi-pie' ? 180 : 360)

    return super.create({
      id:
        id ??
        `${DiagramPieAssessmentElement.elementTag}Ex${numeroExercice}Q${questionIndex}`,
      numeroExercice,
      questionIndex,
      title,
      shape,
      mode,
      targetAngle: target,
      tolerance,
      infosStatus,
      hiddenColumns,
      items,
      interactivityOn,
      verifyCallbackName: callbackName,
    })
  }

  static registerVerificationCallback(
    name: string,
    callback: PieAssessmentVerificationCallback,
  ): void {
    if (name.trim() === '') {
      throw new Error(
        'Le nom du callback de verification ne peut pas etre vide',
      )
    }
    DiagramPieAssessmentElement.verificationCallbacks.set(name, callback)
  }

  static unregisterVerificationCallback(name: string): void {
    DiagramPieAssessmentElement.verificationCallbacks.delete(name)
  }

  static verifQuestion(
    exercice: IExercice,
    questionIndex: number,
  ): PieAssessmentVerificationResult {
    const id = `${DiagramPieAssessmentElement.elementTag}Ex${exercice.numeroExercice}Q${questionIndex}`
    const element = document.getElementById(
      id,
    ) as DiagramPieAssessmentElement | null
    const spanResult = document.querySelector(
      `#resultatCheckEx${exercice.numeroExercice}Q${questionIndex}`,
    )
    const feedbackDiv = document.querySelector(
      `#feedbackEx${exercice.numeroExercice}Q${questionIndex}`,
    ) as HTMLElement | null

    if (element == null) {
      const feedback = 'Diagramme circulaire interactif introuvable.'
      if (spanResult) spanResult.innerHTML = '☹️'
      if (feedbackDiv) {
        feedbackDiv.innerHTML = feedback
        feedbackDiv.style.display = 'block'
      }
      return {
        isOk: false,
        feedback,
        score: { nbBonnesReponses: 0, nbReponses: 1 },
      }
    }

    const expectedRaw =
      exercice.autoCorrection?.[questionIndex]?.valeur?.reponse?.value
    const actualRaw = element.value
    const expected: PieAssessmentExpected | null = {
      labels: parseLabels(expectedRaw) ?? [],
      effectifs: parseEffectifs(expectedRaw) ?? [],
      angles: parseAngles(expectedRaw) ?? [],
    }
    const actual: PieAssessmentExpected = {
      labels: element.getStudentLabels(),
      effectifs: element.getStudentEffectifs(),
      angles: element.getStudentAngles(),
    }

    exercice.answers ??= {}
    exercice.answers[element.id] = actualRaw
    element.interactivityOn = false

    const callbackName = element.getAttribute('verify-callback-name')
    if (callbackName != null) {
      const callback =
        DiagramPieAssessmentElement.verificationCallbacks.get(callbackName)
      if (callback == null) {
        const feedback = `Vérificateur introuvable: ${callbackName}`
        if (spanResult) spanResult.innerHTML = '☹️'
        if (feedbackDiv) {
          feedbackDiv.innerHTML = feedback
          feedbackDiv.style.display = 'block'
        }
        return {
          isOk: false,
          feedback,
          score: { nbBonnesReponses: 0, nbReponses: 1 },
        }
      }

      try {
        const result = callback({
          exercice,
          questionIndex,
          element,
          expectedRaw,
          actualRaw,
          expected,
          actual,
        })
        if (spanResult) spanResult.innerHTML = result.isOk ? '😎' : '☹️'
        if (feedbackDiv) {
          feedbackDiv.innerHTML = result.feedback
          feedbackDiv.style.display = result.feedback === '' ? 'none' : 'block'
        }
        return result
      } catch (error) {
        const feedback = `Erreur dans le vérificateur ${callbackName}`
        if (spanResult) spanResult.innerHTML = '☹️'
        if (feedbackDiv) {
          feedbackDiv.innerHTML = feedback
          feedbackDiv.style.display = 'block'
        }
        window.notify(feedback, { error, callbackName })
        return {
          isOk: false,
          feedback,
          score: { nbBonnesReponses: 0, nbReponses: 1 },
        }
      }
    }

    if (
      expected == null ||
      (expected.labels.length === 0 &&
        expected.effectifs.length === 0 &&
        expected.angles.length === 0)
    ) {
      const feedback = 'Réponse attendue absente ou invalide.'
      if (spanResult) spanResult.innerHTML = '☹️'
      if (feedbackDiv) {
        feedbackDiv.innerHTML = feedback
        feedbackDiv.style.display = 'block'
      }
      return {
        isOk: false,
        feedback,
        score: { nbBonnesReponses: 0, nbReponses: 1 },
      }
    }

    const tolerance = element.state.tolerance
    const mode = element.state.mode

    let isOk = false
    let feedback = ''

    if (mode === 'label') {
      if (expected.labels.length !== actual.labels.length) {
        feedback = 'Le nombre de catégories saisies ne correspond pas.'
      } else {
        const mismatches = expected.labels
          .map((label, index) => ({
            expected: normalizeLabel(label),
            actual: normalizeLabel(actual.labels[index] ?? ''),
          }))
          .filter((entry) => entry.expected !== entry.actual)
        isOk = mismatches.length === 0
        if (!isOk) {
          feedback = `Catégories incorrectes pour ${mismatches.length} secteur(s).`
        }
      }
    } else if (mode === 'effectif') {
      if (expected.effectifs.length !== actual.effectifs.length) {
        feedback = 'Le nombre de secteurs saisis ne correspond pas.'
      } else {
        const mismatches = expected.effectifs
          .map((value, index) => ({
            expected: value,
            actual: actual.effectifs[index] ?? 0,
          }))
          .filter(
            (entry) => Math.abs(entry.expected - entry.actual) > tolerance,
          )
        isOk = mismatches.length === 0
        if (!isOk) {
          feedback = `Effectifs incorrects pour ${mismatches.length} secteur(s).`
        }
      }
    } else {
      if (expected.angles.length !== actual.angles.length) {
        feedback = 'Le nombre de secteurs saisis ne correspond pas.'
      } else {
        const mismatches = expected.angles
          .map((value, index) => ({
            expected: value,
            actual: actual.angles[index] ?? 0,
          }))
          .filter(
            (entry) => Math.abs(entry.expected - entry.actual) > tolerance,
          )
        isOk = mismatches.length === 0
        if (!isOk) {
          feedback = `Angles incorrects pour ${mismatches.length} secteur(s).`
        }
      }
    }

    if (feedback !== '') isOk = false

    if (spanResult) spanResult.innerHTML = isOk ? '😎' : '☹️'

    if (feedbackDiv) {
      feedbackDiv.innerHTML = feedback
      feedbackDiv.style.display = feedback === '' ? 'none' : 'block'
    }

    return {
      isOk,
      feedback,
      score: { nbBonnesReponses: isOk ? 1 : 0, nbReponses: 1 },
    }
  }

  static formatStudentAnswer(rawAnswer: string): string {
    const angles = parseAngles(rawAnswer)
    if (angles == null) return rawAnswer
    return angles.map((value, index) => `S${index + 1}: ${value}°`).join(' ; ')
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.syncStateFromAttributes()
    this.render()
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    if (oldValue === newValue) return
    if (name === 'interactivity-on') {
      this.hydrateCommonAttributes()
    }
    this.syncStateFromAttributes()
    this.render()
  }

  render(): string | void {
    if (!context.isHtml || context.isTypst) {
      return this.renderLatex()
    }
    if (this.shadowRoot == null) return

    const disableAttr = this.interactivityOn ? '' : 'disabled'

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 10px;
          margin: 8px 0;
          background: #ffffff;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th,
        td {
          border: 1px solid #e5e7eb;
          padding: 5px;
          text-align: left;
        }
        td input {
          width: 100%;
          box-sizing: border-box;
        }
        .preview {
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 6px;
          background: #f8fafc;
        }
        .status {
          font-size: 0.9rem;
          color: #334155;
        }
        .status.warning {
          color: #b45309;
        }
        .legend {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 6px;
          margin-top: 8px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.95rem;
          color: #334155;
        }
        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
          flex-shrink: 0;
        }
        svg {
          width: 100%;
          height: 220px;
          display: block;
          background: #fff;
        }
      </style>
      <div class="grid">
        ${
          this.state.title.trim() === ''
            ? ''
            : `<div>${this.escapeText(this.state.title.trim())}</div>`
        }
        ${this.renderTable(disableAttr)}
        <div class="preview" id="preview"></div>
      </div>
    `

    this.renderPreview()
    this.bindEvents()
  }

  protected renderLatex(): string {
    return ''
  }

  get value(): string {
    return JSON.stringify(this.toSerializedState())
  }

  set value(nextValue: string) {
    this.update(nextValue)
  }

  update(nextValue: string | PieAssessmentSerializedState): void {
    let parsed: unknown = nextValue
    if (typeof nextValue === 'string') {
      if (nextValue.trim() === '') return
      try {
        parsed = JSON.parse(nextValue)
      } catch {
        return
      }
    }

    if (parsed == null || typeof parsed !== 'object') return
    const raw = parsed as Partial<PieAssessmentSerializedState>

    const itemsByIndex = Array.isArray(raw.items) ? raw.items : []
    this.state.items = this.state.items.map((item, index) => {
      const incoming = itemsByIndex[index]
      if (incoming == null) return item
      return {
        label: safeText(incoming.label) || item.label,
        effectif: Number.isFinite(Number(incoming.effectif))
          ? Number(incoming.effectif)
          : item.effectif,
        angle: normalizeAngle(incoming.angle),
      }
    })

    if (raw.shape === 'pie' || raw.shape === 'semi-pie') {
      this.state.shape = raw.shape
    }
    if (raw.mode === 'angle' || raw.mode === 'auto') {
      this.state.mode = raw.mode
    }
    if (raw.mode === 'effectif' || raw.mode === 'label') {
      this.state.mode = raw.mode
    }

    if (Array.isArray(raw.hiddenColumns)) {
      this.state.hiddenColumns = raw.hiddenColumns.filter(
        (column): column is PieAssessmentColumn =>
          column === 'label' || column === 'effectif' || column === 'angle',
      )
    }

    if (typeof raw.infosStatus === 'boolean') {
      this.state.infosStatus = raw.infosStatus
    }

    this.state.targetAngle = effectiveTargetAngle(
      this.state.shape,
      safeNumber(raw.targetAngle, this.state.targetAngle),
    )

    this.render()
  }

  protected onInteractivityChanged(_isOn: boolean): void {
    this.render()
  }

  getStudentAngles(): number[] {
    return this.state.items.map((item, index) =>
      this.itemAngleForDisplay(item, index),
    )
  }

  getStudentEffectifs(): number[] {
    return this.state.items.map((item) => Math.max(0, item.effectif))
  }

  getStudentLabels(): string[] {
    return this.state.items.map((item) => item.label)
  }

  private syncStateFromAttributes(): void {
    const shapeAttr = this.getAttribute('shape')
    const modeAttr = this.getAttribute('mode')

    this.state.shape = shapeAttr === 'semi-pie' ? 'semi-pie' : 'pie'
    this.state.mode =
      modeAttr === 'auto' ||
      modeAttr === 'angle' ||
      modeAttr === 'effectif' ||
      modeAttr === 'label'
        ? modeAttr
        : 'angle'
    this.state.title = this.getAttribute('title') ?? ''
    this.state.infosStatus = parseBooleanAttribute(
      this.getAttribute('infos-status'),
      DEFAULT_STATE.infosStatus,
    )
    this.state.hiddenColumns = parseHiddenColumns(
      this.getAttribute('hidden-columns'),
    )

    const items = normalizeItems(
      parseJsonAttribute<unknown[]>(this.getAttribute('items'), []),
    )
    this.state.items =
      items.length > 0 ? items : structuredClone(DEFAULT_STATE.items)

    const targetConfigured = safeNumber(
      this.getAttribute('target-angle'),
      this.state.shape === 'semi-pie' ? 180 : 360,
    )
    this.state.targetAngle = effectiveTargetAngle(
      this.state.shape,
      targetConfigured,
    )

    this.state.tolerance = clamp(
      safeNumber(this.getAttribute('tolerance'), 0),
      0,
      180,
    )
  }

  private renderTable(disableAttr: string): string {
    const showLabel = this.isColumnVisible('label')
    const showEffectif = this.isColumnVisible('effectif')
    const showAngle = this.isColumnVisible('angle')

    const columns: string[] = []
    if (showLabel) columns.push('<th>Catégorie</th>')
    if (showEffectif) columns.push('<th>Effectif</th>')
    if (showAngle) columns.push('<th>Angle (°)</th>')

    const noColumnMessage =
      !showLabel && !showEffectif && !showAngle
        ? '<div>Aucune colonne à afficher.</div>'
        : ''

    if (noColumnMessage !== '') return noColumnMessage

    return `
      <table>
        <thead>
          <tr>
            ${columns.join('')}
          </tr>
        </thead>
        <tbody>
          ${this.state.items
            .map((item, index) => {
              const displayedAngle = this.itemAngleForDisplay(item, index)
              const angleInputDisabled =
                this.interactivityOn && this.state.mode === 'angle'
                  ? ''
                  : 'disabled'
              const effectifInputDisabled =
                this.interactivityOn && this.state.mode === 'effectif'
                  ? ''
                  : 'disabled'
              const labelInputDisabled =
                this.interactivityOn && this.state.mode === 'label'
                  ? ''
                  : 'disabled'
              return `
                <tr>
                  ${
                    showLabel
                      ? `<td><input type="text" data-kind="label" data-index="${index}" value="${this.escapeText(item.label)}" ${disableAttr} ${labelInputDisabled} /></td>`
                      : ''
                  }
                  ${
                    showEffectif
                      ? `<td><input type="number" step="1" data-kind="effectif" data-index="${index}" value="${item.effectif}" ${disableAttr} ${effectifInputDisabled} /></td>`
                      : ''
                  }
                  ${
                    showAngle
                      ? `<td><input type="number" step="1" inputmode="numeric" data-kind="angle" data-index="${index}" value="${Number.isFinite(displayedAngle) ? displayedAngle : 0}" ${disableAttr} ${angleInputDisabled} /></td>`
                      : ''
                  }
                </tr>
              `
            })
            .join('')}
        </tbody>
      </table>
    `
  }

  private bindEvents(): void {
    if (this.shadowRoot == null) return

    this.shadowRoot
      .querySelectorAll<HTMLInputElement>('input[data-kind="angle"]')
      .forEach((input) => {
        input.addEventListener('input', () => {
          const sanitizedValue = sanitizeIntegerInput(input.value)
          if (sanitizedValue !== input.value) {
            input.value = sanitizedValue
          }

          const index = safeNumber(input.dataset.index, -1)
          if (!Number.isInteger(index) || index < 0) return
          if (this.state.mode !== 'angle') return
          if (this.state.items[index] == null) return
          this.state.items[index].angle = normalizeAngle(input.value)
          this.renderPreview()
        })

        input.addEventListener('change', () => {
          this.dispatchChangeEvents()
        })
      })

    this.shadowRoot
      .querySelectorAll<HTMLInputElement>('input[data-kind="effectif"]')
      .forEach((input) => {
        input.addEventListener('input', () => {
          const index = safeNumber(input.dataset.index, -1)
          if (!Number.isInteger(index) || index < 0) return
          if (this.state.mode !== 'effectif') return
          if (this.state.items[index] == null) return
          this.state.items[index].effectif = Math.max(
            0,
            safeNumber(input.value, 0),
          )
          this.renderPreview()
        })

        input.addEventListener('change', () => {
          this.dispatchChangeEvents()
        })
      })

    this.shadowRoot
      .querySelectorAll<HTMLInputElement>('input[data-kind="label"]')
      .forEach((input) => {
        input.addEventListener('input', () => {
          const index = safeNumber(input.dataset.index, -1)
          if (!Number.isInteger(index) || index < 0) return
          if (this.state.mode !== 'label') return
          if (this.state.items[index] == null) return
          this.state.items[index].label = input.value
          this.renderPreview()
        })

        input.addEventListener('change', () => {
          this.dispatchChangeEvents()
        })
      })
  }

  private renderPreview(): void {
    if (this.shadowRoot == null) return
    const preview = this.shadowRoot.querySelector(
      '#preview',
    ) as HTMLDivElement | null
    if (preview == null) return

    const { svg, usedAngle } = this.renderPieSvg()
    const remaining = this.state.targetAngle - usedAngle
    const statusText =
      remaining > 0
        ? `Somme des angles: ${usedAngle.toFixed(0)}° / ${this.state.targetAngle}° (incomplet)`
        : `Somme des angles: ${usedAngle.toFixed(0)}° / ${this.state.targetAngle}°`

    const statusClass = remaining > 0 ? 'status warning' : 'status'
    preview.innerHTML = this.state.infosStatus
      ? `${svg}<div class="${statusClass}">${statusText}</div>${this.renderLegend()}`
      : `${svg}${this.renderLegend()}`
  }

  private renderPieSvg(): { svg: string; usedAngle: number } {
    const width = 320
    const height = 220
    const margin = 12
    const isSemi = this.state.shape === 'semi-pie'
    const cx = width / 2
    const cy = isSemi ? height - 20 : height / 2
    const radius = isSemi
      ? Math.min(width / 2 - margin, height - 34)
      : Math.min(width, height) / 2 - margin

    const target = this.state.targetAngle
    const maxAngle = target
    let usedAngle = 0
    let startDeg = isSemi ? 180 : -90

    const slices: string[] = []

    this.state.items.forEach((item, index) => {
      const requested = Math.max(0, this.itemAngleForDisplay(item, index))
      if (requested <= 0) return

      const remaining = Math.max(0, maxAngle - usedAngle)
      if (remaining <= 0) return

      const drawn = Math.min(requested, remaining)
      const endDeg = startDeg + drawn
      const path = this.arcPath(cx, cy, radius, startDeg, endDeg)
      const tooltip = `${item.label} : ${requested.toFixed(1)}°`
      slices.push(
        `<path d="${path}" fill="${this.colorForIndex(index)}"><title>${this.escapeText(tooltip)}</title></path>`,
      )
      usedAngle += drawn
      startDeg = endDeg
    })

    const frame = isSemi
      ? `<path d="${this.arcPath(cx, cy, radius, 180, 360)}" fill="none" stroke="#94a3b8" stroke-width="1"/>`
      : `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#94a3b8" stroke-width="1"/>`

    const svg = `<svg viewBox="0 0 ${width} ${height}">${frame}${slices.join('')}</svg>`

    return { svg, usedAngle }
  }

  private arcPath(
    cx: number,
    cy: number,
    r: number,
    startDeg: number,
    endDeg: number,
  ): string {
    const startRad = (startDeg * Math.PI) / 180
    const endRad = (endDeg * Math.PI) / 180
    const startX = cx + r * Math.cos(startRad)
    const startY = cy + r * Math.sin(startRad)
    const endX = cx + r * Math.cos(endRad)
    const endY = cy + r * Math.sin(endRad)
    const delta = Math.abs(endDeg - startDeg)
    const largeArc = delta > 180 ? 1 : 0
    return `M ${cx} ${cy} L ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY} Z`
  }

  private renderLegend(): string {
    return `<div class="legend">${this.state.items
      .map((item, index) => {
        const tooltip = `${item.label}: ${this.itemAngleForDisplay(item, index).toFixed(1)}°`
        return `<div class="legend-item" title="${this.escapeText(tooltip)}"><span class="legend-color" style="background:${this.colorForIndex(index)};"></span><span>${this.escapeText(item.label)}</span></div>`
      })
      .join('')}</div>`
  }

  private itemAngleForDisplay(item: PieAssessmentItem, _index: number): number {
    if (this.state.mode === 'angle') {
      return Math.max(0, item.angle ?? 0)
    }

    const total = this.totalEffectif()
    if (total <= 0) return 0
    const ratio = item.effectif / total
    const angle = ratio * this.state.targetAngle
    if (!Number.isFinite(angle)) return 0

    // Arrondi léger pour garder un affichage stable sans bruit décimal.
    return Math.round(angle * 10) / 10
  }

  private totalEffectif(): number {
    return this.state.items.reduce(
      (sum, item) => sum + Math.max(0, item.effectif),
      0,
    )
  }

  private toSerializedState(): PieAssessmentSerializedState {
    const serialized = {
      version: 1 as const,
      kind: 'diagram-pie-assessment' as const,
      shape: this.state.shape,
      mode: this.state.mode,
      targetAngle: this.state.targetAngle,
      infosStatus: this.state.infosStatus,
      hiddenColumns: this.state.hiddenColumns,
      items: this.state.items.map((item, index) => ({
        label: item.label,
        effectif: item.effectif,
        angle:
          this.state.mode === 'angle'
            ? this.itemAngleForDisplay(item, index)
            : item.angle,
      })),
    }

    // Comparaison stable pour rester robuste aux variations d'ordre de clés.
    return JSON.parse(
      stringifyStable(serialized),
    ) as PieAssessmentSerializedState
  }

  private dispatchChangeEvents(): void {
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    )
  }

  private colorForIndex(index: number): string {
    return PIE_COLORS[index % PIE_COLORS.length]
  }

  private isColumnVisible(column: PieAssessmentColumn): boolean {
    if (this.state.hiddenColumns.includes(column)) return false
    if (this.state.mode === 'angle' && column === 'effectif') return false
    if (this.state.mode === 'effectif' && column === 'angle') return false
    return true
  }

  private escapeText(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('"', '&quot;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
  }
}

export function addDiagramPieAssessment(
  exercice: IExercice,
  questionIndex: number,
  options: PieAssessmentOptions,
): string {
  if (!context.isHtml) return ''
  if (exercice.autoCorrection[questionIndex] == null) {
    exercice.autoCorrection[questionIndex] = {}
  }
  exercice.autoCorrection[questionIndex].formatInteractif =
    DiagramPieAssessmentElement.elementTag
  return DiagramPieAssessmentElement.create({
    ...options,
    numeroExercice: exercice.numeroExercice ?? 0,
    questionIndex,
  })
}

registerMathaleaCustomElement(DiagramPieAssessmentElement)
