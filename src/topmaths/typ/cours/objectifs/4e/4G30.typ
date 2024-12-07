#definition()[
  Deux triangles sont #motDefini()[égaux] lorsque leurs côtés sont deux à deux de même longueur.
]

#exemple()[
  #place(right, image("4G30-1.png", height: 10em), dy: -3em)
  AB = DE\
  BC = EF\
  AC = DF\
  Les triangles ABC et DEF ont leur trois côtés\
  deux à deux de même mesure, donc ils sont égaux.
]

#propriete()[
  Si deux triangles sont égaux, alors leurs angles sont deux à deux de même mesure.
]

#propriete()[
  Si deux triangles ont deux à deux un angle de même mesure compris entre deux côtés de même longueur, alors ils sont égaux.
]

#exemple()[
  #place(right, image("4G30-2.png", height: 10em), dy: -3em)
  $"GH" = "LK"$\
  $"HI" = "LJ"$\
  $hat("GHI") = hat("JLK")$\
  Les triangles GHI et JKL ont deux à deux\
  un angle de même mesure compris entre deux côtés de même longueur,\
  donc ils sont égaux.
]


#propriete()[
  Si deux triangles ont deux à deux un côté de même longueur compris entre deux angles de même mesure, alors ils sont égaux.
]

#exemple()[
  #place(right, image("4G30-3.png", height: 6em), dy: -1em)
  $"NO" = "QP"$\
  $hat("MNO") = hat("PQR")$\
  $hat("NOM") = hat("QPR")$\
  Les triangles NOM et QPR ont deux à deux\
  un côté de même longueur compris entre deux angles de même mesure,\
  donc ils sont égaux.
]

#methode()[
  Pour montrer que deux triangles sont égaux, on utilise la définition ou l'une des deux propriétés précédentes
]

#remarques()[
  Pour montrer que deux triangles sont égaux, on a besoin de 3 informations : 3 côtés, 2 côtés et 1 angle ou 1 côté et 2 angles.\
  La définition et les propriétés précédentes peuvent se résumer de la façon suivante :\
  #grid(
    align: center,
    columns: 3,
    inset: 0.3em,
    [Deux triangles sont égaux s'ils ont], [leurs 3 côtés], [deux à deux de même mesure.],
    [], grid.vline(stroke: couleurPrincipale), [1 angle compris entre 2 côtés], grid.vline(stroke: couleurPrincipale), [],
    [], [1 côté compris entre 2 angles], []
  )
]