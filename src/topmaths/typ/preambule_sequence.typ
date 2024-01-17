#import "./components/couleurs.typ": *
#import "./components/page.typ": *
#import "./components/outils.typ": *

#let couleurPrincipale = blue
#let normal(texte) = text(couleurPrincipale, texte)

#let attention() = {
  underline()[#rouge()[/!\\]]
}

#let blocDeCours(texte, nom, couleur, epaisseur) = {
  par()[
    #block(breakable: false)[
      #pad(bottom: -1em)[#underline(nom + " :", stroke: 1pt + couleur, offset: 2pt)]
      #block(stroke: (left: epaisseur + couleur), inset: (left: 0.5em, y: 0.5em), width: 100%)[
        #texte
    ]
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
    #block(text(red, weight: "semibold", 1.75em, titre))
  ]
}

#let titre1(titre, numero: 0) = {
  let chiffresRomains = ("", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X")
  block(
    text(
      underline(
        text(
          red, font: "STIX Two Text", size: 1.05em, 
              chiffresRomains.at(
                numero
              )
        ) + " " + titre, stroke: 1pt + red, offset: 2pt
      ), weight: "regular", size: 1.02em
    )
  )
}

#let titre2(titre, numero: 0) = {
  block(
    text(
      text(
        size: 1.03em, 
          str(numero)
      ) + ". " + titre, black, weight: "regular", size: 1.02em
    )
  )
}

#let titre3(titre, numeroPrincipal: 0, numeroSecondaire: 0) = {
  let lettres = "abcdefghijklmnopqrstuvwxyz"
  block(
    text(
      text(
        size: 1.03em,
          str(numeroPrincipal)
      ) + "." +
      text(
        size: 1.02em,
          lettres.at(numeroSecondaire - 1)
      ) + ") " + titre, black, weight: "regular"
    )
  )
}

#let implication(conditions, consequences, nbConditions: 1, nbConsequences: 1) = {
  table(
    columns: (5fr, 1fr, 5fr),
    stroke: none,
    align: horizon + center,
    if nbConditions > 1 [Conditions] else [Condition], [Donc], if nbConsequences > 1 [Conséquences] else [Conséquence],
    normal(conditions), [=>], normal(consequences)
  )}


#let sequence(title: "", body) = {
  set document(author: "Guillaume Valmont", title: title)
  set text(couleurPrincipale, font: "Source Sans Pro", weight: "medium",lang: "fr", hyphenate: false)
  set page(footer: footerTopmaths(fonctionCouleurLiens: normal))
  set figure(supplement: none, numbering: none)
  show math.equation: set text(font: "STIX Two Math")
  show math.frac: it => math.display(it) // Pour avoir de grosses fractions partout
  set math.mat(delim: none)
  set par(justify: true)
  set table(stroke: 0.5pt + rgb("#696969"))
  set list(marker: [--])
  set underline(offset: 2pt)
  show link: l => {underline(bleu(l))}
  show heading: it => block(it.body)
  show heading.where(level: 1): it => {
    counter(heading).step(level: 1)
    locate(loc => {
      titre1(it.body, numero: counter(heading).at(loc).at(0))
    })
  }
  show heading.where(level: 2): it => {
    counter(heading).step(level: 2)
    locate(loc => {
      titre2(it.body, numero: counter(heading).at(loc).at(1))
    })
  }
  show heading.where(level: 3): it => {
    counter(heading).step(level: 3)
    locate(loc => {
      titre3(it.body, numeroPrincipal: counter(heading).at(loc).at(1), numeroSecondaire: counter(heading).at(loc).at(2))
    })
  }
  if title != "" {
    titrePrincipal(title)
    v(2em)
  }
  body
}
