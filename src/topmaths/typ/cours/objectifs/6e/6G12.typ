#definition()[
  Deux droites #motDefini()[parallèles] sont deux droites qui ne sont pas sécantes.
]

#regle(titre: "Notation")[
  En mathématiques, "La droite (AB) #motDefini()[est parallèle à] la droite (d)" peut se noter "(AB) #motDefini()[\/\/] (d)"
]

#exemple()[
  #table(
    columns: (1fr, 1fr, 1fr),
    stroke: none,
    align: horizon + center,
    image("6G12-1.png"), [
      (AB) \/\/ (d)
    ]
  )
]

#remarque()[
  #table(
    columns: (2fr, 1fr),
    stroke: none,
    align: horizon,
    [
      Lorsque les points A, B et C sont alignés, les droites (AB) et (AC) ont tous leurs points en commun. 
      Ces droites ne sont pas sécantes (car elles ont plus d'un point en commun), elles sont donc parallèles.\
      Dans ce cas, on dit que les droites (AB) et (AC) sont #motDefini()[confondues].
    ],
    image("6G12-2.png")
  )
]

#methode()[
  #set list(marker: [--])
  Pour tracer la droite parallèle à (d) qui passe par A :
  - on place l’équerre sur la droite (d)
  - on place la règle contre l’équerre
  - on fait glisser l’équerre le long de la règle jusqu’au point A en faisant attention à ne pas bouger la règle 
  - une fois arrivé au point A, on trace la droite
  #image("6G12-3.png")
]
