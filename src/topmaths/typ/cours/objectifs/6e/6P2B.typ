#remarque()[
  Une même probabilité peut s'exprimer de différentes façons.
]

#exemple()[
  Si on lance une pièce, il y a une chance sur deux de tomber sur face.\
  On peut dire que la probabilité de tomber sur face est $1/2$, $50 %$ ou encore $0$,$5$
]

#proprietes()[
  La probabilité d’un événement est (toujours) un nombre compris entre 0 et 1.\
  La somme des probabilités de toutes les issues est égale à 1.\
  La probabilité d’un événement est la somme des probabilités des issues qui réalisent cet événement.\
  La probabilité d’un événement impossible est 0.\
  La probabilité d’un événement certain est 1.
]

#definition()[
  Lorsque toutes les issues d’une expérience aléatoire ont la même probabilité, on dit que les issues sont #motDefini()[équiprobables].
]

#proprietes()[
  Si une expérience aléatoire comporte $n$ issues équiprobables, la probabilité de chacune d’entre elles vaut $1/n$.\
  Dans une expérience aléatoire équiprobable, on peut calculer la probabilité d’un événement à l’aide de la formule : $"Probabilité" = "Nombre de possibilités favorables"/"Nombre total de possibilités"$
]

#exemple()[
  #place(right, dy: -2.2em)[
    #image("6P2B-1.png", width: 20%)
  ]
  #block(width: 80%)[
    On tourne la roue bien équilibrée ci-contre et on relève le numéro du secteur qui s'arrête en face du repère.\
    On note S l’événement "Sortie d'un nombre supérieur ou égal à 2".\
    Quelle est la probabilité de l'événement S ?
  ]

  #set text(couleurPrincipale)
  4 secteurs ont un numéro supérieur ou égal à 2 (possibilités favorables) sur un total de 6 secteurs.

  $"Probabilité" = "Nombre de possibilités favorables"/"Nombre total de possibilités" = 4/6 = 2/3$

  La probabilité de l’événement S est donc $2/3$.
]
