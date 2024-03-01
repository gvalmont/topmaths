#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => normal(doc)
#show: doc => presentation(doc, titre: "6M12 : Calculer le périmètre et l'aire d'un triangle quelconque")

#slide()[
  #definitions()[
    La #rouge()[hauteur] du triangle $A B C$ issue de $A$ est la droite passant par le point $A$ et perpendiculaire à la droite $(B C)$.\
    Le segment $[B C]$ est alors appelé la #vert()[base] liée à cette hauteur.
  ]

  #exemples()[
    #block(width: 100%)[
      #align(center, grid(
        columns: 2,
        column-gutter: 3em,
        image("../../cours/objectifs/6e/6M12-1.png", height: 6em), image("../../cours/objectifs/6e/6M12-2.png", height: 6em)
      ))
    ]
  ]

  #propriete()[
    L’aire d’un triangle quelconque se calcule grâce à la formule $cal(A) = (#vert("b") times #rouge("h")) div 2$
  ]
]
