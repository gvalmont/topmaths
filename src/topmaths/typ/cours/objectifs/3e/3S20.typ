#definition()[
  Une #motDefini()[expérience aléatoire à deux épreuves] est constituée de deux expériences aléatoires qui se suivent.
]

#exemples()[
  - On peut par exemple faire tourner une roue deux fois.
  - On peut aussi tirer à pile ou face, puis piocher une boule.
  - Ou encore choisir au hasard un short, puis choisir au hasard un tee shirt.
]

#definition()[
  Lorsque le résultat de la deuxième épreuve ne dépend pas du résultat de la première, on dit que les deux épreuves sont #motDefini()[indépendantes].
]

#exemple()[
  Les épreuves des trois exemples précédents sont indépendantes.\
  Si on tire deux fois à la suite une boule dans une urne les deux épreuves ne sont pas indépendantes (si par exemple je tire une boule noire à la première épreuve, il y aura une boule noire de moins de disponible à la deuxième épreuve)
]

#methode()[
  Pour étudier une expérience aléatoire à deux épreuves, on peut utiliser un tableau à double entrée.
]

#exemple()[
  Dans son armoire, Tom a 1 short bleu, 1 short rouge et 1 short vert.\
  Il a aussi 1 tee-shirt bleu, 2 tee-shirts rouges et 1 tee-shirt noir.\
  Il prend au hasard un short et un tee-shirt dans son armoire.

  + Quelle est la probabilité qu’il soit habillé tout en rouge ?
  + Quelle est la probabilité qu’il soit habillé entièrement de la même couleur~?
  + Quelle est la probabilité qu'il soit habillé de deux couleurs différentes~?

  #set text(couleurPrincipale)
  On peut noter toutes les issues dans un tableau à double entrée :

  #block()[
    #set text(black)
    #show "R": rouge
    #show "Rouge": rouge
    #show "B": bleu
    #show "Bleu": bleu
    #show "V": vert
    #show "Vert": vert
    #table(
      columns: 5,
      align: horizon + center,
      [
        #place(top + right)[Tee-shirt]
        #place(bottom + left)[Short]
        #math.cancel(inverted: true)[#phantom()[Tee-shirt - Short\ Tee-shirt - Short]]
      ],
      [Bleu (B)],
      [Rouge (R)],
      [Rouge (R)],
      [Noir (N)],

      [Bleu], [(B ; B)], [(B ; R)], [(B ; R)], [(B ; N)],
      [Rouge], [(R ; B)], [(R ; R)], [(R ; R)], [(R ; N)],
      [Vert], [(V ; B)], [(V ; R)], [(V ; R)], [(V ; N)],
    )
  ]


  + On peut lire sur le tableau qu’il y a $2$ possibilités pour qu’il soit tout en rouge sur un total de $12$ possibilités. La probabilité qu’il soit habillé tout en rouge est donc $2 / 12 = 1 / 6$.
  + On peut lire sur le tableau qu’il y a~:
    - 1 possibilité pour qu’il soit tout en bleu~;
    - 2 possibilité pour qu’il soit tout en rouge~;
    sur un total de 12 possibilités.\
    La probabilité qu’il soit habillé entièrement de la même couleur est donc $(1 + 2) / 12 = 3 / 12 = 1 / 4$
  + On peut lire sur le tableau qu'il y a 9 possibilités pour qu'il soit habillé de deux couleurs différentes sur un total de 12 possibilités.\
    La probabilité qu'il soit habillé de deux couleurs différentes est donc $9 / 12 = 3 / 4$.\
    (On aurait pu aussi remarquer qu'être habillé de deux couleurs différentes est l'événement contraire d'être habillé de la même couleur. Sa probabilité est donc $1 - 1 / 4 = 3 / 4$)\
]
