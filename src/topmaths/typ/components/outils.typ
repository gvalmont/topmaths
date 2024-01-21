#let lien(fichier) = {
  let messageErreur = text(red, "le lien vers " + fichier + " n'a pas pu être généré")

  if fichier.contains("_Cours") {
    if fichier.starts-with("S") {
      let niveau = fichier.slice(1, 2) + "e"
      link("https://topmaths.fr/topmaths/cours/" + niveau + "/" + fichier + ".pdf")[Cours]
    } else {
      messageErreur
    }
  } else if fichier.contains("_Fiche") {
    if fichier.starts-with("S") {
      let niveau = fichier.slice(1, 2) + "e"
      link("https://topmaths.fr/topmaths/fiches/sequences/" + niveau + "/" + fichier + ".pdf")[Fiche de séquence]
    } else {
      let niveau = fichier.slice(0, 1) + "e"
      link("https://topmaths.fr/topmaths/fiches/objectifs/" + niveau + "/" + fichier + ".pdf")[Fiche de séance]
    }
  } else if fichier.contains("_Poly") {
    let niveau = fichier.slice(0, 1) + "e"
    let suffixe = ""
    if fichier.position("-") != none and fichier.position("-") > 0 {suffixe = " " + fichier.at(fichier.position("-") + 1)}
    link("https://topmaths.fr/topmaths/photocopies/" + niveau + "/" + fichier + ".pdf")[Photocopies#suffixe]
  } else if fichier.contains("_Presentation") {
    let niveau = fichier.slice(0, 1) + "e"
    link("https://topmaths.fr/topmaths/presentations/" + niveau + "/" + fichier + ".pdf")[Présentation]
  } else if fichier.contains("Entrainement_") {
    let niveau = fichier.slice(13, 14) + "e"
    link("https://topmaths.fr/topmaths/entrainement/" + niveau + "/" + fichier + ".pdf")[Entraînement]
  } else if fichier.contains("_Diaporama") {
    let niveau = fichier.slice(0, 1) + "e"
    link("https://topmaths.fr/topmaths/diaporamas/" + niveau + "/" + fichier + ".odp")[Diaporama]
  } else if fichier.contains("_Geogebra") {
    let niveau = fichier.slice(0, 1) + "e"
    link("https://topmaths.fr/topmaths/geogebra/" + niveau + "/" + fichier + ".ggb")[Geogebra]
  }
}

#let gras(texte) = {
  text(texte, weight: "semibold")
}

#let flecheProportionnalite(coefficient) = {
  place(image("fleche-tableau-proportionnalite.svg", height: 2.2em), dx: 2em, dy: -0.6em)
  place(dx: 3.3em, dy: 0.1em, text(red, size: 0.9em, $times coefficient$))
}

#let dfrac(a, b) = $display(frac(a, b))$