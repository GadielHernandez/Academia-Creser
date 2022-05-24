import Vue from 'vue'
import VueRouter from 'vue-router'
import { authorization, levelValidation } from './middlewares'
import UserRoutes from './UserRoutes'
import TeacherRoutes from './TeacherRoutes'

Vue.use(VueRouter)

const routes = [
    ...UserRoutes,
    ...TeacherRoutes
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
	const auth = authorization(to)
    if(!auth.approve)
        return location.href = "https://creser.fuentedevida.com.mx/login"
    
    const validLevel = levelValidation(to)
    if(!validLevel)
        return next(validLevel.redirect)

    next()
})

export default router
