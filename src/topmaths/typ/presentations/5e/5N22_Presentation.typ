#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc, titre: "5N22 : Simplifier des fractions simples")
#set text(couleurPrincipale)

#slide()[
  #propriete()[
    $a$, $b$ et #rouge()[$k$] désignent trois nombres relatifs avec $b ≠ 0$ et $#rouge()[k] ≠ 0$.

    Comme $a/b = (a #rouge()[$times k$])/(b #rouge()[$times k$])$, alors $(a #rouge()[$times k$])/(b #rouge()[$times k$]) = a/b$
  ]

  #exemple()[
    #v(0.5em)
    $15/20 = (3 #rouge()[$times 5$])/(4 #rouge()[$times 5$]) = 3/4$
  ]
]
