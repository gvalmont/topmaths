#proprietes()[
  Multiplier par 0,1 revient à diviser par 10.\
  Multiplier par 0,01 revient à diviser par 100.\
  etc.

  Diviser par 0,1 revient à multiplier par 10.\
  Diviser par 0,01 revient à multiplier par 100.\
  etc.
]

#remarque(titre: "Preuve de la première propriété")[
  #grid(columns: 2, row-gutter: 1.5em)[
    $"nombre" times #vert[0,1]$][$= "nombre" times #vert()[$1/10$]$][
    ][$= ("nombre" times 1)/10$][
    ][$= "nombre" / 10$][
    ][$ = "nombre" div 10$
  ]
]

#methode()[
  Pour multiplier un nombre décimal par 0,1 ; 0,01 ; 0,001... on compte le nombre de zéros et on décale la virgule vers la gauche du même nombre de rangs en rajoutant des zéros si besoin.\
  Pour diviser un nombre décimal par 0,1 ; 0,01 ; 0,001... on fait la même chose mais vers la droite !
]

#exemples()[
  - 9,487 $times$ #rouge()[0],1 = 9#rouge()[4,]87
  - 74,5 $div$ #rouge()[0],#rouge()[0]1 = 74#gris()[,]#rouge()[5\_,] $div$ #rouge()[0],#rouge()[0]1 = 74#rouge()[50]
  - 84 $times$ #rouge()[0],#rouge()[00]1 = #rouge()[,\_84]#gris()[,] $times$ #rouge()[0],#rouge()[00]1 = #vert()[0]#rouge()[,084]
]

#remarque()[
  On peut voir 0,1 ; 0,01 et 0,001 comme le monde paralèlle des 10, 100, 1 000 :
  - La technique est la même sauf qu'on déplace la virgule dans l'autre sens
  - si on lit 0,1 ; 0,01 et 0,001 de droite à gauche sans la virgule on voit 10, 100, 1 000 !
]