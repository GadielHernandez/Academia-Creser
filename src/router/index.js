import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import UserHome from '../views/user/Home'

import { auth } from '../plugins/firebase'

Vue.use(VueRouter)

const routes = [
    {
        path: '/student/',
        name: 'studentHome',
        component: UserHome,
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
