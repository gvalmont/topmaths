#methode()[
  Pour calculer des durées ou des horaires on fait attention à bien calculer les minutes avec les minutes et les heures avec les heures :
  - si le résultat d'une addition dépasse les $60$ minutes, on enlève $60 min$ et on ajoute $1 "h "$ ;
  - si on veut faire une soustraction mais qu'on n'a pas assez de minutes, on ajoute $60 "min"$ et on enlève $1 "h "$.
  Même chose pour $60$ secondes, $24$ heures etc.
]

#exemple(titre: "Exemple 1")[
  Calculer $4 "h " 44 "min" + 5 "h " 49 "min"$

  #set text(couleurPrincipale)
  #place(
    dx: 3.2em,
    dy: 1.9em,
    circle(
      inset: 0pt,
      stroke: red + 1pt,
      radius: 1em,
      )[
        #set align(center + horizon)
        #set text(red, size: 0.8em)
        $+ 1$
      ]
  )
  #place(
    dx: 9.4em,
    dy: 1.9em,
    circle(
      inset: 0pt,
      stroke: green + 1pt,
      radius: 1em,
      )[
        #set align(center + horizon)
        #set text(green, size: 0.8em)
        $- 60$
      ]
  )
  #place(
    dy: 3.2em,
    line(length: 13em, stroke: couleurPrincipale + 0.4pt)
  )
  #tablex(
    columns: 6,
    column-gutter: 1em,
    auto-lines: false,
    inset: 0.3em,
    [], $4$, [h], $4$, $2$, [min],
    $+$, $2$, [h], $3$, $7$, [min], hlinex(stroke: couleurPrincipale),
    $=$, $6$, [h], $7$, $9$, [min],
    $=$, $7$, [h], $1$, $9$, [min]
  )
]

#exemple(titre: "Exemple 2")[
  Calculer $7 "h " 32 "min" - 4 "h " 50 "min"$

  #set text(couleurPrincipale)
  #place(
    dx: 3.2em,
    dy: 0.7em,
    circle(
      inset: 0pt,
      stroke: red + 1pt,
      radius: 1em,
      )[
        #set align(center + horizon)
        #set text(red, size: 0.8em)
        $- 1$
      ]
  )
  #place(
    dx: 9.4em,
    dy: 0.7em,
    circle(
      inset: 0pt,
      stroke: green + 1pt,
      radius: 1em,
      )[
        #set align(center + horizon)
        #set text(green, size: 0.8em)
        $+ 60$
      ]
  )
  #place(
    dy: 2em,
    line(length: 13em, stroke: couleurPrincipale + 0.4pt)
  )
  #tablex(
    columns: 6,
    column-gutter: 1em,
    auto-lines: false,
    inset: 0.3em,
    [], $6$, [h], $9$, $2$, [min],
    [], $7$, [h], $3$, $2$, [min],
    $-$, $4$, [h], $5$, $0$, [min], hlinex(stroke: couleurPrincipale),
    $=$, $2$, [h], $4$, $2$, [min]
  )
]
