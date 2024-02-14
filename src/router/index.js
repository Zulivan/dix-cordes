import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import App from '../views/App.vue'

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home,
	},
	{
		path: '/app',
		name: 'Application',
		component: App,
	},
	{
		path: '/app/@me/:currentContact',
		name: 'ApplicationContactInput',
		props: true,
		component: App,
	},
	{
		path: '/app/archive/:currentArchive',
		name: 'ApplicationArchiveInput',
		props: true,
		component: App,
	},
	{
		path: '/app/:currentViewProp',
		name: 'ApplicationViewInput',
		props: true,
		component: App,
	},
	{
		path: '/app/login',
		name: 'Login',
		component: Login,
	},
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
})

export default router
