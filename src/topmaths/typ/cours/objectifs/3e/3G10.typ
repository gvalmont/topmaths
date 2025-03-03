#definition()[
  Deux triangles #motDefini()[semblables] ont leurs 3 angles deux à deux de même mesure.
]

#propriete()[
  La somme des trois angles d’un triangle fait toujours 180 degree.
]

#propriete()[
  Pour montrer que deux triangles sont semblables, il suffit de montrer qu’ils ont deux paires d’angles deux à deux de même mesure.
]

#exemple(titre: "Exemple 1")[
  Les triangles $K J L$ et $T V U$ suivants sont-ils semblables ?

  #set text(couleurPrincipale)
  #image("3G10-1.png", width: 60%)
  $hat(K L J) = 180 degree - 60 degree - 80 degree = 40 degree$\
  $hat(K L J) = hat(V T U)$\
  $hat(K J L) = hat(T V U)$\
  Les triangles $K J L$ et $T V U$ ont deux paires d’angles deux à deux de même mesure, donc ils sont semblables.
]

#exemple(titre: "Exemple 2")[
  Les triangles $B D C$ et $O Q P$ suivants sont-ils semblables ?

  #set text(couleurPrincipale)
  #image("3G10-2.png", width: 60%)

  $hat(B C D) = 180 degree - 49 degree - 71 degree = 60 degree$\
  $hat(O P Q) = 180 degree - 71 degree - 54 degree = 55 degree$

  Les angles du triangles $B D C$ mesurent $49 degree$, $60 degree$ et $71 degree$\
  Les angles du triangle $O Q P$ mesurent $54 degree$, $55 degree$ et $71 degree$\
  Ils n’ont pas deux paires d’angles deux à deux de même mesure donc ils ne sont pas semblables.
]

#propriete()[
  Si les longueurs des côtés de deux triangles sont proportionnelles, alors ils sont semblables.
]

#exemple()[
  Les triangles $G H I$ et $T U V$ sont-ils semblables? Justifier.

  #set text(couleurPrincipale)
  #image("3G10-3.png", width: 80%)
  #table(
    columns: 4,
    align: center,
    [], [petit côté], [moyen côté], [grand côté],
    [Triangle $G H I$], [9,1 cm], [10,4 cm], [13 cm],
    [Triangle $T U V$], [7 cm], [8 cm], [10 cm]
  )
  $9,1 div 7 = 1,3$\
  $10,4 div 8 = 1,3$\
  $13 div 10 = 1,3$\
  Les longueurs des côtés des triangles $G H I$ et $T U V$ sont proportionnelles.\
  Donc les triangles $G H I$ et $T U V$ sont semblables.
]