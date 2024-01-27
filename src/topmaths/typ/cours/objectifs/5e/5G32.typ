#propriete()[
  La somme des trois angles d’un triangle fait (toujours) 180 °.
]

#remarque(titre: "Démonstration")[
  #place(right, block(width: 25%, image("5G32-1.png")))
  #block(width: 75%)[
    Montrons que $#rouge($hat("ABC")$) + #noir($hat("BAC")$) + #vert($hat("BCA")$) = 180 degree$

    On trace la droite $("DE")$ parallèle à la droite $("BC")$ et passant par $A$.

    $("DE")$ et $("BC")$ sont deux droites parallèles coupées par une sécante $("AB")$.\
    Les angles alternes-internes ainsi formés ont donc la même mesure.\
    En particulier $#rouge($hat("DAB")$) = #rouge($hat("ABC")$)$

    $("DE")$ et $("BC")$ sont deux droites parallèles coupées par une sécante $("AC")$.\
    Les angles alternes-internes ainsi formés ont donc la même mesure.\
    En particulier $#vert($hat("CAE")$) = #vert($hat("BCA")$)$

    $hat("DAE")$ est un angle plat et mesure donc $180 degree$.\
    Or $hat("DAE") = #rouge($hat("DAB")$) + #noir($hat("BAC")$) + #vert($hat("CAE")$) = 180 degree$\
    Donc $hat("DAE") = #rouge($hat("ABC")$) + #noir($hat("BAC")$) + #vert($hat("BCA")$) = 180 degree$
  ]
]