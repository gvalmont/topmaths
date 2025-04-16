#proprietes()[
  Quel que soit le nombre entier $n ≥ 1$,
  #grid(
    columns: 9,
    column-gutter: 0.5em,
    row-gutter: 1em,
    align: center,
    $10^n =$, $10 times … times 10$, $=$, $10…0$, h(3em), $10^(-n) = 1 / 10^n=$, $1 / (10…0)$, $=$, $0,0…01$,
    [], noir()[$n$ facteurs], [], noir()[$n$ zéros], [], [], noir()[$n$ zéros], [], noir()[$n$ zéros],
  )
]

#exemples()[
  $10^3 = num("1 000")$ mille\
  $10^6 = num("1 000 000")$ un million\
  $10^9 = num("1 000 000 000")$ un milliard\
  $10^(-3) = num("0,001")$ un millième\
  $10^(-6) = num("0,000 001")$ un millionième
]

#proprietes()[
  $n$ désigne un nombre entier positif.\
  Pour multiplier un nombre décimal par $10^n$, il suffit la virgule de $n$ rangs vers la droite (en complétant éventuellement par des zéros).\
  Pour multiplier un nombre décimal par $10^(-n)$, il suffit la virgule de $n$ rangs vers la gauche (en complétant éventuellement par des zéros).
]

#exemples()[
  $3,5 times 10^4 = num("35 000")$\
  $3,5 times 10^(-4) = num("0,000 35")$
]
