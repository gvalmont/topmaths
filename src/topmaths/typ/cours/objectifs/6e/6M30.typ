#vocabulaire()[
  Dans la phrase "Un film au cinéma commence à 13h10 et dure 1h20." on parle d’heures et de minutes à deux reprises mais ce sont des heures et des minutes très différentes !

  "13h10" indique "à quel moment" le film commence.\
  "1h20" indique "combien de temps" dure le film.\

  Pour éviter de confondre les deux types "d’heures", on utilise deux mots différents :
  - Les heures qui indiquent "combien de temps" sont appelées des #motDefini()[durées].
  - Les heures qui indiquent "à quel moment" sont appelées des #motDefini()[horaires].
]

#regle(titre:"Conventions")[
  #table(
    columns: 3,
    column-gutter: 0.3em,
    row-gutter: 0.5em,
    inset: 0pt,
    align: (right, center, left),
    stroke: none,
    "1 semaine", "=", "7 jours",
    "1 jour", "=", "24 h",
    "1 h", "=", "60 min",
    "1 min", "=", "60 s"
  )
]

#exemple(titre:"Exemple 1")[
  $3,47 "h " = 3 "h " + #rouge()[$0,47 "h "$]$\
  $3,47 "h " = 3 "h " + #rouge()[$0,47 times 1 "h "$]$\
  $3,47 "h " = 3 "h " + #rouge()[$0,47 times 60 "min"$]$\
  $3,47 "h " = 3 "h " + #rouge()[$28,2 "min"$]$\
  $3,47 "h " = 3 "h " + 28 "min" + #vert()[$0,2 "min"$]$\
  $3,47 "h " = 3 "h " + 28 "min" + #vert()[$0,2 times 1 "min"$]$\
  $3,47 "h " = 3 "h " + 28 "min" + #vert()[$0,2 times 60 "s "$]$\
  $3,47 "h " = 3 "h " + 28 "min" + #vert()[$12 "s "$]$\
  $3,47 "h " = 3 "h " 28 "min" 12 "s " $
]

#exemple(titre: "Exemple 2")[
  97400 s correspondent à combien d’heures, minutes et secondes ?

  #set text(couleurPrincipale)
  #underline()[Étape 1 :]

  Comme $1 "min" = 60 "s "$, Pour savoir il y a combien de minutes dans $97 400 "s "$, on cherche il y a combien de fois 60 s dans 97400 s.

  #block(align(center, grid(
    columns: 2,
    column-gutter: 2em,
    [
      #underline()[À la main :]
      #tablex(
        columns: 3,
        auto-lines: false,
        inset: 0.3em,
        [], $97400$, vlinex(stroke: couleurPrincipale), $60$, hlinex(start: 2, end: 3, stroke: couleurPrincipale),
        $-$, $60$, $1623$, hlinex(start: 0, end: 2, stroke: couleurPrincipale),
        [], $374$, [],
        $-$, $360$, [], hlinex(start: 0, end: 2, stroke: couleurPrincipale),
        [], [#h(0.5em)$140$], [],
        $-$, [#h(0.5em)$120$], [], hlinex(start: 0, end: 2, stroke: couleurPrincipale),
        [], [#h(1em)$200$], [],
        $-$, [#h(1em)$180$], [], hlinex(start: 0, end: 2, stroke: couleurPrincipale),
        [], [#h(1.5em)$20$], []
      )
    ],
    [
      #underline()[À la calculatrice :]
      $ 97400 "s " ÷ 60 "s / min" approx 1623,3333 "min"$
      $ 1623,3333 "min" – 1623 "min" approx 0,3333 "min" $
      $ 0,3333 "min" times 60 "s / min" approx 20 "s " $
    ]
  )))

  Donc $97400 "s " = 1623 "min" + 20 "s "$

  #underline()[Étape 2 :]

  Comme $1 "h " = 60 "min"$, pour savoir il y a combien d’heures dans $1623 "min"$,
  on cherche il y a combien de fois $60 "min"$ dans $1623 "min"$.

  #block(align(center, grid(
  columns: 2,
  column-gutter: 2em,
  [
    #underline()[À la main :]
    #tablex(
      columns: 3,
      auto-lines: false,
      inset: 0.3em,
      [], $1623$, vlinex(stroke: couleurPrincipale), $60$, hlinex(start: 2, end: 3, stroke: couleurPrincipale),
      $-$, $120$, $27$, hlinex(start: 0, end: 2, stroke: couleurPrincipale),
      [], [#h(0.5em)$423$], [],
      $-$, [#h(0.5em)$420$], [], hlinex(start: 0, end: 2, stroke: couleurPrincipale),
      [], [#h(1.5em)$3$], []
    )
  ],
  [
    #underline()[À la calculatrice :]
    $ 1623 "min" div 60 "min / h" = 27,05 "h " $
    $ 27,05 "h " - 27 "h " = 0,05 "h " $
    $ 0,05 "h " times 60 "min / h" = 3 "min" $
  ]
)))
Donc $1623 "min" = 27 "h " + 3 "min"$

