#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc, titre: "6M31 : Calculer des durées et des horaires")
#show: doc => normal(doc)

#for i in range(12) {
  align(center, slide()[
    #let url = "6M31-" + str(i + 1) + ".png"
    #image(url)
  ])
}
