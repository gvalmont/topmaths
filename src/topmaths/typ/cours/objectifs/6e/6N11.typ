#definition()[
  #motDefini()[] deux nombres, c'est dire s'ils sont égaux ou si l'un est plus petit ou plus grand que l'autre.
]

#vocabulaire()[
  #table(
    columns: 3,
    inset: 10pt,
    align: horizon + center,
    stroke: 1pt + black.lighten(70%),
    [Notation mathématique], [Signification], [Exemple],
    $"a" = "b"$, [a est égal à b], $13 = 130/10$,
    $"a < b"$, [a est inférieur (plus petit) à b], $13 < 45$,
    $"a" > "b"$, [a est supérieur (plus grand) à b], $45 > 13$ )
]

#methode()[
  Pour comparer deux nombres, on commence par regarder ils ont combien de chiffres.
  - s’ils n’ont pas le même nombre de chiffres, celui qui en a le plus est le plus grand
  - s’ils ont le même nombre de chiffres, on compare les chiffres en partant de la gauche jusqu’à trouver deux chiffres différents
]

#definitions()[
  #show "Ranger": motDefini
  #show "ordre croissant": motDefini
  #show "ordre décroissant": motDefini
  Ranger une liste de nombres dans l'ordre croissant signifie les ranger du plus petit au plus grand.\
  Ranger une liste de nombres dans l'ordre décroissant signifie les ranger du plus grand au plus petit.
]

#exemple()[
  On considère les nombres suivants : 23 | 21 | 39 | 18\
  #set text(couleurPrincipale)
  Rangement dans l'ordre croissant : 18 < 21 < 23 < 39\
  Rangement dans l'ordre décroissant : 39 > 23 > 21 > 18
]

#definition()[
  #show "Encadrer": motDefini
  Encadrer un nombre, c'est en trouver deux autres, un plus petit et un plus grand.
]

#exemples()[
  #table(
    columns: 2,
    align: horizon + center,
    stroke: 0pt,
    $2 < 7 < 59$, align(left)[← encadrement "quelconque"],
    $250 < 257 < 260$, align(left)[← encadrement à la dizaine près],
    $200 < 257 < 300$, align(left)[← encadrement à la centaine près]
  )
]

#definition()[
  #motDefini()[Intercaler] un nombre entre deux nombres donnés, c’est trouver un nombre compris entre les deux.
]

#exemple()[
  Intercaler un nombre entre 5 et 8.\
  #set text(couleurPrincipale)
  5 < 6 < 8
]