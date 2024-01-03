#import "../../preambule_photocopies.typ": * 
#show: doc => photocopies(doc)

#let tableau() = {
  align(horizon + center, table(columns: 6, stroke: 1pt + gray)[][#image("../../cours/objectifs/6e/6G41-1.png")][#image("../../cours/objectifs/6e/6G41-2.png")][#image("../../cours/objectifs/6e/6G41-3.png")][#image("../../cours/objectifs/6e/6G41-4.png")][#image("../../cours/objectifs/6e/6G41-5.png")][Angle][nul][aigu][droit][obtus][plat][Mesure][égale à 0°][comprise entre 0° et 90°][égale à 90°][comprise entre 90° et 180°][égale à 180°])
}
#for i in range(5) {
  tableau()
  if i < 4 {
    v(7pt)
  }
}