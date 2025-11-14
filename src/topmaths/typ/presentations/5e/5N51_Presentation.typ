#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc)
#show: doc => normal(doc)

#slide()[
  #propriete()[
    $a$ et $b$ désignent des nombres.\
    $a #vert("x") + b #vert("x") = (a + b)#vert("x")$
  ]
  #exemple()[
    $C = 2#vert("x") + 3#rouge("x")$\
    $C = #vert("x") + #vert("x") + #rouge("x") + #rouge("x") + #rouge("x")$ \
    $C = 5x$
  ]
]
