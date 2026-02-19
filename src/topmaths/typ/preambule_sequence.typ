#import "./components/couleurs.typ": *
#import "./components/page.typ": *
#import "./components/outils.typ": *

#let couleurPrincipale = blue
#let normal(texte) = text(couleurPrincipale, texte)

#let attention() = {
  underline()[#rouge()[/!\\]]
}

#let blocDeCours(texte, nom, couleur, epaisseur) = {
  block(breakable: true)[
    #let yOffset = 0em
    #if nom != "" {
      pad(bottom: -1em)[#underline(nom + " :", stroke: 1pt + couleur, offset: 2pt)]
      yOffset = 0.5em
    }
    #block(stroke: (left: epaisseur + couleur), inset: (left: 0.5em, y: yOffset), width: 100%)[
      #texte
    ]
  ]
}
#let vocabulaire(texte, titre: "Vocabulaire") = {
  blocDeCours(texte, titre, couleurPrincipale, 1pt)
}
#let definition(texte, titre: "Définition") = {
  blocDeCours(texte, titre, couleurPrincipale, 2pt)
}
#let definitions(texte) = {
  definition(texte, titre: "Définitions")
}
#let propriete(texte, titre: "Propriété") = {
  blocDeCours(texte, titre, red, 1pt)
}
#let proprietes(texte) = {
  propriete(texte, titre: "Propriétés")
}
#let theoreme(texte, titre: "Théorème") = {
  blocDeCours(texte, titre, red, 2pt)
}
#let theoremes(texte) = {
  theoreme(texte, titre: "Théorèmes")
}
#let regle(texte, titre: "Règle") = {
  blocDeCours(texte, titre, green, 1pt)
}
#let regles(texte) = {
  regle(texte, titre: "Règles")
}
#let methode(texte, titre: "Méthode") = {
  blocDeCours(texte, titre, black, 1pt)
}
#let methodes(texte) = {
  methode(texte, titre: "Méthodes")
}
#let exemple(texte, titre: "Exemple") = {
  set text(black)
  blocDeCours(texte, titre, black, 0pt)
}
#let exemples(texte) = {
  exemple(texte, titre: "Exemples")
}
#let remarque(texte, titre: "Remarque") = {
  blocDeCours(texte, titre, couleurPrincipale, 0pt)
}
#let remarques(texte) = {
  remarque(texte, titre: "Remarques")
}
#let objectif(texte, titre: "Objectif") = {
  set list(marker: [--])
  blocDeCours(texte, titre, couleurPrincipale, 0pt)
}
#let objectifs(texte) = {
  objectif(texte, titre: "Objectifs")
}

#let titrePrincipal(titre) = {
  align(center)[
    #block(text(couleurRouge, weight: "semibold", 1.75em, titre))
  ]
}

#let numberToRoman(number) = {
  if number == 1 {
    "I"
  } else if number == 2 {
    "II"
  } else if number == 3 {
    "III"
  } else if number == 4 {
    "IV"
  } else if number == 5 {
    "V"
  } else if number == 6 {
    "VI"
  } else if number == 7 {
    "VII"
  } else if number == 8 {
    "VIII"
  } else if number == 9 {
    "IX"
  } else if number == 10 {
    "X"
  } else {
    number
  }
}

#let titre1(titre, numero: 0) = {
  let headingCount = 1
  if numero > 0 {
    headingCount = [#numberToRoman(numero)]
  } else {
    headingCount = context counter(heading).display("I")
  }
  block(
    text(
      underline(
        text(couleurRouge, font: "STIX Two Text", size: 1.05em, headingCount) + " " + titre,
        stroke: 1pt + couleurRouge,
        offset: 2pt,
      ),
      weight: "regular",
      size: 1.02em,
    ),
  )
}

#let titre2(titre, numero: 0) = {
  let headingCount = 1
  if numero > 0 {
    headingCount = [#numero]
  } else {
    headingCount = context counter(heading).display().at(2)
  }
  block(
    text(
      text(size: 1.03em, headingCount) + ". " + titre,
      black,
      weight: "regular",
      size: 1.02em,
    ),
  )
}

#let implication(conditions, consequences, nbConditions: 1, nbConsequences: 1) = {
  table(
    columns: (5fr, 1fr, 5fr),
    stroke: none,
    align: horizon + center,
    if nbConditions > 1 [Conditions] else [Condition], [Donc], if nbConsequences > 1 [Conséquences] else [Conséquence],
    normal(conditions), [=>], normal(consequences),
  )
}


#let sequence(title: "", body) = {
  set document(author: "Guillaume Valmont", title: title)
  set text(couleurPrincipale, font: "Verdana Pro", weight: "regular", lang: "fr", hyphenate: false)
  set page(footer: footerTopmaths(fonctionCouleurLiens: normal))
  set figure(supplement: none, numbering: none)
  show math.frac: it => math.display(it) // Pour avoir de grosses fractions partout
  set math.mat(delim: none)
  set par(justify: true)
  set table(stroke: 0.5pt + rgb("#696969"))
  set list(marker: [--])
  set underline(offset: 2pt)
  show link: l => { underline(bleu(l)) }
  show heading: it => block(it.body)
  show heading.where(level: 1): it => {
    counter(heading).step(level: 1)
    titre1(it.body)
  }
  show heading.where(level: 2): it => {
    counter(heading).step(level: 2)
    titre2(it.body)
  }
  if title != "" {
    titrePrincipal(title)
    v(2em)
  }
  body
}
