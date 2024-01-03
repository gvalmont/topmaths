#methode()[
  Pour construire un triangle avec Geogebra :\
  1\. On commence par tracer le plus grand côté #box(image("5G22-1.png"), height: 1.5em)\
  2\. On trace des cercles ayant pour rayon les longueurs des autres côtés #box(image("5G22-2.png"), height: 1.5em)\
  3\. On construit les angles qu'on connaît #box(image("5G22-3.png"), height: 1.5em) et on trace des demi-droites #box(image("5G22-4.png"), height: 1.5em)\
  4\. On construit le point d'intersection #box(image("5G22-5.png"), height: 1.5em) puis le triangle #box(image("5G22-6.png"), height: 1.5em)
]

#exemple()[
  #let cell = rect.with(
      fill: white
    )
  Construire un triangle $"GHT"$ avec $"GH" = 5 "cm"$, $hat("GHT") = 54 degree$ et $hat("HGT") = 37 degree$.
  #grid(columns: 4, rows: 1, cell()[#figure(image("5G21-5.png"), caption: [Étape 1])], cell()[#figure(image("5G21-6.png"), caption: [Étape 3])], cell()[#figure(image("5G21-7.png"), caption: [Étape 3])], cell()[#figure(image("5G21-8.png"), caption: [Étape 4])])
]