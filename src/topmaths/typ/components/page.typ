#import "./couleurs.typ": *

#let footerTopmaths(fonctionCouleurLiens: bleu) = [
  #show link:fonctionCouleurLiens
  #set align(center)
  #set text(black, 9pt)
  #link("https://topmaths.fr")[topmaths.fr] © #datetime.today().display("[year]") de #link("https://forge.aeif.fr/gvalmont")[Guillaume Valmont] sous licence libre #link("https://creativecommons.org/licenses/by-sa/4.0/deed.fr")[CC-BY-SA 4.0]
]
