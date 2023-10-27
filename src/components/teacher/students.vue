<template>
    <div class="mx-1 main-background">
        <v-row>
            <v-col>
                <v-card class="py-2" flat color="background">
                    <v-list-item two-line>
                        <v-list-item-avatar
                            tile
                            color="secondary"
                            class="rounded"
                        >
                            <v-icon color="white"> mdi-calendar-start </v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-subtitle class="text-caption">
                                Inicio del curso:
                            </v-list-item-subtitle>
                            <v-list-item-title
                                class="text-caption font-weight-medium"
                            >
                                {{
                                    new Date(course.starts).toLocaleDateString()
                                }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
            </v-col>
            <v-col>
                <v-card class="py-2" flat color="background">
                    <v-list-item two-line>
                        <v-list-item-avatar
                            tile
                            color="secondary"
                            class="rounded"
                        >
                            <v-icon color="white">
                                mdi-calendar-end
                            </v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-subtitle class="text-caption">
                                Fin del curso:
                            </v-list-item-subtitle>
                            <v-list-item-title
                                class="text-caption font-weight-medium"
                            >
                                {{ new Date(course.ends).toLocaleDateString() }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
            </v-col>
            <v-col>
                <v-card class="py-2" flat color="background">
                    <v-list-item two-line>
                        <v-list-item-avatar
                            tile
                            color="secondary"
                            class="rounded"
                        >
                            <v-icon color="white"> mdi-account-group </v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-subtitle class="text-caption">
                                Alumnos
                            </v-list-item-subtitle>
                            <v-list-item-title
                                class="text-caption font-weight-medium"
                                v-if="progress.items"
                                >{{ progress.items.length }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="pb-0">
                <p class="my-1 font-weight-bold ml-3">Alumnos</p>
            </v-col>
        </v-row>
        <v-row v-if="progress.items && progress.items.length > 0">
            <v-col>
                <v-card outlined>
                    <v-toolbar flat>
                        <v-text-field
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Search"
                            single-line
                            hide-details
                            solo
                            flat
                        ></v-text-field>
                    </v-toolbar>
                    <v-divider></v-divider>
                    <v-data-table
                        :headers="progress.headers"
                        :items="progress.items"
                        :search="search"
                    >
                        <template v-slot:item.name="{ item }">
                            <v-list-item class="rounded-lg py-2" :key="item.id">
                                <v-list-item-avatar
                                    color="primary"
                                    tile
                                    class="rounded-lg"
                                    dark
                                >
                                    <v-icon dark>mdi-account</v-icon>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{ item.name }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle class="text-caption">
                                        {{ item.email }}
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </template>
                        <template v-slot:item.attendances="{ item }">
                            <v-chip small color="success">{{
                                item.attendances
                            }}</v-chip>
                            <v-chip small color="warning mx-1">{{
                                item.out_of_time
                            }}</v-chip>
                            <v-chip small color="red" dark>{{
                                item.no_attendance
                            }}</v-chip>
                        </template>
                        <template v-slot:item.exams="{ item }">
                            <template v-for="(grade, index) in item.exams">
                                <v-chip
                                    small
                                    :color="
                                        grade >= 0.7 ? 'success' : 'warning'
                                    "
                                    :key="index"
                                >
                                    {{ parseInt(grade * 100) }}
                                </v-chip>
                            </template>
                        </template>
                        <template v-slot:item.tasks="{ item }">
                            <span class="font-weight-bold text-caption">
                                {{ item.tasks }}
                            </span>
                        </template>
                        <template v-slot:item.final="{ item }">
                            <span class="font-weight-bold text-caption">
                                {{
                                    item.final
                                        ? parseInt(item.final.grade * 100)
                                        : 'Pendiente'
                                }}
                            </span>
                        </template>
                        <template v-slot:item.extra="{ item }">
                            <span class="font-weight-bold text-caption">
                                {{ item.extra }}
                            </span>
                        </template>
                        <template v-slot:item.grade="{ item }">
                            <span
                                class="font-weight-bold"
                                :class="{
                                    'warning--text': item.grade <= 70,
                                    'green--text': item.grade > 70,
                                }"
                            >
                                {{ item.grade }}
                            </span>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
        <div v-else class="no-students d-flex">
            <div class="ma-auto font-weight-bold blue-grey--text text-center">
                <v-icon x-large class="font-weight-bold blue-grey--text"
                    >mdi-account-supervisor-circle</v-icon
                >
                <p>No hay alumnos registrados</p>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import {
    ATTENDANCE,
    EXAMS,
    TASKS,
    FINAL,
    EXTRAS,
} from '../../plugins/criteria-types'

export default {
    name: 'Students',
    computed: {
        ...mapState({
            course: (state) => ({
                starts: state.teacher.course.starts,
                ends: state.teacher.course.ends,
            }),
            progress: (state) => {
                const students = state.teacher.course.students
                const progress = state.teacher.course.progress
                const criteria = state.teacher.course.criteria
                if (!students || !progress || !criteria) return []

                const attendances = progress[ATTENDANCE]
                const attendaces_obj = {}
                const attendance_values = criteria.find(
                    (c) => c.name === ATTENDANCE
                )
                const exams = progress[EXAMS]
                const exams_obj = {}
                const exams_values = criteria.find((c) => c.name === EXAMS)
                const tasks = progress[TASKS]
                const tasks_obj = {}
                const tasks_values = criteria.find((c) => c.name === TASKS)
                const final_obj = {}
                const final_values = criteria.find((c) => c.name === FINAL)
                const extras = progress[EXTRAS]
                const extras_obj = {}

                if (attendances) {
                    Object.keys(attendances).forEach((att) => {
                        attendances[att].forEach((user) => {
                            if (!attendaces_obj[user.user])
                                attendaces_obj[user.user] = {
                                    attendances: 0,
                                    out_of_time: 0,
                                    no_attendance: 0,
                                }

                            if (user.out_of_time)
                                attendaces_obj[user.user].out_of_time += 1
                            else if (user.no_attendance)
                                attendaces_obj[user.user].no_attendance += 1
                            else attendaces_obj[user.user].attendances += 1
                        })
                    })
                }

                if (exams) {
                    const final_id = final_values ? final_values.id : null
                    Object.keys(exams).forEach((exam) => {
                        if (exam === final_id) return
                        exams[exam].forEach((user) => {
                            if (!exams_obj[user.user])
                                exams_obj[user.user] = {
                                    answered: 0,
                                    grades: [],
                                }
                            exams_obj[user.user].answered += 1
                            exams_obj[user.user].grades.push(user.grade)
                        })
                    })
                }

                if (tasks) {
                    Object.keys(tasks).forEach((task) => {
                        tasks[task].forEach((user) => {
                            if (!tasks_obj[user.user])
                                tasks_obj[user.user] = { completed: 0 }
                            tasks_obj[user.user].completed += 1
                        })
                    })
                }

                if (final_values && exams && exams[final_values.id]) {
                    exams[final_values.id].forEach((user) => {
                        final_obj[user.user] = user
                    })
                }

                if (extras) {
                    extras.forEach((extra) => {
                        if (!extras_obj[extra.user]) extras_obj[extra.user] = 1
                        else extras_obj[extra.user].extra += 1
                    })
                }

                const headers = [
                    { text: 'Nombre', value: 'name' },
                    { text: 'Asistencias', value: 'attendances' },
                    { text: 'Examenes', value: 'exams' },
                    { text: 'Tareas', value: 'tasks' },
                    { text: 'Examen Final', value: 'final' },
                    { text: 'Puntos extra', value: 'extra' },
                    { text: 'Calificación', value: 'grade' },
                ]

                const items = students.map((student) => ({
                    id: student.id,
                    name: student.name,
                    email: student.email,
                    attendances: attendaces_obj[student.id]
                        ? attendaces_obj[student.id].attendances
                        : 0,
                    out_of_time: attendaces_obj[student.id]
                        ? attendaces_obj[student.id].out_of_time
                        : 0,
                    no_attendance: attendaces_obj[student.id]
                        ? attendaces_obj[student.id].no_attendance
                        : 0,
                    exams: exams_obj[student.id]
                        ? exams_obj[student.id].grades
                        : [],
                    tasks: tasks_obj[student.id]
                        ? tasks_obj[student.id].completed
                        : 0,
                    extra: extras_obj[student.id] ? extras_obj[student.id] : 0,
                    final: final_obj[student.id] ? final_obj[student.id] : null,
                    grade: null,
                }))

                items.forEach((student) => {
                    const attendances_value =
                        (student.attendances * attendance_values.value) /
                        attendance_values.number
                    const att_out_of_time_value =
                        (student.out_of_time * attendance_values.value) /
                        attendance_values.number
                    const attendaces_grade =
                        attendances_value + att_out_of_time_value

                    let exams_grade = 0
                    if (exams_obj[student.id])
                        exams_obj[student.id].grades.forEach(
                            (g) =>
                                (exams_grade +=
                                    (g * exams_values.value) /
                                    exams_values.number)
                        )

                    let tasks_grade =
                        (student.tasks * tasks_values.value) /
                        tasks_values.number

                    let final_grade = 0
                    if (student.final)
                        final_grade = student.final.grade * final_values.value

                    const extra = extras_obj[student.id]
                        ? extras_obj[student.id]
                        : 0

                    student.grade = (
                        attendaces_grade +
                        exams_grade +
                        tasks_grade +
                        final_grade +
                        extra
                    ).toFixed(2)
                })
                return {
                    headers,
                    items,
                }
            },
        }),
    },
    data() {
        return {
            search: '',
        }
    },
}
</script>

<style scoped>
.no-students {
    height: 70vh;
}
</style>
