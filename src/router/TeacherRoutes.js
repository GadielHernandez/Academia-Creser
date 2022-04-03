import { createRoute } from '../plugins/router-helpers'
import { TEACHER } from '../plugins/user-types'
import HomeTeacher from '../views/teacher/Home'
import Attendance from '../views/teacher/Attendance'
import Lessons from '../views/teacher/Lessons'
import Tasks from '../views/teacher/Tasks'
import Exams from '../views/teacher/Exams'

const Routes = [
    createRoute({
        name: 'teacher-home',
        path: '/teacher/',
        view: HomeTeacher,
        level: TEACHER
    }),
    createRoute({
        name: 'teacher-lessons',
        path: '/teacher/lessons',
        view: Lessons,
        level: TEACHER
    }),
    createRoute({
        name: 'teacher-attendance',
        path: '/teacher/attendance',
        view: Attendance,
        level: TEACHER
    }),
    createRoute({
        name: 'teacher-tasks',
        path: '/teacher/tasks',
        view: Tasks,
        level: TEACHER
    }),
    createRoute({
        name: 'teacher-exams',
        path: '/teacher/exams',
        view: Exams,
        level: TEACHER
    })
]

export default Routes
