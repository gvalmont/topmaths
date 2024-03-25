#proprietes()[
  Les nombres pairs sont les nombres de la forme $2n$.\
  Les nombres impairs sont les nombres de la forme $2n + 1$.
]

#exemple(titre: "Exemple 1")[
  Montrer que la somme de deux entiers consécutifs est impaire.

  #set text(couleurPrincipale)
  $n$ désigne un nombre entier.\
  Le nombre suivant est donc $n + 1$.\
  $n$ et $n + 1$ désignent donc deux entiers consécutifs.\
  Calculons leur somme : $n + (n + 1) = n + n + 1 = 2n + 1$

  #grid(
    columns: 3,
    column-gutter: 0.5em,
    row-gutter: 0.7em,
    [#align(center)[Je sais que]], [:], [La somme de deux entiers consécutifs est de la forme $2n + 1$.],
    [#align(center, [Propriété])], [:], [Or, les nombres impairs sont les nombres de la forme $2n + 1$.],
    [#align(center, [Conclusion])], [:], [La somme de deux entiers consécutifs est donc un nombre impair.]
  )
]

#exemple(titre: "Exemple 2")[
  Montrer que la somme de trois entiers consécutifs est un multiple de $3$.

  #set text(couleurPrincipale)
  $n$ désigne un nombre entier.\
  Les entiers qui le suivent sont $n + 1$ et $n + 2$.\
  Calculons leur somme : $n + (n + 1) + (n + 2) = n + n + 1 + n + 2 = 3n + 3$

  $3n$ désigne le triple d’un nombre, c’est donc un multiple de $3$.\
  Si on ajoute $3$ à un multiple de $3$ on obtient un autre multiple de $3$ (parce que les multiples de $3$ vont « de $3$ en $3$ »).\
  La somme de trois entiers consécutifs est donc un multiple de $3$.
]