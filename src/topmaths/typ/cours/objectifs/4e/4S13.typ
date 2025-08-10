##6P2B

#definition()[
  L’événement #motDefini()[contraire] d’un événement $A$ est l’événement qui se réalise à chaque fois que $A$ n’est pas réalisé~: il est réalisé par toutes les issues qui ne réalisent pas l’événement $A$.\
  Cet évènement est noté $macron(A)$
]

#propriete()[
  La somme des probabilités d’un événement et de son contraire vaut 1~: $P(A) + P(macron(A)) = 1$
]

#remarque()[
  On peut en déduire que $P(macron(A)) = 1 - P(A)$
]

#exemple()[
  Dans l’exemple précédent, l’événement contraire de l’évènement $S$ "Sortie d’un nombre supérieur ou égal à 2" est l’événement $macron(S)$ "Sortie d’un nombre strictement inférieur à 2".\
  Le seul nombre strictement inférieur à 2 ici est le nombre 1.\
  La probabilité de sortie du 1 est $2/6 = 1/3$\
  donc $P(macron(S)) = 1/3$\
  On aurait pu le trouver aussi grâce à l’égalité~:

  $P(macron(S)) = 1 - P(S)$

  $phantom(P(macron(S))) = 1 - 4/6$

  $phantom(P(macron(S))) = 6/6 - 4/6$

  $phantom(P(macron(S))) = 2/6$

  $phantom(P(macron(S))) = 1/3$
]
