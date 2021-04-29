import { db, firebase } from '../../plugins/firebase'

const state = {
    course: 'JgoBlXYdaGKpGF5tV98x',
    info: null,
    users: null,
    exams: null,
    groups: null,
    lessons: null,
    tasks: null,
    aux: {}
}

const getters = {}

const actions = {
    fetchCourse({ commit, state }){
        return new Promise((resolve, reject) => {
            db.doc(`courses/${state.course}`).get()
            .then( doc => {
                commit('UPDATE_INFO', doc.data() )
                return resolve()
            })
            .catch( () => reject() )
        })
    },
    fetchListUsers(ctx, lastUser){
        let query 
        if(lastUser)
            query = db.collection(`users`).orderBy('email').startAt(lastUser).limit(20)
        else
            query = db.collection(`users`).orderBy('email').limit(20)
        return new Promise((resolve, reject) => {
            query.get()
            .then( resp => {
                return resolve(resp.docs.map( doc => ({ id: doc.id, ...doc.data() })))
            })
            .catch( () => reject() )
        })
    },
    fetchGroups({ commit, state }){
        return new Promise((resolve, reject) => {
            db.collection(`courses/${state.course}/groups`).get()
            .then( resp =>{
                commit('UPDATE_GROUPS', resp.docs.map( doc => ({ id: doc.id, ...doc.data() })) )
                return resolve()
            })
            .catch( () => reject() )
        })
    },
    fetchExams({ commit, state }){
        return new Promise((resolve, reject) => {
            db.collection(`courses/${state.course}/exams`).get()
            .then( resp =>{
                commit('UPDATE_EXAMS', resp.docs.map( doc => ({ id: doc.id, ...doc.data() })) )
                return resolve()
            })
            .catch( () => reject() )
        })
    },
    fetchLessons({ commit, state }){
        return new Promise((resolve, reject) => {
            db.collection(`courses/${state.course}/lessons`).orderBy('available_after').get()
            .then( resp =>{
                commit('UPDATE_LESSONS', resp.docs.map( doc => ({ id: doc.id, ...doc.data() })) )
                return resolve()
            })
            .catch( () => reject() )
        })
    },
    fetchTasks({ commit, state }){
        return new Promise((resolve, reject) => {
            db.collection(`courses/${state.course}/tasks`).get()
            .then( resp =>{
                commit('UPDATE_TASKS', resp.docs.map( doc => ({ id: doc.id, ...doc.data() })) )
                return resolve()
            })
            .catch( () => reject() )
        })
    },
    fetchUser( ctx, email){
        return new Promise((resolve, reject) => {
            db.collection('users').where('email' ,'==', email.replace(/\s/g, '')).get()
            .then( res => {
                if(res.docs.length === 0) resolve(null)
                else resolve({ id: res.docs[0].id, ...res.docs[0].data() })
                return
            })
            .catch( () => reject() )
        })
    },
    updateLesson({ commit, state }, payload){
        const { id } = payload
        delete payload.id
        return new Promise((resolve, reject) => {
            db.doc(`courses/${state.course}/lessons/${id}`).update(payload)
            .then(() => {
                commit('UPDATE_LESSON', { id: id, data: payload })
                return resolve()
            })
            .catch( () => reject() )
        })
    },
    updateGroup({ commit, state }, payload){
        const { id } = payload
        delete payload.id
        return new Promise((resolve, reject) => {
            db.doc(`courses/${state.course}/groups/${id}`).update(payload)
            .then(() => {
                commit('UPDATE_GROUP', { id: id, data: payload })
                return resolve()
            })
            .then( () => reject() )
        })
    },
    updateUser(ctx , payload){
        const { id } = payload
        delete payload.id
        return new Promise((resolve, reject) => {
            db.doc(`users/${id}`).update(payload)
            .then(() => resolve())
            .catch( () => reject() )
        })
    },
    addLesson({ commit }, payload){
        return new Promise((resolve, reject) => {
            db.collection(`courses/${state.course}/lessons`).add(payload)
            .then( doc => {
                commit('ADD_LESSON', { id: doc.id, ...payload })
                return resolve()
            })
            .catch( () => reject() )
        })
    },
    addGroup({ commit }, payload){
        return new Promise((resolve, reject) => {
            db.collection(`courses/${state.course}/groups`).add(payload)
            .then( doc => {
                commit('ADD_GROUP', { id: doc.id, ...payload })
                return resolve()
            })
            .catch( () => reject() )
        })
    },
    addUser({ state }, user){
        return new Promise((resolve, reject) => {
            if(!state.aux.auxApp)
                state.aux.auxApp = firebase.initializeApp(firebase.app().options, 'auth-worker')
            if(!state.aux.auxAuth){
                state.aux.auxAuth = firebase.auth(state.aux.auxApp)
                state.aux.auxAuth.setPersistence(firebase.auth.Auth.Persistence.NONE)
            }

            state.aux.auxAuth.createUserWithEmailAndPassword(user.email, user.password)
            .then(async user_ => {
                delete user.password
                await db.doc(`users/${user_.user.uid}`).set(user)
                return resolve()
            })
            .catch( error => {
                if(error) return reject({ message: error.message })
                return reject({ message: '' })
            })
        })
    },
    addUserGroup({ commit }, payload){
        const { group, user } = payload
        return new Promise((resolve, reject) => {
            db.doc(`courses/${state.course}/groups/${group}`).update({
                students: firebase.firestore.FieldValue.arrayUnion(user)
            })
            .then( async () => {
                await db.doc(`users/${user.id}/courses/${state.course}`).set({
                    group: group
                })
                commit('ADD_USER_GROUP', payload)
                return resolve()
            })
            .catch( () => reject() )
        })
    },
}

const mutations = {
    UPDATE_USERS(state, payload){
        state.users = payload
    },
    UPDATE_INFO(state, payload){
        state.info = payload
    },
    UPDATE_GROUPS(state, payload){
        state.groups = payload
    },
    UPDATE_EXAMS(state, payload){
        state.exams = payload
    },
    UPDATE_LESSONS(state, payload){
        state.lessons = payload
    },
    UPDATE_TASKS(state, payload){
        state.tasks = payload
    },
    UPDATE_LESSON(state, payload){
        const index = state.lessons.findIndex( l => l.id === payload.id )
        state.lessons.splice(index, 1, { id: payload.id, ...payload.data })
    },
    UPDATE_GROUP(state, payload){
        const index = state.groups.findIndex( l => l.id === payload.id )
        state.groups.splice(index, 1, { id: payload.id, ...payload.data })
    },
    ADD_LESSON(state, payload){
        const index = state.lessons.findIndex( l => l.available_after > payload.available_after )
        if(index == -1)
            state.lessons.push(payload)
        else
            state.lessons.splice(index, 0, payload)
    },
    ADD_GROUP(state, payload){
        state.groups.push(payload)
    },
    ADD_USER_GROUP(state, payload){
        const { group, user } = payload
        const index = state.groups.findIndex( g => g.id === group)
        if(!state.groups[index].students)
            state.groups[index].students = []
        state.groups[index].students.push(user)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}