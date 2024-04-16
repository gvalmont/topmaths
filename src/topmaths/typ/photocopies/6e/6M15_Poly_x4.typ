#import "../../preambule_sequence.typ": *
#import "../../preambule_photocopies.typ": * 
#show: doc => photocopies(doc, nbCols: 2, paysage: true, marge: 0.9cm)

#let truc = [
  #exemple()[
    Calculer le volume du solide suivant :

    #box(width: 30%)[
      #image("../../cours/objectifs/6e/6M15-3.png", width: 10em)
    ]
    #box(width: 69%)[
      On remarque qu'il est constitué de plusieurs cubes d'arête $1 "cm"$ :
      - Il est constitué de $6$ couches
      - Chaque couche contient $3$ lignes
      - Chaque ligne contient $4$ cubes

      Une couche contient alors $3 "lignes" times 4 "cubes" = 12 "cubes"$.\
      Ce solide contient alors $6 "couches" times 12 "cubes" = 72 "cubes"$.

      Comme ce solide est constitué de $72$ cubes d'arête $1 "cm"$,\
      on dit qu'il a un volume de $72 "cm" ^3$ ($72$ centimètres cubes)
    ]
  ]
]

#for value in range(8) {
  truc
  v(2em)
}