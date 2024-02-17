#propriete()[
  Un quotient ne change pas si on multiplie ou divise son numérateur et son dénominateur par un même nombre non nul (non nul = différent de zéro).

  a, b et #rouge()[k] désignent trois nombres relatifs avec b ≠ 0 et #rouge()[k] ≠ 0.\
  $a/b = fractionMultiplieParFacteur(a, b, k)$ et $a/b = fractionDiviseParFacteur(a, b, k)$
]

#exemples()[
  #v(0.5em)
  $5/3 = fractionMultiplieParFacteur(5, 3, 4) = 20/12$

  $-56/64 = fractionDiviseParFacteur(-56, 64, 8) = -7/8$
]

#definition()[
  #motDefini()[Simplifier] une fraction, c’est écrire une fraction qui lui est égale mais avec un numérateur et un dénominateur plus petits.
]

#exemple()[
  Simplifier $63/75$.

  #set text(couleurPrincipale)
  $63$ et $75$ sont divisibles par $3$.
  On peut donc écrire $63/75 = fractionDiviseParFacteur(63, 75, 3) = 21/25$.
]

#definition()[
  $a$ et $b$ désignent deux entiers relatifs avec $b ≠ 0$.
  On dit que la fraction $a/b$ est #rouge()[irréductible] si le seul diviseur positif commun à $a$ et $b$ est égal à 1.
]

#exemple()[
  #v(0.5em)
  $5/8$ est une fraction irréductible car le seul diviseur positif commun à $5$ et $8$ est $1$.
]

#methode()[
  Pour rendre une fraction irréductible, on peut, au choix :
  - trouver par quel nombre on peut diviser le numérateur et le dénominateur ;
  - trouver le numérateur et le dénominateur sont dans quelle table ;
  - décomposer le numérateur et le dénominateur en produits de facteurs premiers.
]

#exemple()[
  Rendre irréductible la fraction $24/36$.

  #set text(couleurPrincipale)
  #methode(titre: "Avec des divisions")[
    #v(0.5em)
    $24/36 = fractionDiviseParFacteur(24, 36, 2) = 12/18 = (12 #text(green)[$div 2$])/(18 #text(green)[$div 2$]) = 6/9 = (6 #text(black)[$div 3$])/(9 #text(black)[$div 3$]) = 2/3$
  ]
  #methode(titre: "Avec des multiplications")[
    #v(0.5em)
    $24/36 = (#text(red)[$2 times$] 12)/(#text(red)[$2 times$] 18) = 12/18 = (#text(green)[$2 times$] 6)/(#text(green)[$2 times$] 9) = 6/9 = (#text(black)[$3 times$] 2)/(#text(black)[$3 times$] 3) = 2/3$
  ]
  #methode(titre: "Avec des décompositions")[
    #v(0.5em)
    $24/36 = (rouge(cancel(2)) times vert(cancel(2)) times 2 times noir(cancel(3)))/(rouge(cancel(2)) times vert(cancel(2)) times noir(cancel(3)) times 3) = 2/3$
  ]
]
