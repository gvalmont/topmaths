#import "../../preambule_photocopies.typ": * 
#show: doc => photocopies(doc, nbCols: 2)

#let annee = {
  datetime.today().display("[year]")
}

#let anneeMoins2000 = {
  (int(datetime.today().display("[year]")) - 2000)
}

#let exercice = {
  block(inset: 10pt, breakable: false, width: 100%)[
    #text(weight: "bold")[Consigne 1 :]\
    Effectue mentalement les calculs suivants :\
    17 + 21 – 1 =\
    148 + 199 – 99 =\
    17 + 35 – 15 =\
    131 + 256 – 56 =\
    39 + 58 – 8 =\
    187 + #annee – #anneeMoins2000 =
  ]
}

#for j in "12345" {
  exercice
}
#colbreak()
#for j in "12345" {
  exercice
}