#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc, titre: "6G50 : Connaître et utiliser la définition de la médiatrice")
#show: doc => normal(doc)

#slide()[
  #set text(size: 24pt)
  #only(1)[#titrePrincipal()[Séquence 20 : Médiatrice d'un segment]]
  #only(2)[#titrePrincipal()[Séquence 5 : Symétrie et médiatrice]]
  
  #definition()[
    La #motDefini()[médiatrice] d'un segment est la droite qui coupe ce segment #vert()[perpendiculairement] et #noir()[en son milieu].
  ]

  #exemple()[
    #place(right, image("../../cours/objectifs/6e/6G50-1.png", width: 20%), dy: -1em)
    #block(width: 80%)[
      #show: normal
      La droite #rouge()[(d)] coupe le segment [AB] #vert()[perpendiculairement] et #noir()[en son milieu].\
      La droite #rouge()[(d)] est donc la #rouge()[médiatrice] du segment [AB]
    ]
  ]
]
