#import "../../preambule_photocopies.typ": * 
#show: doc => photocopies(doc, paysage: true, nbCols: 2)

#let exercice = {
  block(inset: 10pt, breakable: false, width: 100%)[
    #text(weight: "bold")[Consigne 3 :]\
    Effectue mentalement les calculs suivants :\
    #place(right, dx: -80pt)[
      #align(left)[
        3 469 + 45 – 46 =\
        15 627 + 124 – 125 =\
        823 + 313 – 314 =\
        4 586 + 32 – 33 =\
        823 + 7,2 – 8,2 =
      ]
    ]
    458 + 45 – 46 =\			
    3 469 + 124 – 125 =\		      	
    15 627 + 313 – 314 =\		
    823 + 32 – 33 =\			
    4 586 + 7 538 – 7 539 =		
  ]
}

#for j in "1234" {
  exercice
}
#colbreak()
#for j in "1234" {
  exercice
}