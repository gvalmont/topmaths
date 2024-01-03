== Symétrique d'un point

#definition()[
  #show "symétrique": motDefini
  Si le point M appartient à la droite (d), son symétrique par rapport à (d) est confondu avec lui même.
  Si le point M n'appartient pas à la droite (d), son symétrique par rapport à (d) est le point M' tel que (d) est la médiatrice du segment [MM']

  #grid(columns: (3fr, 1fr, 1fr, 4fr, 2fr, 3fr), align(center + horizon)[M appartient à (d)], image("6G51-1.png"), [], align(center + horizon)[M n'appartient pas à (d)], image("6G51-2.png"))
]

#methode(titre: "Méthode pour construire le symétrique d'un point M par rapport à une droite (d)")[
  #let step(numero) = {
    align(center)[#image("6G51-" + str(numero + 2) + ".png", height: 10em)#box(align(center + horizon, text(black, str(numero))), stroke: 1pt,  radius: 100%, width: 16pt, height: 16pt)]
  }
  #grid(columns: 5, step(1), step(2), step(3), step(4), step(5))
]

== Symétrique d'un segment, d'une droite, d’un polygone

#methodes()[
  Pour tracer le symétrique d'un segment, il suffit de tracer les symétriques des extrémités de ce segment et de les relier.\
  Pour tracer la symétrique d'une droite, il suffit de tracer les symétriques de deux points de cette droite et de tracer une droite passant par eux.\
  Pour tracer le symétrique d’un polygone, il suffit de tracer les symétriques des sommets de ce polygone et de les relier.
]

#exemple()[
  #image("6G51-8.png", height: 16em)
]

== Symétrique d'un cercle

#methode()[
  Pour tracer le symétrique d'un cercle, il suffit de tracer un cercle de même rayon ayant pour centre le symétrique du centre du premier cercle.
]

#exemple()[
  #image("6G51-9.png", height: 16em)
]