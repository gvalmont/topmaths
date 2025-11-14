#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc)
#show: doc => normal(doc)

#slide()[
  #definitions()[
    #show "somme": motDefini
    #show "différence": motDefini
    #show "produit": motDefini
    #show "quotient": motDefini
    La somme #uncover((beginning: 2))[est le résultat d’une #vert()[addition].]\
    #uncover((beginning: 3))[La différence #uncover((beginning: 4))[est le résultat d’une #vert()[soustraction]].]\
    #uncover((beginning: 5))[Le produit #uncover((beginning: 6))[est le résultat d’une #vert()[multiplication]].]\
    #uncover((beginning: 7))[Le quotient #uncover((beginning: 8))[est le résultat d’une #vert()[division]].]
  ]
]
