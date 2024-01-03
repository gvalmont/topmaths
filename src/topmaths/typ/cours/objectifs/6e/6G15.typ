#let BLEU = (100%, 100%, 0%, 0%)
#let VERT = (100%, 0%, 100%, 0%)
#let bleu(texte) = {
  text(fill: cmyk(BLEU.at(0), BLEU.at(1), BLEU.at(2), BLEU.at(3)), texte)
}
#let vert(texte) = {
  text(fill: cmyk(VERT.at(0), VERT.at(1), VERT.at(2), VERT.at(3)), texte)
}

#propriete()[
  Si #degrade(BLEU, VERT, "deux droites") sont #degrade(BLEU, VERT, "parallèles") et si une #rouge()[troisième droite] est #motDefini()[perpendiculaire] à #bleu()[l'une] alors elle est #motDefini()[perpendiculaire] à #vert()[l'autre].
]

#exemple()[
  #implication(image("6G15-1.png"), image("6G15-2.png"), nbConditions: 2)
]

#propriete()[
  Si #degrade(BLEU, VERT, "deux droites") sont #motDefini()[perpendiculaires] à une #rouge()[même droite], alors elles sont #motDefini()[parallèles] #degrade(BLEU, VERT, "entre elles")
]

#exemple()[
  #implication(image("6G15-3.png"), image("6G15-4.png"), nbConditions: 2)
]

#propriete()[
  Si #degrade(BLEU, VERT, "deux droites") sont #motDefini()[parallèles] à une #rouge()[même droite], alors elles sont #motDefini()[perpendiculaires] #degrade(BLEU, VERT, "entre elles")
]

#exemple()[
  #implication(image("6G15-5.png"), image("6G15-6.png"), nbConditions: 2)
]
