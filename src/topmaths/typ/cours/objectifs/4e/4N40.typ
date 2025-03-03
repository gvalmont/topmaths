##5N42

#methode(titre: "Méthode du crible d'Eratosthène")[
  - On commence par entourer $2$ et on raye tous ses multiples.
  - On entoure l’entier suivant qui n’est pas rayé ($3$) et on recommence.
  - On entoure l’entier suivant qui n’est pas rayé ($5$) et ainsi de suite.
  Au final, tous les entiers qui n’ont pas été rayés sont des nombres premiers.
]

#image("4N40-1.png")
#text(align(center)[M.qrius, #link("https://creativecommons.org/licenses/by-sa/4.0", "CC BY-SA 4.0"), via Wikimedia Commons])

#remarques()[
  - $11 times 2$ a déjà été rayé lorsqu’on a rayé les multiples de $2$, pareil pour $11 times 3$, $11 times 4$ etc. jusqu’à $11 times 10$
  - le plus petit multiple de $11$ qui n’a pas encore été rayé avec les tables précédentes est donc $11 times 11 = 121$ qui est déjà plus grand que $100$ !
  Arrivé à $10$, comme $10 times 10 = 100$, on peut directement entourer tous les nombres qui n’ont pas été barrés, ce sont tous des nombres premiers.
]

#methode()[
  Pour vérifier si un nombre inférieur à $100$ est un nombre premier, on vérifie s’il est dans le table de $2$, $3$, $5$ ou $7$. S’il n’est dans aucune de ces tables, alors c’est un nombre premier !
]

#propriete(titre: "Propriétés (rappels des critères de divisibilité)")[
  Un nombre est :
  - divisible par $2$ s’il se termine par $0$, $2$, $4$, $6$ ou $8$ ;
  - divisible par $3$ si la somme de ses chiffres est divisible par $3$ ;
  - divisible par $5$ s’il se termine par $0$ ou $5$.
]

#methode()[
  Pour vérifier si un nombre plus petit que $70$ est dans la table de $7$ il suffit de connaître la table de $7$.\
  S’il est plus grand que $70$, on enlève $70$ et on vérifie si ce qui reste est dans la table de $7$.
]