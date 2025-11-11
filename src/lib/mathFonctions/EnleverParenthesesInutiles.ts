import { ComputeEngine, type Expression } from '@cortex-js/compute-engine'
const ce = new ComputeEngine()

/**
 * 🔹 Supprime récursivement les "Delimiter" dans le MathJSON
 */
function stripDelimiter(node: Expression): Expression {
  if (!Array.isArray(node)) return node

  const arr = node as [string, ...Expression[]]
  const op = arr[0]

  if (op === 'Delimiter') {
    const inner = arr.length === 1 ? arr[0] : arr[1]

    if (Array.isArray(inner)) {
      const innerOp = inner[0]
      // ⚙️ On ne garde les parenthèses que si le contenu est Add/Subtract
      if (innerOp === 'Add' || innerOp === 'Subtract') {
        return ['Delimiter', stripDelimiter(inner)] as Expression
      }
      // Sinon, on retire complètement les parenthèses
      return stripDelimiter(inner)
    }
    return inner
  }

  const rest = arr.slice(1).map((x) => stripDelimiter(x as Expression))
  return [op, ...rest] as Expression
}

/**
 * 🔹 Sérialisation manuelle MathJSON → LaTeX préservant l’ordre et les signes
 */
function mathJsonToLatex(node: Expression): string {
  const isArray = Array.isArray
  const getOp = (n: Expression) =>
    isArray(n) && typeof n[0] === 'string' ? n[0] : null

  function toLatex(n: Expression): string {
    if (!isArray(n)) return String(n)

    const op = n[0] as string
    const args = n.slice(1) as Expression[]

    switch (op) {
      //
      // 🔹 PRIMITIFS
      //
      case 'Number':
      case 'Real':
      case 'Integer':
      case 'String':
      case 'Symbol':
        return String(args[0])

      //
      // 🔹 NÉGATION
      //
      case 'Negate': {
        const inner = args[0]
        const innerOp = getOp(inner)
        const latexInner = toLatex(inner)
        // On parenthèse seulement si nécessaire
        if (innerOp === 'Add' || innerOp === 'Subtract')
          return `-(${latexInner})`
        return `-${latexInner}`
      }

      //
      // 🔹 ADDITION / SOUSTRACTION
      //
      case 'Add':
        return args.map(toLatex).join('+')

      case 'Subtract':
        if (args.length === 1) return '-' + toLatex(args[0])
        return args
          .map((a, i) => (i === 0 ? toLatex(a) : `-${toLatex(a)}`))
          .join('')

      //
      // 🔹 MULTIPLICATION
      //
      case 'Multiply': {
        const parts = args.map((a, idx) => {
          const opA = getOp(a)

          // 🔸 1. Nombre négatif explicite
          if (
            Array.isArray(a) &&
            a[0] === 'Number' &&
            typeof a[1] === 'number' &&
            a[1] < 0
          ) {
            const absVal = Math.abs(a[1])
            return idx === 0 ? `-${absVal}` : `(-${absVal})`
          }

          // 🔸 2. Negate(...)
          if (Array.isArray(a) && a[0] === 'Negate') {
            const inner = a[1]
            const latexInner = toLatex(inner)
            return idx === 0 ? `-${latexInner}` : `(-${latexInner})`
          }

          // 🔸 3. Add/Subtract → toujours parenthèses
          if (opA === 'Add' || opA === 'Subtract') {
            return `(${toLatex(a)})`
          }

          // 🔸 4. Divide → parenthèses si non premier facteur
          if (opA === 'Divide' && idx > 0) {
            return `(${toLatex(a)})`
          }

          // 🔸 5. Cas normal
          return toLatex(a)
        })

        return parts.join('\\times')
      }

      //
      // 🔹 DIVISION (préserve \div)
      //
      case 'Divide': {
        const left = args[0]
        const right = args[1]
        const leftOp = getOp(left)
        const rightOp = getOp(right)

        const leftLatex =
          leftOp === 'Add' || leftOp === 'Subtract'
            ? `(${toLatex(left)})`
            : toLatex(left)

        let rightLatex = toLatex(right)

        // dénominateur Add/Subtract → parenthèses
        if (rightOp === 'Add' || rightOp === 'Subtract') {
          rightLatex = `(${rightLatex})`
        }

        // dénominateur négatif explicite → parenthèses aussi
        if (
          rightOp === 'Negate' ||
          (isArray(right) &&
            right[0] === 'Number' &&
            typeof right[1] === 'number' &&
            right[1] < 0)
        ) {
          rightLatex = `(${rightLatex})`
        }

        return `${leftLatex}\\div${rightLatex}`
      }

      //
      // 🔹 FRACTION (vraies \frac / \dfrac)
      //
      case 'Frac': {
        const num = args[0]
        const den = args[1]
        return `\\frac{${toLatex(num)}}{${toLatex(den)}}`
      }

      //
      // 🔹 PUISSANCE
      //
      case 'Power': {
        const base = toLatex(args[0])
        const exp = toLatex(args[1])
        return `${base}^{${exp}}`
      }

      //
      // 🔹 DELIMITER
      //
      case 'Delimiter': {
        // le contenu est souvent à arg[1] ou arg[0]
        const inner = args.length === 1 ? args[0] : (args[1] ?? args[0])
        // supprime complètement le mot-clé Delimiter, garde les parenthèses normales
        return `(${toLatex(inner)})`
      }

      //
      // 🔹 PAR DÉFAUT
      //
      default: {
        const name = op.toLowerCase()
        const known: Record<string, string> = {
          sin: '\\sin',
          cos: '\\cos',
          tan: '\\tan',
        }
        if (known[name])
          return `${known[name]}\\left(${args.map(toLatex).join(',')}\\right)`
        return `${op}\\left(${args.map(toLatex).join(',')}\\right)`
      }
    }
  }

  return toLatex(node)
}

