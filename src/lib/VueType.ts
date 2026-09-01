/*
Code inspiré de Sylvain, merci!
https://stackoverflow.com/questions/55020193/is-it-possible-to-create-a-typescript-type-from-an-array
*/
const VueTypeArray = <const>[
  'a4',
  'alacarte',
  'diaporama',
  'can',
  'eleve',
  'latex',
  'pdf',
  'raw',
  'confeleve',
  'amc',
  'anki',
  'moodle',
  'l',
  'l2',
  'overview',
  'myriade',
  'indices',
  'start',
  'indice',
  'tools',
  'typst',
  'tex',
  'flashcards',
  'slides',
  'tbi',
  'quizzconf',
  'quizz',
  'omr',
  'check-test',
  '',
]
type VueTypeArrayType = typeof VueTypeArray
type MathaleaVueType = VueTypeArrayType[number]
export type VueType = MathaleaVueType | View

// export type VueType = 'diaporama' | 'can' | 'eleve' | 'latex' | 'confeleve' | 'amc' | 'anki' | 'moodle' | 'l' | 'l2' | 'overview'

export const convertVueType = (type: string): VueType | undefined => {
  return VueTypeArray.indexOf(type as MathaleaVueType) < 0
    ? undefined
    : VueTypeArray[VueTypeArray.indexOf(type as MathaleaVueType)]
}
import type { View } from '../topmaths/types/navigation'
