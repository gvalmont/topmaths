== Consigne 1

#let annee = {
  datetime.today().display("[year]")
}

#let anneeMoins2000 = {
  (int(datetime.today().display("[year]")) - 2000)
}

#noir()[
  #block(stroke: black + 1pt, inset: 10pt, breakable: false)[
    #text(weight: "bold")[Consigne 1 :]\
    Effectue mentalement les calculs suivants :\
    17 + 21 – 1 =\
    148 + 199 – 99 =\
    17 + 35 – 15 =\
    131 + 256 – 56 =\
    39 + 58 – 8 =\
    187 + #annee – #anneeMoins2000 =
  ]
]

Ajouter 21 et soustraire 1 à un nombre revient à ajouter 20 à ce nombre\
Ajouter 199 et soustraire 99 à un nombre revient à ajouter 100 à ce nombre\
etc.\
#rouge()[On a simplifié des programmes de calculs pour calculer mentalement]

== Consigne 2

#noir()[
  #block(stroke: black + 1pt, inset: 10pt, breakable: false)[
    #text(weight: "bold")[Consigne 2 :]\
    Effectue mentalement les calculs suivants :\
    14 + 17 – 15 =\
    114 + 17 – 15 =\
    1 802 + 319 – 315 =\
    4 374 + 62 – 61 =\
    4 374 + 61 – 62 =\
    7 081 + 61 – 62 =
  ]
]

Ajouter 17 et soustraire 15 à un nombre revient à ajouter 2 à ce nombre.\
Ajouter 319 et soustraire 315 à un nombre revient à ajouter 4 à ce nombre.\
Ajouter 62 et soustraire 61 à un nombre revient à ajouter 1 à ce nombre.\
#attention() Mais attention ! #attention()\
#rouge()[Ajouter 61 et soustraire 62 à un nombre revient à soustraire 1 à ce nombre]\
En effet, c’est ce que montre l’exemple suivant :
  $ mat(,,#vert()[4 374] + 61 – 62,=,#vert()[\(4 373],#vert()[+],#vert()[1\)],+,61,–,62;,,,=,4 373,+,#rouge()[\(1],#rouge()[+],#rouge()[61\)],-,62;,,,=,4 373,+,,#rouge()[62],,-,62;,,,=,4 373) $
Donc : 4 374 + 61 – 62 = 4 374 – 1\
#rouge()[Simplifier un programme de calcul revient parfois à soustraire.]

== Une nouvelle notation pour simplifier l’écriture

#noir()[
  #block(stroke: black + 1pt, inset: 10pt, breakable: false, width: 70%)[
    #text(weight: "bold")[Consigne 3 :]\
    Effectue mentalement les calculs suivants :\
    #place(right, dx: -60pt)[
      #align(left)[
        3 469 + 45 – 46 =\
        15 627 + 124 – 125 =\
        823 + 313 – 314 =\
        4 586 + 32 – 33 =\
        823 + 7,2 – 8,2 =
      ]
    ]
    458 + 45 – 46 =\			
    3 469 + 124 – 125 =\		      	
    15 627 + 313 – 314 =\		
    823 + 32 – 33 =\			
    4 586 + 7 538 – 7 539 =		
  ]
]

Pour simplifier l’écriture du programme de calcul, « à un nombre, on ajoute 45 et on soustrait 46 », on aurait pu écrire : ... + 45 – 46 = ... –1.\
On a préféré écrire :\
#rouge()[\+ 45 – 46 = –1]\
qui signifie que si à un nombre, on ajoute 45 puis on soustrait 46, alors on lui soustrait 1.

Ainsi : 458 #rouge()[\+ 45 – 46] = 458 #rouge()[– 1] = 457

+124 – 125 = –1 	ainsi 15 627 + 124 – 125 = 15 627 – 1 = 15 626\
etc.
