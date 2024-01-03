#import "../../preambule_photocopies.typ": * 
#show: doc => photocopies(doc, paysage: false, nbCols: 2, marge: 6.6mm)

#let exercice = {
  block(inset: 10pt, breakable: false, width: 100%)[
    #text(weight: "bold")[Consigne 8 :]\
    Calculer les sommes suivantes de nombres relatifs :
    #align(center)[
      #table(columns: 6, stroke: none, [
        \+ 4,3 + (+6,7)\
        \– 9 + (+2)\
        \– 4 + (+10)\
        \+ 3 + (+	8)
      ], [
        \=\
        \=\
        \=\
        \=
      ], h(1.3cm), [
        \+ 7 + (–2)\
        \– 7 + (–2)\
        \+ 7 – (–2)\
        \– 7 – (–2)
      ], [
        \=\
        \=\
        \=\
        \=
      ], h(1.3cm))
    ]
  ]
}

#for j in "123456" {
  exercice
}
#colbreak()
#for j in "123456" {
  exercice
}