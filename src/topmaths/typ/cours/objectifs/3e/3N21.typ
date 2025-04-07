#propriete()[
  #show "a": rouge()[$a$]
  #show "b": vert()[$b$]
  #show "c": noir()[$c$]
  #show "d": noir()[$d$]
  $(a + b)(c + d) = a c + a d + b c + b d$
]

#remarque(titre: "Preuve")[
  #show "b": vert()[$b$]
  On va noter $#noir()[$A$] = #noir()[$c + d$]$.\
  Ainsi $(#rouge()[$a$] + b)#noir()[$(c + d)$] = (#rouge()[$a$] + b) times #noir()[$A$]$ qu'on sait déjà développer.

  $(#rouge()[$a$] + b)(c + d) = (#rouge()[$a$] + b) times #noir()[$A$]$\
  $(#rouge()[$a$] + b)(c + d) = #rouge()[$a$] times #noir()[$A$] + b times #noir()[$A$]$\
  $(#rouge()[$a$] + b)(c + d) = #rouge()[$a$] times #noir()[$(c + d)$] + b times #noir()[$(c + d)$]$\
  $(#rouge()[$a$] + b)(c + d) = #rouge()[$a$] times #noir()[$c$] + #rouge()[$a$] times #noir()[$d$] + b times #noir()[$c$] + b times #noir()[$d$]$
]

#exemple(titre: "Exemple 1")[
  Développer et réduire $(2x + 3)(4x + 5)$.

  #set text(couleurPrincipale)
  $(2x + 3)(4x + 5) = 2x times 4x + 2x times 5 + 3 times 4x + 3 times 5$\
  $(2x + 3)(4x + 5) = 8x^2 + 10x + 12x + 15$\
  $(2x + 3)(4x + 5) = 8x^2 + 22x + 15$
]

#exemple(titre: "Exemple 2")[
  Développer et réduire $(7x - 2)(-5x - 3)$.

  #set text(couleurPrincipale)
  On commence par transformer les soustractions en additions pour se ramener à la formule du cours.
  $(7x - 2)(-5x - 3) = (7x + (-2))(-5x + (-3))$\
  $(7x - 2)(-5x - 3) = 7x times (-5x) + 7x times (-3) + (-2) times (-5x) + (-2) times (-3)$\
  $(7x - 2)(-5x - 3) = -35x^2 - 21x + 10x + 6$\
  $(7x - 2)(-5x - 3) = -35x^2 - 11x + 6$
]
