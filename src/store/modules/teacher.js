import { ATTENDANCE } from '../../plugins/criteria-types'
import { db, auth, timeServer, FieldValue } from '../../plugins/firebase'

const state = {
    id: 'JgoBlXYdaGKpGF5tV98x',
    course: {
        active: false,
        ends: null,
        id: null,
        name: null,
        progress: {},
        starts: null,
        students: null,
        teacher: { tasks: null }
    },
    hasCourse: null,
    lessons: null,
    tasks: null,
    exams: null
}

const getters = {}

const actions = {
    fetchCourse({ commit, state }){
        return new Promise((resolve, reject) => {
            db.collection(`users/${auth.currentUser.uid}/groups`).where('course', '==', state.id).get()
            .then( async resp => {
                if(resp.docs.length === 0) {
                    commit('UPDATE_STATUS', false)
                    return resolve()
                }

                let group = resp.docs[0]
                let group_data = await db.doc(`courses/${group.data().course}/groups/${group.id}`).get()
                let course_data = await db.doc(`courses/${group.data().course}`).get()
                commit('UPDATE_ID', group.data().course)
                commit('UPDATE_COURSE', { id: group.id, ...group_data.data(), ...course_data.data() })
                
                const otherTeachers = group_data.data().teachers.filter( t => t.id !== auth.currentUser.uid)
                const allFeedbacks = { tasks: group.data().tasks || {}, exams: group.data().exams  || {}}
                const combinateFeedbacks = (obj1, obj2) => {
                    Object.keys(obj2).forEach( key => {
                        obj1[key] 
                            ? obj1[key] = [...obj1[key], obj2[key]]
                            : obj1[key] = obj2[key] 
                    })
                    return obj1
                }
                if(otherTeachers.length > 0){
                    const teachersFeedbacksPromises = otherTeachers.map( t => 
                        db.doc(`users/${t.id}/groups/${group.id}`).get()
                    ) 
                    const teachersFeedbacks = await Promise.all(teachersFeedbacksPromises)
                    teachersFeedbacks.forEach( t => {
                        if(!t.exists) return
                        if(t.data().tasks) combinateFeedbacks(allFeedbacks.tasks, t.data().tasks)
                        if(t.data().exams) combinateFeedbacks(allFeedbacks.exams, t.data().exams)
                    })
                }
                commit('UPDATE_FEEDBACKS', allFeedbacks)
                
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
                commit( 'UPDATE_LESSONS', resp.docs.map( l => ({ id: l.id, ...l.data() }) ) )
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
    },
    setFeedback({ commit, state }, payload){
        return new Promise((resolve, reject) => {
            const task = payload.task
            const student = payload.student
            const feedback = payload.feedback
            const addvalue = FieldValue.arrayUnion(student)

            const update = {}
            update[`tasks.${task}`] = addvalue

            db.doc(`users/${auth.currentUser.uid}/groups/${state.course.id}`)
            .update(update)
            .then( async () => {
                await db.doc(`users/${student}/courses/${state.id}`).update({ feedback: FieldValue.arrayUnion({ id: task, feedback: feedback }) })
                commit('SET_FEEDBACK', payload)
                commit('UPDATE_USER_FEEDBACKS', { student, feedbacks: [{ id: task, feedback }] })
                resolve()
            })
            .catch( () => reject() )
        })
    },
    setFeedbackExam({ commit, state }, payload){
        return new Promise((resolve, reject) => {
            const { exam, student, feedback } = payload
            const addvalue = FieldValue.arrayUnion(student)

            const update = {}
            update[`exams.${exam}`] = addvalue

            db.doc(`users/${auth.currentUser.uid}/groups/${state.course.id}`)
            .update(update)
            .then( async () => {
                await db.doc(`users/${student}/courses/${state.id}`).update({ feedback_exams: FieldValue.arrayUnion({ id: exam, feedback: feedback }) })
                commit('SET_FEEDBACK_EXAM', payload)
                commit('UPDATE_USER_FEEDBACKS_EXAM', { student, feedbacks: [{ id: exam, feedback }] })
                resolve()
            })
            .catch( () => reject() )
        })
    },
    fetchTasks({ commit, state }){
        return new Promise((resolve, reject) => {
            const now = timeServer().toMillis()
            db.collection(`courses/${state.id}/tasks`).where('available_after', '<', now - state.course.starts ).get()
            .then( tasks => {
                commit( 'UPDATE_TASKS', tasks.docs.map( t => ({ id: t.id, ...t.data(), course_start: state.course.starts }) ) )
                resolve()
            })
            .catch( e => reject(e) )
        })
    },
    fetchAnswersFeedback({ state, commit }, payload){
        if(state.course.students != null){
            const user_state = state.course.students.find( s => s.id === payload.student )
            if(user_state.tasks)
                if(user_state.tasks.find(t => t.id == payload.task))
                    return user_state.tasks.find(t => t.id == payload.task)
        }
        return new Promise((resolve, reject) => {
            db.doc(`users/${payload.student}/courses/${state.id}`).get()
            .then( student => {
                const user_data = student.data()
                let response = { id: payload.task }
                if(user_data.tasks){
                    commit('UPDATE_USER_ANSWERS', { student: payload.student , answ: user_data.tasks})
                    response.responses = user_data.tasks.find( t => t.id == payload.task ).responses
                }

                if(user_data.feedback){
                    commit('UPDATE_USER_FEEDBACKS', { student: payload.student, feedbacks: user_data.feedback })
                    let taskfeedback = user_data.feedback.find( t => t.id == payload.task )
                    if(taskfeedback) response.feedback = taskfeedback.feedback
                }
                
                resolve(response)    
            })
            .catch( e => reject(e) )
        })
    },
    fetchExams({ commit, state }){
        return new Promise((resolve, reject) => {
            const now = timeServer().toMillis()
            db.collection(`courses/${state.id}/exams`).where('available_after', '<', now - state.course.starts ).get()
            .then( exams => {
                commit( 'UPDATE_EXAMS', exams.docs.map( e => ({ id: e.id, ...e.data(), course_start: state.course.starts }) ) )
                resolve()
            })
            .catch( e => reject(e) )
        })
    },
    fetchAnswersFeedbackExams({ state, commit }, payload){
        if(state.course.students != null){
            const user_state = state.course.students.find( s => s.id === payload.student )
            if(user_state.exams)
                if(user_state.exams.find(e => e.id == payload.exam))
                    return user_state.exams.find(e => e.id == payload.exam)
        }
        return new Promise((resolve, reject) => {
            db.doc(`users/${payload.student}/courses/${state.id}`).get()
            .then( student => {
                const user_data = student.data()
                let response = { id: payload.exam }
                if(user_data.tasks){
                    commit('UPDATE_USER_ANSWERS_EXAM', { student: payload.student , answ: user_data.exams})
                    response.responses = user_data.exams.find( e => e.id == payload.exam ).responses
                }

                if(user_data.feedback_exams){
                    commit('UPDATE_USER_FEEDBACKS_EXAM', { student: payload.student, feedbacks: user_data.feedback_exams })
                    let examfeedback = user_data.feedback_exams.find( e => e.id == payload.exam )
                    if(examfeedback) response.feedback = examfeedback.feedback
                }
                
                resolve(response)    
            })
            .catch( e => reject(e) )
        })
    },
}

const mutations = {
    UPDATE_ID(state, payload){
        state.id = payload
    },
    UPDATE_COURSE(state, payload){
        for (var prop in payload) {
            if (Object.prototype.hasOwnProperty.call(payload, prop)) {
                state.course[prop] = payload[prop]
            }
        }
    },
    UPDATE_STATUS(state, payload){
        state.hasCourse = payload
    },
    UPDATE_LESSONS(state, payload){
        state.lessons = payload
    },
    UPDATE_ATTENDANCE(state, payload){
        if(state.course.progress[ATTENDANCE])
            state.course.progress[ATTENDANCE][payload.id] = payload.data
        else{
            state.course.progress[ATTENDANCE] = {}
            state.course.progress[ATTENDANCE][payload.id] = payload.data
        }
    },
    UPDATE_TASKS(state, payload){
        state.tasks = payload
    },
    UPDATE_USER_ANSWERS(state, payload){
        const user_index = state.course.students.findIndex( s => s.id === payload.student )
        state.course.students[user_index].tasks = payload.answ
    },
    UPDATE_USER_ANSWERS_EXAM(state, payload){
        const user_index = state.course.students.findIndex( s => s.id === payload.student )
        state.course.students[user_index].exams = payload.answ
    },
    UPDATE_USER_FEEDBACKS(state, payload){
        const user_index = state.course.students.findIndex( s => s.id === payload.student )
        payload.feedbacks.forEach(feedback => {
            const task_index = state.course.students[user_index].tasks.findIndex( t => t.id === feedback.id )
            state.course.students[user_index].tasks[task_index].feedback = feedback.feedback
        });
    },
    UPDATE_USER_FEEDBACKS_EXAM(state, payload){
        const user_index = state.course.students.findIndex( s => s.id === payload.student )
        payload.feedbacks.forEach(feedback => {
            const task_index = state.course.students[user_index].exams.findIndex( e => e.id === feedback.id )
            state.course.students[user_index].exams[task_index].feedback = feedback.feedback
        });
    },
    UPDATE_FEEDBACKS(state, payload){
        state.course.teacher.tasks = payload.tasks
        state.course.teacher.exams = payload.exams
    },
    SET_FEEDBACK(state, payload){
        if(state.course.teacher.tasks){
            if(state.course.teacher.tasks[payload.task])
                state.course.teacher.tasks[payload.task].push(payload.student)
            else
            state.course.teacher.tasks[payload.task] = [ payload.student ]
        } 
        else{
            state.course.teacher.tasks = {}
            state.course.teacher.tasks[payload.task] = [ payload.student ]
        }
    },
    SET_FEEDBACK_EXAM(state, payload){
        if(state.course.teacher.exams){
            if(state.course.teacher.exams[payload.exam])
                state.course.teacher.exams[payload.exam].push(payload.student)
            else
            state.course.teacher.exams[payload.exam] = [ payload.student ]
        } 
        else{
            state.course.teacher.exams = {}
            state.course.teacher.exams[payload.exam] = [ payload.student ]
        }
    },
    UPDATE_EXAMS(state, payload){
        state.exams = payload
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}