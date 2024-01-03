#import "../../preambule_photocopies.typ": * 
#show: doc => photocopies(doc, paysage: true, nbCols: 2)

#let enonce = [
  Transformer le point A par la symétrie de centre O.
  #align(horizon + center)[
    #grid(columns: 2, column-gutter: 3em, row-gutter: 1em)[
      #image("../../cours/objectifs/5e/5G10-2.png")
    ][
      #image("../../cours/objectifs/5e/5G10-3.png")
    ][
      1. On trace la demi-droite qui passe par le centre de symétrie et on prolonge
    ][
      2. On reporte la distance entre le point A et le centre de symétrie
    ]
  ]
]

#for i in range(6) {
  enonce
  v(1.5em)
}