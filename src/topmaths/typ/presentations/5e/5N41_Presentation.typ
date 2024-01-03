#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc, titre: "5N41 : Utiliser les critères de divisibilité par 2, 3, 5, 9, 10")
#show: doc => normal(doc)

#slide()[
  #proprietes()[
    Un nombre entier est divisible :
    - par #rouge()[2] lorsque son #noir()[chiffre des unités] est #vert()[0, 2, 4, 6 ou 8] ;
    - par #rouge()[5] lorsque son #noir()[chiffre des unités] est #vert()[0 ou 5] ;
    - par #rouge()[10] lorsque son #noir()[chiffre des unités] est #vert()[0].
  ]
  #proprietes()[
    Un nombre entier est divisible :
    - par #rouge()[3] lorsque la #noir()[somme de ses chiffres] est divisible par #vert()[3] ;
    - par #rouge()[9] lorsque la #noir()[somme de ses chiffres] est divisible par #vert()[9].
  ]
]
