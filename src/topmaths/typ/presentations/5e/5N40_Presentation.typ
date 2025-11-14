#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc)
#show: doc => normal(doc)

#slide()[
  #vocabulaire()[
    On a : 38 = 2 $times$ 19 + 0.\
    Le reste de la division euclidienne de 38 par 2 est égal à zéro.\
    On peut ainsi dire que :
    - 38 est un #uncover(2)[#motDefini()[multiple]] de 2
    - 38 est #uncover(2)[#motDefini()[divisible]] par 2
    - 2 est un #uncover(2)[#motDefini()[diviseur]] de 38
  ]
]

#slide()[
  #remarques()[
    Quand #vert()[on multiplie] un nombre, on obtient #noir()[un #uncover((2, 3))[multiple]].\
    Si un nombre #vert()[divise] entièrement (sans laisser de reste), c'est #noir()[un #uncover((2, 3))[diviseur]].
  ]

  #definitions()[
    Les nombres entiers divisibles par 2 sont appelés #motDefini()[nombres #uncover(3)[pairs]].\
    Les nombres entiers qui ne sont pas divisibles par 2 sont appelés #motDefini()[nombres #uncover(3)[impairs]].
  ]
]
