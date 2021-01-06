import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Academia from '../views/Academia'

import { auth } from '../plugins/firebase'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/academia',
        name: 'Academia',
        component: Academia,
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
})

router.beforeEach((to, from, next) =>{
	const requiresAuth = to.matched.some( r => r.meta.requiresAuth )
	// const requiresAdmin = to.matched.some( r => r.meta.requiresAdmin )
    
    if(requiresAuth && !auth.currentUser) return next('/login')
    else if(!requiresAuth &&auth.currentUser) return next('/')
    
    next()
        
})

export default router
