#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc)
#show: doc => normal(doc)

#slide()[
  #set text(size: 20pt)
  #definitions()[
    #place(image("../../cours/objectifs/3e/3S30-1.png", height: 4em), right, dy: 1em)
    Une #motDefini()[fonction] $f$ est un processus qui, à chaque valeur d’un nombre $x$, appelé #motDefini()[variable], associe un unique nombre $f(x)$.\
    Le nombre $f(x)$ est #motDefini()[l’image] de $x$ par la fonction $f$.\
    Le nombre $x$ est un #motDefini()[antécédent] de $f(x)$.\
    On note $f : x ⟼  f(x)$ (se lit "$f$ est la fonction qui, à $x$ associe $f(x)$")
  ]
]
