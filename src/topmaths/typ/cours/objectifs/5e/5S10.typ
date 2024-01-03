#definitions()[
  Dans une série de données :
  - #motDefini()[l’effectif] d’une valeur est #vert()[le nombre de fois où cette valeur apparaît dans la série].
  - #motDefini()[l’effectif total] est #vert()[le nombre total de valeurs de la série].
  - la #motDefini()[fréquence] d’une valeur est le quotient de son effectif par l’effectif total.\
  $"fréquence d’une valeur" =$ #text(size: 1.4em)[#vert()[$"effectif de la valeur"/"effectif total"$]]
]

#exemple()[
  Voici les températures en degrés relevées à Saint Gilles en Janvier :\
  #block(width: 80%)[
    #for value in (30, 27, 30, 27, 30, 27, 27, 30, 26, 27, 30, 26, 30, 26, 29, 30, 29, 28, 30, 26, 27, 27, 27, 26, 30, 27, 29, 30, 30, 28, 30) {
      $value$
      h(8mm)
    }
  ]
  $30 degree$ apparaît $12$ fois sur $31$ jours donc :
  - #rouge()[l’effectif] de $30 degree$ est $12$
  - #rouge()[l’effectif total] est $31$
  - La #rouge()[fréquence] de $30 degree$ est #text(size: 1.4em)[$12/30$] $= 0,4$
]



