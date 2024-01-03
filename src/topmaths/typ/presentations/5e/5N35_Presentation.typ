#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc, titre: "Repérer un point dans le plan muni d’un repère orthogonal")

#slide()[
  #align(center, image("5N35-1.png"))
]

#slide()[
  #text(fill: couleurPrincipale)[
    #definitions()[
      Dans un repère du plan, chaque point est repéré par deux nombres relatifs qu’on appelle ses #noir()[coordonnées].\
      Le premier est l’#rouge()[abscisse], le second est l’#vert()[ordonnée].\
      On les note toujours dans cet ordre : #noir()[(#rouge()[abscisse] ; #vert()[ordonnée])]
    ]
  ]
]

#slide()[
  #text(fill: couleurPrincipale, size: 0.9em)[
    #exemple()[
      #show: normal
      #image("../../cours/objectifs/5e/5N35-1.png", width: 70%)
      #place(right, align(left)[L’#rouge()[abscisse] du point A est #uncover((beginning: 2))[#rouge()[2]]\
      L’#vert()[ordonnée] du point A est #uncover((beginning: 2))[#vert()[3]]\
      Les #noir()[coordonnées] du point A se notent #uncover((beginning: 2))[#noir()[(#rouge()[2] ; #vert()[3])]]\
      #uncover((beginning: 3))[
        Le point B a pour #noir()[coordonnées] #uncover((beginning: 4))[#noir()[(#rouge()[-3] ; #vert()[0])]]\
        Les #noir()[coordonnées] du point C sont #uncover((beginning: 4))[#noir()[(#rouge()[0] ; #vert()[-2])]]\
        D #uncover((beginning: 4))[#noir()[(#rouge()[-3] ; #vert()[-2])]]
      ]
      ], dx: 40%, dy: -100%)
      
    ]
  ]
]
