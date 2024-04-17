#vocabulaire()[
  Lorsqu’on écrit que quelque chose est #motDefini()[égal] à quelque chose, on écrit ce qu’on appelle une #motDefini()[égalité].\
  Une égalité peut être #motDefini()[vraie] ou #motDefini()[fausse].
]

#exemples()[
  $4 times 5 = 20$ ← Cette égalité est vraie\
  $7 times 2 = 18$ ← Cette égalité est fausse
]

#definitions()[
  Le #motDefini()[membre de gauche] d’une égalité désigne tout ce qu’il y a à gauche du signe égal.\
  Le #motDefini()[membre de droite] d’une égalité désigne tout ce qu’il y a à droite du signe égal.
]

#exemple()[
  Dans l’égalité $2 + 3 = 9 minus 4$:
  - le membre de gauche est $2 + 3$;
  - le membre de droite est $7 minus 4$.
]

#definition()[
  #motDefini()[Tester une égalité] signifie "Vérifier si cette égalité est vraie ou fausse".
]

#methode()[
  Pour tester une égalité :
  - on calcule la valeur du membre de gauche en remplaçant la lettre par la valeur donnée ;
  - on calcule la valeur du membre de droite en remplaçant la lettre par la valeur donnée ;
  - si on obtient le même résultat, l'égalité est vraie ; sinon, elle est fausse.
]

#exemple(titre: "Exemple 1")[
  Tester l’égalité $2x + 5 = 7x minus 1$ pour $x = 8$.

  #set text(couleurPrincipale)
  #grid(
    columns: 2,
    column-gutter: 5em,
    row-gutter: 0.8em,
    [Calcul du membre de #vert()[gauche] pour #rouge()[$x = 8$] :], [Calcul du membre de #vert()[droite] pour #rouge()[$x = 8$] :],
    [$2 #rouge()[$x$] + 5 = 2 times #rouge()[$8$] + 5$], [$7 #rouge()[$x$] minus 1 = 7 times #rouge()[$8$] minus 1$],
    [$#phantom($2x + 5$) = 16 + 5$], [$#phantom($7x - 1$) = 56 - 1$],
    [$#phantom($2x + 5$) = #vert()[$21$]$], [$#phantom($7x - 1$) = #vert()[$55$]$]
  )
  #vert()[$21 eq.not 55$]\
  On n’obtient #vert()[pas le même résultat], donc cette égalité est #vert()[fausse] pour #rouge()[$x = 8$].
]

#exemple(titre: "Exemple 2")[
  Tester l’égalité $2x + 5 = 7x minus 1$ pour $x = 1,2$.

  #set text(couleurPrincipale)
  #grid(
    columns: 2,
    column-gutter: 5em,
    row-gutter: 0.8em,
    [Calcul du membre de #vert()[gauche] pour #rouge()[$x = 1,2$] :], [Calcul du membre de #vert()[droite] pour #rouge()[$x = 1,2$] :],
    [$2 #rouge()[$x$] + 5 = 2 times #rouge()[$1,2$] + 5$], [$7 #rouge()[$x$] minus 1 = 7 times #rouge()[$1,2$] minus 1$],
    [$#phantom($2x + 5$) = 2,4 + 5$], [$#phantom($7x - 1$) = 8,4 - 1$],
    [$#phantom($2x + 5$) = #vert()[$7,4$]$], [$#phantom($7x - 1$) = #vert()[$7,4$]$]
  )
  #vert()[$7,4 = 7,4$]\
  On obtient #vert()[le même résultat], donc cette égalité est #vert()[vraie] pour #rouge()[$x = 1,2$].
]
