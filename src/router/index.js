import Vue from 'vue'
import VueRouter from 'vue-router'
import { authorization } from './middlewares'
import UserRoutes from './UserRoutes'

Vue.use(VueRouter)

const routes = [
    ...UserRoutes
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
	const auth = authorization(to)
    if(!auth.approve)
        next(auth.redirect)
    
    next()
})

export default router
