import { createRoute } from '../plugins/router-helpers'
import { USER } from '../plugins/user-types'
import HomeView from '../views/user/Home'
import ClassesView from '../views/user/Lessons'

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
    })
]

export default Routes
