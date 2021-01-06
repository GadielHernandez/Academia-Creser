import { auth } from '../../plugins/firebase'

const state = {}

const getters = {}

const mutations = {}

const actions = {
    login(ctx, credentials){
        return new Promise((resolve, reject) => {
            if(auth.currentUser) return resolve({ message: 'Ya esta logueado' })
            
            auth.signInWithEmailAndPassword(credentials.email, credentials.password)
            .then( () => resolve({ message: 'Login exitoso' }))
            .catch( e => {
                if( e.code === 'auth/wrong-password' ) 
                    return reject({ message: 'Constraseña incorrecta' })
                if( e.code === 'auth/user-not-found' ) 
                    return reject({ message: 'El correo no esta registrado' })
                return reject({ message: 'Revisa los datos' })
            })
        })
    },
    logout(){
        return new Promise((resolve, reject) => {
            if(!auth.currentUser) return resolve({ message: 'No esta logueado' })

            auth.signOut()
            .then( () => resolve({ message: 'Logout exitoso' }) )
            .catch( () => reject({ message: 'Error al cerrar sesion' }) )
        })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}