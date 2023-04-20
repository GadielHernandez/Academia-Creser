import { createRoute } from '../plugins/router-helpers'
import { USER } from '../plugins/user-types'
import HomeView from '../views/user/Home'
import ClassesView from '../views/user/Lessons'
import TasksView from '../views/user/Tasks'
import ExamsView from '../views/user/Exams'
import Login from '../views/Login'

const Routes = [
    createRoute({
        name: 'student-home',
        path: '/student/',
        view: HomeView,
        level: USER
    }),
    createRoute({
        name: 'student-classes',
        path: '/student/classes',
        view: ClassesView,
        level: USER
    }),
    createRoute({
        name: 'student-tasks',
        path: '/student/tasks',
        view: TasksView,
        level: USER
    }),
    createRoute({
        name: 'student-exams',
        path: '/student/exams',
        view: ExamsView,
        level: USER
    })
]

if(process.env.VUE_APP_ENV === 'development'){
    Routes.push(createRoute({
        name: 'Login',
        path: '/login',
        view: Login,
        level: USER
    }))
}

export default Routes
