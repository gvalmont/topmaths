#import "../../preambule_sequence.typ": *
#import "../../preambule_photocopies.typ": * 
#show: doc => photocopies(doc, nbCols: 2)
#set text(size: 10pt)

#let truc = block(breakable:false)[
  #tablex(
    columns: (1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr),
    inset: 0.6em,
    align: center + horizon,
    colspanx(2, rowspanx(2)[$"km"^2$]), (), colspanx(2)[$"hm"^2$], (), colspanx(2)[$"dam"^2$], (), colspanx(2)[$" m "^2$], (), colspanx(2, rowspanx(2)[$"dm"^2$]), (), colspanx(2, rowspanx(2)[$"cm"^2$]), (), colspanx(2, rowspanx(2)[$"mm"^2$]), (),
    (), (), colspanx(2)[$"hectare"$], (), colspanx(2)[$"are"$], (), colspanx(2)[$"centiare"$], (), (), (), (), (), (), (),
    [\ ], [], [], [], [], [], [], [], [], [], [], [], [], [],
    [\ ], [], [], [], [], [], [], [], [], [], [], [], [], [],
    [\ ], [], [], [], [], [], [], [], [], [], [], [], [], [],
    [\ ], [], [], [], [], [], [], [], [], [], [], [], [], []
  )
]

#for value in range(10) {
  truc
  v(2em)
}