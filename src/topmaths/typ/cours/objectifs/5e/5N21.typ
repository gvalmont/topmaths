#methode()[
  Pour comparer des fractions (dire laquelle est plus grande) :
  + on les met sur le même dénominateur
  + on compare leurs numérateurs
]

#exemple()[
  Compare $17/12$ et #vert[$7/4$]

  #set text(couleurPrincipale)
  On remarque que $#noir()[12] = #vert[$4$] #rouge[$times 3$]$

  $#vert[$7/4$] = #fractionMultiplieParFacteur(text(green)[7], text(green)[4], 3) = #vert[$21/12$]$

  Or $#noir()[$17$] < #vert[$21$]$

  Donc $#noir()[$17/12$] < #vert[$21/12$]$

  Enfin $#noir()[$17/12$] < #vert[$7/4$]$
]

#methode()[
  Pour ranger des fractions :
  + on les met toutes sur le même dénominateur
  + on range leurs numérateurs
]

#exemple()[
  Range les nombres suivants dans l’ordre croissant : $11/10$ ; $3$ ; $7/4$ ; $2/5$ ; $3/20$

  #set text(couleurPrincipale)
  On remarque que 20 est dans la table de 10, 4, et 5. On va donc toutes les mettre sur 20.

  $11/10 = fractionMultiplieParFacteur(11, 10, 2) = 22/20$

  $3 = 3/1 = fractionMultiplieParFacteur(3, 1, 20) = 60/20$

  $7/4 = fractionMultiplieParFacteur(7, 4, 5) = 35/20$

  $2/5 = fractionMultiplieParFacteur(2, 5, 4) = 8/20$

  $3/20 = 3/20$

  Or $ 3 < 8 < 22 < 35 < 60$

  Donc $3/20 < 8/20 < 22/20 < 35/20 < 60/20$

  Enfin $3/20 < 2/5 < 11/10 < 7/4 < 3$
]