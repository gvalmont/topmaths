#import "../../preambule_presentation.typ": *
#show: doc => presentation(doc, titre: "6G41 : Estimer si un angle est droit, aigu ou obtus")

#for i in (3, 2, 5, 1, 4) {
  slide()[
    #align(center + horizon)[
      #text(size: 2em)[Quelle est la nature de cet angle ?]
      #image("../../cours/objectifs/6e/6G41-" + str(i) + ".png", width: 40%)
    ]
  ]
}

#slide()[
  #align(horizon + center, table(columns: 6)[][#image("../../cours/objectifs/6e/6G41-1.png")][#image("../../cours/objectifs/6e/6G41-2.png")][#image("../../cours/objectifs/6e/6G41-3.png")][#image("../../cours/objectifs/6e/6G41-4.png")][#image("../../cours/objectifs/6e/6G41-5.png")][Angle][][][][][])
]

#slide()[
  #align(horizon + center, table(columns: 6)[][#image("../../cours/objectifs/6e/6G41-1.png")][#image("../../cours/objectifs/6e/6G41-2.png")][#image("../../cours/objectifs/6e/6G41-3.png")][#image("../../cours/objectifs/6e/6G41-4.png")][#image("../../cours/objectifs/6e/6G41-5.png")][Angle][nul][aigu][droit][obtus][plat][Mesure][#v(3em)])
]

#slide()[
  #align(horizon + center, table(columns: 6)[][#image("../../cours/objectifs/6e/6G41-1.png")][#image("../../cours/objectifs/6e/6G41-2.png")][#image("../../cours/objectifs/6e/6G41-3.png")][#image("../../cours/objectifs/6e/6G41-4.png")][#image("../../cours/objectifs/6e/6G41-5.png")][Angle][nul][aigu][droit][obtus][plat][Mesure][égale à 0°][comprise entre 0° et 90°][égale à 90°][comprise entre 90° et 180°][égale à 180°])
]