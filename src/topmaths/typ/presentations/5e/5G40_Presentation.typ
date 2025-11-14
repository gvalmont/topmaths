#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc)
#show: doc => normal(doc)

#slide()[
  #definition()[
    Un parallélogramme est un quadrilatère qui a ses côtés opposés parallèles.
    #place(dx: 6.5cm)[
      #block(height: 7em)[
        #align(horizon)[
          #rouge()[$ (A D) #h(0.2em) \/\/ #h(0.2em) (B C) $]
          $ (A B) #h(0.2em) \/\/ #h(0.2em) (C D) $
        ]
      ]
    ]
    #image("../../cours/objectifs/5e/5G40-1.png", height: 7em)
  ]
]

#slide()[
  #proprietes()[
    Si un quadrilatère est un parallélogramme, alors :
    - ses diagonales se coupent en leur milieu.
    - ses côtés opposés ont la même longueur.
    - ses angles opposés ont la même mesure.
    - deux angles consécutifs sont supplémentaires (leur somme est égale à 180°).
  ]
]