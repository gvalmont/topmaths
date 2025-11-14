#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc)
#show: doc => normal(doc)

#slide()[
  #definition()[
    La #motDefini()[moyenne] d'une série de valeurs, #motDefini()[pondérée] par les effectifs, est le nombre obtenu :
    - en additionnant les produits de chaque valeur par son effectif,
    - puis en divisant cette somme par l'effectif total de la série.
  ]
]

#slide()[
  #set text(size: 22pt)
  #exemple()[
    Un sondage a été réalisé auprès de 10 000 collégiens pour connaître le nombre d'enfants présents dans leur foyer. Voici leurs réponses :
    #table(
      align: center,
      columns: 7,
      "Nombre d'enfants", [#rouge()[1]], [#rouge()[2]], [#rouge()[3]], [#rouge()[4]], [#rouge()[5]], [#rouge()[6]], "Nombre de familles", [3170], [4225], [1894], [436], [248], [27]
    )
    Calculer le nombre moyen d'enfants par foyer. Interpréter.

    #set text(couleurPrincipale)
    #uncover((2, 3))[
      #text(size: 21pt, [$(#rouge()[1] times 3170+#rouge()[2] times 4225+#rouge()[3] times 1894+#rouge()[4] times 436+#rouge()[5] times 248+#rouge()[6] times 27)/(3170+4225+1894+436+248+27) = 20448/10000 = 2,0448$])
      
      Le nombre moyen d'enfants par famille est de $2,0448$.
    ]

    #uncover(3)[
      Interprétation : Cela signifie qu’au total, il y a autant d’enfants que s’il y avait $2,0448$ enfant dans chaque famille.
    ]
  ]
]
