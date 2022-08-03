export class PanierItem {
  exerciceId: number
  objectif: string
  description: string
  slug: string

  constructor (exerciceId: number, objectif: string, description: string, slug: string) {
    this.exerciceId = exerciceId
    this.objectif = objectif
    this.description = description
    this.slug = slug
  }
}
