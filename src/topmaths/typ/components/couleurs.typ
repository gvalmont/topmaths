#let bleu(texte) = text(blue, texte)
#let rouge(texte) = text(red, texte)
#let vert(texte) = text(green, texte)
#let noir(texte) = text(black, texte)
#let gris(texte) = text(gray, texte)
#let blanc(texte) = text(white, texte, size: 1.3em)
#let motDefini(texte) = text(red, texte)

#let degrade(couleur1, couleur2, texte) = {
  let couleur(indiceCouleur, indiceTexte) = {
    let poids1 = texte.len() - 1 - indiceTexte
    let poids2 = indiceTexte
    let valeur1 = couleur1.at(indiceCouleur)
    let valeur2 = couleur2.at(indiceCouleur)
    return (valeur1 * poids1 + valeur2 * poids2) / (poids1 + poids2)
  }
  let i = 0
  for lettre in texte {
    text(fill: cmyk(couleur(0, i), couleur(1, i), couleur(2, i), couleur(3, i)), lettre)
    i += 1
  }
}