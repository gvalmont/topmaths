#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc, titre: "Additionner des nombres relatifs")
#show: doc => normal(doc)
#slide()[
      #text(
        underline(
          text(
            red, font: "STIX Two Text", "IV"
          ) + " Additionner des nombres relatifs", stroke: 1pt + red, offset: 2pt
        ), weight: "regular"
      )
  #exemples()[
    #normal()[
      Différents cas sont possibles :
      - On ajoute deux nombres positifs\
      #uncover((beginning: 2))[#vert()[\+ 7] + (#vert()[\+ 2]) =] #uncover((beginning: 3))[7 + 2 = 9 = #vert()[\+ 9]]\
      #uncover((beginning: 4))[#vert()[\+ 7] + (#vert()[\+ 10]) =] #uncover((beginning: 5))[7 + 10 = 17 = #vert()[\+ 17]]

      #uncover((beginning: 6))[- On ajoute deux nombres négatifs]
      #uncover((beginning: 7))[#rouge()[\– 7] + (#rouge()[\– 2]) =] #uncover((beginning: 8))[–7 – 2 = #rouge()[\– 9]]\
      #uncover((beginning: 9))[#rouge()[\– 7] + (#rouge()[\– 10]) =] #uncover((beginning: 10))[–7 – 10 = #rouge()[\– 17]]
    ]
  ]
]

#slide()[

  - On ajoute un négatif et un positif
  #uncover((beginning: 2))[#rouge()[\– 7] + (#vert()[\+ 2]) =] #uncover((beginning: 3))[–7 + 2 = #rouge()[\– 5]]\
  #uncover((beginning: 4))[#rouge()[\– 7] + (#vert()[\+ 10]) =] #uncover((beginning: 5))[–7 + 10 = #vert()[\+ 3] = 3]

  #uncover((beginning: 6))[- On ajoute un positif et un négatif]
  #uncover((beginning: 7))[#vert()[\+ 7] + (#rouge()[\– 2]) =] #uncover((beginning: 8))[7 – 2 = #vert()[\+ 5] = 5]\
  #uncover((beginning: 9))[#vert()[\+ 7] + (#rouge()[\– 10]) =] #uncover((beginning: 10))[7 – 10 = #rouge()[\– 3]]
]