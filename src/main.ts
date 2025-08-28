import 'boxicons/css/boxicons.min.css'
import './app.css'
import './topmaths/styles/topmaths.scss'
import App from './components/App.svelte'
import './bugsnag'
import './modules/stats'

const app = new App({
  target: document.getElementById('appMathalea') as HTMLElement,
})

export default app
