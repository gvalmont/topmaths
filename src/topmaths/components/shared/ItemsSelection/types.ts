import type { Objective } from '../../../types/objective'
import { deepCopy } from '../../../types/shared'
import { emptyUnit, type Unit } from '../../../types/unit'

export type Item =
  | Objective
  | (Unit & {
      isAutomaticity?: boolean
    })
export const emptyItem: Item = Object.assign(deepCopy(emptyUnit), {
  isAutomaticity: false,
})
