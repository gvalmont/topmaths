#definition(titre: "Définitions-exemples")[
  $a$, $b$ et $c$ désignent trois nombres relatifs.
  On dit par exemple :
  - que $a$ et $b$ sont dans le #motDefini()[ratio] $3:4$ si $a / 3 = b / 4$
  - que trois nombres $a$, $b$ et $c$ sont dans le #motDefini()[ratio] $2:3:7$ si $a / 2 = b / 3 = c / 7$
]

#remarque()[
  Les ratios servent à représenter un partage qui n'est pas équitable.
]

#exemple()[
  Tic, Tac et Toc veulent se partager leurs $238$ noisettes suivant le ratio $3:5:9$
  Combien chacun en aura-t-il ?

  #set text(couleurPrincipale)
  Si on distribue $3$ à Tic, $5$ à Tac et $9$ à Toc, alors on en distribue $17$.\
  Si on distribue à nouveau $3$ à Tic, $5$ à Tac et $9$ à Toc, alors on en distribue encore $17$, ce qui fait qu'on en a distribué au total $17 times 2 = 34$.\
  Il faudra distribuer combien de fois $17$ noisettes pour distribuer les $238$ noisettes ?\
  $238 div 17 = 14$ donc $17 times 14 = 238$\
  En distribuant $14$ fois $17$ noisettes de cette façon, on aura distribué les $238$ noisettes.\
  Tic en aura $3 times 14 = 42$, Tac en aura $5 times 14 = 70$ et Toc en aura $9 times 14 = 126$.

  On peut résumer cela de la façon suivante :
  #align(center, grid(
    columns: 7,
    row-gutter: 0.9em,
    column-gutter: 1em,
    "Tic", [], "Tac", [], "Toc", [], "Total",
    $#flecheProportionnalite(14, cote: "gauche")3$, $+$, $5$, $+$, $9$, $=$, $17#flecheProportionnalite(14)$,
    $42$, $+$, $70$, $+$, $126$, $=$, $238$
  ))
  Tic aura $42$ noisettes, Tac en aura $70$ et Toc en aura $126$.
]