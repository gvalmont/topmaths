#import "../../preambule_photocopies.typ": * 
#import "../../preambule_sequence.typ": * 
#show: doc => photocopies(doc, paysage: false, nbCols: 1, marge: 0.8cm)

#let truc = [
  #grid(columns: (3fr, 1fr),
    table(columns: 6, rows: (1.5em, 4em, 1.5em), align: horizon + center)[
    ][Carré][Rectangle][Triangle Rectangle][Trianque quelconque][Disque][
    Figure][#image("../../cours/objectifs/6e/6M10-15.png")][#image("../../cours/objectifs/6e/6M10-16.png")][#image("../../cours/objectifs/6e/6M10-17.png")][#box(image("5M10-1.png")) #box(image("5M10-2.png"))][#image("5M10-3.png")][
    Aire][$c times c$][$L times l$][$(L times l) div 2$][$(b times h) div 2$][$pi r^2$]
  )
]

#for i in range(8) {
  truc
  v(1em)
}
