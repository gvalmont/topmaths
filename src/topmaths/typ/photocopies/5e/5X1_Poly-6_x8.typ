#import "../../preambule_photocopies.typ": * 
#show: doc => photocopies(doc, paysage: true, nbCols: 2, marge: 7mm)

#let exercice = {
  block(inset: 10pt, breakable: false, width: 100%)[
    #text(weight: "bold")[Consigne 6 :]\
    Cherche le programme de calcul équivalent le plus simple :
    #align(center)[
      #table(columns: 9, stroke: none, [
        \+ 7 – 11\
        \– 12 + 10\
        \– 11 + 7\
        \+ 10 – 12\
      ], [
        \=\
        \=\
        \=\
        \=\
      ], h(1.5cm), [
        \+ 5 – 2\
        \+ 8 – 3\
        \– 2 + 5\
        \– 3 + 8\
      ], [
        \=\
        \=\
        \=\
        \=\
      ], h(1.5cm), [
        \+ 8 – 13\
        \– 7 + 4\
        \– 13 + 8\
        \+ 4 – 7\
      ], [
        \=\
        \=\
        \=\
        \=\
      ], h(1.5cm))
    ]
  ]
}

#for j in "1234" {
  exercice
}
#colbreak()
#for j in "1234" {
  exercice
}