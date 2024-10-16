import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.css'
// Import BootstrapVue 3 CSS
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'


// Import BootstrapVue 3
import { BootstrapVue3 } from 'bootstrap-vue-3'

// Create vue app
const app = createApp(App)
const pinia = createPinia()

// Use BootstrapVue3
app.use(BootstrapVue3)
app.use(pinia)

// Register plugins
registerPlugins(app)

// Mount vue app
app.mount('#app')
