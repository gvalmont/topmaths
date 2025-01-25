#propriete()[
  $a$, $b$, $c$ désignent des nombres.\
  Si $a = b$, alors $a #rouge()[\+ c] = b #rouge()[\+ c]$.\
  Si $a = b$, alors $a #rouge()[$minus c$] = b #rouge()[$minus c$]$.
]

#exemple()[
  #grid(
    columns: 4,
    row-gutter: 1em,
    column-gutter: 1em,
    align: center,
    [Si $x$ est un nombre tel que], align(left)[$x - 8$], $=$, align(left)[$4$],
    align(right)[alors], $x - 8 #rouge()[\+ 8]$, $=$, $4 #rouge()[\+ 8]$,
    align(right)[donc], $x$, $=$, $12$
  )
]

#propriete()[
  $a$, $b$, $c$ désignent des nombres avec $c eq.not 0$.\
  Si $a = b$, alors $a #rouge()[$times c$] = b #rouge()[$times c$]$.\
  Si $a = b$, alors $#rouge()[#normal()[a] $div c$] = #rouge()[#normal()[b] $div c$]$.
]

#exemple()[
  #grid(
    columns: 4,
    row-gutter: 1em,
    column-gutter: 1em,
    align: center,
    [Si $x$ est un nombre tel que], align(left)[$3x$], $=$, align(left)[$12$],
    align(right)[alors], $3x #rouge()[$div 3$]$, $=$, $12 #rouge()[$div 3$]$,
    align(right)[donc], $x$, $=$, $4$
  )
]

#methode(titre: "Méthode de résolution d'une équation du type ax + b = cx + d")[
  + On regroupe les termes "en $x$" dans le membre de gauche ($+$ ou $–$)
  + On regroupe les termes "sans $x$" dans le membre de droite ($+$ ou $–$)
  + On isole $x$ ($times$ ou $div$)
]


#exemple()[
  #grid(
    columns: 4,
    row-gutter: 1em,
    column-gutter: 1em,
    align: center,
    [Résolution de l'équation], align(left)[$5x - 4$], $=$, align(left)[$3x + 2$],
    align(right)[On regroupe les termes "en $x$" à gauche], $5x - 4 #rouge()[$minus 3x$]$, $=$, $3x + 2 #rouge()[$minus 3x$]$,
    align(right)[On regroupe les termes "sans $x$" à droite], $2x - 4 #rouge()[$+ 4$]$, $=$, $2 #rouge()[$+ 4$]$,
    align(right)[On isole $x$], rouge()[$#noir()[$2x$]/2$], $=$, rouge()[$#noir()[$6$]/2$],
    align(right)[donc], $x$, $=$, $3$
  )
  $3$ est solution de l'équation.
]