#import "../../preambule_photocopies.typ": * 
#show: doc => photocopies(doc, paysage: true, nbCols: 2, marge: 9mm)

#let exercice = {
  block(inset: 10pt, breakable: false, width: 100%)[
    #text(weight: "bold")[Consigne 4 :]\
    Effectue mentalement les calculs suivants, puis écris sous forme simplifiée comment se résume le programme de calcul :\
    #place(right, dx: -80pt)[
      #align(left)[
        3645 + 5241 – 5246 =\
        1010 + 21 – 31 =\
        236 + 22 – 29 =
      ]
    ]
    15627 + 314 – 316 =\
    823 + 34 – 3 =\
    4586 + 34 – 38 =

    Exemple :
    1350 + 242 – 247 = 1345 parce que +242 – 247 = – 5	
  ]
}

#for j in "1234" {
  exercice
}
#colbreak()
#for j in "1234" {
  exercice
}