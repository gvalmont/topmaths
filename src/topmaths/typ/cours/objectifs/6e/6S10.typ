#exemple()[
  Les ingrédients nécessaires pour fabriquer un gâteau au chocolat sont les suivants :\
  250 g de beurre, 200 g de farine, 100 g de chocolat en poudre, 200 g de sucre en poudre, 150 g de lait.\
  On peut choisir de représenter ces données de plusieurs façons selon notre objectif :
]

== Par un tableau

Si on veut juste organiser et regrouper des données pour pouvoir les lire plus facilement, on peut utiliser un tableau :

#table(columns: 6, stroke: gray, "Ingrédient", "Beurre", "Farine", "Chocolat", "Sucre", "Lait", "Masse (en g)", "250", "200", "100", "200", "150")


== Par un diagramme en en barres ou en bâtons

Si on veut pouvoir comparer visuellement les données (voir simplement les plus petits et les plus grands), on peut les représenter sous la forme d’un diagramme en barres ou en bâtons :

#regle()[
  Dans un diagramme en barres et dans un diagramme en bâtons, les longueurs des barres (ou des bâtons) sont proportionnelles à une des grandeurs qu’on peut lire sur l’axe des ordonnées (vertical)
]

#regle()[
  #place(right, image("6S10-1.png", width: 50%))
  #block(width: 50%)[
    Dans un diagramme en barres :
    - sur l’axe des abscisses (horizontal) se trouve une grandeur
    - sur l’axe des ordonnées (vertical) se trouve l’autre grandeur
  ]
]


#regle()[
  #place(right, image("6S10-2.png", width: 50%), dy: -2em)
  #block(width: 50%)[
  Dans un diagramme en bâtons :
  - sur l’axe des abscisses (horizontal) se trouvent des valeurs numériques
  - sur l’axe des ordonnées (vertical) se trouvent les effectifs de ces valeurs
  ]
]

#remarque()[
  Savoir faire la différence entre un diagramme en barres et un diagramme en bâtons n’est pas au programme, donc ce n’est pas grave de les confondre.
]

== Par un graphique cartésien

Si on veut mettre en évidence une évolution (voir comment les données évoluent, ce qui n’a pas vraiment de sens ici) on peut les représenter sous la forme d’un graphique cartésien :

#image("6S10-3.png")

#regle()[
- Dans un graphique cartésien, chaque point fait le lien entre deux grandeurs : l’une sur l’axe des abscisses (horizontal) et l’autre sur l’axe des ordonnées (vertical). Par exemple, on peut lire pour la farine : 200 g.
- Les points sont ensuite reliés par des segments.
]

#vocabulaire()[
  Dans le cas d’un graphique cartésien, on dit qu’on représente l’ordonnée en fonction de l’abscisse.\
  Donc ici, on a représenté la masse (ordonnée) en fonction de l’ingrédient (abscisse).
]

== Par un diagramme circulaire

Si on veut mettre en évidence une répartition (comment les données sont réparties ou partagées), on peut les représenter sous la forme d’un diagramme circulaire :

On sait qu’un tour complet fait 360 °, on détermine d’abord la mesure d’angle correspondant à chaque ingrédient grâce à un tableau de proportionnalité pour pouvoir ensuite construire le diagramme :

#place(right, image("6S10-4.png", width: 35%), dy: -2em)
#table(columns: 7, "Ingrédients", "Beurre", "Farine", "Chocolat", "Sucre", "Lait", "Total", "Masse (en g)", "250", "200", "100", "200", "150", "900", "Angle (en °)", "100", "80", "40", "80", "60", "360")

#regle()[
  Dans un diagramme circulaire, les mesures des angles sont proportionnelles aux valeurs de chaque catégorie.
]