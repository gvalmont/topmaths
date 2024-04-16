#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc, titre: "6M15 : Calculer le volume d’un cube ou d’un pavé droit")
#show: doc => normal(doc)

#slide()[
  #titrePrincipal()[Séquence 26 : Volumes]
  
  #definition()[
    Le #motDefini()[volume] d'un solide est la mesure de l'espace occupé par ce solide.
  ]
]

#slide()[
  #set text(size: 20pt)
  #exemple()[
    Calculer le volume du solide suivant :

    #box(width: 30%)[
      #image("../../cours/objectifs/6e/6M15-3.png", width: 10em)
    ]
    #box(width: 69%)[
    #set text(couleurPrincipale)
      #uncover((beginning: 2))[
        On remarque qu'il est constitué de plusieurs cubes d'arête $1 "cm"$ :
      ]
      #uncover((beginning: 3))[
        - Il est constitué de $6$ couches
        - Chaque couche contient $3$ lignes
        - Chaque ligne contient $4$ cubes
      ]

      #uncover((beginning: 4))[
        Une couche contient alors $3 "lignes" times 4 "cubes" = 12 "cubes"$.\
        Ce solide contient alors $6 "couches" times 12 "cubes" = 72 "cubes"$.
      ]

      #uncover((beginning: 5))[
        Comme ce solide est constitué de $72$ cubes d'arête $1 "cm"$,\
        on dit qu'il a un volume de $72 "cm" ^3$ ($72$ centimètres cubes)
      ]
    ]
  ]
]