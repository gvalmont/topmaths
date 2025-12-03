/*
Code inspiré de Sylvain, merci!
https://stackoverflow.com/questions/55020193/is-it-possible-to-create-a-typescript-type-from-an-array
*/
const VueTypeArray = <const>[
  'alacarte',
  'diaporama',
  'can',
  'eleve',
  'latex',
  'pdf',
  'confeleve',
  'amc',
  'anki',
  'moodle',
  'l',
  'l2',
  'overview',
  'myriade',
  'indices',
  '',
]
type VueTypeArrayType = typeof VueTypeArray
export type VueType = VueTypeArrayType[number] // equiv to diaporama' | 'can' | 'eleve' | 'latex' | 'confeleve' | 'amc' | 'anki' | 'moodle' | 'l' | 'l2' | 'overview'

// export type VueType = 'diaporama' | 'can' | 'eleve' | 'latex' | 'confeleve' | 'amc' | 'anki' | 'moodle' | 'l' | 'l2' | 'overview'

export const convertVueType = (type: string): VueType | undefined => {
  return VueTypeArray.indexOf(type as VueType) < 0
    ? undefined
    : VueTypeArray[VueTypeArray.indexOf(type as VueType)]
}
