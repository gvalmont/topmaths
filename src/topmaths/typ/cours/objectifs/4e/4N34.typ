#remarque()[
  Pour simplifier la lecture de nombres très grands et très petits, on peut utiliser des préfixes.
  #block(width: 80%)[
    #table(
      columns: (2fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr),
      align: center,
      [Puissance], $10^12$, $10^9$, $10^6$, $10^3$, $10^0$, $10^(-3)$, $10^(-6)$, $10^(-9)$,
      [Préfixe], [T], [G], [M], [k], [], [m], [μ], [n],
      [Se lit], [Tera], [Giga], [Mega], [Kilo], [], [Milli], [Micro], [Nano],
    )
  ]
]

#exemples()[
  $3,8 M V = 3,8 times 10^6 V = 3,8 times num("1 000 000") V = num("3 800 000") V$\
  $num("4 000 000 000 000") o = 4 times num("1 000 000 000 000") o = 4 times 10^12 o = 4 T o$\
  $0,002 5 s = 2,5 times 0,001 s = 2,5 times 10^(-3) s = 2,5 m s$
]
