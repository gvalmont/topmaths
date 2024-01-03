#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc, titre: "6M10 : Calculer le périmètre et l'aire d'un carré, d'un rectangle et d'un triangle rectangle")

#let diapos(figureSansDecoupage, figureAvecDecoupage, calcul, resultat) = {
  slide()[
    Quelle est l'aire de ce rectangle ?
    #v(-6em)
    #align(horizon, grid(columns: 3, column-gutter: 1em, image("../../cours/objectifs/6e/" + figureSansDecoupage + ".png", height: 6em)))
  ]

  slide()[
    Quelle est l'aire de ce rectangle ?
    #v(-3em)
    #align(horizon, grid(columns: 3, column-gutter: 1em, image("../../cours/objectifs/6e/" + figureSansDecoupage + ".png", height: 6em), "→", image("../../cours/objectifs/6e/" + figureAvecDecoupage + ".png", height: 6em)))

    #uncover((2, 3))[#calcul] #uncover(3)[donc l'aire est de #rouge[#resultat]].
  ]
}

#diapos("6M10-5", "6M10-6", [2 $times$ 3 carrés = 6 carrés de 1 cm de côté], "6 cm²")
#diapos("6M10-7", "6M10-8", [3 $times$ 5 carrés = 15 carrés de 1 m de côté], "15 m²")
#diapos("6M10-9", "6M10-10", [2 $times$ 2,5 carrés = 5 carrés de 1 cm de côté], "5 cm²")
#diapos("6M10-11", "6M10-12", [$L times l$ carrés de 1 cm de côté], [$L times l$ cm²])

#slide()[
  #set text(couleurPrincipale)
  #propriete()[
    Pour obtenir l'aire d'un rectangle, il suffit de multiplier sa longueur par sa largeur.\
    $A_"rectangle" = L times l$
  ]
]

#slide()[
  Et pour l'aire d'un carré ?

  #only(1)[#image("../../cours/objectifs/6e/6M10-15.png", height: 4em)]
  #only((2))[
    #image("../../cours/objectifs/6e/6M10-13.png", height: 4em)
    $A_"carré" = L times l = c times c$
  ]
]

#slide()[
  Et pour l'aire d'un triangle rectangle ?

  #only(1)[#image("../../cours/objectifs/6e/6M10-17.png", height: 4em)]
  #only((2))[
    #image("../../cours/objectifs/6e/6M10-14.png", height: 4em)
    $A_"triangle rectangle" = A_"rectangle" div 2 = (L times l) div 2$
  ]
]

#slide()[
  #underline("Résumé")
  #table(columns: 4, rows: (1.5em, 4em, 1.5em), align: horizon + center)[
    ][Carré][Rectangle][Triangle Rectangle][
    Figure][#image("../../cours/objectifs/6e/6M10-15.png")][#image("../../cours/objectifs/6e/6M10-16.png")][#image("../../cours/objectifs/6e/6M10-17.png")][
    Aire][$A = c times c$][$A = L times l$][$A = (L times l) div 2$]
]