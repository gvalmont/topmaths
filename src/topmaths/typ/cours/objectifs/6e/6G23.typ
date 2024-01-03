#methode(titre: "Méthode pour construire un triangle connaissant les 3 longueurs")[
  Pour construire un triangle connaissant ses trois longueurs :
  + On commence par tracer le plus grand côté
  + On trace des arc de cercle ayant pour rayon les longueurs des deux autres côtés
  + On relie le point d'intersection aux extrémités du segment déjà tracé
]

#exemple()[
  #let cell = rect.with(
      fill: white
    )
  Construire un triangle $"UST"$ avec $"US" = 6 "cm"$, $"ST" = 5 "cm"$ et $"UT" = 4 "cm"$.
  #grid(columns: 4, rows: 1, cell()[#figure(image("6G23-1.png"), caption: [Étape 1])], cell()[#figure(image("6G23-2.png"), caption: [Étape 2])], cell()[#figure(image("6G23-3.png"), caption: [Étape 2])], cell()[#figure(image("6G23-4.png"), caption: [Étape 3])])
]