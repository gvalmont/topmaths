== Calculer sans parenthèses

#regle()[
  Dans une expression #vert()[sans parenthèses], ne comportant #noir()[que des additions et des soustractions], on effectue les calculs #rouge()[de la gauche vers la droite].\
  Dans une expression #vert()[sans parenthèses], ne comportant #noir()[que des multiplications et des divisions], on effectue les calculs #rouge()[de la gauche vers la droite].
]

#exemples()[
  $ mat(A,=,12 – 5,+ ,8,#h(1cm),B,=,40 ÷ 8,times,10;,=,   7  ,+ ,8,#h(1cm), ,=,   5  ,times,10;,=,      ,15, ,#h(1cm), ,=,      ,  50 ,) $
]

#regle()[
  Dans une expression #vert()[sans parenthèses] qui #noir()[mélange] additions, soustractions, multiplications et divisions, on effectue #rouge()[d’abord les multiplications et les divisions], #rouge()[puis les additions et les soustractions].\
  On dit que #rouge()[la multiplication et la division sont prioritaires] par rapport à l’addition et à la soustraction.
]

#exemples()[
$ mat(C,=,23,+,#underline(stroke: 1pt + red,"6 × 4"),#h(1cm),D,=,#underline(stroke: 1pt + red,"7 × 8"),–,#underline(stroke: 1pt + red,"12 ÷ 4"),<-,"Les calculs 7 × 8 et 12 ÷ 4 sont tous";,=,23,+,24,#h(1cm),,=,56,–,#underline(stroke: 1pt + red,"12 ÷ 4"),,"les deux prioritaires, on les fait donc";,=,,47,,#h(1cm),,=,56,–,3,,"de la gauche vers la droite";,,,,,,#h(1cm),=,,53) $
]

== Calculer avec des parenthèses

#regle()[
  Dans une expression #vert()[avec des parenthèses], on effectue #rouge()[d’abord les calculs entre parenthèses].\
  Quand il y a #vert()[plusieurs niveaux de parenthèses], on commence par #rouge()[les plus intérieures].\
  À #vert()[l’intérieur des parenthèses], on applique les #rouge()[priorités de calcul] du #noir()[1.]
]

#exemples()[
  $ mat(E,=,2,times,"("7,–,#underline(stroke: 1pt + red,"(5 - 3)")")",#h(1cm),F,=,9,times,"("5,+,#underline(stroke: 1pt + red,"2 × 3")")";,=,2,times,"("#underline(stroke: 1pt + red,"7"),–,2")",#h(1cm),,=,9,times,"("5,+,6")";,=,2,times,,5,,#h(1cm),,=,9,times,,11,;,=,,10,,,,#h(1cm),,=,,99) $
]

#remarque()[
  #attention() Les parenthèses changent l’ordre des calculs et donc le résultat !
]

#exemples()[
  $ mat(G,=,#underline(stroke: 1pt + red,"9 × 7"),+,4,#h(1cm),H,=,9,times,#underline(stroke: 1pt + red,"(7 + 4)"),;,=,  63,+,4,#h(1cm),,=,9,times,11;,=,,67,,#h(1cm),,=,,99) $
]

== Calculer un quotient

#regle()[
  Pour calculer un quotient, on effectue les calculs au #vert()[numérateur] et au #vert()[dénominateur] comme s’ils étaient #rouge()[entre parenthèses].
]

#place(right, dy:-2.5em)[
  #block(stroke: 1pt + gray, inset: 5pt)[
    #align(left)[
      #remarque(titre:"Rappel")[
        $ "Fraction" = "Numérateur" / "Dénominateur" $
      ]
    ]
  ]
]

#exemple()[
  #place(left, dx: 100pt, dy: 1.5em)[
    $ mat(I,=,"("#underline(stroke: 1pt + red,"5 × 4"),–,6")",div,"("9 – 7")";
I,=,"("20,–,6")",div,2;
I,=,,14,,div,2;
I,=,,,,7) $
  ]
  #place(left, dx: 55pt)[
    #box(width: 500pt)[$<-$ On fait les calculs dans le même ordre que si c’était :]
  ]
  $ mat(I,=,(#underline(stroke: 1pt + red, offset: 1pt,"5 × 4") - 6) / (9 - 7);I,=,(20 - 6) / 2;I,=,14/2;I,=,7) $
]
