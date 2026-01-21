import 'boxicons/css/boxicons.min.css'
import { mount } from 'svelte'
import './app.css'
import './bugsnag'
import App from './components/App.svelte'
import './modules/stats'
import './topmaths/styles/topmaths.scss'

const app = mount(App, {
  target: document.getElementById('appMathalea') as HTMLElement,
})

export default app
