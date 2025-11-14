#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc)
#show: doc => normal(doc)

#set text(size: 21pt)
#slide()[
  #proprietes()[
    n désigne un nombre entier.\
    Les nombres pairs sont les nombres de la forme $2n$.\
    Les nombres impairs sont les nombres de la forme $2n + 1$.
  ]
]

#slide()[
  #exemple(titre: "Exemple 1")[
    Montrer que la somme de deux entiers consécutifs est impaire.

    #set text(couleurPrincipale)
    #uncover((2, 3))[
      $n$ désigne un nombre entier.\
      Le nombre suivant est donc $n + 1$.\
      $n$ et $n + 1$ désignent donc deux entiers consécutifs.\
      Calculons leur somme : $n + (n + 1) = n + n + 1 = 2n + 1$
    ]
    #uncover(3)[
      #grid(
        columns: 3,
        column-gutter: 0.5em,
        row-gutter: 0.7em,
        [#align(center)[Je sais que]], [:], [La somme de deux entiers consécutifs est de la forme $2n + 1$.],
        [#align(center, [Propriété])], [:], [Or, les nombres impairs sont les nombres de la forme $2n + 1$.],
        [#align(center, [Conclusion])], [:], [La somme de deux entiers consécutifs est donc un nombre impair.]
      )
    ]
  ]
]

#slide()[
  #exemple(titre: "Exemple 2")[
    Montrer que la somme de trois entiers consécutifs est un multiple de $3$.

    #set text(couleurPrincipale)
    #uncover((2, 3))[
      $n$ désigne un nombre entier.\
      Les entiers qui le suivent sont $n + 1$ et $n + 2$.\
      Calculons leur somme : $n + (n + 1) + (n + 2) = n + n + 1 + n + 2 = 3n + 3$
    ]

    #uncover(3)[
      $3n$ désigne le triple d’un nombre, c’est donc un multiple de $3$.\
      Si on ajoute $3$ à un multiple de $3$ on obtient un autre multiple de $3$ (parce que les multiples de $3$ vont « de $3$ en $3$ »).\
      La somme de trois entiers consécutifs est donc un multiple de $3$.
    ]
  ]
]

#slide()[
  #exemple(titre: "Exemple 3")[
    Montrer que la somme de quatre entiers consécutifs est un nombre pair.

    #set text(couleurPrincipale)
    #uncover((2, 3))[
      $n$ désigne un nombre entier.\
      Les entiers qui le suivent sont $n + 1$, $n + 2$ et $n + 3$.\
      Calculons leur somme :\
      $n + (n + 1) + (n + 2) + (n + 3) = n + n + 1 + n + 2 + n + 3 = 4 n + 6$
    ]

    #uncover(3)[
      $4 n = 2 times 2 n$\
      On peut écrire $4 n$ comme $2 times$ un nombre entier donc $4 n$ est un nombre pair.

      $6$ est aussi un nombre pair.

      $4 n + 6$ est donc la somme de deux nombres pairs, c'est donc aussi un nombre pair.
    ]
  ]
]
