import { auth, db } from '../../plugins/firebase'

const state = {
    profile: {},
    courses: null
}

const getters = {}

const actions = {
    login( ctx, credentials){
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
    },
    fetchProfile({ commit }){
        return new Promise((resolve, reject) => {
            db.doc(`users/${auth.currentUser.uid}`).get()
            .then( async doc => {
                commit( 'UPDATE_PROFILE', doc.data() )
                const courses = await db.collection(`users/${auth.currentUser.uid}/courses`).get()
                commit( 'UPDATE_COURSES', courses.docs.map( course => ({ id: course.id, ...course.data()})) ) 
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
    UPDATE_COURSES(state, payload){
        state.courses = payload
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}