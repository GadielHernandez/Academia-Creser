import { ATTENDANCE } from '../../plugins/criteria-types'
import { db, auth, timeServer } from '../../plugins/firebase'

const state = {
    id: null,
    course: {
        active: false,
        ends: null,
        id: null,
        name: null,
        progress: null,
        starts: null,
        students: null,
        teacher: null
    },
    hasCourse: null,
    lessons: []
}

const getters = {}

const actions = {
    fetchCourse({ commit }){
        return new Promise((resolve, reject) => {
            db.collection(`users/${auth.currentUser.uid}/groups`).where('active', '==', true).get()
            .then( async resp => {
                if(resp.docs.length === 0) {
                    commit('UPDATE_STATUS', false)
                    return resolve()
                }

                let group = resp.docs[0]
                let group_data = await db.doc(`courses/${group.data().course}/groups/${group.id}`).get()
                commit('UPDATE_ID', group.data().course)
                commit('UPDATE_COURSE', { id: group.id, ...group_data.data() })

                const now = timeServer().toMillis()
                const lessons = await db.collection(`courses/${group.data().course}/lessons`).where('available_after', '<', now - group_data.data().starts ).get()
                if(lessons.docs.length > 0) commit( 'UPDATE_LESSONS', lessons.docs.map( l => ({ id: l.id, ...l.data() }) ) )
                
                commit('UPDATE_STATUS', true)
                return resolve()
            })
            .catch( error => reject(error))
        })
    },
    setAttendances({ state, commit }, payload){
        return new Promise((resolve, reject) => {
            const update = {}
            update[`progress.${ATTENDANCE}.${payload.id}`] = payload.data
            db.doc(`courses/${state.id}/groups/${state.course.id}`).update(update)
            .then(() => {
                commit('UPDATE_ATTENDANCE', payload)
                resolve()
            })
            .catch(() => reject())
        })
    }
}

const mutations = {
    UPDATE_ID(state, payload){
        state.id = payload
    },
    UPDATE_COURSE(state, payload){
        state.course = payload
    },
    UPDATE_STATUS(state, payload){
        state.hasCourse = payload
    },
    UPDATE_LESSONS(state, payload){
        state.lessons = payload
    },
    UPDATE_ATTENDANCE(state, payload){
        state.course.progress[ATTENDANCE][payload.id] = payload.data
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}