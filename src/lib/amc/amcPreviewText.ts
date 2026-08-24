/**
 * Convertit les séparateurs de texte LaTeX en HTML sans toucher au contenu
 * mathématique. Les `\\` de `array`, `aligned`, matrices, etc. doivent parvenir
 * intacts à KaTeX.
 */
export function latexLineBreaksToHtmlOutsideMath(source: string): string {
  let result = ''
  let index = 0
  let mathDelimiter: '$' | '\\[' | null = null

  while (index < source.length) {
    if (mathDelimiter === '$') {
      const char = source[index]
      result += char
      index++
      if (char === '$' && source[index - 2] !== '\\') mathDelimiter = null
      continue
    }

    if (mathDelimiter === '\\[') {
      if (source.startsWith('\\]', index)) {
        result += '\\]'
        index += 2
        mathDelimiter = null
      } else {
        result += source[index]
        index++
      }
      continue
    }

    if (source[index] === '$' && source[index - 1] !== '\\') {
      mathDelimiter = '$'
      result += '$'
      index++
      continue
    }
    if (source.startsWith('\\[', index)) {
      mathDelimiter = '\\['
      result += '\\['
      index += 2
      continue
    }
    if (source.startsWith('\\\\', index)) {
      result += '<br>'
      index += 2
      continue
    }
    if (source.startsWith('\\medskip', index)) {
      result += '<br><br>'
      index += '\\medskip'.length
      continue
    }
    if (source.startsWith('\n\n', index)) {
      result += '<br>'
      index += 2
      continue
    }

    result += source[index]
    index++
  }

  return result
}
