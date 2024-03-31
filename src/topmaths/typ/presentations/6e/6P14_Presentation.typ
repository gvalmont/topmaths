#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc, titre: "6P14 : Reproduire une figure en respectant une échelle donnée")
#show: doc => normal(doc)

#slide()[
  #titre1(numero: 1)[Reproduire une figure en respectant une échelle donnée]
  #set text(size: 22pt)
  #definitions()[
    Lorsqu’on multiplie toutes les longueurs d’une figure ou d’un solide par un nombre #vert()[$k > 1$], on dit qu’on en fait un #motDefini()[agrandissement de rapport $k$].\
    Lorsqu’on multiplie toutes les longueurs d’une figure ou d’un solide par un nombre #vert()[$0 < k < 1$], on dit qu'on fait une #motDefini()[réduction de rapport $k$].
  ]
]

#slide()[
  #exemple()[
    #image("../../cours/objectifs/6e/6P14-1.png", width: 100%)
  ]
]