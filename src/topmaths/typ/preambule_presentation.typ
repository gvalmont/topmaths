#import "@preview/polylux:0.3.1": *
#import "./components/outils.typ": *

#let mainColor = red

#let aColler(content, contentHeight) = {
  let watermark = "Photocopie"
  let watermarkColor = luma(150)
  content
  place(
    rect(
      width: 100%,
      height: contentHeight,
      fill: color.linear-rgb(100%, 100%, 100%, 70%),
      stroke: (
        paint: watermarkColor,
        thickness: 1pt,
        dash: "dashed"
      )
    ),
    dy: -contentHeight
  )
  place(
    block(
      width: 100%,
      height: contentHeight,
      align(
        horizon + center,
        text(watermarkColor,
          weight: "regular",
          watermark,
          size: 3em
        )
      )
    ),
    dy: -contentHeight
  )
}

#let titre(content) = {
  heading(content, level: 2)
  v(0.5em)
  align(right)[#line(stroke: 2pt + mainColor, length: 102%)]
}

#let slide(content) = {
  polylux-slide()[
    #content
  ]
}

#let title-slide(titre: "", sous-titre: "") = {
  polylux-slide()[
    #align(horizon + right)[
      #box(width: 80%)[
        #align(left)[
          #heading(titre)
          #align(right)[#line(stroke: 2pt + mainColor, length: 102%)]
          #sous-titre
        ]
      ]
    ]
  ]
}

#let presentation(titre: "", sous-titre: "", doc) = {
  set document(author: "Guillaume Valmont", title: titre)
  set text(font: "Source Sans Pro", weight: "light",lang: "fr", size: 25pt)
  show heading: it => text(upper(it), weight: "regular")
  show heading.where(level: 1): it => text(it, size: 40pt)
  show heading.where(level: 2): it => text(it, size: 30pt)
  show link: it => underline(text(it, mainColor))
  set page(paper: "presentation-16-9")

  if titre != "" {
    title-slide(titre: titre, sous-titre:sous-titre)
  }

  doc
}
