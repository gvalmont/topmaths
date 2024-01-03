#exemple()[
  #set text(couleurPrincipale)
Division euclidienne de 185 par 7.

#h(1.5cm)Calcul posé
#place(left, dx:20%)[
  #v(0.5em)
    #noir()[dividende]\
    #bleu()[diviseur]\
    #vert()[quotient]\
    #rouge()[reste]
]
#image("5N40-1.png", width: 18%)

#noir()[185] = (#vert()[26] $times$ 7) + #rouge()[3] et #rouge()[3] < 7.\
Le dividende est #noir()[185] et le diviseur est 7.\
Le quotient est #vert()[26] et le reste est #rouge()[3].
]


#vocabulaire()[
  On a : 38 = 2 $times$ 19 + 0.\
  Le reste de la division euclidienne de 38 par 2 est égal à zéro.\
  On peut ainsi dire que :
  - 38 est un #motDefini()[multiple] de 2
  - 38 est #motDefini()[divisible] par 2
  - 2 est un #motDefini()[diviseur] de 38
]

#methode()[
  Pour déterminer si un nombre entier est ou n’est pas multiple ou diviseur d’un autre nombre entier, on pose la division euclidienne et on vérifie si le reste est nul (égal à 0).
]

#remarques()[
  Quand #vert()[on multiplie] un nombre, on obtient #noir()[un multiple].\
  Quand #vert()[on divise] un nombre, on obtient #noir()[un diviseur].
]

#definitions()[
  Les nombres entiers divisibles par 2 sont appelés #motDefini()[nombres pairs].\
  Les nombres entiers qui ne sont pas divisibles par 2 sont appelés #motDefini()[nombres impairs].
]

#exemples()[
  380 est divisible par 2, donc 380 est un nombre pair.\
  381 n'est pas divisible par 2, donc 381 est un nombre impair.
]
