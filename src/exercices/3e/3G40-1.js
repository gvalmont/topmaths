import { SceneViewer } from '../../lib/3d/SceneViewer'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { approximatelyCompare } from '../../lib/interactif/comparisonFunctions'
import { ajouteQuestionMathlive } from '../../lib/interactif/questionMathLive'
import { choice } from '../../lib/outils/arrayOutils'
import { arcenciel } from '../../lib/outils/embellissements'
import { rangeMinMax } from '../../lib/outils/nombres'
import { texNombre } from '../../lib/outils/texNombre'
import { context } from '../../modules/context'
import { randint } from '../../modules/outils'
import Exercice from '../Exercice'

export const dateDeModifImportante = '13/07/2025'
export const titre = 'Repérage géodésique sur la Terre'
export const interactifReady = true
export const interactifType = 'mathLive'

export const uuid = '75ea3'

export const refs = {
  'fr-fr': ['3G40-1'],
  'fr-ch': []
}

const listeVilles = [
  { latitude: 40.7128, longitude: -74.0060, label: 'New York' },
  { latitude: -33.8688, longitude: 151.2093, label: 'Sydney' },
  { latitude: 39.9042, longitude: 116.4074, label: 'Pékin' },
  { latitude: -23.5505, longitude: -46.6333, label: 'São Paulo' },
  { latitude: 19.4326, longitude: -99.1332, label: 'Mexico City' },
  { latitude: 37.7749, longitude: -122.4194, label: 'San Francisco' },
  { latitude: 1.3521, longitude: 103.8198, label: 'Singapour' },
  { latitude: 34.0522, longitude: -118.2437, label: 'Los Angeles' },
  { latitude: 55.7558, longitude: 13.4050, label: 'Berlin' },
  { latitude: 37.5665, longitude: 126.9780, label: 'Séoul' },
  { latitude: 28.6139, longitude: 77.2090, label: 'New Delhi' },
  { latitude: -37.8136, longitude: 144.9631, label: 'Melbourne' },
  { latitude: 55.9533, longitude: -3.1883, label: 'Édimbourg' },
  { latitude: -22.9068, longitude: -43.1729, label: 'Rio de Janeiro' },
  { latitude: 37.3382, longitude: -121.8863, label: 'San José' },
  { latitude: 47.6062, longitude: -122.3321, label: 'Seattle' },
  { latitude: 39.7392, longitude: -104.9903, label: 'Denver' },
  { latitude: 43.6532, longitude: -79.3832, label: 'Toronto' },
  { latitude: 41.3275, longitude: 19.8187, label: 'Tirana' },
  { latitude: 48.2082, longitude: 16.3738, label: 'Vienne' },
  { latitude: 53.9, longitude: 27.5667, label: 'Minsk' },
  { latitude: 50.8466, longitude: 4.3528, label: 'Bruxelles' },
  { latitude: 43.8563, longitude: 18.4131, label: 'Sarajevo' },
  { latitude: 42.6977, longitude: 23.3219, label: 'Sofia' },
  { latitude: 45.8131, longitude: 15.9770, label: 'Zagreb' },
  { latitude: 35.1856, longitude: 33.3823, label: 'Nicosie' },
  { latitude: 50.0755, longitude: 14.4378, label: 'Prague' },
  { latitude: 55.6761, longitude: 12.5683, label: 'Copenhague' },
  { latitude: 59.4370, longitude: 24.7536, label: 'Tallinn' },
  { latitude: 60.1699, longitude: 24.9384, label: 'Helsinki' },
  { latitude: 48.8566, longitude: 2.3522, label: 'Paris' },
  { latitude: 37.9838, longitude: 23.7275, label: 'Athènes' },
  { latitude: 47.4979, longitude: 19.0402, label: 'Budapest' },
  { latitude: 64.1466, longitude: -21.9426, label: 'Reykjavik' },
  { latitude: 53.3498, longitude: -6.2603, label: 'Dublin' },
  { latitude: 41.9028, longitude: 12.4964, label: 'Rome' },
  { latitude: 56.9496, longitude: 24.1052, label: 'Riga' },
  { latitude: 54.6872, longitude: 25.2797, label: 'Vilnius' },
  { latitude: 49.6116, longitude: 6.1319, label: 'Luxembourg' },
  { latitude: 35.8997, longitude: 14.5147, label: 'La Valette' },
  { latitude: 47.0105, longitude: 28.8638, label: 'Chisinau' },
  { latitude: 42.5063, longitude: 1.5218, label: 'Andorre-la-Vieille' },
  { latitude: 59.9139, longitude: 10.7522, label: 'Oslo' },
  { latitude: 52.2297, longitude: 21.0122, label: 'Varsovie' },
  { latitude: 38.7223, longitude: -9.1393, label: 'Lisbonne' },
  { latitude: 44.4268, longitude: 26.1025, label: 'Bucarest' },
  { latitude: 55.7558, longitude: 37.6173, label: 'Moscou' },
  { latitude: 44.7866, longitude: 20.4489, label: 'Belgrade' },
  { latitude: 48.1486, longitude: 17.1077, label: 'Bratislava' },
  { latitude: 46.0569, longitude: 14.5058, label: 'Ljubljana' },
  { latitude: 40.4168, longitude: -3.7038, label: 'Madrid' },
  { latitude: 59.3293, longitude: 18.0686, label: 'Stockholm' },
  { latitude: 46.9480, longitude: 7.4474, label: 'Berne' },
  { latitude: 50.4501, longitude: 30.5234, label: 'Kiev' },
  { latitude: 51.5074, longitude: -0.1278, label: 'Londres' },
  { latitude: 42.4410, longitude: 19.2620, label: 'Podgorica' },
  { latitude: 41.7151, longitude: 44.8271, label: 'Tbilissi' },
  { latitude: 35.6895, longitude: 139.6917, label: 'Tokyo' },
  { latitude: -26.2041, longitude: 28.0473, label: 'Johannesburg' },
  { latitude: 36.8065, longitude: 10.1815, label: 'Tunis' },
  { latitude: 33.5731, longitude: -7.5898, label: 'Casablanca' },
  { latitude: 31.7917, longitude: -7.0926, label: 'Marrakech' },
  { latitude: 36.7529, longitude: 3.0420, label: 'Alger' },
  { latitude: 35.6895, longitude: -0.6332, label: 'Oran' },
  { latitude: 14.7167, longitude: -17.4677, label: 'Dakar' },
  { latitude: 6.5244, longitude: 3.3792, label: 'Lagos' },
  { latitude: 9.0579, longitude: 7.4951, label: 'Abuja' },
  { latitude: -1.2921, longitude: 36.8219, label: 'Nairobi' },
  { latitude: 30.0444, longitude: 31.2357, label: 'Le Caire' },
  { latitude: -4.4419, longitude: 15.2663, label: 'Kinshasa' },
  { latitude: 12.6392, longitude: -8.0029, label: 'Bamako' },
  { latitude: 5.6037, longitude: -0.1870, label: 'Accra' },
  { latitude: 15.5007, longitude: 32.5599, label: 'Khartoum' },
  { latitude: -18.8792, longitude: 47.5079, label: 'Antananarivo' },
  { latitude: -33.9249, longitude: 18.4241, label: 'Le Cap' },
  { latitude: -17.8252, longitude: 31.0335, label: 'Harare' },
  { latitude: 7.3775, longitude: 3.9470, label: 'Ibadan' },
  { latitude: 4.8156, longitude: 7.0498, label: 'Port Harcourt' },
  { latitude: 13.5137, longitude: 2.1098, label: 'Niamey' },
  { latitude: 11.5564, longitude: 104.9282, label: 'Kampala' },
  { latitude: 12.3686, longitude: -1.5271, label: 'Ouagadougou' },
  { latitude: 36.3650, longitude: 6.6147, label: 'Constantine' },
  { latitude: 35.6971, longitude: -0.6308, label: 'Oran' },
  { latitude: 14.6928, longitude: -17.4467, label: 'Thiès' },
  { latitude: 6.3156, longitude: -10.8074, label: 'Monrovia' },
  { latitude: 9.1450, longitude: 40.4897, label: 'Addis-Abeba' }, { latitude: -33.8688, longitude: 151.2093, label: 'Sydney' },
  { latitude: -27.4698, longitude: 153.0251, label: 'Brisbane' },
  { latitude: -31.9505, longitude: 115.8605, label: 'Perth' },
  { latitude: -34.9285, longitude: 138.6007, label: 'Adélaïde' },
  { latitude: -35.2809, longitude: 149.1300, label: 'Canberra' },
  { latitude: -12.4634, longitude: 130.8456, label: 'Darwin' },
  { latitude: -42.8821, longitude: 147.3272, label: 'Hobart' },
  { latitude: -16.9186, longitude: 145.7781, label: 'Cairns' },
  { latitude: -23.6980, longitude: 133.8807, label: 'Alice Springs' },
  { latitude: 31.2304, longitude: 121.4737, label: 'Shanghai' },
  { latitude: 19.0760, longitude: 72.8777, label: 'Mumbai' },
  { latitude: 23.1291, longitude: 113.2644, label: 'Canton' },
  { latitude: 13.7563, longitude: 100.5018, label: 'Bangkok' },
  { latitude: 14.5995, longitude: 120.9842, label: 'Manille' },
  { latitude: 24.8607, longitude: 67.0011, label: 'Karachi' },
  { latitude: 35.6892, longitude: 51.3890, label: 'Téhéran' },
  { latitude: 41.0082, longitude: 28.9784, label: 'Istanbul' },
  { latitude: 25.276987, longitude: 55.296249, label: 'Dubaï' },
  { latitude: 31.5497, longitude: 74.3436, label: 'Lahore' },
  { latitude: 22.3964, longitude: 114.1095, label: 'Hong Kong' },
  { latitude: 34.6937, longitude: 135.5023, label: 'Osaka' },
  { latitude: 23.8103, longitude: 90.4125, label: 'Dacca' },
  { latitude: 21.0285, longitude: 105.8542, label: 'Hanoï' },
  { latitude: 10.762622, longitude: 106.660172, label: 'Ho Chi Minh' },
  { latitude: 24.7136, longitude: 46.6753, label: 'Riyad' },
  { latitude: 29.3759, longitude: 47.9774, label: 'Koweït City' },
  { latitude: 39.9334, longitude: 32.8597, label: 'Ankara' },
  { latitude: 33.6844, longitude: 73.0479, label: 'Islamabad' },
  { latitude: 45.5017, longitude: -73.5673, label: 'Montréal' },
  { latitude: 29.7604, longitude: -95.3698, label: 'Houston' },
  { latitude: 32.7767, longitude: -96.7970, label: 'Dallas' },
  { latitude: 25.7617, longitude: -80.1918, label: 'Miami' },
  { latitude: 39.9526, longitude: -75.1652, label: 'Philadelphie' },
  { latitude: 38.9072, longitude: -77.0369, label: 'Washington' },
  { latitude: 45.4215, longitude: -75.6997, label: 'Ottawa' },
  { latitude: 49.2827, longitude: -123.1207, label: 'Vancouver' },
  { latitude: 20.6597, longitude: -103.3496, label: 'Guadalajara' },
  { latitude: 21.1619, longitude: -86.8515, label: 'Cancún' },
  { latitude: 29.4241, longitude: -98.4936, label: 'San Antonio' },
  { latitude: 33.4484, longitude: -112.0740, label: 'Phoenix' },
  { latitude: -34.6037, longitude: -58.3816, label: 'Buenos Aires' },
  { latitude: -12.0464, longitude: -77.0428, label: 'Lima' },
  { latitude: -0.1807, longitude: -78.4678, label: 'Quito' },
  { latitude: -16.5000, longitude: -68.1500, label: 'La Paz' },
  { latitude: -34.9011, longitude: -56.1645, label: 'Montevideo' },
  { latitude: -33.4489, longitude: -70.6693, label: 'Santiago' },
  { latitude: -25.2637, longitude: -57.5759, label: 'Asuncion' },
  { latitude: -2.170998, longitude: -79.922359, label: 'Guayaquil' },
  { latitude: -17.7833, longitude: -63.1821, label: 'Santa Cruz' },
  { latitude: -3.1190, longitude: -60.0217, label: 'Manaus' },
  { latitude: -12.9777, longitude: -38.5016, label: 'Salvador' },
  { latitude: -15.7801, longitude: -47.9292, label: 'Brasilia' },
  { latitude: -8.0543, longitude: -34.8813, label: 'Recife' },
  { latitude: -3.7319, longitude: -38.5267, label: 'Fortaleza' },
  { latitude: -27.5954, longitude: -48.5480, label: 'Florianopolis' },
]

