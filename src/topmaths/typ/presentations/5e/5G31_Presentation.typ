#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc, titre: "5G31 : Utiliser les propriétés des angles opposés par le sommet, supplémentaires, correspondants, alternes-internes")
#show: doc => normal(doc)

#set text(size: 18pt)

#slide()[
  #titre1(numero: 2)[Utiliser les propriétés des angles opposés par le sommet, supplémentaires, correspondants, alternes-internes]
  #titre2(numero: 1)[Reconnaître des angles de même mesure]
  #propriete()[
    Si deux droites parallèles sont coupées par une sécante, alors les angles correspondants qu'elles forment ont la même mesure.
    #aColler(implication(image("../../cours/objectifs/5e/5G31-1.png", height: 8em), image("../../cours/objectifs/5e/5G31-2.png", height: 8em)), 10em)
  ]
]

#slide()[
  #propriete()[
    Si deux droites parallèles sont coupées par une sécante, alors les angles alternes-internes qu'elles forment ont la même mesure.
    #aColler(implication(image("../../cours/objectifs/5e/5G31-1.png", height: 8em), image("../../cours/objectifs/5e/5G31-3.png", height: 8em)), 10em)
  ]
]

#slide()[
  #titre2(numero: 2)[Reconnaître des droites parallèles]
  #propriete()[
    Si deux droites coupées par une sécante forment deux angles correspondants de même mesure, alors ces droites sont parallèles.
    #aColler(implication(image("../../cours/objectifs/5e/5G31-2.png", height: 8em), image("../../cours/objectifs/5e/5G31-1.png", height: 8em)), 10em)
  ]
]
#slide()[
  #propriete()[
    Si deux droites coupées par une sécante forment deux angles alternes-internes de même mesure, alors ces droites sont parallèles.
    #aColler(implication(image("../../cours/objectifs/5e/5G31-3.png", height: 8em), image("../../cours/objectifs/5e/5G31-1.png", height: 8em)), 10em)
  ]
]

#slide()[
  #remarques()[
    On dit que ces propriétés sont les réciproques des propriétés énoncées au 1.\
    Les données et la conclusion d'une propriété et de sa réciproque sont échangées.
  ]
]