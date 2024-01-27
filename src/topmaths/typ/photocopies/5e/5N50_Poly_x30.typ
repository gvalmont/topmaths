#import "../../preambule_photocopies.typ": * 
#show: doc => photocopies(doc, paysage: false, nbCols: 3)

#let enonce1 = [
  Recopie le calcul suivant :\
  $2 x times x = 2 x^2$
]

#let enonce2 = [
  Recopie le calcul suivant :\
  $2 x x x = 2 x^3$
]

#for i in range(15) {
  enonce1
  v(19pt)
}

#for i in range(15) {
  enonce2
  v(19pt)
}