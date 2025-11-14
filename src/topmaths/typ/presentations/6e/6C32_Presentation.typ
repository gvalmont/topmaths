#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc)
#show: doc => normal(doc)

#slide()[
  #regle()[
    Pour faire un calcul lorsqu'il y a des additions, des soustractions et des multipliations, on fait #rouge()[d'abord les multiplications].\
    On dit que les multiplications sont #rouge()[prioritaires].
  ]

  #uncover((beginning: 2))[
    #exemples()[
      $3 + 8 times 2 = #uncover((beginning: 3))[19]$\
      $3 times 5 + 2 = #uncover((beginning: 4))[17]$\
      $2 times 3 + 4 times 5 = #uncover((beginning: 5))[26]$
    ]
  ]
]
