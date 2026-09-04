import referentielBibliotheque from '../../json/referentielBibliotheque.json'
import referentielStaticFR from '../../json/referentielStaticFRHydrated'
import { retrieveResourceFromUuid } from '../../lib/components/refUtils'
import type {
  JSONReferentielEnding,
  JSONReferentielObject,
} from '../../lib/types/referentiels'

const topmathsStaticReferentiels: JSONReferentielObject = {
  ...referentielBibliotheque,
  ...referentielStaticFR,
}

/**
 * Résout une ressource statique Topmaths depuis le référentiel déjà hydraté.
 * Les métadonnées d'examen (année, mois, lieu...) ne sont plus présentes dans
 * le JSON brut et doivent toujours être récupérées par ce point d'entrée.
 */
export function getTopmathsStaticResource(
  uuid: string,
): JSONReferentielEnding | null {
  return retrieveResourceFromUuid(topmathsStaticReferentiels, uuid)
}
