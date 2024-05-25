#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc)
#show: doc => normal(doc)

#slide()[
  #remarque()[
    Une même probabilité peut s'exprimer de différentes façons.
  ]

  #exemple()[
    Si on lance une pièce, il y a une chance sur deux de tomber sur face.\
    On peut dire que la probabilité de tomber sur face est #uncover(2)[$1/2$], #uncover(2)[$50 %$] ou encore #uncover(2)[$0$,$5$]
  ]
]

#slide()[
  #proprietes()[
    La probabilité d’un événement est (toujours) un nombre compris entre #uncover((beginning: 2))[0 et 1.]\
    #uncover((beginning: 3))[La somme des probabilités de toutes les issues est égale à #uncover((beginning: 4))[1.]]\
    #uncover((beginning: 5))[La probabilité d’un événement est la somme des probabilités des issues qui réalisent cet événement.]\
    #uncover((beginning: 6))[La probabilité d’un événement impossible est #uncover((beginning: 7))[0.]]\
    #uncover((beginning: 8))[La probabilité d’un événement certain est #uncover((beginning: 9))[1.]]
  ]
]