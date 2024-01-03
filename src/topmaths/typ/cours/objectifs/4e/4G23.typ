#definition()[
  #show "A": vert
  #show "B": noir
  #show "réciproque": motDefini
  On considère une propriété de la forme "Si A est vrai, alors B est vrai". #linebreak()
  Si on inverse les données et la conclusion, on obtient "Si B est vrai, alors A est vrai". #linebreak()
  Cette deuxième propriété est appelée la réciproque de la première propriété.
]
#exemple()[
  #set text(couleurPrincipale)
  Le théorème de Pythagore dit que "Si #vert()[un triangle est rectangle], alors #noir()[le carré de son plus grand côté est égal à la somme des carrés des deux autres côtés]" #linebreak()
  On peut donc en déduire la :
]
#propriete(titre: "Réciproque du théorème de Pythagore")[
  Si #noir()[le carré du plus grand côté d’un triangle est égal à la somme des carrés des deux autres côtés], alors #vert()[ce triangle est rectangle].
]
#exemple()[
  $"MNP"$ est un triangle tel que : $"MN" = 6 "cm"$, $"MP" = 8 "cm"$ et $"NP" = 10 "cm"$.#linebreak()
  Est-ce que $"MNP"$ est un triangle rectangle ?

  #set text(couleurPrincipale)
  Le côté le plus long est $["NP"]$.

  $"NP"^2 = 10^2 = 100$

  $"MN"^2 + "MP"^2 = 6^2 + 8^2 = 36 + 64 = 100$

  On obtient le même résultat donc, d’après la réciproque du théorème de Pythagore le triangle $"MNP"$ est rectangle en $"M "$.
]
#definition()[
  #show "A": vert
  #show "B": noir
  #show "faux": rouge
  #show "contraposée": motDefini
  On considère une propriété de la forme "Si A est vrai, alors B est vrai".#linebreak()
  Dans ce cas, le fait que B soit vrai est la conséquence du fait que A soit vrai.#linebreak()
  Il est donc impossible d’avoir à la fois B qui est faux et A qui est vrai (puisque si A est vrai, alors par conséquent B est vrai lui aussi).#linebreak()
  On peut donc en déduire la propriété suivante "Si B est faux, alors A est faux".#linebreak()
  Cette dernière propriété est appelée la contraposée de la première propriété.
]
#propriete(titre: "Contraposée du théorème de Pythagore")[
  Si #noir()[le carré du plus grand côté d’un triangle n’est #rouge()[pas] égal à la somme des carrés des deux autres côtés], alors #vert()[ce triangle n’est #rouge()[pas] rectangle].
]
#exemple()[
  $"EFH"$ est un triangle tel que : $"EF" = 5 "cm"$, $"FH" = 7 "cm"$ et $"HE" = 9 "cm"$.#linebreak()
  Est-ce que $"EFH"$ est un triangle rectangle ?

  #block(breakable: false)[
    #set text(couleurPrincipale)
    Le côté le plus long est $["HE"]$ qui mesure $9 "cm"$.

    $"HE"^2 = 9^2 = 81$

    $"EF"^2 + "FH"^2 = 5^2 + 7^2 = 25 + 49 = 74$

    On n’obtient pas le même résultat donc, d’après la contraposée du théorème de Pythagore le triangle $"EFH"$ n’est pas rectangle.
  ]
]
