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
  Dans son armoire, Tom a 3 shorts bleus, 1 short rouge et 2 shorts verts.\
  Il a aussi 2 tee-shirts bleus et 3 tee-shirts rouges.\
  Il prend au hasard un short et un tee-shirt dans son armoire.

  + Quelle est la probabilité qu’il soit habillé tout en rouge ?
  + Quelle est la probabilité qu’il soit habillé entièrement de la même couleur~?

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
      columns: 6,
      align: horizon + center,
      [
        #place(top + right)[Tee-shirt]
        #place(bottom + left)[Short]
        #math.cancel(inverted: true)[#phantom()[Tee-shirt - Short\ Tee-shirt - Short]]
      ], [Bleu (B)], [Bleu (B)], [Rouge (R)], [Rouge (R)], [Rouge (R)],
      [Bleu], [(B ; B)], [(B ; B)], [(B ; R)], [(B ; R)], [(B ; R)],
      [Bleu], [(B ; B)], [(B ; B)], [(B ; R)], [(B ; R)], [(B ; R)],
      [Bleu], [(B ; B)], [(B ; B)], [(B ; R)], [(B ; R)], [(B ; R)],
      [Rouge], [(R ; B)], [(R ; B)], [(R ; R)], [(R ; R)], [(R ; R)],
      [Vert], [(V ; B)], [(V ; B)], [(V ; R)], [(V ; R)], [(V ; R)],
      [Vert], [(V ; B)], [(V ; B)], [(V ; R)], [(V ; R)], [(V ; R)]
    )
  ]


  + On peut lire sur le tableau qu’il y a $3$ possibilités pour qu’il soit tout en rouge sur un total de $30$ possibilités. La probabilité qu’il soit habillé tout en rouge est donc $3/30$.
  + On peut lire sur le tableau qu’il y a~:
    - 6 possibilités pour qu’il soit tout en bleu~;
    - 3 possibilités pour qu’il soit tout en rouge~;
    - 0 possibilités pour qu’il soit tout en vert~;
    sur un total de 30 possibilités.\
    La probabilité qu’il soit habillé entièrement de la même couleur est donc $(6+3+0)/30 = 9/30$
]