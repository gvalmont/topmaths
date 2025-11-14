#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc)
#show: doc => normal(doc)

#slide()[
  #definitions()[
    En statistiques, un ensemble de nombres s’appelle une #motDefini()[série] et ces nombres sont appelés #motDefini()[valeurs].\
    L’#motDefini()[effectif total] est le nombre total de valeurs de la série.\
    La #motDefini()[moyenne arithmétique] d'une série de valeurs est le nombre obtenu :
    - en additionnant toutes les valeurs de la série
    - puis en divisant cette somme par l'effectif total de la série.
  ]
]

#slide()[
  #exemple()[
    Voici les distances parcourues (en km) par un sportif chaque matin pendant une semaine : $8$ ; $10$ ; $9$ ; $12$ ; $16$ ; $13,4$ ; $10$.\
    Calculer la distance moyenne qu'il a parcouru cette semaine. Interpréter.
    
    #set text(couleurPrincipale)
    #uncover((2, 3))[
    $(8+10+9+12+16+13,4+10)/7 = (78,4)/7 = 11,2$\
    La distance moyenne qu'il a parcouru cette semaine est $11,2$ km.\
    ]
    
    #uncover(3)[
      Interprétation : Cela signifie qu'en une semaine, ce sportif a parcouru la même distance que s'il avait parcouru $11,2$ km chaque jour.
    ]
  ]
]
