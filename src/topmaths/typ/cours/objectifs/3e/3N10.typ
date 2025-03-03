##4N40

#propriete()[
  Pour vérifier si un nombre est premier, il suffit de vérifier s'il est divisible par un nombre premier inférieur ou égal à sa racine carrée.\
  S'il n'est divisible par aucun de ces nombres, alors c'est un nombre premier.
]

#remarque(titre: "Justifications")[
  + Pourquoi ne tester que les nombres premiers :
    - En ayant le crible d'Eratosthène en tête, on comprend que s'il est divisible par un nombre qui n'est pas premier (un nombre barré), alors il est aussi divisible par les nombres premiers qui le composent (les nombres entourés), donc vérifier s'il est divisible uniquement par les nombres premiers suffit et est plus efficace.
  + Pourquoi s'arrêter à sa racine carrée :
    - Avec le crible d'Eratosthène, on a vu qu'on pouvait s'arrêter à $10$ car $10 times 10 = 100$.
    - Or $10 times 10 = 10^2$ on pouvait donc s'arrêter à $10$ car $10^2 = 100$.
    - En étendant ce raisonnement, pour vérifier si un nombre $n$ est un nombre premier, on peut s'arrêter lorsqu'on arrive à un nombre dont le carré est $n$.
    - Par définition, le nombre positif dont le carré est $n$ est $sqrt(n)$.
    - Donc pour vérifier si un nombre $n$ est premier, on peut tester s'il est divisible par l'un des nombres premiers jusqu'à $sqrt(n)$
]

#exemple()[
  Vérifier si $233$ est un nombre premier.

  #set text(couleurPrincipale)
  $sqrt(233) approx 15,26$\
  On vérifie si $233$ est divisible par tous les nombres premiers inférieurs ou égaux à $15$, c'est-à-dire $2$, $3$, $5$, $7$, $11$ et $13$.\
  $233 div 2 = 116,5$\
  $233 div 3 approx 77,67$\
  $233 div 5 = 46,6$\
  $233 div 7 approx 33,29$\
  $233 div 11 approx 21,18$\
  $233 div 13 approx 17,92$\
  $233$ n'est divisible par aucun des nombres premiers inférieurs ou égaux à $15$, donc $233$ est un nombre premier.
]