// Ajout des propriétés communes à toutes les villes
listeVilles.forEach(ville => {
  ville.pointColor = '#FF0000'
  ville.pointRadius = 0.02
  ville.labelColor = arcenciel(randint(0, 10))
  ville.labelSize = 0.5
  ville.font = 'images/custom-msdf.json'
  ville.transparent = true
})

function choisirNVillesAssezLointaines (n) {
  const villes = []
  let cpt = 0
  for (let i = 0; i < n && cpt < 100;) {
    const ville = choice(listeVilles)
    if (!villes.some(v => Math.abs(v.latitude - ville.latitude) < 10 && Math.abs(v.longitude - ville.longitude) < 10)) {
      villes.push(ville)
      i++
    } else {
      cpt++
    }
  }
  return villes
}
export default class ReperageSurLaTerre extends Exercice {
  constructor () {
    super()
    this.besoinFormulaireCaseACocher = ['3D dynamique', true]
    this.sup = true
    this.nbQuestions = 4
  }

  nouvelleVersion () {
    const correctionTexte = (choix, ville) => `   En effet, la ${choix === 'latitude' ? 'latitude' : 'longitude'} est la ${choix === 'latitude' ? 'première' : 'deuxième'} coordonnée GPS, soit $${choix === 'latitude'
        ? `${texNombre(ville.latitude, 3)}\\approx ${texNombre(ville.latitude, 0)}`
        : `${texNombre(ville.longitude, 3)}\\approx ${texNombre(ville.longitude, 0)}`}$.<br>
        De plus, la ${choix === 'latitude' ? 'latitude' : 'longitude'} est ${choix === 'latitude'
        ? ville.latitude >= 0 ? 'positive' : 'négative'
        : ville.longitude >= 0 ? 'positive' : 'négative'
        }, ce qui signifie que ${ville.label} est située ${choix === 'latitude'
        ? ville.latitude >= 0 ? 'au nord' : 'au sud'
        : ville.longitude >= 0 ? 'à l\'est' : 'à l\'ouest'
        }.`

    const villes = choisirNVillesAssezLointaines(this.nbQuestions)
    if (this.sup && context.isHtml) {
      // nettoyage de la scène précédente
      const previousScene = document.querySelector('#emplacementPourSceneViewerscene-Ex0Q0')
      if (previousScene) {
        previousScene.innerHTML = ''
      }

      const sceneBuilder = new SceneViewer({ width: 400, height: 400, id: `Ex${this.numeroExercice}Q0`, withEarth: true, withSky: true, rigPosition: [0, 3, 0], zoomLimits: { min: 8, max: 12 }, cameraDistance: 10, fov: 60, rigRotation: [0, 0, 0] }) // Même si il y a plusieurs question, il n'y a qu'une seule scène
      // Création de la scène 3D
      sceneBuilder.addCustomWireSphere({
        position: [0, 3, 0],
        radius: 4.02,
        parallels: 18,
        meridians: 72,
        /* parallelColor: 'black', // Parallèles bleu ciel
          meridianColor: 'purple', // Méridiens gris-ble */
        showEquator: true,
        equatorColor: '#DC143C',
        equatorThickness: 0.01,       // Équateur plus épais
        showGreenwich: true,
        greenwichColor: '#008000',
        greenwichThickness: 0.01     // Greenwich épais

      })
      // Les longitudes
      const points = rangeMinMax(-17, 18, [0]).map(el => Object.assign({
        latitude: 0,
        longitude: el * 10,
        label: `${el >= 0 ? `${el * 10}°E` : `${-el * 10}°O`}`,
        pointColor: '#FF0000'
      }, {
        pointColor: '#FF0000',
        pointRadius: 0.02,
        font: 'images/custom-msdf.json',
        labelColor: '#FFFFFF',
        transparent: true  // NOUVEAU : Forcer la transparence
      }))

      sceneBuilder.addGeographicPoints({
        spherePosition: [0, 3, 0],
        sphereRadius: 4,
        defaultLabelSize: 0.3,
        points,
        transparent: true  // NOUVEAU : Transparence globale
      })

      // Les latitudes
      const points2 = rangeMinMax(-8, 8, [0]).map(el => [Object.assign({
        latitude: el * 10,
        longitude: 0,
        label: `${el >= 0 ? `${el * 10}°N` : `${-el * 10}°S`}`
      }, {
        pointColor: '#FF0000',
        pointRadius: 0.02,
        labelColor: '#FFFFFF',
        labelSize: 0.3,
        font: 'images/custom-msdf.json',
        transparent: true  // NOUVEAU : Transparence pour chaque point
      }),
      Object.assign({
        latitude: el * 10,
        longitude: 180,
        label: `${el >= 0 ? `${el * 10}°N` : `${-el * 10}°S`}`
      }, {
        pointColor: '#FF0000',
        pointRadius: 0.02,
        labelColor: '#FFFFFF',
        labelSize: 0.3,
        font: 'images/custom-msdf.json',
        transparent: true  // NOUVEAU : Transparence pour chaque point
      })]
      ).flat(1)

      sceneBuilder.addGeographicPoints({
        spherePosition: [0, 3, 0],
        sphereRadius: 4,
        points: points2,
        defaultLabelSize: 0.3,
        transparent: true  // NOUVEAU : Transparence globale
      })

      // Villes avec transparence

      sceneBuilder.addGeographicPoints({
        spherePosition: [0, 3, 0],
        sphereRadius: 4,
        points: villes,
        defaultLabelSize: 0.2,
        defaultFont: 'images/custom-msdf.json',
        transparent: true  // NOUVEAU : Transparence globale
      })

      sceneBuilder.addRealisticEarthSphere({
        position: [0, 3, 0],
        radius: 4,
        greenwichAlignment: -90,
      })

      const vue = `<div id="emplacementPourSceneViewer${sceneBuilder.id}" style="width: 400px; height: 400px;"></div>`

      this.consigne = vue

      for (let i = 0; i < this.nbQuestions; i++) {
        const ville = villes[i]
        const choix = choice(['latitude', 'longitude'])
        const question = `Quelle est la ${choix} de ${ville.label} ?` + ajouteQuestionMathlive({
          exercice: this,
          question: i,
          typeInteractivite: 'remplisLesBlancs',
          content: '%{champ1}°%{champ2}',
          classe: KeyboardType.geolocalisation,
          objetReponse: {
            champ1: { value: `${choix === 'latitude' ? Math.round(Math.abs(ville.latitude)) : Math.round(Math.abs(ville.longitude))}`, compare: approximatelyCompare, options: { tolerance: 1 } }, champ2: { value: `${choix === 'latitude' ? (ville.latitude >= 0 ? 'N' : 'S') : (ville.longitude >= 0 ? 'E' : 'O')}`, compare: approximatelyCompare, options: { tolerance: 1 } }
          },
        })
        const correction = `La ${choix} de ${ville.label} est d'environ ${choix === 'latitude'
        ? `${Math.round(Math.abs(ville.latitude))}°${ville.latitude >= 0 ? 'N' : 'S'}`
        : `${Math.round(Math.abs(ville.longitude))}°${ville.longitude >= 0 ? 'E' : 'O'
      }`}.<br>
       ${correctionTexte(choix, ville)}`
        this.listeQuestions.push(question)
        this.listeCorrections.push(correction)
      }
      document.addEventListener('exercicesAffiches', () => {
        const parent = document.getElementById(`emplacementPourSceneViewer${sceneBuilder.id}`)
        if (parent !== null) {
          const aScene = parent.querySelector('a-scene')
          if (aScene === null) {
            sceneBuilder.showSceneAt(parent)
          }
        }
      }, { once: true })
    } else {
      this.consigne = 'Cet exercice est interactif et nécessite un affichage HTML. (version modifiée pour la version pdf)'
      for (let i = 0; i < this.nbQuestions; i++) {
        const ville = villes[i]
        const choix = choice(['latitude', 'longitude'])
        const question = `Quelle est la ${choix} de ${ville.label} dont les coordonnées GPS sont $(~${texNombre(ville.latitude, 3)}~;~${texNombre(ville.longitude, 3)}~)$ ?<br>
         On donnera la réponse arrondie à l'unité, sous la forme d'un angle positif avec son orientation (N, S, E ou O).`
        const correction = `La ${choix} de ${ville.label} est d'environ ${choix === 'latitude'
          ? `${Math.round(Math.abs(ville.latitude))}°${ville.latitude >= 0 ? 'N' : 'S'}`
          : `${Math.round(Math.abs(ville.longitude))}°${ville.longitude >= 0 ? 'E' : 'O'
        }`}.<br>
         ${correctionTexte(choix, ville)}`
        this.listeQuestions.push(question)
        this.listeCorrections.push(correction)
      }
    }
  }
}
