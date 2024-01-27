#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc, titre: "6S11 : Recueillir et organiser des données")

#slide()[
  On a demandé à 10 personnes leur parfum de glace préféré, voici leurs réponses : fraise • mangue • vanille • vanille • chocolat • fraise • vanille • passion • fraise • chocolat.

  Résumer leurs réponses dans un tableau.

  #show: doc => normal(doc)
  #only(2)[
    #align(center, table(
      columns: 5,
      inset: 0.5em,
      [fraise], [mangue], [vanille], [chocolat], [passion],
      [3], [1], [3], [2], [1]
    ))
  ]
]
#let triangle(color) = {
  polygon.regular(
  fill: color,
  size: 66pt,
  vertices: 3,
)

}
#slide()[
  #align(center, grid(
    columns: 11,
    column-gutter: 0.5em,
    row-gutter: 0.5em,
    [#circle(radius: 25pt, fill: red)], [#circle(radius: 25pt, fill: blue)], [#square(size: 50pt, fill: blue)],
    [#triangle(blue)], [#triangle(green)], [#circle(radius: 25pt, fill: red)], [#square(size: 50pt, fill: green)],
    [#square(size: 50pt, fill: blue)], [#circle(radius: 25pt, fill: red)], [#circle(radius: 25pt, fill: green)],
    [#square(size: 50pt, fill: green)]
  ))

  Construire un tableau indiquant le nombre de symboles selon leur forme et leur couleur.

  #show: doc => normal(doc)
  #only(2)[
    #align(center, table(
      columns: 4,
      inset: 0.5em,
      [        ], [Rouge], [Vert], [Bleu],
      [Triangle],   [0]  ,   [1] ,   [1] ,
      [Disque  ],   [3]  ,   [1] ,   [1] ,
      [Carré   ],   [0]  ,   [2] ,   [2]
    ))
  ]
]