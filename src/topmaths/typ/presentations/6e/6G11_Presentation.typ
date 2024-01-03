#import "../../preambule_presentation.typ": *
#show: doc => presentation(doc, titre: "l'abstraction")

#slide()[
  #place(left)[
    #box(width: 50%)[
        #titre("L'art abstrait")
        - Ne cherche pas forcément à représenter le réel
        #uncover((2, 3))[- Même s'il peut s'en inspirer]
        #uncover(3)[- Avec beaucoup d'imagination]
      ]
    ]
  #place(right)[
    #box(width: 45%)[
        #align(center)[
          #only(1)[
            #image("6G11_Presentation-1.jpg")
            #text(size: 0.5em)[#link("https://fr.wikipedia.org/wiki/Diego_Rivera")[Diego Rivera], 1915, #link("https://en.wikipedia.org/wiki/Portrait_of_Ram%C3%B3n_G%C3%B3mez_de_la_Serna")[Portrait of Ramón Gómez de la Serna]]
          ]
          #only(2)[
            #image("6G11_Presentation-2.png")
            #text(size: 0.5em)[#link("https://fr.wikipedia.org/wiki/Sophie_Taeuber-Arp")[Sophie Taeuber Arp], 1918, #link("https://blogs.mediapart.fr/eric-monsinjon/blog/130122/les-marionnettes-de-sophie-taeuber-arp-lassaut-de-lart-total-13")[Dada Marionettes]]
          ]
          #only(3)[
            #image("6G11_Presentation-3.png")
            #text(size: 0.5em)[#link("https://fr.wikipedia.org/wiki/Piet_Mondrian")[Piet Mondrian], 1921, #link("https://fr.wikipedia.org/wiki/Composition_avec_grand_plan_rouge,_jaune,_noir,_gris_et_bleu")[Composition avec grand plan rouge, jaune, noir, gris et bleu]]
          ]
      ]
    ]
  ]
]

#slide()[
  #titre()[Ça vous dirait de faire votre propre composition en rouge, jaune, bleu et noir ?]
  #align(horizon + center)[#image("6G11_Presentation-4.png", height: 66%)]
]