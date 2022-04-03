import { createRoute } from '../plugins/router-helpers'
import { TEACHER } from '../plugins/user-types'
import HomeView from '../views/user/Home'

const Routes = [
    createRoute({
        name: 'teacher-home',
        path: '/teacher/',
        view: HomeView,
        level: TEACHER
    })
]

export default Routes
