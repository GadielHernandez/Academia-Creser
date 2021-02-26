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
    lessons: null
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
                
                commit('UPDATE_STATUS', true)
                return resolve()
            })
            .catch( error => reject(error))
        })
    },
    fetchLessons({commit, state}){
        return new Promise((resolve, reject) => {
            const now = timeServer().toMillis()
            db.collection(`courses/${state.id}/lessons`).where('available_after', '<', now - state.course.starts ).get()
            .then( resp => {
                if(resp.docs.length > 0) commit( 'UPDATE_LESSONS', resp.docs.map( l => ({ id: l.id, ...l.data() }) ) )
            })
            .catch( e => reject(e) )
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