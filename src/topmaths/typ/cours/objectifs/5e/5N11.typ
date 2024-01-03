#definitions()[
  #show "somme": motDefini
  #show "différence": motDefini
  #show "produit": motDefini
  #show "quotient": motDefini
  #show "termes": motDefini
  #show "facteurs": motDefini
  #show "dividende": motDefini
  #show "diviseur": motDefini
  La somme est le résultat d’une #vert()[addition].\
  Les nombres qu’on additionne sont appelés les termes.\
  La différence est le résultat d’une #vert()[soustraction].\
  Les nombres qui interviennent dans une soustraction sont appelés les termes.\
  Le produit est le résultat d’une #vert()[multiplication].\
  Les nombres qu’on multiplie sont appelés les facteurs.\
  Le quotient est le résultat d’une #vert()[division].\
  Le nombre qui se fait diviser est appelé dividende et le nombre qui divise est appelé diviseur.
]

#exemples()[
  #let cell = rect.with(
    fill: white
  )
  #grid(columns: 2, rows: 2, cell()[#image("5N11-1.png")], cell()[#image("5N11-2.png")], cell()[#image("5N11-3.png")], cell()[#image("5N11-4.png")])
  #align(center)[
    Les images proviennent de #link("https://cleclasse.wordpress.com/2017/10/15/sens-et-vocabulaire-des-operations/#more-2260")[cleclasse.wordpress.com]
  ]
]