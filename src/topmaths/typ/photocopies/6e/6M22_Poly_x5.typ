#import "../../preambule_sequence.typ": *
#import "../../preambule_photocopies.typ": * 
#show: doc => photocopies(doc, nbCols: 2, paysage: true)
#set text(size: 10pt)

#let truc = block(breakable:false)[
  #table(
    columns: (1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr),
    inset: 0.6em,
    align: center + horizon,
    table.cell(colspan: 3)[$"km"^3$], table.cell(colspan: 3)[$"hm"^3$], table.cell(colspan: 3)[$"dam"^3$], table.cell(colspan: 3)[$" m "^3$], table.cell(colspan: 3, $"dm"^3$), table.cell(colspan: 3, $"cm"^3$), table.cell(colspan: 3, $"mm"^3$),
    [\ ], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
    [\ ], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
    [\ ], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []
  )
]

#for value in range(10) {
  truc
  v(2em)
}