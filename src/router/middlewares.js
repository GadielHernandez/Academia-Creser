import { auth } from '../plugins/firebase'
import { INITAL_ROUTES } from '../plugins/router-helpers'
import store from '../store'

export function authorization(to) {
    const requiresAuth = to.matched.some((r) => r.meta.requiresAuth)

    if (requiresAuth && !auth.currentUser)
        return { approve: false, redirect: '/login' }

    return { approve: true }
}

export function levelValidation(to) {
    const valid =
        to.meta.level === store.state.view.actual ||
        store.state.view.actual === null

    if (!valid)
        return { valid, redirect: INITAL_ROUTES[store.state.view.actual] }

    return { valid }
}
