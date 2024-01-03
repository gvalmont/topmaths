#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc, titre: "5N20 : Reconnaître et produire des fractions égales")
#show: doc => normal(doc)

#slide()[
  #set text(size: 20pt)
  #titrePrincipal()[Séquence 11 : Fractions 1]
  #proprietes()[
    #box()[
      $ a/b = (a #rouge()[$times k$])/(b #rouge()[$times k$]) $
    ]
    #h(1em)
    #box(height: 1.5em)[et]
    #h(1em)
    #box()[
      $ a/b = (a #rouge()[$div k$])/(b #rouge()[$div k$]) $
    ]
  ]

  #exemples()[
    #block()[
      $ 3/4 = (...)/(...) = (...)/20 $
    ]
    #block()[
      $ (-56)/64 = (...)/(...) = (...)/8 $
    ]
  ]
]

#slide()[
  #set text(size: 20pt)
  #titrePrincipal()[Séquence 11 : Fractions 1]
  #proprietes()[
    #box()[
      $ a/b = (a #rouge()[$times k$])/(b #rouge()[$times k$]) $
    ]
    #h(1em)
    #box(height: 1.5em)[et]
    #h(1em)
    #box()[
      $ a/b = (a #rouge()[$div k$])/(b #rouge()[$div k$]) $
    ]
  ]

  #exemples()[
    #block()[
      $ 3/4 = (3 #rouge()[$times 5$])/(4 #rouge()[$times 5$]) = 15/20 $
    ]
    #block()[
      $ (-56)/64 = (-56 #rouge()[$div 8$])/(64 #rouge()[$div 8$]) = (-7)/8 $
    ]
  ]
]

