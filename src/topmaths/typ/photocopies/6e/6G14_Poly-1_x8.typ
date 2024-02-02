#import "../../preambule_sequence.typ": *
#import "../../preambule_photocopies.typ": * 
#show: doc => photocopies(doc, nbCols: 2)

#let truc = [
  #exemple()[
    Détermine la distance du point $A$ à la droite $(d)$
    #image("../../cours/objectifs/6e/6G14-1.png", height: 10em)
  ]
]

#for value in range(8) {
  truc
  v(2em)
}