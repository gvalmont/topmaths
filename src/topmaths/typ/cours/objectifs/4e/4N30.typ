#regle(titre: "Notation")[
  $a$ désigne un nombre relatif et $n$ un nombre entier avec $n ≥ 2$.\
  $a^n$ désigne le produit de $n$ facteurs égaux à $a$.\
  #grid(
    columns: 2,
    column-gutter: 0.5em,
    row-gutter: 1em,
    align: center,
    $a^n =$, $a times a times … times a$,
    [], [($n$ facteurs)],
  )
  $a^n$ est une puissance du nombre $a$.\
  $a^n$ se lit "$a$ exposant $n$".\
  Par convention, $a^1 = a$ et lorsque $a ≠ 0$, $a^0 = 1$.
]

#exemples()[
  - #grid(
      columns: 3,
      column-gutter: 0.5em,
      row-gutter: 1em,
      align: center,
      $2^5 =$, $2 times 2 times 2 times 2 times 2$, $= 32$,
      [], [(5 facteurs)], [],
    )
  - #grid(
      columns: 3,
      column-gutter: 0.5em,
      row-gutter: 1em,
      align: center,
      $(-5)^3 =$, $(-5) times (-5) times (-5)$, $= - 125$,
      [], [(3 facteurs)], [],
    )
  - $(3 / 2)^2 = 3 / 2 times 3 / 2 = 9 / 4$
  - $0^n = 0$ (avec $n ≥ 1$)
  - $1^n = 1$
  - $a^0 = 1$
  - $a^1 = a$
]

#vocabulaire()[
  $a^2$ se lit aussi "$a$ au carré".\
  $a^3$ se lit aussi "$a$ au cube".
]
