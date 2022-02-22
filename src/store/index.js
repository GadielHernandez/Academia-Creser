import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import student from './modules/student'
import teacher from './modules/teacher'
import admin from './modules/admin'
import view from './modules/view'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        user,
        student,
        teacher,
        admin,
        view
    },
})
