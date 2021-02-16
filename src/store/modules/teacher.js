import { db, auth } from '../../plugins/firebase'

const state = {
    course: null,
    hasCourse: null
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

                commit('UPDATE_COURSE', { id: group.id, ...group_data.data() })
                commit('UPDATE_STATUS', true)
                return resolve()
            })
            .catch( error => reject(error))
        })
    }
}

const mutations = {
    UPDATE_COURSE(state, payload){
        state.course = payload
    },
    UPDATE_STATUS(state, payload){
        state.hasCourse = payload
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}