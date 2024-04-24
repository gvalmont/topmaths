#regle()[
  Dans une expression #vert()[avec des parenthèses], on effectue #rouge()[d’abord les calculs entre parenthèses].\
  Quand il y a #vert()[plusieurs niveaux de parenthèses], on commence par #rouge()[les plus intérieures].
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