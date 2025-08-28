import {
  create,
  evaluateDependencies,
  formatDependencies,
  fractionDependencies,
  gcdDependencies,
  lcmDependencies,
  NodeDependencies,
  nthRootDependencies,
  OperatorNode,
  ParenthesisNode,
  parseDependencies,
  simplifyDependencies,
  SymbolNode,
  type Fraction,
  type MathNode,
} from 'mathjs'

const config = {
  // optionally, you can specify configuration
}

// Create just the functions we need
export const math = create(
  {
    fractionDependencies,
    lcmDependencies,
    gcdDependencies,
    nthRootDependencies,
    NodeDependencies,
    formatDependencies,
    parseDependencies,
    evaluateDependencies,
    simplifyDependencies,
  },
  config,
)

// ---- exporter les types ----
export { OperatorNode, ParenthesisNode, SymbolNode }
export type { Fraction, MathNode }
