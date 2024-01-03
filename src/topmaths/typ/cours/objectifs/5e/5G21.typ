#methode(titre: "Méthode pour construire un triangle")[
  Pour construire un triangle connaissant des longueurs et des angles :
  + On commence par tracer le plus grand côté
  + On mesure les autres longueurs avec le compas et on trace des arcs de cercle
  + On mesure les angles avec le rapporteur et on trace des demi-droites
  + On relie le point d'intersection aux extrémités du segment déjà tracé
]

#exemple(titre: "Exemple 1")[
  #let cell = rect.with(
      fill: white
    )
  Construire un triangle $"DEF"$ avec $"EF" = 6 "cm"$, $"DF" = 5 "cm"$ et $hat("EFD") = 60degree$.
  #grid(columns: 4, rows: 1, cell()[#figure(image("5G21-1.png"), caption: [Étape 1])], cell()[#figure(image("5G21-2.png"), caption: [Étape 2])], cell()[#figure(image("5G21-3.png"), caption: [Étape 3])], cell()[#figure(image("5G21-4.png"), caption: [Étape 4])])
]

#exemple(titre: "Exemple 2")[
  #let cell = rect.with(
      fill: white
    )
  Construire un triangle $"GHT"$ avec $"GH" = 5 "cm"$, $hat("GHT") = 54 degree$ et $hat("HGT") = 37 degree$.
  #grid(columns: 4, rows: 1, cell()[#figure(image("5G21-5.png"), caption: [Étape 1])], cell()[#figure(image("5G21-6.png"), caption: [Étape 3])], cell()[#figure(image("5G21-7.png"), caption: [Étape 3])], cell()[#figure(image("5G21-8.png"), caption: [Étape 4])])
]