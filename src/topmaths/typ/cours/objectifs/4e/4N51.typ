#definition()[
  #motDefini()[Développer], c'est transformer un #vert()[produit] en une #vert()[somme] (ou une différence).
]

#proprietes()[
  #show "k": rouge
  $a$, $b$ et $k$ désignent des nombres relatifs.\
  #grid(columns: 7, column-gutter: 0.2em, row-gutter: 1em, align: center,
  $k(a + b)$, $=$, $k a + k b$, h(2em), $k(a – b)$, $=$, $k a – k b$,
  "Produit", [], "Somme", [], "Produit", [], "Différence")
]

#exemples()[
  #show "3": rouge
  #grid(columns: 3, column-gutter: 1em, row-gutter: 1em, align: center,
  $3(2a + 5)$, $=$, $3 times 2a + 3 times 5$,
  [], $=$, $6a + 15$,
  [], [], [],
  $3(2 - 5a)$, $=$, $3 times 2 - 3 times 5a$,
  [], $=$, $6 - 15a$,
  )
]