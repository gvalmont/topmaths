#import "../../preambule_photocopies.typ": * 
#import "../../preambule_sequence.typ": * 
#show: doc => photocopies(doc, paysage: true, nbCols: 2, marge: 0.8cm)


#for i in range(6) {
  methodes()[
    Pour calculer l'aire d'une figure complexe, il y a deux possibilités :
    + on la découpe en figures dont on sait calculer les aires et on les additionne ;
      #image("../../cours/objectifs/6e/6M11-1.png", height: 4em)
    + on la découpe en figures dont on sait calculer les aires et on les soustrait.
      #image("../../cours/objectifs/6e/6M11-2.png", height: 4em)
  ]
}