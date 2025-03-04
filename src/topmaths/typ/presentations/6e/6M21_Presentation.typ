#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc, titre: "6M21 : Convertir des aires")
#show: doc => normal(doc)

#slide()[
  #remarque()[
    Comme une aire s’exprime en #rouge()[$#normal("cm")^2$], #rouge()[$#normal("dm")^2$], #rouge()[$#normal(" m ")^2$], etc. il y a $2$ colonnes pour chaque unité dans le tableau de conversion.
  ]

  #exemple()[
    #aColler(
      table(
        columns: (1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr),
        inset: 0.6em,
        align: center + horizon,
        table.cell(colspan: 2, rowspan: 2)[$"km"^2$], table.cell(colspan: 2)[$"hm"^2$], table.cell(colspan: 2)[$"dam"^2$], table.cell(colspan: 2)[$" m "^2$], table.cell(colspan: 2, rowspan: 2)[$"dm"^2$], table.cell(colspan: 2, rowspan: 2)[$"cm"^2$], table.cell(colspan: 2, rowspan: 2)[$"mm"^2$],
        table.cell(colspan: 2)[$"hectare"$], table.cell(colspan: 2)[$"are"$], table.cell(colspan: 2)[$"centiare"$],
        [\ ], [], [], [], [], [], [], [], [], [], [], [], [], [],
        [\ ], [], [], [], [], [], [], [], [], [], [], [], [], []
      ),
      8.1em
    )
  ]
]
