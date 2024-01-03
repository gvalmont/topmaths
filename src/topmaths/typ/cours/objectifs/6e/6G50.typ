#definition()[
  La #motDefini()[médiatrice] d'un segment est la droite qui coupe ce segment #vert()[perpendiculairement] et #noir()[en son milieu].
]

#exemple()[
  #place(right, image("6G50-1.png", width: 20%), dx: 7%, dy: -1em)
  #block(width: 95%)[
    #show: normal
    La droite (d) coupe le segment [AB] #vert()[en formant un angle droit] et #noir()[passe par le milieu] du segment [AB].\
    Donc la droite (d) coupe le segment [AB] #vert()[perpendiculairement] et #noir()[en son milieu].\
    La droite (d) est donc la #rouge()[médiatrice] du segment [AB]
  ]
]

#propriete()[
  Si #rouge()[un point appartient à la médiatrice d'un segment], alors #vert()[il est équidistant] (= à la même distance) #vert()[des deux extrémités de ce segment].
]

#exemple()[
  #implication(
    [Le point C #rouge()[appartient à la médiatrice] du segment [AB].#image("6G50-2.png")],
    [Le point C est #vert()[équidistant] de A et de B.#image("6G50-3.png")]
  )
]

#propriete()[
  Si #vert()[un point est équidistant] des deux extrémités d'un segment, alors rouge()[il appartient à la médiatrice de ce segment].
]

#exemple()[
  #implication(
    [Le point C est #vert()[équidistant] de A et de B.#image("6G50-4.png")],
    [Le point C #rouge()[appartient à la médiatrice] du segment [AB].#image("6G50-5.png")]
  )
]