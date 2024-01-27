#methode()[
  Pour décomposer un nombre en un produit de facteurs premiers, on le divise autant que possible par des nombres premiers
]

#exemple()[
  Décomposer 1008 en produit de facteurs premiers.

  #set text(blue)
  $1008$ est divisible par $2$ car il se termine par $8$\
  $1008 div #rouge()[2] = #vert()[504]$ (qui est divisible par $2$ car il se termine par $4$)\
  $#vert()[504] div #rouge()[2] = #vert()[252]$ (qui est divisible par $2$ car il se termine par $2$)\
  $#vert()[252] div #rouge()[2] = #vert()[126]$ (qui est divisible par $2$ car il se termine par $6$)\
  $#vert()[126] div #rouge()[2] = #vert()[63]$ (qui n'est pas divisible par 2 mais l'est par $3$ car $6 + 3 = 9$ qui est divisible par $3$)\
  $#vert()[63] div #rouge()[3] = #vert()[21]$ (qui est divisible par $3$ car $2 + 1 = 3$ qui est divisible par $3$)\
  $#vert()[21] div #rouge()[3] = #vert()[7]$ (on s’arrête là car $7$ est un nombre premier)

  Si on refait les calculs dans l’autre sens, on obtient :\
  $#vert()[7] times #rouge()[3] times #rouge()[3] times #rouge()[2] times #rouge()[2] times #rouge()[2] times #rouge()[2] = 1008$

  $2$, $3$ et $7$ étant premiers, on a bien trouvé une décomposition en facteurs premiers de $1008$.
]

#remarque()[
  On peut aussi le rédiger autrement :
  #let c(t) = align(center)[#t]
  #let cr(t) = align(center, text(red)[#t])
  #place(line(end: (0em, 12em), stroke: blue + 0.8pt), dy:0.4em, dx:2.9em)
  #table(
    columns: 2,
    stroke: none,
    [#c(1008)], [#cr(2)],
    [#c(504)], [#cr(2)],
    [#c(252)], [#cr(2)],
    [#c(126)], [#cr(2)],
    [#c(63)], [#cr(2)],
    [#c(21)], [#cr(3)],
    [#c(7)], [#cr(7)],
    [#c(1)]
  )
]

#methode()[
  Pour décomposer un nombre en produit de facteurs premiers plus efficacement, on peut garder en tête (ou sur la calculatrice) les résultats intermédiaires et n’écrire que les facteurs premiers.
]

#exemple()[
  #set text(blue)
  #box(
    width: 50%,
    align(center, grid(
      columns: (6fr, 3fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr),
      row-gutter: 1em,
      [En tête :       ],[],[],[#vert()[1050]],[],[#vert()[525]],[],[#vert()[175]],[],[#vert()[35]],[],[],[],
      [Sur la feuille : #h(0.2em)],[$2100 =$],[$#rouge()[2]$],[$times$],[#rouge()[2]],[$times$],[#rouge()[3]],[$times$],[#rouge()[5]],[$times$],[#rouge()[5]],[$times$],[#rouge()[7]])
    )
  )
]