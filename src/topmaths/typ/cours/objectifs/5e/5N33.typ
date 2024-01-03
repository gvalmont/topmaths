#propriete()[
  Soustraire un nombre relatif revient au même qu'additionner son opposé.
]

#remarque(titre: "Preuve")[
  #underline()[Cas 1 :] Soustraire un nombre positif\
  On a déjà vu que 7 + (- 2) = 7 $-$ 2\
  On a aussi vu que le nombre 2 peut aussi s'écrire (+ 2) donc 7 $-$ 2 = 7 $-$ (+ 2)\
  Donc si on récapitule 7 + (- 2) = 7 $-$ 2 = 7 $-$ (+ 2)\
  Si on le lit dans l'autre sens, on a 7 $-$ (+ 2) = 7 + (- 2)
  
  #underline()[Cas 2 :] Soustraire un nombre négatif\
  Comme pour l'addition de nombres relatifs, pour y arriver on va "ajouter zéro".\
  #grid(columns: 8, column-gutter: 4pt, row-gutter: 8pt)[7 $-$ (-2)][\= 7][$-$][(-2)][+][][#vert()[0]][][][\= 7][$-$][(-2)][+][#vert()[(-2)]][#vert()[+]][#vert()[(+2)]][][\= 7][#rouge()[$-$]][#rouge()[(-2)]][#rouge()[+]][#rouge()[(-2)]][+][(+2)][][\= 7][#rouge()[+]][][#rouge()[0]][][+][(+2)][][\= 7][+][(+2)][][][][]
  Donc 7 $-$ (-2) = 7 + (+2)
]

#methode()[
  Pour soustraire un nombre relatif, on additionne son opposé.
]

#exemples()[
  #normal()[
    7 #rouge()[$-$] (#vert()[\+ 2]) = 7 #vert()[+] (#rouge()[\– 2]) = 7 #rouge()[$-$] 2 = 5\
    7 #rouge()[$-$] (#rouge()[\– 2]) = 7 #vert()[+] (#vert()[\+ 2]) = 7 #vert()[+] 2 = 9
  ]
]

#propriete(titre: "Règle des signes")[
  - On peut remplacer deux signes #vert()[identiques] qui se suivent par un "#vert()[+]"
  - On peut remplacer deux signes #rouge()[différents] qui se suivent par un "#rouge()[$-$]"
]
