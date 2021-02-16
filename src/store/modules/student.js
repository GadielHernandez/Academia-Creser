import { db } from '../../plugins/firebase'

const state = {
    loaded: false,
    course_selected: null,
    info: {},
    group: {}
}

const getters = {}

const actions = {
    fetchCourses({ commit, rootState, state }){
        if(rootState.user.courses.length === 0)
            return
            
        commit('UPDATE_SELECTED', rootState.user.courses[0].id)
        return new Promise((resolve, reject) => {
            db.doc(`courses/${state.course_selected}`).get()
            .then( async doc => {
                commit( 'UPDATE_COURSE', { id: doc.id, ...doc.data() } )
                if(rootState.user.courses[0].group){
                    const group = await db.doc(`courses/${state.course_selected}/groups/${rootState.user.courses[0].group}`).get()
                    commit( 'UPDATE_GROUP', { id: group.id, ...group.data() } )
                }
                commit( 'UPDATE_STATUS', true )
                return resolve()
            })
            .catch( error => reject(error))
        })
    }
}

const mutations = {
    UPDATE_STATUS(state, payload){
        state.loaded = payload
    },
    UPDATE_COURSE(state, payload){
        state.info = payload
    },
    UPDATE_SELECTED(state, payload){
        state.course_selected = payload
    },
    UPDATE_GROUP(state, payload){
        state.group = payload
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}