/**
 * 🔹 Transforme certaines divisions en vraies fractions "Frac"
 * (quand l'entrée d'origine contenait \frac ou \dfrac)
 */
function restoreFracNodes(
  node: Expression,
  count: number,
): { node: Expression; used: number } {
  if (!Array.isArray(node)) return { node, used: 0 }
  const [op, ...args] = node
  if (op === 'Divide' && count > 0) {
    const [num, den] = args
    return { node: ['Frac', num, den], used: 1 }
  }
  let used = 0
  const newArgs = args.map((a) => {
    const res = restoreFracNodes(a as Expression, count - used)
    used += res.used
    return res.node
  })
  return { node: [op, ...newArgs] as Expression, used }
}

/**
 * 🧹 deparenthise()
 * Nettoie une expression LaTeX sans changer les opérateurs d'origine.
 */
export function deparenthise(latexIn: string): string {
  // Comptage des \frac et \dfrac
  const dfracCount = (latexIn.match(/\\dfrac\b/g) || []).length
  const fracCount = (latexIn.match(/\\frac\b/g) || []).length + dfracCount

  // Normalisation temporaire : \dfrac → \frac pour Compute Engine
  const normalized = latexIn.replace(/\\dfrac\b/g, '\\frac')

  const boxed = ce.parse(normalized, { canonical: false })
  const mathJson = boxed.json as Expression

  // Nettoyage
  const stripped = stripDelimiter(mathJson)

  // Restauration des "Frac" à partir des Divide
  const restored = restoreFracNodes(stripped, fracCount).node

  // Conversion LaTeX
  let result = mathJsonToLatex(restored)

  // Restauration des \dfrac (si présents en tête)
  if (dfracCount > 0) {
    let replaced = 0
    result = result.replace(/\\frac\{/g, () => {
      replaced++
      return replaced <= dfracCount ? '\\dfrac{' : '\\frac{'
    })
  }

  return result
}
