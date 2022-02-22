import { createRoute } from '../plugins/router-helpers'
import { USER } from '../plugins/user-types'
import HomeView from '../views/user/Home'

const Routes = [
    createRoute({
        name: 'student-home',
        path: '/student/',
        view: HomeView,
        level: USER
    })
]

export default Routes
