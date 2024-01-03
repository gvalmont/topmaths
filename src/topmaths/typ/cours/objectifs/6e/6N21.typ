#definition()[
  Comparer deux nombres, c'est dire s'ils sont égaux ou si l'un est plus petit ou plus grand que l'autre.
]

#vocabulaire()[
  #table(
    columns: 3,
    inset: 10pt,
    align: horizon + center,
    stroke: 1pt + black.lighten(70%),
    [Notation mathématique], [Signification], [Exemple],
    $"a" = "b"$, [a est égal à b], [13,40 = 13,4],
    $"a < b"$, [a est inférieur (plus petit) à b], [13,41 < 13,42],
    $"a" > "b"$, [a est supérieur (plus grand) à b], [13,42 > 13,41]
  )
]

#methode()[
  Pour comparer deux nombres, on commence par regarder ils ont combien de chiffres dans la partie entière :
  - s’ils n’ont pas le même nombre de chiffres, celui qui en a le plus est le plus grand
  - s’ils ont le même nombre de chiffres, on compare les chiffres en partant de la gauche jusqu’à trouver deux chiffres différents
  Si les parties entières sont identiques, on continue à comparer les chiffres de la partie décimale de la même façon (de gauche à droite)
]

#exemple(titre: "Exemple 1")[
  Comparer 19,4 et 3,19748.\
  #set text(couleurPrincipale)
  La partie entière de 19,4 est 19.\
  La partie entière de 3,19748 est 3.\
  19 > 3 donc 19,4 > 3,19748.
]

#exemple(titre: "Exemple 2")[
  Comparer 74,45328 et 74,456.\
  #set text(couleurPrincipale)
  La partie entière de 74,45328 est 74.\
  La partie entière de 74,456 est 74.\
  Les parties entières sont identiques donc on compare un par un les chiffres de la partie décimale jusqu'à en trouver deux différents.\
  74,#noir()[45]#rouge()[3]2\
  74,#noir[45]#rouge()[6]\
  #rouge()[6] > #rouge()[3] donc 74,456 > 74,45328.
]

#definitions()[
  #show "Ranger": motDefini
  #show "ordre croissant": motDefini
  #show "ordre décroissant": motDefini
  Ranger une liste de nombres dans l'ordre croissant signifie les ranger du plus petit au plus grand.
  Ranger une liste de nombres dans l'ordre décroissant signifie les ranger du plus grand au plus petit.
]

#exemple()[
  On considère les nombres suivants : 5,41 | 5,2 | 5,5 | 6\
  #set text(couleurPrincipale)
  Rangement dans l'ordre croissant : 5,2 < 5,41 < 5,5 < 6\
  Rangement dans l'ordre décroissant : 6 > 5,5 > 5,2 > 5,41
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
    "2 < 2,143 < 2,7", align(left)[← encadrement "quelconque"],
    "2,1 < 2,143 < 2,2", align(left)[← encadrement au dixième près],
    "2,14 < 2,143 < 2,15", align(left)[← encadrement au centième près]
  )
]

#definition()[
  #motDefini()[Intercaler] un nombre entre deux nombres donnés, c’est trouver un nombre compris entre les deux.
]

#exemple()[
  Intercaler un nombre entre 3,45 et 3,46.\
  #set text(couleurPrincipale)
  3,45 < 3,451 < 3,46
]