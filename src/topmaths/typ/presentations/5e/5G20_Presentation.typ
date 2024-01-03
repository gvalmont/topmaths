#import "../../preambule_presentation.typ": *
#show: doc => presentation(doc, titre: "Inégalité triangulaire")

#slide()[
  #only((until: 4))[
    #block(width: 50%, height: 100%)[
      #align(horizon + left)[
        #only(1)[Construire un triangle ABC avec :#linebreak()AB = 7 cm, AC = 2 cm et BC = 4 cm]
        #only(2)[Est-il possible de construire un triangle ABC avec :#linebreak()AB = 10 cm, AC = 3 cm et BC = 5 cm ?]
        #only(3)[Est-il possible de construire un triangle ABC avec :#linebreak()AB = 5 cm, AC = 4 cm et BC = 3 cm ?]
        #only(4)[Est-il possible de construire un triangle ABC avec :#linebreak()AB = 4 cm, AC = 8 cm et BC = 10 cm ?]
      ]
    ]
  ]
  #align(horizon + center)[
    #only(5)[Est-il possible de construire un triangle ABC avec :#linebreak()AB = 2 cm, AC = 5 cm et BC = 9 cm ?]
    #only(6)[Est-il possible de construire un triangle ABC avec :#linebreak()AB = 10 cm, AC = 12 cm et BC = 16 cm ?]
    #only(7)[Bilan]
  ]
  #place(right + horizon)[
    #block(width: 50%, height: 100%)[
      #for i in (1, 2, 3, 4) {
        only(i)[#image("5G20-" + str(i) + ".png")]
      }
    ]
  ]
]
