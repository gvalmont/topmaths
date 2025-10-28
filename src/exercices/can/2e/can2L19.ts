import { texteCentre } from '../../../lib/format/miseEnPage'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { choice } from '../../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import ExerciceSimple from '../../ExerciceSimple'
export const titre = 'Exprimer une variable en fonction des autres (formules)'
export const interactifReady = true
export const interactifType = 'qcm'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '06/07/2025' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
 export const dateDeModifImportante = '23/10/2025' // Une date de modification importante au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora

*/
export const uuid = 'c42f7'

export const refs = {
  'fr-fr': ['can2L19'],
  'fr-ch': [],
}
export default class ExprimerEnFonction extends ExerciceSimple {
  constructor() {
    super()
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.versionQcmDisponible = true
    this.formatChampTexte = KeyboardType.alphanumeric
    this.optionsChampTexte = { texteAvant: '<br> ', texteApres: ' ' }
    this.optionsDeComparaison = { calculFormel: true }
  }

  nouvelleVersion() {
    const choixQ = choice([true, false])

    switch (choice([1, 2, 3, 4, 5, 6])) {
      case 1:
        this.question = `Lorsqu’un point mobile suit une trajectoire circulaire de rayon $R$, 
  en mètre (m), son accélération centripète $a$ (en m/s$^2$) 
  et sa vitesse $v$ (en m/s) sont liées par la relation : <br>
  ${choixQ ? `${texteCentre('$a=\\dfrac{v^2}{R}$')}` : `${texteCentre('$v=\\sqrt{aR}$')}`}`
        if (this.versionQcm) {
          this.question += choixQ
            ? `L'expression permettant, à partir de cette formule, d'exprimer la vitesse $v$ est : `
            : `L'expression permettant, à partir de cette formule, d'exprimer l'accélération $a$ est : `
          this.reponse = choixQ ? '$v=\\sqrt{aR}$' : '$a=\\dfrac{v^2}{R}$'
        } else {
          this.question += choixQ
            ? `Donner l'expression permettant, à partir de cette formule, d'exprimer la vitesse $v$.`
            : `Donner l'expression permettant, à partir de cette formule, d'exprimer l'accélération $a$.`
          this.reponse = choixQ ? '$\\sqrt{aR}$' : '$\\dfrac{v^2}{R}$'
        }
        this.distracteurs = choixQ
          ? ['$v=aR^2$', '$v=\\sqrt{\\dfrac{a}{R}}$', '$v=\\dfrac{a^2}{R}$']
          : ['$a=v^2R$', '$a=\\dfrac{v}{\\sqrt{R}}$', '$a=\\dfrac{R}{v^2}$']
        choixQ
          ? (this.optionsChampTexte = {
              texteAvant: '<br> $v=$',
              texteApres: ' ',
            })
          : (this.optionsChampTexte = {
              texteAvant: '<br> $a=$',
              texteApres: ' ',
            })
        this.correction = choixQ
          ? `Puisque $a=\\dfrac{v^2}{R}$, alors $v^2 = a \\times R$. <br>Comme $a \\times R\\geqslant 0$, $${miseEnEvidence('v = \\sqrt{aR}')}$.`
          : `On part de la formule $v = \\sqrt{aR}$.<br>
En élevant les deux membres au carré, on obtient : $v^2 = aR$.<br>
Puis en isolant $a$, on obtient : $${miseEnEvidence('a = \\dfrac{v^2}{R}')}$.`
        break
      case 2:
        this.question =
          'On considère $x$, $y$ et $v$ des nombres réels positifs non nuls liés par la relation : <br>'
        this.question += choixQ
          ? `${texteCentre('$v=\\sqrt{\\dfrac{x}{y}}$')}`
          : `${texteCentre('$y=(1+vx)^2$')}`
        if (this.versionQcm) {
          this.question += choixQ
            ? `L'expression permettant, à partir de cette formule, d'exprimer $y$ est : `
            : `L'expression permettant, à partir de cette formule, d'exprimer $v$ est : `
          this.reponse = choixQ
            ? '$y=\\dfrac{x}{v^2}$'
            : '$v=\\dfrac{\\sqrt{y}-1}{x}$'
        } else {
          this.question += choixQ
            ? `Donner l'expression permettant, à partir de cette formule, d'exprimer $y$.`
            : `Donner l'expression permettant, à partir de cette formule, d'exprimer $v$.`
          this.reponse = choixQ
            ? '$\\dfrac{x}{v^2}$'
            : '$\\dfrac{\\sqrt{y}-1}{x}$'
        }
        this.distracteurs = choixQ
          ? ['$y=\\sqrt{xv}$', '$y=x \\times v^2$', '$y=\\dfrac{v^2}{x}$']
          : [
              '$v=\\dfrac{y-1}{x}$',
              '$v=\\sqrt{y} \\times x - 1$',
              '$v=\\dfrac{1}{x \\times \\sqrt{y}}$',
            ]
        choixQ
          ? (this.optionsChampTexte = {
              texteAvant: '<br> $y=$',
              texteApres: ' ',
            })
          : (this.optionsChampTexte = {
              texteAvant: '<br> $v=$',
              texteApres: ' ',
            })
        if (choixQ) {
          this.correction = `On part de la relation : $v = \\sqrt{\\dfrac{x}{y}}$.<br>
En élevant les deux membres au carré, on obtient : $v^2 = \\dfrac{x}{y}$.<br>
Puis en isolant $y$, on obtient : $${miseEnEvidence('y = \\dfrac{x}{v^2}')}$.`
        } else {
          this.correction = `On part de la formule : $y = (1 + vx)^2$.<br>
Comme les deux membres sont positifs, on peut prendre la racine carrée : $\\sqrt{y} = 1 + vx$.<br>
En isolant  $v$, on obtient : $vx = \\sqrt{y} - 1$.<br>
Donc : $${miseEnEvidence('v = \\dfrac{\\sqrt{y} - 1}{x}')}$.`
        }
        break

      case 3:
        this.question = `Le degré Fahrenheit $F$ est une unité de mesure de la température utilisée aux États-Unis. <br>Il est lié au degré Celsius $C$ par la formule suivante : <br>`
        this.question += choixQ
          ? `${texteCentre('$F=\\dfrac{9}{5}C+32$')}`
          : `${texteCentre('$C=\\dfrac{5}{9}(F-32)$')}`
        if (this.versionQcm) {
          this.question += choixQ
            ? `L'expression permettant, à partir de cette formule, d'exprimer $C$ est : `
            : `L'expression permettant, à partir de cette formule, d'exprimer $F$ est : `
          this.reponse = choixQ
            ? '$C=\\dfrac{5}{9}(F-32)$'
            : '$F=\\dfrac{9}{5}C+32$'
        } else {
          this.question += choixQ
            ? `Donner l'expression permettant, à partir de cette formule, d'exprimer $C$.`
            : `Donner l'expression permettant, à partir de cette formule, d'exprimer $F$.`
          this.reponse = choixQ
            ? '$\\dfrac{5}{9}(F-32)$'
            : '$\\dfrac{9}{5}C+32$'
        }
        this.distracteurs = choixQ
          ? [
              '$C=\\dfrac{9}{5}(F-32)$',
              '$C=\\dfrac{5}{9}F-32$',
              '$C=\\dfrac{5(F-32)}{9}$',
            ]
          : [
              '$F=\\dfrac{5}{9}C+32$',
              '$F=\\dfrac{9}{5}C-32$',
              '$F=\\dfrac{9}{5}(C+32)$',
            ]
        choixQ
          ? (this.optionsChampTexte = {
              texteAvant: '<br> $C=$',
              texteApres: ' ',
            })
          : (this.optionsChampTexte = {
              texteAvant: '<br> $F=$',
              texteApres: ' ',
            })
        this.correction = choixQ
          ? `On part de la formule : $F = \\dfrac{9}{5}C + 32$.<br>
En isolant  $C$, on obtient  : $F - 32 = \\dfrac{9}{5}C$.<br>
En multipliant les deux membres par $\\dfrac{5}{9}$, on obtient  : $${miseEnEvidence('C = \\dfrac{5}{9}(F - 32)')}$.`
          : `On part de la formule : $C = \\dfrac{5}{9}(F - 32)$<br>
En multipliant les deux membres par $\\dfrac{9}{5}$, on obtient : $\\dfrac{9}{5}C = F - 32$.<br>
Puis en isolant  $F$, on obtient : $${miseEnEvidence('F = \\dfrac{9}{5}C + 32')}$.`
        break

      case 4:
        this.question = `Dans le vide, la distance $h$ (en m) parcourue par un corps en chute libre durant un temps $t$ (en s) est donnée par la formule : <br>`
        this.question += texteCentre('$h=\\dfrac{1}{2}gt^2$')
        if (this.versionQcm) {
          this.question += `L'expression permettant, à partir de cette formule, d'exprimer $t$ est : `
          this.reponse = '$t=\\sqrt{\\dfrac{2h}{g}}$'
        } else {
          this.question += `Donner l'expression permettant, à partir de cette formule, d'exprimer $t$.`
          this.reponse = '$\\sqrt{\\dfrac{2h}{g}}$'
        }
        this.distracteurs = [
          '$t=\\dfrac{2h}{g}$',
          '$t=\\sqrt{\\dfrac{h}{2g}}$',
          '$t=\\dfrac{\\sqrt{2h}}{g}$',
        ]
        this.optionsChampTexte = { texteAvant: '<br> $t=$', texteApres: ' ' }
        this.correction = `On part de la formule : $h = \\dfrac{1}{2}gt^2$.<br>
En multiplinat les deux membres par $2$, on obtient : $2h = gt^2$.<br>
En isolant $t^2$, on obtient : $t^2 = \\dfrac{2h}{g}$.<br>
Comme $t \\geqslant 0$, en prenant la racine carrée, on obtient : $${miseEnEvidence('t = \\sqrt{\\dfrac{2h}{g}}')}$.`
        break

      case 5:
        this.question = `Le taux de variation $T$ entre deux valeurs $F$ et $I$ est donnée par la formule : <br>`
        this.question += texteCentre('$T=\\dfrac{F-I}{I}$')
        if (this.versionQcm) {
          this.question += choixQ
            ? `L'expression permettant, à partir de cette formule, d'exprimer $F$ est : `
            : `L'expression permettant, à partir de cette formule, d'exprimer $I$ est : `
          this.reponse = choixQ ? '$F=I(1+T)$' : '$I=\\dfrac{F}{1+T}$'
        } else {
          this.question += choixQ
            ? `Donner l'expression permettant, à partir de cette formule, d'exprimer $F$.`
            : `Donner l'expression permettant, à partir de cette formule, d'exprimer $I$.`
          this.reponse = choixQ ? '$I(1+T)$' : '$\\dfrac{F}{1+T}$'
        }
        this.distracteurs = choixQ
          ? ['$F=TI-I$', '$F=\\dfrac{I}{1+T}$', '$F=I(T-1)$']
          : ['$I=F(1+T)$', '$I=\\dfrac{F}{T-1}$', '$I=F-T$']

        choixQ
          ? (this.optionsChampTexte = {
              texteAvant: '<br> $F=$',
              texteApres: ' ',
            })
          : (this.optionsChampTexte = {
              texteAvant: '<br> $I=$',
              texteApres: ' ',
            })

        if (choixQ) {
          this.correction = `On part de la formule : $T = \\dfrac{F-I}{I}$.<br>
En mutilpiant par $I$ les deux membres, on obtient : $TI = F - I$.<br>
En isolant $F$, puis en factorisant, on obtient : $${miseEnEvidence('F = I(1 + T)')}$.`
        } else {
          this.correction = `On part de la formule : $T = \\dfrac{F-I}{I}$.<br>
En multipliant  par $I$ les deux membres, on obtient : $TI = F - I$.<br>
En isolant $I$ et en factorisant, on obtient : $TI + I = F$, soit $I(T + 1) = F$.<br>
Donc : $${miseEnEvidence('I = \\dfrac{F}{1 + T}')}$.`
        }
        break

      case 6:
      default:
        this.question = `Le périmètre $P$ d'un rectangle est donnée en fonction de sa longueur $L$ et sa largeur $\\ell$.<br>`
        this.question += texteCentre('$P=2(L+\\ell)$')
        this.reponse = choixQ ? '$\\dfrac{P}{2}-l$' : '$\\dfrac{P}{2}-L$'
        if (this.versionQcm) {
          this.question += choixQ
            ? `L'expression permettant, à partir de cette formule, d'exprimer $L$ est : `
            : `L'expression permettant, à partir de cette formule, d'exprimer $\\ell$ est : `
          this.reponse = choixQ
            ? '$L=\\dfrac{P}{2}-\\ell$'
            : '$\\ell=\\dfrac{P}{2}-L$'
        } else {
          this.question += choixQ
            ? `Donner l'expression permettant, à partir de cette formule, d'exprimer $L$.`
            : `Donner l'expression permettant, à partir de cette formule, d'exprimer $\\ell$.`
        }
        this.distracteurs = choixQ
          ? [
              '$L=\\dfrac{P-\\ell}{2}$',
              '$L=P-2\\ell$',
              '$L=\\dfrac{P}{2\\ell}$',
            ]
          : [
              '$\\ell=\\dfrac{P-L}{2}$',
              '$\\ell=P-2L$',
              '$\\ell=\\dfrac{P}{2L}$',
            ]

        choixQ
          ? (this.optionsChampTexte = {
              texteAvant: '<br> $L=$',
              texteApres: ' ',
            })
          : (this.optionsChampTexte = {
              texteAvant: '<br> $\\ell=$',
              texteApres: ' ',
            })

        if (choixQ) {
          this.correction = `On part de la formule : $P = 2(L + \\ell)$.<br>
En développant, on obtient : $P = 2L + 2\\ell$.<br>
En isolant $2L$, puis en divaisant par $2$, on obtient : $2L = P - 2\\ell$ soit $${miseEnEvidence('L = \\dfrac{P}{2} - \\ell')}$.<br>`
        } else {
          this.correction = `On part de la formule : $P = 2(L + \\ell)$.<br>
En développant, on obtient : $P = 2L + 2\\ell$.<br>
En isolant $2\\ell$, puis en divisant par $2$, on obtient : $2\\ell = P - 2L$, soit $${miseEnEvidence('\\ell = \\dfrac{P}{2} - L')}$. `
        }
        break
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
