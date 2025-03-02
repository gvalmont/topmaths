#definition()[
  Lorsque les valeurs d'une série statistique sont rangées par ordre croissant, la #motDefini()[médiane] est un nombre qui est :
  - supérieur ou égal à au moins la moitié des valeurs de la série ;
  - inférieur ou égal à au moins la moitié des valeurs de la série.
]

#remarque()[
  On peut dire que la médiane est "le nombre du milieu" !
]

#methode()[
  Pour déterminer la médiane d'une série statistique, on commence par ranger les valeurs par ordre croissant, puis on distingue deux cas :
  - Dans le cas où l'effectif total est impair, la médiane correspond à la valeur du milieu de la série.
  - Dans le cas où l'effectif total est pair, la médiane correspond à la moyenne des deux valeurs du milieu de la série.
]

#exemple(titre: "Exemple 1")[
  Voici les notes obtenues par un élève : $6$ ; $15$ ; $20$ ; $16$ ; $20$ ; $20$ ; $20$ ; $17$ ; $9$ ; $12$ ; $14$\
  Déterminer la médiane de ses notes.

  #set text(couleurPrincipale)
  On commence par les ranger par ordre croissant :\
  $rouge(underbrace(normal(6 < 9 < 12 < 14 < 15), "5 valeurs")) < 16 < rouge(underbrace(normal(17 < 20 = 20 = 20 = 20), "5 valeurs"))$\
  L'effectif total est 11. La médiane est donc la 6ème valeur de la série, c'est-à-dire 16.\
  Interprétation : Cela signifie qu’au moins la moitié de ses notes sont inférieures ou égales à 16 et qu’au moins la moitié de ses notes sont supérieures ou égales à 16.
]

#exemple(titre: "Exemple 2")[
  Voici les températures relevée au cours de cette semaine en ° : $16$ ; $7$ ; $11$ ; $9$ ; $14$ ; $15$
  Déterminer la médiane de ces températures.

  #set text(couleurPrincipale)
  On commence par les ranger par ordre croissant :\
  $rouge(underbrace(normal(7 < 9 < 11), "3 valeurs")) < rouge(underbrace(normal(14 < 15 < 16), "3 valeurs"))$\
  L'effectif total est 6. La médiane est donc la moyenne de la 3ème et de la 4ème valeur, c'est-à-dire $(11+14)/2 = 12,5$\
  Interprétation : Cela signifie que cette semaine, la température était plus haute que 12,5° au moins la moitié des jours et que la température était plus basse que 12,5° au moins la moitié des jours.
]

#remarques()[
  On dit que la médiane et la moyenne sont des indicateurs de position.\
  Contrairement à la moyenne :
  - La médiane d'une série de valeurs n'est pas sensible aux valeurs extrêmes de la série ;
  - la détermination de la médiane nécessite d'ordonner la série.
]