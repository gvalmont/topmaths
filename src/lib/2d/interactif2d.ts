import type { Interactif2dData } from '../../types/2d'
import type { IExercice } from '../types'
import { ObjetMathalea2D } from './ObjetMathalea2D'

export class Interactif2d extends ObjetMathalea2D {
  exercice: IExercice
  question: number
  x: number
  y: number
  content: string
  opacity: number = 1.0
  constructor(
    content: string,
    x: number,
    y: number,
    {
      exercice,
      question = 0,
      opacity = 1.0,
    }: {
      exercice: IExercice
      question: number
      opacity?: number
    },
  ) {
    super()
    this.x = x
    this.y = y
    this.content = content
    this.exercice = exercice
    this.question = question
    this.opacity = opacity
    const marge = 0.5
    this.bordures = [x - marge, y - marge, x + marge, y + marge]
  }

  svg(): Interactif2dData {
    return {
      exercice: this.exercice,
      question: this.question,
      x: this.x,
      y: this.y,
      content: this.content,
      opacity: this.opacity,
    }
  }

  tikz() {
    return `\\draw[opacity=${this.opacity}] (${this.x},${this.y}) node[anchor = center, rotate=${this.orientation}] {$\\ldots$}};`
  }
}
