#show link: t => text(blue, t)
#show: doc => text(font: "Source Sans Pro",lang: "fr", doc)
#show: doc => page(margin: (left: 1.5cm, right: 1.5cm, top: 1cm, bottom: 0.5cm), doc)

#align(center, text("Tuto Installation Anki", size: 2em, weight: "bold"))
#v(7mm)
= Android

+ Installer #link("https://play.google.com/store/apps/details?id=com.ichi2.anki&pli=1")[AnkiDroid]
+ Télécharger le paquet de #link("https://topmaths.fr/assets/topmaths/telechargements/tables_de_multiplication_anki.apkg")[Tables de multiplication] ainsi que le paquet de #link("https://topmaths.fr/assets/topmaths/telechargements/Topmaths.apkg")[Topmaths]
+ Les ouvrir avec AnkiDroid

= iOS

== Version payante

+ Acheter #link("https://apps.apple.com/us/app/ankimobile-flashcards/id373493387")[AnkiMobile] (29,99 €)
+ Télécharger le paquet de #link("https://topmaths.fr/assets/topmaths/telechargements/tables_de_multiplication_anki.apkg")[Tables de multiplication] ainsi que le paquet de #link("https://topmaths.fr/assets/topmaths/telechargements/Topmaths.apkg")[Topmaths]
+ Les ouvrir avec AnkiMobile

== Version gratuite

Dans la version gratuite, on ne peut pas ouvrir de paquets téléchargés depuis son iPhone mais on peut le faire depuis un ordinateur et synchroniser les deux. C'est ce qu'on va faire.\
#text(style: "italic")[
  Remarque : Il y a aussi #link("https://tube-numerique-educatif.apps.education.fr/w/2yahhfTYFpiTEpiUPVquQd")[
    une vidéo de ce tuto #box(image("peertube-logo.png", height: 2em), baseline: 33%, inset: (left: 3pt))
  ]
]

=== 1. Paramétrage du téléphone

+ Depuis son téléphone, aller sur #link("https://ankiweb.net/account/signup")[AnkiWeb]
+ Saisir son email et le mot de passe qu'on voudra utiliser pour se connecter à Anki puis cliquer sur "Sign up"
+ Tout en bas de la page "Terms ans Conditions", cocher la case "I have read the Terms and Conditions, and agree to be bound by them." puis cliquer sur "Continue"
+ Consulter ses mails et cliquer sur "Verify Email" dans le mail qu'on vient de recevoir puis sur "Proceed"
+ Se connecter avec l'email et le mot de passe qu'on vient de choisir

On arrive sur une page vide pour l'instant, mais c'est depuis cette page qu'on va utiliser Anki pour réviser. Pour que ce soit plus pratique, on va faire un raccourci :

+ Appuyer sur le bouton de partage #box(image("share-icon-bold.png"), height: 0.7em)
+ Appuyer sur "Ajouter à l'écran d'accueil"
+ Enlever "Decks" et "Web" pour ne garder que "Anki" comme nom pour le raccourci

On a maintenant un bouton qui permet d'accéder directement à Anki sur son écran d'accueil.

=== 2. Paramétrage de l'ordinateur

+ Télécharger Anki sur son ordinateur
  - #link("https://github.com/ankitects/anki/releases/download/2.1.66/anki-2.1.66-windows-qt6.exe")[Windows]
  - Mac
    - #link("https://github.com/ankitects/anki/releases/download/2.1.66/anki-2.1.66-mac-intel-qt6.dmg")[Intel] (modèles avant 2020)
    - #link("https://github.com/ankitects/anki/releases/download/2.1.66/anki-2.1.66-mac-apple-qt6.dmg")[Apple Silicon] (modèles à partir de 2020 avec une puce M1, M2 etc.)
  - #link("https://github.com/ankitects/anki/releases/download/2.1.66/anki-2.1.66-linux-qt6.tar.zst")[Linux]
+ Ouvrir le fichier téléchargé et l'installer
  - Si le logiciel se ferme immédiatement après ouverture, il faut aller dans les réglages de l'horloge pour faire en sorte que l'heure soit réglée automatiquement
+ Télécharger le paquet de #link("https://topmaths.fr/assets/topmaths/telechargements/tables_de_multiplication_anki.apkg")[Tables de multiplication] ainsi que le paquet de #link("https://topmaths.fr/assets/topmaths/telechargements/Topmaths.apkg")[Topmaths]
+ Les ouvrir avec Anki
+ Cliquer sur le bouton "Synchronisation" puis se connecter avec l'email et le mot de passe choisis sur le téléphone

Et voilà !\
Vous pouvez maintenant réviser avec votre téléphone et ajouter des paquets à l'aide de votre ordinateur si besoin !