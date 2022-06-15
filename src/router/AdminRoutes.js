import { createRoute } from '../plugins/router-helpers'
import { ADMIN } from '../plugins/user-types'
import HomeView from '../views/admin/Home'
import GroupsView from '../views/admin/Groups'
import LessonsView from '../views/admin/Lessons'
import TasksView from '../views/admin/Tasks'
import ExamsView from '../views/admin/Exams'

const Routes = [
    createRoute({
        name: 'admin-home',
        path: '/admin/',
        view: HomeView,
        level: ADMIN
    }),
    createRoute({
        name: 'admin-groups',
        path: '/admin/goups',
        view: GroupsView,
        level: ADMIN
    }),
    createRoute({
        name: 'admin-classes',
        path: '/admin/classes',
        view: LessonsView,
        level: ADMIN
    }),
    createRoute({
        name: 'admin-tasks',
        path: '/admin/tasks',
        view: TasksView,
        level: ADMIN
    }),
    createRoute({
        name: 'admin-exams',
        path: '/admin/exams',
        view: ExamsView,
        level: ADMIN
    })
]

export default Routes
