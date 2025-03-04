#import "../../preambule_sequence.typ": *
#import "../../preambule_photocopies.typ": * 
#show: doc => photocopies(doc, nbCols: 2)
#set text(size: 10pt)

#let truc = block(breakable:false)[
  #table(
    columns: (1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr),
    inset: 0.6em,
    align: center + horizon,
    table.cell(colspan: 2, rowspan: 2, [$"km"^2$]), table.cell(colspan: 2)[$"hm"^2$], table.cell(colspan: 2)[$"dam"^2$], table.cell(colspan: 2)[$" m "^2$], table.cell(colspan: 2, rowspan: 2)[$"dm"^2$], table.cell(colspan: 2, rowspan: 2)[$"cm"^2$], table.cell(colspan: 2, rowspan: 2, [$"mm"^2$]),
    table.cell(colspan: 2)[$"hectare"$], table.cell(colspan: 2)[$"are"$], table.cell(colspan: 2)[$"centiare"$],
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