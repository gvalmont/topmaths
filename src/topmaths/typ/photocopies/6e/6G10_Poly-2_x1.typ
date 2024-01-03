
#import "../../preambule_sequence.typ": * 
#show: doc => sequence(doc)

#table(
  columns: (0.75fr, 0.65fr, 0.67fr, 2fr),
  align: horizon + center,
  stroke: (paint: cmyk(0%,0%,0%,70%), thickness: 0.5pt),
  [Objet], [Tracé], [Notation], [Définition],
  [Deux points\ distincts], image("../../cours/objectifs/6e/6G10-1.png", width: 50pt), [A et B], [Un #motDefini()[point] désigne un emplacement.\
Deux points sont #motDefini()[distincts] s'ils ne sont pas situés au même endroit.],
  [Deux points\ confondus], image("../../cours/objectifs/6e/6G10-2.png", width: 15pt), [A et B], [Deux points sont #motDefini()[confondus] s'ils sont situés exactement au même endroit.],
  [Une droite],
    table(align: horizon + center, stroke:none, image("../../cours/objectifs/6e/6G10-3.png", height: 20pt), image("../../cours/objectifs/6e/6G10-4.png", height: 20pt)),
    table(align: center, stroke:none, rows: 20pt, [(d)\ \ ], [(AB) ou (BA)]),
    [Une #motDefini()[droite] est une ligne droite illimitée des deux côtés.],
  [Une\ demi-droite], image("../../cours/objectifs/6e/6G10-5.png", width: 70pt), [\[AB)], [Une #motDefini()[demi-droite] d'#motDefini()[origine] A qui passe par le point B est une portion de droite qui commence en A et qui est illimitée du coté de B.],
  [Un segment], image("../../cours/objectifs/6e/6G10-6.png", width: 70pt), [[AB] ou [BA]], [Le #motDefini()[segment] d'#motDefini()[extrémités] A et B est la portion de droite située entre A et B.],
  [Milieu\ d'un segment], image("../../cours/objectifs/6e/6G10-7.png", width: 70pt), [I appartient à [AB] et IA = IB.], [Le #motDefini()[milieu] d'un segment est le point de ce segment qui le partage en deux segments de même longueur.],
  [Points alignés], image("../../cours/objectifs/6e/6G10-8.png", width: 70pt), [C appartient à (AB) \ D n'appartient pas à (AB)], [Des points sont #motDefini()[alignés] s’ils appartiennent à la même droite],
  [Droites sécantes], image("../../cours/objectifs/6e/6G10-9.png", width: 70pt), [(d) et (d’)\ sont sécantes\ en A], [Deux droites #motDefini()[sécantes] se "coupent" en un seul point appelé #motDefini()[point d'intersection].],
  [Droites\ perpendiculaires], image("../../cours/objectifs/6e/6G10-10.png", width: 70pt), [(AB) ⟂ (AC)], [Deux droites #motDefini()[perpendiculaires] se coupent en formant un angle droit.],
  [Droites\ parallèles], image("../../cours/objectifs/6e/6G10-11.png", width: 70pt), [(AB) \/\/ (CD)], [Deux droites #motDefini()[parallèles] ne sont pas sécantes (elles ne se "coupent" pas)],
  [Polygone], image("../../cours/objectifs/6e/6G10-12.png", width: 50pt), [ABCDE], [Un #motDefini()[polygone] est une figure fermée uniquement composée de segments],
  [Diagonale], image("../../cours/objectifs/6e/6G10-13.png", width: 50pt), [[BE] est une diagonale], [Une #motDefini()[diagonale] est un segment qui relie deux sommets non consécutifs],
)

#remarque()[
  #set list(marker: [•])
  Une parenthèse signifie qu'on prolonge tandis qu'un crochet signifie qu'on s'arrête.\
  Par exemple :
  - (AB) signifie qu'on prolonge en A et qu'on prolonge en B, c'est donc une droite.
	- [AB] signifie qu'on s'arrête en A et qu'on s'arrête en B, c'est donc un segment.
	- \[AB) signifie qu'on s'arrête en A et qu'on prolonge en B, c'est donc une demi-droite.
]