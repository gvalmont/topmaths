#definitions()[
  Des points #motDefini()[alignés] sont des points qui sont situés sur la même droite.\
  On dit alors qu'ils #motDefini()[appartiennent] à cette droite.
]

#regle(titre: "Notations")[
  $in$ signifie « appartient à ».\
  $in.not$ signifie « n'appartient pas à ».
]

#exemples()[
  #place(right, image("6G13-1.png", height: 6em), dy: -1.5em)
  #block()[
    $A in (B D)$ se lit "Le point A appartient à la droite passant par les points B et D"\
    $D in [A B)$ se lit "Le point D appartient à la demi-droite d'origine A et passant par B"\
    $D in.not [A B]$ se lit "Le point D n'appartient pas au segment d'extrémités A et B"\
    $C in.not (A B)$ se lit "Le point C n'appartient pas à la droite passant par les points A et B"\
  ]
]