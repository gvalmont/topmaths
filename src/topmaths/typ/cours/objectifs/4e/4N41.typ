#methode()[
  Pour décomposer un nombre en un produit de facteurs premiers, on le divise autant que possible par des nombres premiers
]

#exemple()[
  Décomposer $1008$ en produit de facteurs premiers.

  #set text(couleurPrincipale)
  $1008$ est divisible par $2$ (car il se termine par $8$)\
  $1008 = rouge(2) times vert(504)$ (qui est divisible par $2$ car il se termine par $4$)\
  $vert(504) = rouge(2) times vert(252)$ (qui est divisible par $2$ car il se termine par $2$)\
  $vert(252) = rouge(2) times vert(126)$ (qui est divisible par $2$ car il se termine par $6$)\
  $vert(126) = rouge(2) times vert(63)$ (qui est divisible par $3$ car $6 + 3 = 9$ qui est divisible par $3$)\
  $vert(63) = rouge(3) times vert(21)$ (qui est divisible par $3$ car $2 + 1 = 3$ qui est divisible par $3$)\
  $vert(21) = rouge(3) times rouge(7)$ (on s’arrête là car $7$ est un nombre premier)

  Si on refait les calculs dans l’autre sens, on obtient :\
  $rouge(7) times rouge(3) times rouge(3) times rouge(2) times rouge(2) times rouge(2) times rouge(2) = 1008$\
  On a bien trouvé une décomposition en facteurs premiers de $1008$.
]

#remarque()[
  On peut aussi le rédiger autrement :
  #grid(
    columns: 2,
    inset: 0.5em,
    $1008$, grid.vline(stroke: couleurPrincipale), rouge($2$),
    $504$, rouge($2$),
    $252$, rouge($2$),
    $126$, rouge($2$),
    $63$, rouge($3$),
    $21$, rouge($3$),
    $7$, rouge($7$),
    $1$
  )
]

#methode()[
  Pour décomposer un nombre en produit de facteurs premiers plus efficacement, on peut garder en tête (ou sur la calculatrice) les #vert()[résultats intermédiaires] et n’écrire que les #rouge()[facteurs premiers].
]

#exemple()[
  Décomposer 2100 en produit de facteurs premiers.

  #set text(couleurPrincipale)
  #grid(
    align: center,
    columns: 13,
    inset: 0.5em,
    vert([En tête :]), [], [], vert($1050$), [], vert($525$), [], vert($175$), [], vert($35$), [], [], [],
    [Sur la feuille :], $2100 = $, rouge($2$), $times$, rouge($2$), $times$, rouge($3$), $times$, rouge($5$), $times$, rouge($5$), $times$, rouge($7$)
  )
]