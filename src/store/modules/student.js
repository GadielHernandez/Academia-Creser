import { db, timeServer, auth, FieldValue } from '../../plugins/firebase'

const state = {
    loaded: false,
    course_selected: null,
    info: {},
    group: {
        active: false,
        ends: null,
        id: null,
        name: null,
        progress: null,
        starts: null,
        students: null,
        teacher: null
    },
    lessons: null,
    tasks: null
}

const getters = {}

const actions = {
    fetchCourses({ commit, rootState, state }){
        if(rootState.user.courses.length === 0){
            commit( 'UPDATE_STATUS', true )
            return
        }
            
        commit('UPDATE_SELECTED', rootState.user.courses[0].id)
        return new Promise((resolve, reject) => {
            db.doc(`courses/${state.course_selected}`).get()
            .then( async doc => {
                commit( 'UPDATE_COURSE', { id: doc.id, ...doc.data() } )
                if(rootState.user.courses[0].group){

                    const group = await db.doc(`courses/${state.course_selected}/groups/${rootState.user.courses[0].group}`).get()
                    const now = timeServer().toMillis()
                    const active = group.data().starts < now && group.data().ends > now
                    const my_group = { id: group.id, ...group.data(), active }
                    const my_progress = {}
                    for(let criteria in my_group.progress){
                        my_progress[criteria] = []
                        if(Object.prototype.hasOwnProperty.call(my_group.progress, criteria)){
                            for(let element in  my_group.progress[criteria]){
                                if(Object.prototype.hasOwnProperty.call(my_group.progress[criteria], element)){
                                    const completed = my_group.progress[criteria][element].find( p => p.user === auth.currentUser.uid )
                                    if(completed) my_progress[criteria].push({ id: element, ...completed })
                                }
                            }
                        }
                    }
                    my_group.progress = my_progress
                    commit( 'UPDATE_GROUP', my_group )

                }
                commit( 'UPDATE_STATUS', true )
                return resolve()
            })
            .catch( error => reject(error))
        })
    },
    fetchLessons({ commit, state }){
        return new Promise((resolve, reject) => {
            const now = timeServer().toMillis()
            db.collection(`courses/${state.course_selected}/lessons`).where('available_after', '<', now - state.group.starts ).get()
            .then( lessons => {
                commit( 'UPDATE_LESSONS', lessons.docs.map( l => ({ id: l.id, ...l.data() }) ) )
            })
            .catch( e => reject(e) )
        })
    },
    fetchTasks({ commit, rootState }){
        return new Promise((resolve, reject) => {
            const now = timeServer().toMillis()
            db.collection(`courses/${state.course_selected}/tasks`).where('available_after', '<', now - state.group.starts ).get()
            .then( tasks => {
                commit( 'UPDATE_TASKS', tasks.docs.map( t => ({ id: t.id, ...t.data(), course_start: state.group.starts }) ) )
                if(rootState.user.courses[0].tasks){
                    rootState.user.courses[0].tasks.forEach( task => {
                        commit('UPDATE_TASK_RESPONSE', task)
                    })
                }
            })
            .catch( e => reject(e) )
        })
    },
    setCriteriaCompleted({ state, commit }, criteria_payload){
        return new Promise((resolve, reject) => {
            const criteria = criteria_payload.criteria
            const id = criteria_payload.id
            const addvalue = FieldValue.arrayUnion({ user: auth.currentUser.uid })

            const update = {}
            update[`progress.${criteria}.${id}`] = addvalue

            db.doc(`courses/${state.course_selected}/groups/${state.group.id}`)
            .update(update)
            .then( () => {
                commit('UPDATE_CRITERIA_COMPLETE', { criteria, id })
                resolve()
            })
            .catch( (e) => {
                console.log(e)
                reject()
            } )
        })
    },
    uploadTask({ state, commit }, task){
        return new Promise((resolve, reject) => {
            const addTask = FieldValue.arrayUnion(task)
            db.doc(`users/${auth.currentUser.uid}/courses/${state.course_selected}`).update({ tasks: addTask })
            .then( () => { 
                commit('UPDATE_TASK_RESPONSE', task)
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
    },
    UPDATE_TASKS(state, payload){
        state.tasks = payload
    },
    UPDATE_CRITERIA_COMPLETE(state, payload){
        const old = state.group.progress
        if(old[payload.criteria] == undefined)
            old[payload.criteria] = [{ id: payload.id }]
        else
            old[payload.criteria].push({ id: payload.id })
        state.group.progress = old
    },
    UPDATE_TASK_RESPONSE(state, payload){
        let taskIndex = state.tasks.findIndex( t => t.id === payload.id )
        state.tasks[taskIndex].responses = payload.responses
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}