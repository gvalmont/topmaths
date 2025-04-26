#propriete()[
  $c$ et $d$ désignent deux nombres avec $c eq.not 0$ et $d eq.not 0$.

  $1 / c times 1 / d = 1 / (c times d)$
]

#remarque(titre: "Preuve")[
  #v(0.5em)

  $1 = #vert()[$1$] times #noir()[1]$

  $1 = #vert()[$c times 1 / c$] times #noir()[$d times 1 / d$]$ car un nombre fois son inverse est égal à $1$ : #vert()[$c times 1 / c = 1$] et #noir()[$d times 1 / d = 1$]

  $1 = #vert()[$c$] times #noir()[$d$] times #vert()[$1 / c$] times #noir()[$1 / d$]$ car la multiplication est commutative : $#vert()[$2$] times #noir()[$3$] = #noir()[$3$] times #vert()[$2$]$

  $1 = (#vert()[$c$] times #noir()[$d$]) times (#vert()[$1 / c$] times #noir()[$1 / d$])$ donc $#vert()[$1 / c$] times #noir()[$1 / d$]$ est l'inverse de $#vert()[$c$] times #noir()[$d$]$

  Par définition de l'inverse, on sait que l'inverse de $#vert()[$c$] times #noir()[$d$]$ est $1 / (#vert()[$c$] times #noir()[$d$])$

  On peut donc en conclure que $#vert()[$1 / c$] times #noir()[$1 / d$] = 1 / (#vert()[$c$] times #noir()[$d$])$

]

#propriete()[
  $a$, $b$, $c$ et $d$ désignent quatre nombres avec $c eq.not 0$ et $d eq.not 0$.

  $a / c times b / d = (a times b) / (c times d)$
]

#remarque(titre: "Preuve")[
  #v(0.5em)
  $#vert()[$a / c$] times #noir()[$b / d$] = #vert()[$a times 1 / c$] times #noir()[$b times 1 / d$]$ car $3$ cinquièmes c'est $3$ fois $1$ cinquième : #vert()[$3 / 5 = 3 times 1 / 5$]

  #v(1em)

  $#vert()[$a / c$] times #noir()[$b / d$] = #vert()[$a$] times #noir()[$b$] times #vert()[$1 / c$] times #noir()[$1 / d$]$ car la multiplication est commutative : $#vert()[$2$] times #noir()[$3$] = #noir()[$3$] times #vert()[$2$]$

  #v(1em)

  $#vert()[$a / c$] times #noir()[$b / d$] = #vert()[$a$] times #noir()[$b$] times 1 / (#vert()[$c$] times #noir()[$d$])$ d'après la propriété précédente.

  #v(1em)

  $#vert()[$a / c$] times #noir()[$b / d$] = (#vert()[$a$] times #noir()[$b$]) / (#vert()[$c$] times #noir()[$d$])$ car $3$ fois $1$ cinquième c'est $3$ cinquièmes : $3 times 1 / 5 = 3 / 5$
]
