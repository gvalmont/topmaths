#propriete()[
  Dans un triangle non aplati, la longueur de chaque côté est toujours inférieure (<) à la somme (+) des longueurs des deux autres côtés.
]

#exemple()[
  #place(box(image("5G20-1.png"), width: 80pt), right, dx: 80pt)
  Dans un triangle ABC non aplati, on a les inégalités suivantes :
  $ "AB" < "AC" + "BC" $
  $ "AC" < "AB" + "BC" $
  $ "BC" < "AB" + "AC" $
]

#remarques()[
  - C’est pour ça que cette propriété s’appelle #rouge()[l'inégalité triangulaire]
  - Ça veut dire qu’il est impossible qu’un côté d’un triangle soit plus grand que la somme des deux autres côtés.
]

#methode()[
  Pour vérifier si triangle est constructible (si c'est possible de le construire), on vérifie si la plus grande longueur est bien inférieure à la somme des deux autres.
]

#exemple()[
  Est-ce qu’il est possible de construire un triangle ABC avec AB = 8 cm, AC = 4 cm et BC = 2 cm ?\
  #normal()[
    Le plus grand côté est [AB] qui mesure 8 cm.\
    $"AC" + "BC" = 4 "cm" + 2 "cm" = 6 "cm"$\
    6 cm < 8 cm donc construire un tel triangle est impossible.\
    On dit qu’il n’est pas constructible.
  ]
]