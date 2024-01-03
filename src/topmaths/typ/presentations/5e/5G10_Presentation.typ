#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc, titre: "Séquence 8 : Symétrie centrale")
#show: doc => normal(doc)

#slide()[
  #set text(size: 20pt)
  #titrePrincipal()[Séquence 8 : Symétrie centrale]

  #definition()[
    Deux figures sont #motDefini()[symétriques par rapport à un point] lorsque les deux figures se superposent en effectuant un demi-tour autour de ce point. Ce point est le #motDefini()[centre de symétrie].
  ]

  #exemple()[
    #image("../../cours/objectifs/5e/5G10-1.png", height: 4em)
    Les figures (F) et (F') sont symétriques par rapport au point O.\
    O est le centre de symétrie.
  ]
]

#slide()[
  #exemple()[
    Transformer le point A par la symétrie de centre O.
    #normal()[
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
  ]
]
