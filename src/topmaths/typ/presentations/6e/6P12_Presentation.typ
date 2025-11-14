#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc)

#slide()[
  #regle(titre: "Convention d'écriture")[
    Si $p$ désigne un nombre, le quotient $p/100$ peut aussi s’écrire $p %$.
  ]

  #only((2, 3, 4))[
    #exemples()[
      #block()[
        $ (12,435)/100 = #uncover((3, 4))[$12,435$] % $
      ]
      #block()[
        $ 3/8 = #uncover(4)[$ 3 ÷ 8 = 0,375 = (37,5)/100 = 37,5 % $] $
      ]
    ]
  ]
]
