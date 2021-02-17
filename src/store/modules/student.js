import { db, timeServer, auth, FieldValue } from '../../plugins/firebase'

const state = {
    loaded: false,
    course_selected: null,
    info: {},
    group: {},
    lessons: []
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
                    const now = timeServer().toMillis()
                    const active = group.data().starts < now && group.data().ends > now
                    commit( 'UPDATE_GROUP', { id: group.id, ...group.data(), active } )
 
                    if(active){
                        const lessons = await db.collection(`courses/${state.course_selected}/lessons`).where('available_after', '<', now - group.data().starts ).get()
                        if(lessons.docs.length > 0) commit( 'UPDATE_LESSONS', lessons.docs.map( l => ({ id: l.id, ...l.data() }) ) )
                    }

                }
                commit( 'UPDATE_STATUS', true )
                return resolve()
            })
            .catch( error => reject(error))
        })
    },
    seCriteriaCompleted({ state, rootState }, criteria_payload){
        return new Promise((resolve, reject) => {
            const criteria = criteria_payload.criteria
            const id = criteria_payload.id
            const addvalue = FieldValue.arrayUnion({ user: auth.currentUser.uid })

            const update = {}
            update[`progress.${criteria}.${id}`] = addvalue

            db.doc(`courses/${state.course_selected}/groups/${state.group.id}`)
            .update(update)
            .then( async () => {
                const criteria_update = rootState.user.courses[0].criteria ? rootState.user.courses[0].criteria : []
                const indexCriteria = criteria_update.findIndex( c => c.name === criteria )
                if(indexCriteria >= 0) criteria_update[indexCriteria].completed.push(id)
                else criteria_update.push({ name: criteria, completed: [id] })
                
                await db.doc(`users/${auth.currentUser.uid}/courses/${state.course_selected}`).update({ criteria: criteria_update })
                resolve()
            })
            .catch( (e) => {
                console.log(e)
                reject()
            } )
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
    },
    UPDATE_LESSONS(state, payload){
        state.lessons = payload
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}