#import "../../preambule_photocopies.typ": * 
#show: doc => photocopies(doc, paysage: true, nbCols: 2)

#for value in range(6) {
  align(center, table(columns: (1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr), rows: (1.5em, 1.5em, 1.5em, 1.5em, 1.5em, 1.5em, 1.5em, 1.5em, 1.5em, 1.5em), stroke: 0.5pt)[kilomètre][hectomètre][décamètre][mètre][décimètre][centimètre][millimètre][km][hm][dam][m][dm][cm][mm])
  v(0.7em)
}

