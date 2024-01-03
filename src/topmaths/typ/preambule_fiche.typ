#import "./components/couleurs.typ": *
#import "./components/page.typ": *
#import "./components/outils.typ": *

#let entete(titre, sousTitre: "") = {
  align(center)[
    #block()[
      #text(weight: "semibold", 2.1em)[
        #titre
      ]
      #v(-2.5mm)
      #text(weight: "semibold", 1.6em)[
        #sousTitre
      ]
    ]
  ]
  v(1cm)
}

#let titreCategorie(titre) = {
  text(titre, weight: "semibold")
}

#let titreObjectif(titre) = {
  align(center + top, block(inset: 1pt, block(fill: luma(90%), inset: 10pt, width: 100%)[#text(titre, size: 1.5em, weight: "semibold")]))
}

#let fiche(titre: "", sousTitre: "", paysage: false, body) = {
  set document(author: "Guillaume Valmont", title: titre)
  set text(font: "Source Sans Pro", weight: "medium",lang: "fr")
  set page(footer: footerTopmaths(), flipped: paysage)
  show link: bleu
  entete(titre, sousTitre: sousTitre)
  body
}
