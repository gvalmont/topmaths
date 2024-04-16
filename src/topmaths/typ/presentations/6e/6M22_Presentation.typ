#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc, titre: "6M22 : Convertir des volumes")
#show: doc => normal(doc)

#slide()[
  #remarque()[
    Comme un volume s’exprime en #rouge()[$#normal("cm")^3$], #rouge()[$#normal("dm")^3$], #rouge()[$#normal(" m ")^3$], etc. il y a #rouge()[$3$] colonnes pour chaque unité dans le tableau de conversion.
  ]

  #exemple()[
    #aColler(
      tablex(
        columns: (1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr),
        inset: 0.6em,
        align: center + horizon,
        colspanx(3)[$"km"^3$], (), (), colspanx(3)[$"hm"^3$], (), (), colspanx(3)[$"dam"^3$], (), (), colspanx(3)[$" m "^3$], (), (), colspanx(3, $"dm"^3$), (), (), colspanx(3, $"cm"^3$), (), (), colspanx(3, $"mm"^3$), (), (),
        [\ ], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
        [\ ], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
        [\ ], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []
      ),
      7.45em
    )
  ]
]
