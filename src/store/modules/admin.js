import { db } from '../../plugins/firebase'

const state = {
    course: 'JgoBlXYdaGKpGF5tV98x',
    info: null,
    exams: null,
    groups: null,
    lessons: null,
    tasks: null
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
            db.collection('users').where('email' ,'==', email).get()
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
}

const mutations = {
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
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}