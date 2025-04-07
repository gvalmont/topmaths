#theoreme(titre: "Théorème de Thalès")[
  Dans le cas où les points A, B, M d’une part et A, C, N d’autre part sont alignés, si les droites (BC) et (MN) sont parallèles, alors $#rouge()[$A B$]/#vert()[$A M$] = #rouge()[$A C$]/#vert()[$A N$] = #rouge()[$B C$]/#vert()[$M N$]$.
]

#grid(
  columns: (1fr, 1fr),
  align: bottom + center,
  [#image("4G31-1.png") Configuration "des triangles emboîtés"], [#image("4G31-2.png") Configuration "en papillon"],
)

#remarques()[
  - On a également $#vert()[$A M$]/#rouge()[$A B$] = #vert()[$A N$]/#rouge()[$A C$] = #vert()[$M N$]/#rouge()[$B C$]$.
  - On peut aussi se rappeler du théorème de Thalès de la façon suivante : "deux droites sécantes coupées par deux droites parallèles forment deux triangles semblables" (ici, les triangles #rouge()[$A B C$] et #vert()[$A M N$] sont deux triangles semblables).
]

#remarque(titre: "Utilisation")[
  Le théorème de Thalès sert à calculer une longueur lorsqu’on a deux triangles et deux droites parallèles.
]

#exemple()[
  #grid(
    columns: (4fr, 1fr),
    column-gutter: 0.5em,
    align: horizon,
    [
      On considère la figure ci-contre, où les droites (AE) et (BD) se coupent en C et les droites (AB) et (DE) sont parallèles\
      AB = 7,4 cm ; AC = 3,9 cm ; BC = 8,5 cm ; DC = 2,4 cm.\
      Calculer une valeur approchée au mm près des longueurs CE et ED.],
    image("4G31-3.png"),
  )

  #set text(couleurPrincipale)
  #block(breakable: false)[
    #rouge()[1ère étape : on vérifie si les conditions sont bien réunies pour pouvoir utiliser le théorème de Thalès]

    Les points A, C, E d’une part et B, C, D d’autre part sont alignés.\
    Les droites (AB) et (DE) sont parallèles.\
    #h(1em)
  ]

  #block(breakable: false)[
    #rouge()[2ème étape : les conditions, sont bien réunies, on peut utiliser le théorème de Thalès.]

    D’après le théorème de Thalès, on a :

    $#vert()[$C E$]/#rouge()[$C A$] = #vert()[$C D$]/#rouge()[$C B$] = #vert()[$E D$]/#rouge()[$A B$]$\
    #h(1em)
  ]

  #block(breakable: false)[
    #rouge()[3ème étape : on peut enfin calculer les longueurs recherchées]

    $#vert()[$C E$]/#rouge()[$3,9$] = #vert()[$2,4$]/#rouge()[$8,5$] = #vert()[$E D$]/#rouge()[$7,4$]$

    Une règle de trois donne $C E = (3,9 times 2,4)/(8,5) approx 1,1$ cm.

    Une règle de trois donne $E D = (2,4 times 7,4)/(8,5) approx 2,1$ cm.
  ]
]
