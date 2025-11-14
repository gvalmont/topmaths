#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc)
#show: doc => normal(doc)

#slide()[
  #propriete()[
    Si #rouge()[un point appartient à la médiatrice d'un segment], alors #vert()[il est équidistant] (= à la même distance) #vert()[des deux extrémités de ce segment].
  ]

  #exemple()[
    #implication(
      [Le point C #rouge()[appartient à la médiatrice] du segment [AB].#image("../../cours/objectifs/6e/6G3A-2.png", height: 8em)],
      [Le point C est #vert()[équidistant] de A et de B.#image("../../cours/objectifs/6e/6G3A-3.png", height: 8em)],
    )
  ]
]

#slide()[
  #propriete()[
    Si #vert()[un point est équidistant] des deux extrémités d'un segment, alors #rouge()[il appartient à la médiatrice de ce segment].
  ]

  #exemple()[
    #implication(
      [Le point C est #vert()[équidistant] de A et de B.#image("../../cours/objectifs/6e/6G3A-4.png", height: 8em)],
      [Le point C #rouge()[appartient à la médiatrice] du segment [AB].#image("../../cours/objectifs/6e/6G3A-5.png", height: 8em)],
    )
  ]
]
