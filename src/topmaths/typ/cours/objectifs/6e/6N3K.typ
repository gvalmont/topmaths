== Lorsque les dénominateurs sont égaux
#propriete()[
  Pour additionner (ou soustraire) deux fractions qui ont le même dénominateur :
  - on additionne (ou on soustrait) les numérateurs ;
  - on garde le dénominateur commun.

  $a$, $b$ et #rouge()[$c$] désignent trois nombres relatifs avec #rouge()[$c$] ≠ 0.
  
  $a/rouge(c) + b/rouge(c) = (a + b)/rouge(c)$ #h(6em) $a/rouge(c) - b/rouge(c) = (a - b)/rouge(c)$
]

#exemples()[
  #set text(couleurPrincipale)
  #v(0.5em)
  #grid(
    columns: 2,
    column-gutter: 2em,
    row-gutter: 1.5em,
    noir($A = 2/5 + 4/5$), noir($B = 7/3 - 5/3$),
    $A = (2 + 4)/5$, $B = (7 - 5)/3$,
    $A = 6/5$, $B = 2/3$,
    ["$2$ cinquièmes + $4$ cinquièmes = $6$ cinquièmes"], ["$7$ tiers – $5$ tiers = $2$ tiers"]
  )
]

== Lorsque les dénominateurs sont multiples l’un de l’autre
#methode()[
  Pour additionner ou soustraire deux fractions qui n’ont pas le même dénominateur, on doit d’abord les écrire avec le même dénominateur.
]

#exemple()[
  #set text(couleurPrincipale)
  #v(0.5em)
  #grid(
    columns: 2,
    column-gutter: 1em,
    row-gutter: 1.5em,
    noir($C = 5/12 + 2/3$), [],
    $C = 5/12 + 2/3$, $<- 3 times quest = 12$,
    $C = 5/12 + fractionMultiplieParFacteur(2, 3, 4)$, [],
    $C = 5/12 + 8/12$, [$<-$ Maintenant on a le même dénominateur, comme dans le 1.],
    $C = (5 + 8)/12$, [],
    $C = 13/12$, []

  )
]
