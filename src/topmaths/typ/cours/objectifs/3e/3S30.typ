#definitions()[
  #place(image("3S30-1.png", height: 4em), right, dy: 1em)
  Une #motDefini()[fonction] $f$ est un processus qui, à chaque valeur d’un nombre $x$, appelé #motDefini()[variable], associe un unique nombre $f(x)$.\
  Le nombre $f(x)$ est #motDefini()[l’image] de $x$ par la fonction $f$.\
  Le nombre $x$ est un #motDefini()[antécédent] de $f(x)$.\
  On note $f : x ⟼  f(x)$ (se lit "$f$ est la fonction qui, à $x$ associe $f(x)$")
]

#remarque()[
  On dit "l'image" car un nombre ne peut avoir qu'une seule image mais on dit "un antécédent" car un même nombre peut avoir plusieurs antécédents.
]

#exemple()[
  Une fonction $f$ associe à $x$ son carré.\
  On note $f : x -> x^2$ (qui se lit $f$, la fonction qui, à $x$ associe $x^2$);\
  ou encore $f(x) = x^2$ (qui se lit l’image de $x$ par la fonction f est $x^2$).

  $f(5) = 25$. L’image de $5$ par la fonction $f$ est $25$.\
  $f(–5) = 25$. L’image de $–5$ par la fonction $f$ est $25$.\
  $25$ a donc deux antécédents par la fonction $f$ qui sont $5$ et $–5$.
]

#remarque()[
  On peut représenter une fonction de différentes façons :
  - par une relation algébrique :  $f(x) = x^2$
  - par un tableau de valeurs :
  #table(columns: 6, $x$, $0$, $1$, $2$, $3$, $4$, $f(x)$, $0$, $1$, $4$, $9$, $16$)
  - par un graphique :
  #text(black)[#place($f(x)$, dx:-2em)#box(image("3S30-2.png")) $x$
  ]
]

#definitions()[
  Dans un repère, la #motDefini()[représentation graphique] (ou #motDefini()[courbe représentative]) d’une fonction
  est formée par tous les points dont les coordonnées sont de la forme $(x ; f(x))$ (#motDefini()[abscisse] $x$; #motDefini()[ordonnée] $f(x)$).
]

#exemple()[
  Dans l'exemple précédent $f(3) = 3^2 = 9$ donc :
  - l'antécédent $3$ a pour image $9$
  - le point d'abscisse $3$ et d'ordonnée $9$ appartient à la courbe représentative de la fonction $f$.
]