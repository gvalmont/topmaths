#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc, titre: "6N32 : Écrire un quotient sous forme de fraction")
#show: doc => normal(doc)

#slide()[
  #propriete()[
    $#text(red, "a")$ et $#text(green, "b")$ désignent deux nombres avec $#text(green, "b") ≠ 0$.\
    Le nombre qui, multiplié par #text(green, "b") donne $#text(red, "a")$ est le quotient de $#text(red, "a")$ par #text(green, "b").

    Ainsi $#text(green, "b") times #text(red, "a")/#text(green, "b") = #text(red, "a")$
  ]
]
#slide()[
  #exemple()[
    $#text(green, "3") times "?" = #text(red, "5")$ #h(1cm) #uncover((2, 3))[la réponse est $#text(red, "5")/#text(green, "3")$]
  ]
  #uncover(3)[
    #remarque(titre: "Preuve")[
      #v(0.5em)
      $#text(green, "3") times #text(red, "5")/#text(green, "3") = (#text(green, "3") times #text(red, "5"))/#text(green, "3") = 15/#text(green, "3") = #text(red, "5")$
    ]
  ]
]