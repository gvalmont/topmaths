#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc, titre: "Soustraction de nombres relatifs")

#slide()[
  #text(size: 2em)[
    #text(weight: "bold")[Consigne 9 :]
    #align(center)[
      #table(columns: 3, stroke: none, [
        \+ 7 – (+ 2)\
        \– 7 – (+ 2)\
        \+ 7 – (– 2)\
        \– 7 – (– 2)
      ], [
        \=\
        \=\
        \=\
        \=
      ], h(1.3cm))
    ]
  ]
]

#slide()[
  #text(fill: couleurPrincipale, size: 0.95em)[
    #titrePrincipal("Séquence 7 : Nombres relatifs 2")
    #propriete()[
      Soustraire un nombre relatif revient au même qu'additionner son opposé.
    ]
    #uncover((beginning: 2))[
      #exemples()[
        #normal()[
          7 #rouge()[$-$] (#vert()[\+ 2]) = #uncover((beginning: 3))[7 #vert()[+] (#rouge()[\– 2]) =] #uncover((beginning: 4))[7 #rouge()[$-$] 2 = 5]\
          7 #rouge()[$-$] (#rouge()[\– 2]) = #uncover((beginning: 5))[7 #vert()[+] (#vert()[\+ 2]) =] #uncover((beginning: 6))[7 #vert()[+] 2 = 9]
        ]
      ]
    ]
    #uncover((beginning: 7))[
      #propriete(titre: "Règle des signes")[
        - On peut remplacer deux signes #vert()[identiques] qui se suivent par un "#vert()[+]"
        - On peut remplacer deux signes #rouge()[différents] qui se suivent par un "#rouge()[$-$]"
      ]
    ]
  ]
]
