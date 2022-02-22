import { auth } from '../plugins/firebase'

export function authorization(to) {
	const requiresAuth = to.matched.some( r => r.meta.requiresAuth )
	// const requiresAdmin = to.matched.some( r => r.meta.requiresAdmin )
    
    if(requiresAuth && !auth.currentUser) 
        return { approve: false, redirect: '/login' }
    
    return { approve: true }   
}