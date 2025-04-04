#definition()[
  #motDefini()[Factoriser], c'est transformer une somme ou une différence en un produit.
]
#proprietes()[
  $a$, $b$, $#rouge()[k]$ désignent des nombres relatifs.
  #grid(
    columns: 7,
    column-gutter: 0.5em,
    row-gutter: 0.5em,
    $#rouge()[k]a + #rouge()[k]b$, $=$, $#rouge()[k] (a + b)$, h(3em), $#rouge()[k]a – #rouge()[k]b$, $=$, $#rouge()[k] (a – b)$,
    "Somme", "", "Produit", "", "Différence", "", "Produit",
  )
]

#exemple(titre: "Exemple 1")[
  Factoriser $A = 9a + 30b$.

  #set text(couleurPrincipale)
  $A = 9a + 30b$\
  $A = #rouge()[$3 times$] 3a + #rouge()[$3 times$] 10$\
  $A = #rouge()[3] (3a + 10b)$\
]

#exemple(titre: "Exemple 2")[
  Factoriser $B = -35x - 40x^2$.

  #set text(couleurPrincipale)
  $B = -35x - 40x^2$\
  $B = #rouge()[$-5x times$] 7 + #rouge()[$(-5x) times$] 8x$\
  $B = #rouge()[$-5x$] (7 + 8x)$\
]
