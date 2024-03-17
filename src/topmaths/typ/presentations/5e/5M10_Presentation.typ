#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc, titre: "5M10 : Calculer le périmètre et l'aire d'une figure usuelle")
#show: doc => normal(doc)

#slide()[
  #set text(size: 20pt)
  #titrePrincipal()[Séquence 19 : Périmètres et aires]

  #definitions()[
    Une #motDefini()[#rouge()[hauteur]] d’un parallélogramme est la distance entre deux côtés opposés du parallélogramme.\
    Pour l’obtenir, on trace une perpendiculaire à un côté qui va servir de #vert()[base].
  ]

  #exemples()[
    #grid(
      columns: 2,
      column-gutter: 2em,
      image("../../cours/objectifs/5e/5M10-1.png"), image("../../cours/objectifs/5e/5M10-2.png")
    )
  ]
]

#slide()[
  #propriete()[
    L’aire d’un parallélogramme se calcule grâce à la formule $cal(A) = #vert()[base] times #rouge()[hauteur]$
  ]
]