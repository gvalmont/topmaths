#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc)
#show: doc => normal(doc)

#slide()[
  #remarque()[
    Un cercle est vide à l’intérieur (on dit qu’il est creux) alors qu’un disque est rempli (on dit qu’il est plein)
    #set text(black)

    #box()[
      #circle(radius: 2em, stroke: gray)
      #align(center)[Cercle]
    ]
    #h(2em)
    #box()[
      #circle(radius: 2em, fill: gray)
      #align(center)[Disque]
    ]
  ]
]

#slide()[
  #proprietes()[
    $"Périmètre d’un cercle" = 2 times π times "rayon"$\
    $"Aire d’un disque" = π times "rayon" times "rayon"$
  ]
]
