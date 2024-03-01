#import "../../preambule_sequence.typ": *
#import "../../preambule_photocopies.typ": * 
#show: doc => photocopies(doc, nbCols: 1)

#let truc = [
  Calculez l’aire de la surface recouverte de verdure du rond-point de Gillot.\
  Vous serez aussi évalués sur votre capacité à chercher, alors n’hésitez pas à écrire vos idées, ce que vous avez essayé et à faire des schémas.

  #align(center, image("6M14-1.png", height: 42%))
]

#for value in range(2) {
  truc
  v(1em)
}