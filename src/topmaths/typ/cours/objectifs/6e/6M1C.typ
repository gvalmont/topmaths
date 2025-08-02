#remarque()[
  Un cercle est vide à l’intérieur (on dit qu’il est creux) alors qu’un disque est rempli (on dit qu’il est plein)
  #set text(black)

  #box()[
    #circle(radius: 2em, stroke: gray)
    #align(center)[Cercle]
  ]
  #h(2em)
  #box()[
    #circle(radius: 2em, fill: gray)
    #align(center)[Disque]
  ]
]

#proprietes()[
  $"Périmètre d’un cercle" = 2 times π times "rayon"$\
  $"Aire d’un disque" = π times "rayon" times "rayon"$
]

#exemple()[
  #place(dx: 9em)[
    #grid(
      columns: 2,
      row-gutter: 0.5em,
      column-gutter: 0.3em,
      "Périmètre", $= 2 times π times "rayon"$,
      [], $= 2 times π times 9 "cm"$,
      [], $= 18 "cm" times π$,
      [], $≈ 56,5 "cm"$,
      [], [],
      align(right, "Aire"), $= π times "rayon" times "rayon"$,
      [], $= π times 9 "cm" times 9 "cm"$,
      [], $= π times 81 "cm"^2$,
      [], $≈ 254,5 "cm"^2$)
  ]
  #v(1em)
  #image("6M13-1.png", height: 8em)
]