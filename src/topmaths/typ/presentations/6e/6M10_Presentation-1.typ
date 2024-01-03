#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc, titre: "6M10 : Calculer le périmètre et l'aire d'un carré, d'un rectangle et d'un triangle rectangle")
#set text(couleurPrincipale, size: 20pt)
#slide()[
  #align(center + horizon, image("../../photocopies/6e/6M10-1.png", width: 50%))
]
#slide()[
  #align(center + horizon, image("../../cours/objectifs/6e/6M10-1.png", width: 50%))
]
#slide()[
  #align(center + horizon, image("6M10-1.png", width: 50%))
]
#slide()[
  #titre1(numero: 1)[Définitions]

  #definition()[
    Le #uncover(2)[#motDefini()[périmètre]] d'une figure est la longueur de son contour.
  ]

  #exemple()[
    Le #uncover(2)[#rouge()[périmètre]] de cette figure est la longueur en #rouge()[rouge].
    #image("../../cours/objectifs/6e/6M10-1.png", height: 8em)
  ]
]

#slide()[
  #definition()[
    L'#uncover(2)[#motDefini()[aire]] d'une figure est la mesure de la surface à l'intérieur de son contour.
  ]

  #exemple()[
    L'#uncover(2)[#vert()[aire]] de cette figure est la mesure de la surface #vert()[verte].
    #image("../../cours/objectifs/6e/6M10-2.png", height: 8em)
  ]
]

#slide()[
  #align(center + horizon, image("6M10-2.png", width: 50%))
]

#exemple()[
  Calculer le périmètre et l'aire de la figure ci-dessous :
  #set text(couleurPrincipale)

  #place(left, dx: 35%, dy: 1em)[
    #block(width: 65%)[
      Pour calculer le #rouge()[périmètre] d'une figure, on fait le tour de la figure en additionnant toutes les longueurs rencontrées :

      #rouge()[Périmètre] = 2 cm + 1 cm + 3 cm + 2 cm + 5 cm + 3 cm\
      #rouge()[Périmètre] = 16 cm
    ]
  ]
  #image("../../cours/objectifs/6e/6M10-3.png", width: 35%)
  Pour calculer l'#vert()[aire] d'une figure, on compte combien de carrés on a besoin pour la remplir :

  Cette figure est constituée de 12 carrés de 1 centimètre de côté, on peut donc dire qu'elle a une aire de 12 centimètres carrés. En mathématiques, on le note :\
  #vert()[Aire] = 12 cm²
]
