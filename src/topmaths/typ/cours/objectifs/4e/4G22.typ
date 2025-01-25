#definition()[
  #motDefini()[L’hypoténuse] est le plus grand côté d’un triangle rectangle.\
  C’est le côté qui est face à l’angle droit.
]

#v(1em)
#theoreme(titre: "Théorème de Pythagore")[
  #block(width: 65%)[
    #rouge()[Si] #vert[un triangle est rectangle], #rouge()[alors] #noir()[le carré de la longueur de son hypoténuse est égal à la somme des carrés des longueurs des côtés de l'angle droit.]
  ]
]

#exemple()[
  #place(right, image("4G22-1.png", width: 30%), dy: -9em)
  #grid(
    columns: 3,
    align: center,
    row-gutter: 1em,
    column-gutter: 1em,
    rouge()[Donnée], [], rouge()[Conclusion],
    vert()[ABC est un triangle en A], rouge()[Donc $=>$], noir()[BC² = AB² + AC²]
  )
]
#v(1em)

#vocabulaire()[
  Cette égalité est appelée #motDefini()[égalité de Pythagore].
]

#remarque(titre: "Utilisation")[
  Dans un triangle rectangle, lorsqu'on connaît les longueurs de deux côtés, l'égalité de Pythagore permet de calculer la longueur du troisième côté.
]

#remarque(titre: "Remarque importante")[
  Quand on écrit l’égalité de Pythagore, on retient que #rouge()[l’hypoténuse est toujours toute seule !]

  Vu qu’il y a un "=", on ne peut pas avoir #text(size: 0.6em)[(le petit)] = (le moyen) + #text(size: 1.5em)[(le grand)]\
  #phantom()[Vu qu’il y a un "$=$",] ni même (le moyen) = #text(size: 0.6em)[(le petit)] + #text(size: 1.5em)[(le grand)] #h(2em) c’est impossible !

  C’est forcément #text(size: 1.5em)[(le grand)] = #text(size: 0.6em)[(le petit)] + (le moyen)\
  #phantom()[C’est forcément] ou #text(size: 1.5em)[(le grand)] = (le moyen) + #text(size: 0.6em)[(le petit)], ce qui revient au même.
]

#exemple(titre: "Exemple 1")[
  #place(right, image("4G22-2.png", width: 30%))
  Détermine la longueur BC.

  #set text(couleurPrincipale)
  ABC est un triangle rectangle en A.\
  D’après le théorème de Pythagore :\
  $B C^2 = A B^2 + A C^2$\
  $B C^2 = 2,4^2 + 3,2^2$\
  $B C^2 = 5,76 + 10,24$\
  $B C^2 = 16$\
  Donc $B C = 4 c m$.
]

#exemple(titre: "Exemple 2")[
  #place(right, image("4G22-3.png", width: 30%))
  Détermine la longueur AC.

  #set text(couleurPrincipale)
  ABC est un triangle rectangle en A.\
  D’après le théorème de Pythagore :\
  $B C^2 = A B^2 + A C^2$\
  $17^2 = 8^2 + A C^2$\
  $A C^2 = 17^2 – 8^2$\
  $A C^2 = 289 – 64$\
  $A C^2 = 225$\
  Donc $A C = 15$
]
