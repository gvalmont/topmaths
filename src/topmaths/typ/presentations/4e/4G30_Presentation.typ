#import "../../preambule_presentation.typ": *
#import "../../preambule_sequence.typ": *
#show: doc => presentation(doc)
#show: doc => normal(doc)

#slide()[
  #set text(size: 18pt)
  #grid(
    align: center,
    columns: 3,
    inset: 0.3em,
    [Deux triangles sont égaux s'ils ont], [leurs 3 côtés], [deux à deux de même mesure],
    [], grid.vline(stroke: couleurPrincipale), [1 angle compris entre 2 côtés], grid.vline(stroke: couleurPrincipale), [],
    [], [1 côté compris entre 2 angles], []
  )
]
