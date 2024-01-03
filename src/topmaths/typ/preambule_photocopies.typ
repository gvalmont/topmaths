#import "./components/outils.typ": *

#let photocopies(body, paysage: false, nbCols: 1, marge: 1cm) = {
  set document(author: "Guillaume Valmont")
  set text(font: "Source Sans Pro", weight: "medium",lang: "fr", hyphenate: false)
  set page(flipped: paysage, margin: marge)
  set figure(supplement: none, numbering: none)
  set table(stroke: 0.5pt)
  set math.mat(delim: none)
  columns(nbCols, gutter: 1cm)[
    #body
  ]
}
