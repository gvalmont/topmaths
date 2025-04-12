#exemple(titre: "Exemple 1")[
  Une guirlande électrique est constituée de lumières rouges et vertes.\
  Les lumières rouges s'allument toutes les 10 secondes et les vertes toutes les 6 secondes.\
  À un instant donné, on voit les lumières rouges et vertes allumées en même temps.\
  Au bout de combien de secondes ce phénomène se reproduira-t-il la prochaine fois ?\
  Les lumières rouges et vertes se seront allumées combien de fois ?

  #text(couleurPrincipale)[
    #underline()[Méthode 1 : avec un schéma]
  ]

  #set text(8pt)
  #table(
    columns: 35,
    fill: (x, y) => if calc.rem(x, 10) == 0 and y == 1 { red },
    stroke: (x, y) => if y == 0 { none } else { 0.2pt },
    ..range(35).map(t => place(if calc.rem(t, 10) == 0 [#t] else [], dx: -3.5pt, dy: -2pt)),
    [],
  )
  #table(
    columns: 35,
    fill: (x, y) => if calc.rem(x, 6) == 0 and y == 1 { green },
    stroke: (x, y) => if y == 0 { none } else { 0.2pt },
    ..range(35).map(t => place(if calc.rem(t, 6) == 0 [#t] else [], dx: -3.5pt, dy: -2pt)),
    [],
  )
  #set text(couleurPrincipale, 10pt)

  À l'aide du schéma, on peut voir que les lumières rouges et vertes s'allument en même temps au bout de $30$ secondes.

  #underline()[Méthode 2 : par le calcul]

  On commence par décomposer $10$ et $6$ en produits de facteurs premiers :
  - $#rouge()[$10$] = #noir()[$2$] times #rouge()[$5$]$
  - $#vert()[$6$] = #noir()[$2$] times #vert()[$3$]$

  On remarque que le #rouge()[$10$] a le #noir()[$2$] du #vert()[$6$] mais pas son #vert()[$3$].\
  On remarque que le #vert()[$6$] a le #noir()[$2$] du #rouge()[$10$] mais pas son #rouge()[$5$].

  En donnant au #rouge()[$10$] le #vert()[$3$] du #vert()[$6$] qui lui manque, on obtient : $#rouge()[$10$] times #vert()[$3$] = #noir()[$2$] times #rouge()[$5$] times #vert()[$3$]$ = 30

  En donnant au #vert()[$6$] le #rouge()[$5$] du #rouge()[$10$] qui lui manque, on obtient : $#vert()[$6$] times #rouge()[$5$] = #noir()[$2$] times #vert()[$3$] times #rouge()[$5$]$ = 30

  Les lumières rouges et vertes s'allumeront en même temps au bout de $30$ secondes.
  Les lumières #rouge()[rouges] se seront allumées #vert()[$3$] fois et les lumières #vert()[vertes] se seront allumées #rouge()[$5$] fois.
]

#exemple(titre: "Exemple 2")[
  Un décorateur fait des compositions florales dans son atelier pour un mariage.\
  Il souhaite repartir les $72$ fleurs rouges et les $54$ fleurs blanches dans des bouquets.\
  Il souhaite que chaque bouquet comporte le même nombre de fleurs rouges et le même nombre de fleurs blanches.

  + Décomposer en produit de facteurs premiers les nombres 72 et 54.
  + En déduire le plus grand nombre de bouquets que le décorateur pourra constituer.
  + Combien de fleurs rouges et de fleurs blanches y aura-t-il dans chaque bouquet ?
  #set text(couleurPrincipale)
  $1)#h(0.2em) 72 &= 2 times 2 times 2 times 3 times 3 = 2^3 times 3^2\
    54 &= 2 times 3 times 3 times 3 = 2 times 3^3$

  2) $72$ et $54$ ont #noir()[$2 times 3^2$] en commun dans leurs décompositions :\
  #h(1em) $72 = #noir()[$(2 times 3^2)$] times 2^2$\
  #h(1em) $54 = #noir()[$(2 times 3^2)$] times 3$\
  Le plus grand nombre de bouquets que le décorateur pourra constituer est #noir()[$2 times 3^2 = 18$].

  3) Chaque bouquet contiendra $72 / #noir()[$18$] = 4$ fleurs rouges et $54 / #noir()[$18$] = 3$ fleurs blanches.
]
