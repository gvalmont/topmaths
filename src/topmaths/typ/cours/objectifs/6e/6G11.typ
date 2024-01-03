#definitions()[
  Deux droites #motDefini()[sécantes] sont deux droites qui ont un seul point en commun.\
  Le point commun à deux droites sécantes est appelé leur #motDefini()[point d'intersection].
]

#exemple()[
  #table(
    columns: (1fr, 2fr),
    stroke: none,
    align: horizon + center,
    image("6G11-1.png"), [
      Les droites (AB) et (CD) sont sécantes en E.\ \
      Le point E est le point d’intersection des droites (AB) et (CD)
    ]
  )
]

#definition()[
  Deux droites #motDefini()[perpendiculaires] sont deux droites sécantes qui forment un angle droit.
]

#regle(titre: "Notation")[
  En mathématiques, "La droite (AB) #motDefini()[est perpendiculaire à] la droite (d)" peut se noter "(AB) #motDefini()[⊥] (d)"
]

#exemple()[
  #table(
    columns: (1fr, 1fr, 1fr),
    stroke: none,
    align: horizon + center,
    image("6G11-2.png"), [
      (AB) ⊥ (CD)
    ]
  )
]

#table(
  columns: (3fr, 1fr, 0.5fr),
  stroke: none,
  align: horizon,
  methode()[
    #set list(marker: [--])
    Pour tracer la droite perpendiculaire à (AB) qui passe par C : 
    - on place l’équerre sur la droite (AB)
    - on la fait glisser jusqu’à ce qu’elle passe par le point C
    - on trace la droite
  ],
  image("6G11-3.png")
)
