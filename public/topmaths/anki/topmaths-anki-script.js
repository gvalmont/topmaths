function linkUpdate (rawTitle) {
  try {
    const title = cleanseTitle(rawTitle)
    const reference = title.trim().split(' ')[0]
    if (isValid(reference)) {
      const linkContainerDiv = document.getElementById('topmaths-link-container')
      if (linkContainerDiv !== null) {
        linkContainerDiv.innerHTML = `<a href="https://topmaths.fr/?v=objectif&ref=${reference}">${title}</a>`
      }
    }
  } catch (error) {
    console.log(error)
  }
}

function isValid (str) {
  const pattern = /^[3-6][A-Z]\d{2}$/
  return pattern.test(str)
}

function cleanseTitle (urlFieldRaw) {
  const urlField = urlFieldRaw.slice(16, urlFieldRaw.length - 4).trim()
  if (urlField.charAt(0) === '<') {
    const urlBeginningIndex = urlField.indexOf('>') + 1
    const urlEndingIndex = urlField.indexOf('</h1>')
    return urlField.slice(urlBeginningIndex, urlEndingIndex).replace(/&amp;/g, '&')
  }
  return urlField.replace(/&amp;/g, '&')
}
