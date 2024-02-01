#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc, titre: "5N50 : Simplifier l'écriture d'une expression littérale")
#show: doc => normal(doc)

#slide()[
  #set text(size: 22pt)
  #titrePrincipal("Séquence 15 : Calcul littéral 1")
  #uncover((2, 3, 4))[
    #definition()[
      Une #motDefini()[expression littérale] est une expression (un calcul) dans laquelle un ou plusieurs nombres sont désignés par des lettres.
    ]
  ]
  #uncover((3, 4))[
    #regle(titre: "Règles d’écriture")[
      Dans une expression littérale, on peut supprimer le signe $times$ lorsqu'il est placé devant une lettre ou une parenthèse.

      #uncover(4)[
        De plus :\
        $a times a = a^2$ (se lit "a au carré")\
        $a times a times a = a^3$ (se lit "a au cube")
      ]
    ]
  ]
]

#slide()[
  #remarque()[
    Attention à bien courber ses $x$ !\
    $2 x times x = 2 x^2$ mais $2 x x x = 2 x^3$ !
  ]
]