#import "../../preambule_photocopies.typ": * 
#show: doc => photocopies(doc, paysage: true, nbCols: 3)

#for i in range(15) {
  block(breakable: false,
  table(columns: 4, rows: (2.5em, 4em, 1.5em), align: horizon + center)[
    ][Carré][Rectangle][Triangle Rectangle][
    Figure][#image("../../cours/objectifs/6e/6M10-15.png")][#image("../../cours/objectifs/6e/6M10-16.png")][#image("../../cours/objectifs/6e/6M10-17.png")][
    Aire][$A = c times c$][$A = L times l$][$A = (L times l) div 2$])
  v(1em)
}