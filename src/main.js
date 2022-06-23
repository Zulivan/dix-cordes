import { createApp } from 'vue'
import App from './AppContainer.vue'
import router from './router'
import store from './store'
import Socket from './socket'

const socket = new Socket(store)

const app = createApp(App)
app.config.globalProperties.$socket = socket
app.use(store).use(router).mount('#app')
