#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc)
#show: doc => normal(doc)

#slide()[
  #remarques()[
    On dit "l'image" car un nombre ne peut avoir qu'une seule image mais on dit "un antécédent" car un même nombre peut avoir plusieurs antécédents.
  ]

  #exemple()[
    $f : x -> x^2$\

    $f(5) = 5^2 = 25$ et $f(–5) = (-5)^2 = 25$\
    $25$ a donc deux antécédents par la fonction $f$ qui sont $5$ et $–5$.
  ]
]
