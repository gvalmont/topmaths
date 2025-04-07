#definition()[
  Un #rouge()[histogramme] est un type de graphique utilisé pour représenter des données. Il permet de visualiser rapidement la façon dont des valeurs se répartissent en classes.

  Contrairement aux diagrammes en barres, les barres d’un histogramme sont jointes, car les #motDefini()[classes] représentent des intervalles continus (il n'y a pas de "trou" entre les valeurs représentées).
]

#remarque(titre: "Utilisation")[
  Lorsque les données d'une série statistique ont peu de valeurs différentes, on peut les représenter par un diagramme en barres. En revanche, lorsque les valeurs sont nombreuses (continues), on regroupe les données en des #motDefini()[classes] et on les représente plutôt par un histogramme.
]

#definition()[
  L'#motDefini()[amplitude] d’une classe est l'étendue des valeurs de cette classe.
]

#proprietes()[
  Dans un histogramme, l'aire de chaque barre est proportionnelle à l'effectif de la classe qu'elle représente.\
  L'aire totale de l'histogramme est égale à l'effectif total de la série statistique.
]

#remarques()[
  Si les classes ont la même amplitude, la hauteur des barres est proportionnelle à l’effectif.\
  Si les classes ont des amplitudes différentes, il faut que hauteur $times$ largeur = effectif.\
  Dans ce cas, la hauteur de la barre = effectif $div$ amplitude.
]

#exemple()[
  Un opérateur téléphonique a relevé la durée de 50 appels passés dans la journée.\
  Il a regroupé les durées en tranches comme indiqué ci-dessous :
  #table(
    columns: 5,
    align: center,
    [Durée (en minutes)], [0 à 5], [5 à 10], [10 à 15], [15 à 30],
    [Nombre d'appels], [5], [20], [15], [15],
  )
  Représenter ces données par un histogramme.

  #set text(couleurPrincipale)
  L'amplitude de la première classe est 5 ($5 - 5 = 0$) et son effectif est 5. Avec une hauteur de 1 unité, l'aire de la barre est bien égale à son effectif ($5 times 1 = 5$).\
  L'amplitude de la deuxième classe est 5 ($10 - 5 = 5$) et son effectif est 20. Avec une hauteur de 4 unités, l'aire de la barre est bien égale à son effectif ($5 times 4 = 20$).\
  L'amplitude de la troisième classe est 5 ($15 - 10 = 5$) et son effectif est 15. Avec une hauteur de 3 unités, l'aire de la barre est bien égale à son effectif ($5 times 3 = 15$).\
  L'amplitude de la quatrième classe est 15 ($30 - 15 = 15$) et son effectif est 15. Avec une hauteur de 1 unité, l'aire de la barre est bien égale à son effectif ($15 times 1 = 15$).\
  Ce qui nous donne l'histogramme suivant :\
  #image("3S12-1.png", width: 100%)
]
