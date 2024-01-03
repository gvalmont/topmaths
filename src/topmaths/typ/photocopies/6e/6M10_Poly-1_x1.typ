#import "../../preambule_sequence.typ": * 
#show: doc => sequence(doc, title: "Séquence 8 : Périmètres et aires 1")

= Calculer le périmètre et l'aire d'un carré, d'un rectangle et d'un triangle rectangle
== Définitions

#definition()[
  Le #blanc()[périmètre] d'une figure est la longueur de son contour.
]

#exemple()[
  Le #blanc()[périmètre] de cette figure est la longueur en #blanc()[rouge].
  #image("6M10-1.png", height: 8em)
]

#definition()[
  L'#blanc()[aire] d'une figure est la mesure de la surface à l'intérieur de son contour.
]

#exemple()[
  L'#blanc()[aire] de cette figure est la mesure de la surface #blanc()[verte].
  #image("6M10-1.png", height: 8em)
]

#exemple()[
  Calculer le périmètre et l'aire de la figure ci-dessous :
  #set text(couleurPrincipale)

  #place(left, dx: 35%, dy: 1em)[
    #block(width: 65%)[
      Pour calculer le #blanc()[périmètre] d'une figure, on fait le tour de la figure en additionnant toutes les longueurs rencontrées :

      #blanc()[Périmètre] = 2 cm + 1 cm + 3 cm + 2 cm + 5 cm + 3 cm\
      #blanc()[Périmètre] = 16 cm
    ]
  ]
  #image("6M10-2.png", width: 35%)
  Pour calculer l'#blanc()[aire] d'une figure, on compte combien de carrés on a besoin pour la remplir :

  Cette figure est constituée de 12 carrés de 1 centimètre de côté, on peut donc dire qu'elle a une aire de 12 centimètres carrés. En mathématiques, on le note :\
  #blanc()[Aire] = 12 cm²
]
