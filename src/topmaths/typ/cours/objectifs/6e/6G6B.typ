== Les triangles
#definition()[
  Un #motDefini()[triangle] est un polygone à trois côtés.\
  Un #motDefini()[triangle rectangle] est un triangle qui a #vert()[un angle droit].\
  Un #motDefini()[triangle isocèle] est un triangle dont #noir()[deux côtés ont la même longueur].\
  Un #motDefini()[triangle équilatéral] est un triangle dont les #noir()[trois côtés ont la même longueur].
]

#exemples()[
  #grid(
    columns: (1fr, 1fr, 1fr),
    align: center,
    row-gutter: 0.5em,
    image("6G6B-5.png", height: 7em), image("6G6B-6.png", height: 7em), image("6G6B-7.png", height: 7em),
    "Triangle rectangle", "Triangle isocèle en A", "Triangle équilatéral",
  )
]
== Les quadrilatères
#definitions()[
  Un #motDefini()[quadrilatère] est un polygone à quatre côtés.\
  Un #motDefini()[losange] est un quadrilatère dont les #noir()[quatre côtés ont la même longueur].
]

#exemple()[
  #place(right, image("6G6B-1.png", height: 7em), dy: -2em)
  MARK est un quadrilatère\
  et ses quatre côtés sont de même longueur\
  donc c’est un losange.
]

#definition()[
  Un #motDefini()[rectangle] est un quadrilatère qui a #vert()[quatre angles droits].
]

#exemple()[
  #place(right, image("6G6B-2.png", height: 7em), dy: -2em)
  ABCD est un quadrilatère\
  et il a quatre angles droits\
  donc c’est un rectangle.
]

#definition()[
  Un #motDefini()[carré] est un quadrilatère qui a #vert()[quatre angles droits] et #noir()[quatre côtés de même longueur].
]

#exemple()[
  #place(right, image("6G6B-3.png", height: 7em), dy: -2em)
  ABCD est un quadrilatère,\
  il a quatre angles droits\
  et ses quatre côtés sont de même longueur,\
  c’est donc un carré
]

#propriete()[
  Un carré est à la fois un rectangle et un losange.
]

#remarque(titre: "Preuve")[
  Un carré est un quadrilatère qui a quatre angle droits, c'est donc un rectangle.
  Un carré est un quadrilatère qui a quatre côtés de même longueur, c'est donc un losange.
]

#remarque(titre: "Résumé")[
  #image("6G6B-4.png")
]
