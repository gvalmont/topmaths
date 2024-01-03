#import "../../preambule_photocopies.typ": * 
#show: doc => photocopies(doc, paysage: false, nbCols: 1)

#let enonce()=[
  1) Construire un angle de 43 ° qui a pour sommet le point D et qui est orienté "vers le haut"\
  2) Construire un angle de 54 ° qui a pour sommet le point E et qui est orienté "vers le haut"\
  3) Prolonger les côtés des angles qu'on vient de tracer pour former un triangle\
  4) Combien mesure le troisième angle de ce triangle ?\
  #v(7em)
  #align(center, image("6G42_Poly-1.png", height: 2.5em))
]

#for i in range(4) {
  enonce()
  if i < 4 {
    v(12pt)
  }
}