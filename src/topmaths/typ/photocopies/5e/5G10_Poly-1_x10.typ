#import "../../preambule_photocopies.typ": * 
#show: doc => photocopies(doc, paysage: false, nbCols: 2)

#let enonce = [
  #image("../../cours/objectifs/5e/5G10-1.png", height: 12em)
]

#for i in range(10) {
  enonce
  v(6pt)
}