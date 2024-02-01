import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './AppContainer.vue'
import router from './router'
import store from './store'
import Socket from './socket'
import languages from './languages'
const socket = new Socket(store)

const i18n = createI18n({
	locale: localStorage.getItem('locale') || 'en',
	fallbackLocale: 'en',
	messages: languages,
})

const app = createApp(App)
app.config.globalProperties.$socket = socket
app.use(store).use(router).use(i18n).mount('#app')
