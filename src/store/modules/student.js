import { db, timeServer, auth, FieldValue } from '../../plugins/firebase'
import { ATTENDANCE, TASKS, EXAMS } from '../../plugins/criteria-types'

const state = {
    loaded: false,
    course_id: process.env.VUE_APP_COURSE_ID,
    info: {},
    initial_user_data: {},
    group: {
        started: false,
        ended: false,
        ends: null,
        id: null,
        name: null,
        progress: null,
        starts: null,
        students: null,
        teacher: null
    },
    lessons: null,
    lessons_seen: [],
    tasks: null,
    exams: null
}

const getters = {}

const actions = {
    async fetchCourse({ commit, state }){
        const user_id = auth.currentUser.uid
        const user = await db.doc(`users/${user_id}/courses/${state.course_id}`).get()
        const user_data = user.data()
        
        const course = await db.doc(`courses/${state.course_id}`).get()
        commit( 'UPDATE_COURSE', { id: course.id, ...course.data() } )

        if(!user_data.group) return

        const group = await db.doc(`courses/${state.course_id}/groups/${user_data.group}`).get()
        const now = timeServer().toMillis()
        const started = group.data().starts < now
        const ended = group.data().ends < now
        
        const user_group = { id: group.id, ...group.data(), started, ended }
        const user_progress = { }
        user_progress[ATTENDANCE] = []
        user_progress[EXAMS] = []
        user_progress[TASKS] = []

        const criterias = Object.keys(user_group.progress)
        criterias.forEach( criteria => {
            const elements_ids = Object.keys(user_group.progress[criteria])
            elements_ids.forEach( id => {
                const completed = user_group.progress[criteria][id].find( p => p.user === user_id )
                if(completed)
                    user_progress[criteria].push({ id, ...completed })
            })
        })
        
        user_group.progress = user_progress
        commit( 'UPDATE_GROUP', user_group )
        commit( 'SET_INITAL_USER_DATA', user_data )
        commit( 'UPDATE_STATUS', true )
        return 
    },
    fetchLessons({ commit, state }){
        return new Promise((resolve, reject) => {
            const now = timeServer().toMillis()
            db.collection(`courses/${state.course_id}/lessons`).where('available_after', '<', now - state.group.starts ).get()
            .then( lessons => {
                commit( 'UPDATE_LESSONS', lessons.docs.map( l => ({ id: l.id, ...l.data() }) ) )
                if(state.initial_user_data.lessons_seen)
                    commit('SET_LESSONS_SEEN', state.initial_user_data.lessons_seen)
                resolve()
            })
            .catch( e => reject(e) )
        })
    },
    fetchTasks({ commit, state }){
        return new Promise((resolve, reject) => {
            const now = timeServer().toMillis()
            db.collection(`courses/${state.course_id}/tasks`).where('available_after', '<', now - state.group.starts ).get()
            .then( tasks => {
                commit( 'UPDATE_TASKS', tasks.docs.map( t => ({ id: t.id, ...t.data(), course_start: state.group.starts }) ) )

                if(state.initial_user_data.tasks){
                    state.initial_user_data.tasks.forEach( task => {
                        commit('UPDATE_TASK_RESPONSE', task)
                    })
                }
                if(state.initial_user_data.feedback){
                    state.initial_user_data.feedback.forEach( feedback => {
                        commit('UPDATE_TASK_FEEDBACK', feedback)
                    })
                }
            })
            .catch( e => reject(e) )
        })
    },
    setCriteriaCompleted({ state, commit }, criteria_payload){
        return new Promise((resolve, reject) => {
            if(state.group.ended) return reject({ error: 'course-ended'})
            const criteria = criteria_payload.criteria
            const id = criteria_payload.id
            const value = criteria_payload.options 
                ? { user: auth.currentUser.uid, ...criteria_payload.options }
                : { user: auth.currentUser.uid }
            const addvalue = FieldValue.arrayUnion(value)

            const update = {}
            update[`progress.${criteria}.${id}`] = addvalue

            db.doc(`courses/${state.course_id}/groups/${state.group.id}`)
            .update(update)
            .then( () => {
                commit('UPDATE_CRITERIA_COMPLETE', { criteria, id, value })
                resolve()
            })
            .catch( (e) => {
                console.log(e)
                reject({ error: 'fb-error'})
            } )
        })
    },
    uploadSeenLesson({ state, commit }, lesson){
        return new Promise((resolve, reject) => {
            const addLesson = FieldValue.arrayUnion(lesson)
            db.doc(`users/${auth.currentUser.uid}/courses/${state.course_id}`).update({ lessons_seen: addLesson })
            .then( () => { 
                commit('UPDATE_LESSON_SEEN', lesson)
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
            if(state.group.ended) return reject({ error: 'course-ended'})
            const addTask = FieldValue.arrayUnion(task)
            db.doc(`users/${auth.currentUser.uid}/courses/${state.course_id}`).update({ tasks: addTask })
            .then( () => { 
                commit('UPDATE_TASK_RESPONSE', task)
                resolve()
            })
            .catch( (e) => {
                console.log(e)
                reject({ error: 'fb-error'})
            } )
        })
    },
    fetchExams({ commit, state }){
        return new Promise((resolve, reject) => {
            const now = timeServer().toMillis()
            db.collection(`courses/${state.course_id}/exams`).where('available_after', '<', now - state.group.starts ).get()
            .then( exams => {
                commit( 'UPDATE_EXAMS', exams.docs.map( e => {
                    const id = e.id
                    const data = e.data()
                    let hour = parseInt(data.limit_time / (1000 * 60 * 60))
                    let minutes = parseInt( ( data.limit_time - hour * (1000 * 60 * 60) ) / (1000 * 60) )
                    let seconds = ( data.limit_time - (hour * (1000 * 60 * 60)) - (minutes * ((1000 * 60))) ) / 1000
                    
                    if (hour < 10) hour   = '0' + hour
                    if (minutes < 10) minutes = '0' + minutes
                    if (seconds < 10) seconds = '0' + seconds

                    return { id, ...data, time_format: `${hour}:${minutes}:${seconds}`, course_start: state.group.starts }
                }))
                
                if(state.initial_user_data.exams){
                    state.initial_user_data.exams.forEach( exam => {
                        commit('UPDATE_EXAM_RESPONSE', exam)
                    })
                }

                if(state.initial_user_data.feedback_exams){
                    state.initial_user_data.feedback_exams.forEach( feedback => {
                        commit('UPDATE_EXAM_FEEDBACK', feedback)
                    })
                }
                resolve()
            })
            .catch( e => reject(e) )
        })
    },
    uploadExam({ state, commit }, exam){
        return new Promise((resolve, reject) => {
            if(state.group.ended) return reject({ error: 'course-ended'})
            const addExam = FieldValue.arrayUnion(exam)
            db.doc(`users/${auth.currentUser.uid}/courses/${state.course_id}`).update({ exams: addExam })
            .then( () => { 
                commit('UPDATE_EXAM_RESPONSE', exam)
                resolve()
            })
            .catch( (e) => {
                console.log(e)
                reject({ error: 'fb-error'})
            } )
        })
    },
}

const mutations = {
    UPDATE_STATUS(state, payload){
        state.loaded = payload
    },
    SET_INITAL_USER_DATA(state, payload){
        state.intial_progress = payload
    },
    UPDATE_COURSE(state, payload){
        state.info = payload
    },
    UPDATE_SELECTED(state, payload){
        state.course_id = payload
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
        const progress = state.group.progress
        if(progress[payload.criteria] == undefined)
            progress[payload.criteria] = [{ id: payload.id , ...payload.value }]
        else
            progress[payload.criteria].push({ id: payload.id, ...payload.value })
        state.group.progress = progress
    },
    UPDATE_TASK_RESPONSE(state, payload){
        let taskIndex = state.tasks.findIndex( t => t.id === payload.id )
        state.tasks.splice(taskIndex, 1, { ...state.tasks[taskIndex], responses: payload.responses });
    },
    UPDATE_TASK_FEEDBACK(state, payload){
        let taskIndex = state.tasks.findIndex( t => t.id === payload.id )
        state.tasks[taskIndex].feedback = payload.feedback
    },
    UPDATE_EXAMS(state, payload){
        state.exams = payload
    },
    UPDATE_EXAM_RESPONSE(state, payload){
        let examIndex = state.exams.findIndex( e => e.id === payload.id )
        state.exams[examIndex].responses = payload.responses
    },
    UPDATE_EXAM_FEEDBACK(state, payload){
        let taskIndex = state.exams.findIndex( e => e.id === payload.id )
        state.exams[taskIndex].feedback = payload.feedback
    },
    SET_LESSONS_SEEN(state, payload){
        state.lessons_seen = payload
    },
    UPDATE_LESSON_SEEN(state, payload){
        state.lessons_seen.push(payload)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}