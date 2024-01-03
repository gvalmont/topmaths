#import "../../preambule_photocopies.typ": * 
#show: doc => photocopies(doc, paysage: false, nbCols: 2, marge: 7mm)

#let exercice = {
  block(inset: 10pt, breakable: false, width: 100%)[
    #text(weight: "bold")[Consigne 5 :]\
    Pour chaque programme de calcul ci-dessous, donner le programme de calcul équivalent le plus simple :\
    #place(right, dx: -30pt)[
      #align(left)[
        \+ 768,3 – 769, 5 =\
        \+ 72,165 – 74,166 =\
        \+ 0,8 – 0,9 =\
        \+ 1,7 – 1,79 =\
        \+ 2,85 – 22,85 =
      ]
    ]
    \+ 4 – 5 =\
    \+ 3,7 – 4,7 =\
    \+ 6,34 – 9,34 =\
    \+ 503,9 – 510,9 =\
    \+ 54 – 70 =
  ]
}

#for j in "12345" {
  exercice
}
#colbreak()
#for j in "12345" {
  exercice
}