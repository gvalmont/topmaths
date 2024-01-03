#methode()[
  Pour convertir des unités de longueurs, on utilise un tableau de conversion :
  - au début quand on n’est pas à l’aise on le fait au brouillon ;
  - ensuite quand on est à l’aise on peut juste l’imaginer dans sa tête
]

#exemple(titre: "Exemple de tableau de conversion")[
  #align(center, table(columns: (1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr), rows: (1.5em, 1.5em, 1.5em, 1.5em, 1.5em))[kilomètre][hectomètre][décamètre][mètre][décimètre][centimètre][millimètre][km][hm][dam][m][dm][cm][mm])
]

#methode(titre: "Méthode pour utiliser un tableau de conversion")[
  - on place le chiffre des unités dans la colonne de l’unité de départ ;
  - on place la virgule au crayon à papier dans la colonne de l’unité de départ ;
  - on complète le nombre en veillant à n’avoir qu’un seul chiffre par colonne ;
  - on repère dans quelle colonne se trouve l’unité qu’on cherche ;
  - on déplace la virgule pour la mettre dans la colonne de l’unité qu’on cherche ;
  - on ajoute des zéros si besoin.
]

#exemple()[
  + Convertir 27 hm en m.
  + Convertir 0,52 km en dm
  + Convertir 18,5 cm en dam

  #align(center, table(columns: (1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr), rows: (1.5em, 1.5em, 1.5em, 1.5em, 1.5em))[
    km][hm][dam][m][dm][cm][mm][
    #bleu("2")][#place(right, gris(","))#bleu("7")][#vert("0")][#place(right, rouge(","))#vert("0")][][][][
      #place(right, gris(","))#bleu("0")][#bleu("5")][#bleu("2")][#vert("0")][#place(right, rouge(","))#vert("0")][][][
      ][][#place(right, rouge(","))#vert("0")][#vert("0")][#bleu("1")][#place(right, gris(","))#bleu("8")][#bleu("5")])
  #normal()[
    + 27 hm = 2 7#vert()[00] m
    + 0,52 km = 5 2#vert()[00] dm
    + 18,5 cm = #vert()[0#rouge()[,]0]18 5 dam
  ]
]
