#import "../../preambule_photocopies.typ": * 
#show: doc => photocopies(doc, paysage: true, nbCols: 2, marge: 6.6mm)

#let exercice = {
  block(inset: 10pt, breakable: false, width: 100%)[
    #text(weight: "bold")[Consigne 7 :]\
    Cherche le programme de calcul équivalent le plus simple :
    #align(center)[
      #table(columns: 9, stroke: none, [
        \– 8 + 5\
        \– 8 + 8\
        \– 8 – 8
      ], [
        \=\
        \=\
        \=\
      ], h(1.5cm), [
        \– 5 + 5 – 1\
        \+ 4 + 5\
        \+ 7 – 4 – 3
      ], [
        \=\
        \=\
        \=\
      ], h(1.5cm), [
        \– 10 – 20\
        \+ 4 – 4 + 2\
        \– 3 + 4 + 5
      ], [
        \=\
        \=\
        \=\
      ], h(1.5cm))
    ]
  ]
}

#for j in "12345" {
  exercice
}
#colbreak()
#for j in "12345" {
  exercice
}