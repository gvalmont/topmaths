== Définitions

#definition()[
  Le #motDefini()[périmètre] d'une figure est la longueur de son contour.
]

#exemple()[
  Le #rouge()[périmètre] de cette figure est la longueur en #rouge()[rouge].
  #image("6M10-1.png", height: 8em)
]

#definition()[
  L'#motDefini()[aire] d'une figure est la mesure de la surface à l'intérieur de son contour.
]

#exemple()[
  L'#vert()[aire] de cette figure est la mesure de la surface #vert()[verte].
  #image("6M10-2.png", height: 8em)
]

#exemple()[
  Calculer le périmètre et l'aire de la figure ci-dessous :
  #set text(couleurPrincipale)

  #place(left, dx: 35%, dy: 1em)[
    #block(width: 65%)[
      Pour calculer le #rouge()[périmètre] d'une figure, on fait le tour de la figure en additionnant toutes les longueurs rencontrées :

      #rouge()[Périmètre] = 2 cm + 1 cm + 3 cm + 2 cm + 5 cm + 3 cm\
      #rouge()[Périmètre] = 16 cm
    ]
  ]
  #image("6M10-3.png", width: 35%)
  Pour calculer l'#vert()[aire] d'une figure, on compte combien de carrés on a besoin pour la remplir :

  Cette figure est constituée de 12 carrés de 1 centimètre de côté, on peut donc dire qu'elle a une aire de 12 centimètres carrés. En mathématiques, on le note :\
  #vert()[Aire] = 12 cm²
]

== Propriétés

#propriete()[
  Pour obtenir l'aire d'un rectangle, il suffit de multiplier sa longueur par sa largeur.\
  $A_"rectangle" = L times l$
]

#exemple(titre: "Exemple avec des cm")[
  #align(horizon, grid(columns: 3, column-gutter: 1em, image("6M10-5.png", height: 6em), "→", image("6M10-6.png", height: 6em)))

  Prenons par exemple un rectangle qui a pour longueur 3 cm et pour largeur 2 cm.\
  Si on le découpe en carrés de 1 cm, on remarque qu'on peut le partager en 2 bandes de 3 carrés (ou 3 bandes de 2 carrés), ce qui fait 2 $times$ 3 = 3 $times$ 2 = 6 carrés de 1 cm de côté, autrement dit une aire de 6 cm².
]

#exemple(titre: "Exemple avec des m")[
  #align(horizon, grid(columns: 3, column-gutter: 1em, image("6M10-7.png", height: 8em), "→", image("6M10-8.png", height: 8em)))

  Prenons par exemple un rectangle qui a pour longueur 5 m et pour largeur 3 m.\
  Si on le découpe en carrés de 1 m, on remarque qu'on peut le partager en 3 bandes de 5 carrés (ou 5 bandes de 3 carrés), ce qui fait 3 $times$ 5 = 5 $times$ 3 = 15 carrés de 1 m de côté, autrement dit une aire de 15 m².
]

#exemple(titre: "Exemple avec des virgules")[
  #align(horizon, grid(columns: 3, column-gutter: 1em, image("6M10-9.png", height: 6em), "→", image("6M10-10.png", height: 6em)))

  Prenons par exemple un rectangle qui a pour longueur 2,5 cm et pour largeur 2 cm.\
  Si on le découpe en carrés de 1 cm, on remarque qu'on peut le partager en 2 bandes de 2,5 carrés (ou 2,5 bandes de 2 carrés), ce qui fait 2 $times$ 2,5 = 2,5 $times$ 2 = 5 carrés de 1 cm de côté, autrement dit une aire de 5 cm².
]

#exemple(titre: "Exemple avec des lettres")[
  #align(horizon, grid(columns: 3, column-gutter: 1em, image("6M10-11.png", height: 8em), "→", image("6M10-12.png", height: 8em)))

  Prenons par exemple un rectangle qui a pour longueur $L$ cm et pour largeur $l$ cm.\
  Si on le découpe en carrés de 1 cm, on remarque qu'on peut le partager en $l$ bandes de $L$ carrés (ou $L$ bandes de $l$ carrés), ce qui fait $l times L = L times l$ carrés de 1 cm de côté, autrement dit une aire de $L times l$ cm².
]

#propriete()[
  Pour obtenir l'aire d'un carré, il suffit de multiplier son côté par lui-même.\
  $A_"carré" = c times c$
]

#remarque(titre: "Preuve")[
  Un carré est un rectangle dont la largeur est égale à sa longueur.
  #image("6M10-13.png", height: 6em)
  $A_"carré" = L times l = L times L = l times l = c times c$
]

#propriete()[
  Pour obtenir l'aire d'un triangle rectangle, il suffit de multiplier les longueurs des côtés de son angle droit et de diviser le résultat par 2.\
  $A_"triangle rectangle" = (L times l) div 2$
]

#remarque(titre: "Preuve")[
  Un triangle rectangle est la moitié d'un rectangle.
  #image("6M10-14.png", height: 6em)
  Pour calculer son aire, on calcule donc l'aire du rectangle associé et on divise par 2.\
  $A_"triangle rectangle" = A_"rectangle" div 2 = (L times l) div 2$
]

#remarque(titre: "Résumé")[
  #set text(black)
  #table(columns: 4, rows: (1.5em, 4em, 1.5em), align: horizon + center)[
    ][Carré][Rectangle][Triangle Rectangle][
    Figure][#image("6M10-15.png")][#image("6M10-16.png")][#image("6M10-17.png")][
    Aire][$A = c times c$][$A = L times l$][$A = (L times l) div 2$]
]