Donc $97400 "s " = 1623 "min" + 20 "s " = 27 "h " + 3 "min" + 20 "s "$
]

#exemple(titre:"Exemple 3")[
  $97438 "h "$ correspondent à combien de semaines, jours et heures ?

  #set text(couleurPrincipale)
  Comme $1 "jour" = 24 "h "$, pour savoir il y a combien de jours dans $97438 "h "$, on cherche il y a combien de fois $24 "h "$ dans $97438 "h "$.
  
  #block(align(center, grid(
    columns: 2,
    column-gutter: 2em,
    [
      #underline()[À la main :]
      #tablex(
        columns: 3,
        auto-lines: false,
        inset: 0.3em,
        [], $97438$, vlinex(stroke: couleurPrincipale), $24$, hlinex(start: 2, end: 3, stroke: couleurPrincipale),
        $-$, $96$, $4059$, hlinex(start: 0, end: 2, stroke: couleurPrincipale),
        [], [#h(0.5em)$143$], [],
        $-$, [#h(0.5em)$120$], [], hlinex(start: 0, end: 2, stroke: couleurPrincipale),
        [], [#h(1em)$238$], [],
        $-$, [#h(1em)$216$], [], hlinex(start: 0, end: 2, stroke: couleurPrincipale),
        [], [#h(1.5em)$22$], []
      )
    ],
    [
      #underline()[À la calculatrice :]
      $ 97438 "h " div 24 "h/jour" approx 4059,9167 "jours" $
      $ 4059,9167 "jours" – 4059 "jours" approx 0,9167 "jour" $
      $ 0,9167 "jour" times 24 "h/jour" = 22 "h " $
      $ 97438 "h " = 4059 "jours" + 22 "h " $
    ]
  )))
  Ainsi $97438 "h " = 4059 "jours" + 22 "h "$

  Comme $1 "semaine" = 7 "jours"$, pour savoir il y a combien de semaines dans $4059 "jours"$, on cherche il y a combien de fois $7 "jours"$ dans $4059 "jours"$.
  
  #block(align(center, grid(
    columns: 2,
    column-gutter: 2em,
    [
      #underline()[À la main :]
      #tablex(
        columns: 3,
        auto-lines: false,
        inset: 0.3em,
        [], $4059$, vlinex(stroke: couleurPrincipale), $7$, hlinex(start: 2, end: 3, stroke: couleurPrincipale),
        $-$, $35$, $579$, hlinex(start: 0, end: 2, stroke: couleurPrincipale),
        [], [#h(0.5em)$55$], [],
        $-$, [#h(0.5em)$49$], [], hlinex(start: 0, end: 2, stroke: couleurPrincipale),
        [], [#h(1em)$69$], [],
        $-$, [#h(1em)$63$], [], hlinex(start: 0, end: 2, stroke: couleurPrincipale),
        [], [#h(1.5em)$6$], []
      )
    ],
    [
      #underline()[À la calculatrice :]
      $ 4059 "jours" div 7 "jours / semaine" approx 579,8571 "semaines" $
      $ 579,8571 "semaines" – 579 "semaines" approx 0,8571 "semaine" $
      $ 0,8571 "semaine" times 7 "jours / semaine" = 6 "jours" $
      $ 4059 "jours" = 579 "semaines" + 6 "jours" $
    ]
  )))
  Donc $97438 "h " = 4059 "jours" + 22 "h " = 579 "semaines" + 6 "jours" + 22 "h "$
]
