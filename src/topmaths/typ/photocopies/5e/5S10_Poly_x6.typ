#import "../../preambule_photocopies.typ": * 
#show: doc => photocopies(doc, paysage: true, nbCols: 2)

#let janvier = (30, 27, 30, 27, 30, 27, 27, 30, 26, 27, 30, 26, 30, 26, 29, 30, 29, 28, 30, 26, 27, 27, 27, 26, 30, 27, 29, 30, 30, 28, 30)
#let fevrier = (26, 30, 26, 30, 30, 30, 26, 26, 29, 26, 26, 30, 27, 27, 26, 26, 30, 30, 29, 29, 30, 26, 30, 29, 27, 30, 28, 30)

#let exercice = [
  #block(breakable: false)[
  Voici les températures en degrés relevées à Saint Gilles en Janvier et en Février :\
  Est-ce qu'il y a plus de chance de faire 30° en Janvier ou en Février ?\

    #gras()[Températures en Janvier :]\
    #for value in janvier {
      $value$
      h(8mm)
    }

    #gras()[Températures en Février :]\
    #for value in fevrier {
      $value$
      h(8mm)
    }
  ]
]

#for i in "123456" {
  exercice
  if i != "6" {v(1cm)}
}