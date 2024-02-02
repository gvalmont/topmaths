#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc, titre: "6G14 : Déterminer la distance d'un point à une droite")
#show: doc => normal(doc)

#slide()[
  #definition()[
    La #motDefini()[distance d'un point à une droite] est la plus courte distance séparant ce point de la droite.
  ]
]

#slide()[
  #aColler([
    #exemple()[
      Détermine la distance du point $A$ à la droite $(d)$
      #image("../../cours/objectifs/6e/6G14-1.png", height: 5em)
    ]
  ], 10em)
  #uncover(2)[
    #show: normal
    La distance du point $A$ à la droite $(d)$ est la mesure du segment $[A B]$.\
    C'est-à-dire …… cm.
  ]
]