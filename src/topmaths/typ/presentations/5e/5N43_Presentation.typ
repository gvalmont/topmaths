#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc, titre: "5N43 : Décomposer un nombre entier en produit de facteurs premiers inférieurs à 30")
#show: doc => normal(doc)
#slide()[
#exemple()[
  Décomposer 1008 en produit de facteurs premiers.

  #only(2)[
    #set text(blue)
    #let c(t) = align(center)[$#t$]
    #let cr(t) = align(center, text(red)[$#t$])
    #place(line(end: (0em, 8.3em), stroke: blue + 1pt), dy:0.1em, dx:2.4em)
    #table(
      columns: 2,
      stroke: none,
      [#c(1008)], [#cr(2)],
      [#c(504)], [#cr(2)],
      [#c(252)], [#cr(2)],
      [#c(126)], [#cr(2)],
      [#c(63)], [#cr(3)],
      [#c(21)], [#cr(3)],
      [#c(7)], [#cr(7)],
      [#c(1)]
    )
    $1008 = #rouge()[2] times #rouge()[2] times #rouge()[2] times #rouge()[2] times #rouge()[3] times #rouge()[3] times #rouge()[7]$
  ]
]
]
