#definitions()[
  Dans un triangle rectangle, on appelle :
  - #motDefini()[hypoténuse] le côté qui est en face de l'angle droit
  - #motDefini()[côté adjacent] le côté qui relie l'angle considéré à l'angle droit
  - #motDefini()[côté opposé] le côté qui est en face de l'angle considéré
]

#definitions()[
  Dans un triangle rectangle,

  - le #motDefini()[sinus] d'un angle est le quotient $#noir()[longueur du côté opposé à cet angle] / #rouge()[longueur de l\'hypoténuse]$

  - le #motDefini()[cosinus] d'un angle est le quotient $#vert()[longueur du côté adjacent à cet angle] / #rouge()[longueur de l\'hypoténuse]$

  - la #motDefini()[tangente] d'un angle est le quotient $#noir()[longueur du côté opposé à cet angle] / #vert()[longueur du côté adjacent à cet angle]$
]

#exemple()[
  #set text(couleurPrincipale)
  #place(image("3G20-1.png", height: 9.5em), right, dy: -1em)
  Dans un triangle $A B C$ rectangle en $A$ :

  $sin (hat(A B C)) = #noir()[$A C$] / #rouge()[$B C$]$

  $cos (hat(A B C)) = #vert()[$A B$] / #rouge()[$B C$]$

  $tan (hat(A B C)) = #noir()[$A C$] / #vert()[$A B$]$
]

#remarque(titre: "Mémorisation de ces formules")[
  On peut retenir l'expression C#vert()[A]#rouge()[H] S#noir()[O]#rouge()[H] T#noir()[O]#vert()[A]
  - C#vert()[A]#rouge()[H] : "Le Cosinus est égal au côté #vert()[Adjacent] sur #rouge()[Hypoténuse]"
  - S#noir()[O]#rouge()[H] : "Le Sinus est égal au côté #noir()[Opposé] sur #rouge()[Hypoténuse]"
  - T#noir()[O]#vert()[A] : "La Tangente est égale au côté #noir()[Opposé] sur #vert()[Adjacent]".
]

#remarques()[
  - Un sinus, un cosinus et une tangente n'ont pas d'unité.
  - L'hypoténuse est le côté le plus long d'un triangle rectangle donc que ce soit pour calculer un cosinus ou un sinus, on divise une longueur plus petite par une longueur plus grande. Donc $0 < cos < 1$ et $0 < sin< 1$
]

#exemple()[
  #place(image("3G20-2.png", height: 8em), right, dy: -1em)
  Dans le triangle $N O P$ rectangle en $N$, $O P = 14$ mm et $hat(N O P)=49 degree$.\
  Calculer $N O$ à $0,1$ mm près.

  #set text(couleurPrincipale)
  On connaît l'hypoténuse et on cherche le côté adjacent :
  #grid(
    columns: 11,
    [C], [A], [H], h(0.5em), [S], [O], [H], h(0.5em), [T], [O], [A],
    [], [x], [x], h(0.5em), [], [], [x], h(0.5em), [], [], [x],
  )
  Le cosinus est celui qui relie hypoténuse et côté adjacent :

  $cos (hat(N O P)) = "adjacent" / "hypoténuse" = (N O) / (O P)$

  $(cos (49 degree)) / 1 = (N O) / 14$

  Une règle de trois donne $N O = (14 times cos (49 degree))/1 approx 9.2$ mm
]
