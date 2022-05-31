import { auth, db } from '../../plugins/firebase'

const state = {
    profile: null
}

const getters = {}

const actions = {
    login( ctx, token){
        return new Promise((resolve) => {
            if(auth.currentUser) return resolve({ error: 'Ya esta logueado' })
            
            auth.signInWithCustomToken(token)
            .then( () => resolve({ message: 'Login exitoso' }))
            .catch( () => resolve({ error: 'Token invalido' }))
        })
    },
    logout(){
        return new Promise((resolve, reject) => {
            if(!auth.currentUser) return resolve({ message: 'No esta logueado' })

            auth.signOut()
            .then( () => resolve({ message: 'Logout exitoso' }) )
            .catch( () => reject({ message: 'Error al cerrar sesion' }) )
        })
    },
    fetchProfile({ commit }){
        return new Promise((resolve, reject) => {
            db.doc(`users/${auth.currentUser.uid}`).get()
            .then( async doc => {
                const profile = doc.data()
                commit( 'UPDATE_PROFILE', profile )
                return resolve()
            })
            .catch( () => reject() )
        })
    }
}

const mutations = {
    UPDATE_PROFILE(state, payload){
        state.profile = payload
    },
    UPDATE_COURSE(state, payload){
        state.course.data = payload
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}