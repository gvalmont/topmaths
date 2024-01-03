#propriete(titre: "Réciproque du théorème de Thalès")[
  Dans le cas où les points $("BM")$ et $("CN")$ sont sécantes en $"A "$, si #noir()[$"AB"/"AM" = "AC"/"AN" = "BC"/"MN"$],#linebreak()
  alors #vert()[les droites (BC) et (MN) sont parallèles].
  #place(top + right, image("4G32-1.png", width: 18%), dx: 20%)
]
#remarque()[
  Pour utiliser la réciproque du théorème de Thalès, on n’a pas besoin#linebreak()
  d’avoir l’égalité entre les trois rapports, une égalité entre deux rapports suffit.
]
#exemple()[
  $"AB" = 5,4 "cm" "AD" = 7,2 "cm" "AC" = 6,6 "cm" "AE" = 8,8 "cm"$#linebreak()
  Les droites $("BC")$ et $("DE")$ sont-elles parallèles ?#linebreak()
  #set text(couleurPrincipale)
  Les droites $("BD")$ et $("CE")$ sont sécantes en $"A "$.
  
  $"AB"/"AD" = "5,4"/"7,2" = 0,75$

  On obtient le même résultat, donc d’après la réciproque#linebreak()du théorème de Thalès, les droites $("DE")$ et $("BC")$ sont parallèles.
  #place(top + right, image("4G32-2.png", width: 40%), dx: 45%)
]
#propriete(titre: "Contraposée du théorème de Thalès")[
  Dans le cas où les droites $("BM")$ et $("CN")$ sont sécantes en $"A "$,#linebreak()si #noir()[$"AB"/"AM" != "AC"/"AN" != "BC"/"MN"$], alors #vert()[les droites $("BC")$ et $("MN")$ ne sont pas parallèles].
  #place(top + right, image("4G32-1.png", width: 20%), dx: 25%, dy: -2%)
]
#remarque()[
  Pour utiliser la contraposée du théorème de Thalès, on a juste besoin de montrer que deux rapports ne sont pas égaux.
]
#exemple()[
  Les droites $("BC")$ et $("DE")$ sont-elles parallèles ?#linebreak()
  #set text(couleurPrincipale)
  Les droites $("BE")$ et $("CD")$ sont sécantes en $"A "$.
  
  $"AE"/"AB" = "1,8"/"4,8" = 0,375$

  $"AD"/"AC" = "2,4"/5 = 0,48$

  On n’obtient pas le même résultat, donc#linebreak() d’après la contraposée du théorème de Thalès,#linebreak() les droites $("DE")$ et $("BC")$ ne sont pas parallèles.
  #place(top + right, image("4G32-3.png", width: 40%), dx: 45%)
]
