#import "../../preambule_photocopies.typ": * 
#show: doc => photocopies(doc, nbCols: 2)

#let exercice = {
  block(inset: 10pt, breakable: false)[
    #text(weight: "bold")[Consigne 2 :]\
    Effectue mentalement les calculs suivants :\
    14 + 17 – 15 =\
    114 + 17 – 15 =\
    1 802 + 319 – 315 =\
    4 374 + 62 – 61 =\
    4 374 + 61 – 62 =\
    7 081 + 61 – 62 =
  ]
}

#for j in "12345" {
  exercice
}
#colbreak()
#for j in "12345" {
  exercice
}