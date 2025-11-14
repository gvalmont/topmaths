#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc)
#show: doc => normal(doc)

#slide()[
  #definition(titre: "Définitions-Exemples")[
    Une #motDefini()[expérience aléatoire] est une expérience qui dépend du hasard : on ne peut pas prévoir à l’avance le résultat. #uncover((beginning: 2))[#noir()[Exemple : Lancer un dé et regarder sur quel numéro il va s'arrêter]]\
    #uncover((beginning: 3))[Les #motDefini()[issues] d’une expérience aléatoire sont les différents résultats possibles de cette expérience. #uncover((beginning: 4))[#noir[Exemple : un dé peut s'arrêter sur le numéro 1, le numéro 2, etc.]]]
  ]
]

#slide()[
  #definition(titre: "")[
    La #motDefini()[probabilité] d’une issue peut s’interpréter comme la "proportion de chance" d’obtenir cette issue. #uncover((beginning: 2))[#noir()[Exemple : Comme il y a 1 face portant le numéro 2 sur un total de 6 faces, la probabilité de tomber sur une face qui porte le numéro 2 est $1/6$]]\
    #uncover((beginning: 3))[Un #motDefini()[événement] est constitué d’issues. #uncover((beginning: 4))[#noir()[Exemple : L'événement "Obtenir un nombre pair" est constitué des issues "tomber sur le numéro 2", "tomber sur le numéro 4" et "tomber sur le numéro 6"]]]
  ]
]

#slide()[
  #definition(titre: "")[
    On dit qu’un événement est #motDefini()[réalisé] lorsqu’on a obtenu l’une de ses issues. #uncover((beginning: 2))[#noir()[Exemple : Si je tombe sur le numéro 2, l'événement "Tomber sur un nombre pair est réalisé" mais l'événement "Tomber sur un nombre plus grand que 3" n'est pas réalisé.]]\
    #uncover((beginning: 3))[On dit qu’un événement est #motDefini()[impossible] s’il ne peut pas se produire. #uncover((beginning: 4))[#noir()[Exemple : "Tomber sur un nombre plus grand que 10"]]]\
    #uncover((beginning: 5))[On dit qu’un événement est #motDefini()[certain] s’il se produit toujours. #uncover((beginning: 6))[#noir()[Exemple : "Tomber sur un nombre plus petit que 100"]]]
  ]
]

#slide()[
  #remarque()[
    Pour dire à quel point on estime qu'un phénomène a des chances de se produire ou pas on peut les placer sur ce qu'on appelle une échelle de probabilité.
    
    #image("../../cours/objectifs/5e/5S20-1.png")
  ]
]
