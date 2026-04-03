const EXERCISE_PARAM_KEYS = new Set([
  'uuid',
  'id',
  'n',
  'd',
  's',
  's2',
  's3',
  's4',
  's5',
  'qcm',
  'alea',
  'cols',
  'i',
  'cd',
  'o',
  'u',
])

function isExerciseStart(key, previousEntryWasUuid) {
  return key === 'uuid' || (key === 'id' && !previousEntryWasUuid)
}

function normalizeExerciseEntries(entries, interactiveValue) {
  const normalizedEntries = entries.filter(([key]) => key !== 'i')
  normalizedEntries.push(['i', interactiveValue])
  return normalizedEntries
}

export function normalizeExerciseInteractivity(
  link,
  interactiveValue,
  forceValue = false,
) {
  const isAbsoluteUrl = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(link)
  const url = isAbsoluteUrl
    ? new URL(link)
    : new URL(`?${link.replace(/^\?/, '')}`, 'https://topmaths.fr/')
  const entries = Array.from(url.searchParams.entries())
  const normalizedEntries = []
  let currentExerciseEntries = []
  let previousEntryWasUuid = false

  function flushCurrentExercise() {
    if (currentExerciseEntries.length === 0) return
    const hasInteractivity = currentExerciseEntries.some(([key]) => key === 'i')
    const shouldNormalize = forceValue || !hasInteractivity
    normalizedEntries.push(
      ...(shouldNormalize
        ? normalizeExerciseEntries(currentExerciseEntries, interactiveValue)
        : currentExerciseEntries),
    )
    currentExerciseEntries = []
  }

  for (const entry of entries) {
    const [key] = entry
    if (isExerciseStart(key, previousEntryWasUuid)) {
      flushCurrentExercise()
      currentExerciseEntries.push(entry)
    } else if (currentExerciseEntries.length > 0 && EXERCISE_PARAM_KEYS.has(key)) {
      currentExerciseEntries.push(entry)
    } else {
      flushCurrentExercise()
      normalizedEntries.push(entry)
    }
    previousEntryWasUuid = key === 'uuid'
  }
  flushCurrentExercise()

  url.search = ''
  for (const [key, value] of normalizedEntries) {
    url.searchParams.append(key, value)
  }
  return isAbsoluteUrl ? url.toString() : url.search.replace(/^\?/, '')
}
