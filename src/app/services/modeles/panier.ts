export class PanierItem {
  id: string
  objectif: string
  description: string
  slug: string

  constructor (id: string, objectif: string, description: string, slug: string) {
    this.id = id
    this.objectif = objectif
    this.description = description
    this.slug = slug
  }
}
