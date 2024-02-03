#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc, titre: "6P13 : Appliquer un pourcentage")

#set text(couleurPrincipale)

#slide()[
  #methode()[
    Pour calculer un pourcentage d'une quantité :
    + On calcule $1 %$ de cette quantité
    + On multiplie par le nombre de pourcents désiré
  ]
]

#slide()[
  #exemple()[
    Dans un quatre-quarts de $600 g$, il y a $25 %$ de beurre.\
    Quelle est la quantité de beurre contenue dans ce quatre quarts ?

    #set text(couleurPrincipale)
    #uncover(2)[
      $(600 g)/100 = 6 g$ donc $1 %$ de $600 g$ c'est $6 g$.

      $25 times 6 g = 150 g$

      Ce quatre-quarts contient $150 g$ de beurre.
    ]
  ]
]
