#let pokemons = ("Arcanin", "Artikodin", "Bulbizarre", "Carapuce", "Dracaufeu", "Dracolosse", "Elector", "Evoli", "Goupix", "Leviator", "Lucario", "Mewtwo", "Pikachu", "Raichu", "Ramolosse", "Rattata", "Salameche", "Tortank")

#for pokemon in pokemons [
  #if pokemon != pokemons.at(0) [
    #pagebreak()
  ]
  #align(horizon + center, image("Pokemons_outlined/" + pokemon + ".svg", width: 100%))
]