#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc)
#show: doc => normal(doc)

#slide()[
  #definition()[
    Une #motDefini()[grandeur] est quelque chose qu'on peut #vert()[compter] ou qu'on peut #vert()[mesurer] #noir()[(par exemple une durée, une masse, un volume, une distance, un nombre de stylos, ...)].\
    #uncover((beginning: 2))[Une #motDefini()[grandeur] est liée à une #vert()[unité] #noir()[(par exemple min, kg, litres, km, stylos, ...)].]
  ]
]

#slide()[
  #exemple()[
    Karole achète $3$ ananas à $2$ €.

    #uncover((beginning: 2))[
      #set text(couleurPrincipale)
      Les grandeurs sont :
      - le nombre d'ananas (l'unité est "ananas")
      - le prix (l'unité est €)
    ]
  ]
]
