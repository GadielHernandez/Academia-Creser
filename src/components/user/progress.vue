<template>
    <div class="h-100 main-background mx-1">
        <v-row>
            <v-col class="pa-0">
                <p
                    class="ml-3 my-3 primary--text text-caption font-weight-bold"
                >
                    INFORMACIÓN
                </p>
            </v-col>
        </v-row>
        <v-row>
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
                                Grupo:
                            </v-list-item-subtitle>
                            <v-list-item-title
                                class="text-caption font-weight-medium"
                            >
                                {{ group.name }}
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
                                mdi-human-male-board
                            </v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-subtitle class="text-caption">
                                Maestros:
                            </v-list-item-subtitle>
                            <v-list-item-title
                                class="text-caption font-weight-medium"
                            >
                                {{ group.teachers.map( t => t.name).join(', ') }}
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
                            <v-icon color="white"> mdi-calendar-range </v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-subtitle class="text-caption">
                                Duracion
                            </v-list-item-subtitle>
                            <v-list-item-title
                                class="text-caption font-weight-medium"
                                >{{
                                    new Date(group.starts).toLocaleDateString()
                                }}
                                -
                                {{ new Date(group.ends).toLocaleDateString() }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="pa-0">
                <p
                    class="ml-3 my-3 primary--text text-caption font-weight-bold"
                >
                    PROGRESO
                </p>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card outlined style="overflow: hidden">
                    <v-card class="py-2 rounded-br-0 rounded-bl-0" color="primary" dark flat>
                        <v-list-item>
                            <v-list-item-avatar color="primary" tile class="rounded-lg" dark>
                                <v-icon dark>mdi-equal-box</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title class="font-weight-bold">
                                    Calificación
                                </v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action  class="mr-0 mr-md-6">
                                <v-list-item-title class="font-weight-bold text-h4 mx-auto">
                                    {{total}} <span class="text-caption">/ 100 </span>
                                </v-list-item-title>
                            </v-list-item-action>
                        </v-list-item>
                    </v-card>
                
                    <v-card-text class="pa-0 rounded-lg">
                        <v-list class="rounded-lg">
                            <template v-for="(cr) in criteria">
                                <v-list-item
                                    class="rounded-lg py-2"
                                    :key="cr.name"
                                    @click="showMoreInfo(cr)"
                                >
                                    <v-list-item-avatar tile class="rounded-lg">
                                        <v-icon color="primary">{{ cr.icon }}</v-icon>
                                    </v-list-item-avatar>
                                    <v-list-item-content style="max-width: 30%">
                                        <v-list-item-title>
                                            {{ cr.name }}
                                        </v-list-item-title>
                                        <v-list-item-subtitle class="text-caption">
                                            Criterio
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-list-item-content class="text-center" style="max-width: 30%" v-if="$vuetify.breakpoint.mdAndUp">
                                        <v-list-item-title class="d-flex">
                                            <v-progress-linear
                                                :value="cr.name === ATTENDANCE 
                                                    ? (cr.completed + cr.out_of_time + cr.not_attendance) / cr.number * 100
                                                    : cr.completed / cr.number * 100"
                                                rounded
                                                hide-details
                                                color="secondary"
                                                height="20"
                                            >
                                            </v-progress-linear>
                                        </v-list-item-title>
                                        <v-list-item-subtitle class="text-caption">
                                            Progreso: {{  
                                                cr.name === ATTENDANCE 
                                                    ? cr.completed + cr.out_of_time + cr.not_attendance 
                                                    : cr.completed
                                            }} 
                                            /{{ cr.number }}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-spacer ></v-spacer>
                                    <v-list-item-action class="mr-0 mr-md-6">
                                        <v-list-item-title class="primary--text text-h6 mx-auto">
                                            {{ cr.points.toFixed(2) }} <span class="text-caption">/ {{ cr.value }}</span>
                                        </v-list-item-title>
                                        <v-list-item-subtitle class="text-caption mx-auto">
                                            puntos
                                        </v-list-item-subtitle>
                                    </v-list-item-action>
                                </v-list-item>
                            </template>
                        </v-list>
                    </v-card-text>
                    
                </v-card>
                <!-- <v-card outlined flat>
                    
                    <v-divider class="d-none d-md-block"></v-divider>
                    <v-card-text class="pa-0">
                        <v-row class="d-none d-sm-flex px-3">
                            <v-col cols="5" sm="5" class="py-0 text-center">
                                <p class="text-caption my-0">Criterio de evaluación</p>
                            </v-col>
                            <v-col cols="4" sm="4" class="py-0 text-center">
                                <p class="text-caption my-0">Avance</p>
                            </v-col>
                            <v-col cols="2" sm="2" class="py-0 text-center">
                                <p class="text-caption my-0">Puntos</p>
                            </v-col>
                        </v-row>
                        <v-divider></v-divider>
                        <v-row
                            class="py-2 px-3"
                            v-for="cr in criteria"
                            :key="cr.name"
                        >
                            <v-col cols="3" sm="1" md="1" class="center-vertical">
                                <v-icon color="primary" class="ml-5">{{ cr.icon }}</v-icon>
                            </v-col>
                            <v-col cols="9" sm="3" md="4" class="center-vertical">
                                <p class="ma-0">{{ cr.name }}</p>
                            </v-col>
                            <v-col cols="12" sm="4" md="4" class="center-vertical">
                                <v-progress-linear
                                    :value="cr.name === ATTENDANCE 
                                        ? (cr.completed + cr.out_of_time + cr.not_attendance) / cr.number * 100
                                        : cr.completed / cr.number * 100"
                                    rounded
                                    hide-details
                                    color="secondary"
                                    height="20"
                                    class="text-caption"
                                >
                                    <template v-slot:default>
                                        {{  
                                            cr.name === ATTENDANCE 
                                                ? cr.completed + cr.out_of_time + cr.not_attendance 
                                                : cr.completed
                                        }} 
                                        de {{ cr.number }}
                                    </template>
                                </v-progress-linear>
                            </v-col>
                            <v-col cols="12" sm="2" md="2" class="center-vertical">
                                <p class="ma-0 font-weight-bold primary--text text-h6 text-center">
                                    {{ cr.points.toFixed(2) }} 
                                    <span class="text-caption text--secondary"> 
                                        / {{ cr.value }}
                                    </span>
                                </p>
                            </v-col>
                            <v-col class="text-center">
                                <v-btn  color="white" x-small fab depressed class="text-center pa-0">
                                    <v-icon small color="primary">mdi-dots-horizontal</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card> -->
            </v-col>
        </v-row>
        <v-dialog v-model="moreInfo.show" max-width="600" scrollable>
            <v-card>
                <v-toolbar
                    color="primary"
                    dark
                    extended
                    flat
                >
                    <p class="ml-3 mt-3 text-subtitle-1">{{ moreInfo.title }}</p>
                </v-toolbar>
                <v-card style="margin-top: -40px;" class="mx-6">
                    <v-card-text>
                        <v-row class="text-center" >
                            <v-col>
                                <p class="my-0 font-weight-bold">{{(moreInfo.values.value)}}</p>
                                <p class="my-0 text-caption">Valor total</p>
                            </v-col>
                            <v-col>
                                <p class="my-0 font-weight-bold">{{(moreInfo.values.value / moreInfo.values.number).toFixed(2)}}</p>
                                <p class="my-0 text-caption">Valor individual</p>
                            </v-col>
                            <v-col>
                                <p class="my-0 font-weight-bold">{{(moreInfo.values.number)}}</p>
                                <p class="my-0 text-caption">Numero de {{moreInfo.criteria}}</p>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                <v-card-text style="height: 400px;" class="mt-5">
                    <div v-if="moreInfo.criteria === ATTENDANCE">
                        <v-tabs color="primary" fixed-tabs>
                            <v-tab>{{moreInfo.data[ATTENDANCE].attendances.length}} Asistencias</v-tab>
                            <v-tab>{{moreInfo.data[ATTENDANCE].out_of_time.length}} Retardos</v-tab>
                            <v-tab>{{moreInfo.data[ATTENDANCE].not_attendances.length}} Faltas</v-tab>

                            <v-tab-item>
                                <v-list-item
                                    v-for="attendance in moreInfo.data[
                                        ATTENDANCE
                                    ].attendances"
                                    :key="attendance.id"
                                >
                                    <v-list-item-icon>
                                        <v-icon color="success"
                                            >mdi-checkbox-blank</v-icon
                                        >
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>{{
                                            attendance.name
                                        }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-tab-item>
                            <v-tab-item>
                                <v-list-item
                                    v-for="attendance in moreInfo.data[
                                        ATTENDANCE
                                    ].out_of_time"
                                    :key="attendance.id"
                                >
                                    <v-list-item-icon>
                                        <v-icon color="warning"
                                            >mdi-checkbox-blank</v-icon
                                        >
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>{{
                                            attendance.name
                                        }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-tab-item>
                            <v-tab-item>
                                <v-list-item
                                    v-for="attendance in moreInfo.data[
                                        ATTENDANCE
                                    ].not_attendances"
                                    :key="attendance.id"
                                >
                                    <v-list-item-icon>
                                        <v-icon color="red"
                                            >mdi-checkbox-blank</v-icon
                                        >
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>{{
                                            attendance.name
                                        }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-tab-item>
                        </v-tabs>
                    </div>

                    <div v-if="moreInfo.criteria === TASKS">
                        <v-tabs color="primary" fixed-tabs>
                            <v-tab>{{moreInfo.data[TASKS].answered.length}} Contestadas</v-tab>
                            <v-tab>{{moreInfo.data[TASKS].not_answered.length}} No contestadas</v-tab>

                            <v-tab-item>
                                <v-list-item
                                    v-for="task in moreInfo.data[TASKS]
                                        .answered"
                                    :key="task.id"
                                >
                                    <v-list-item-icon>
                                        <v-icon color="success"
                                            >mdi-checkbox-blank</v-icon
                                        >
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>{{
                                            task.name
                                        }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-tab-item>
                            <v-tab-item>
                                <v-list-item
                                    v-for="task in moreInfo.data[TASKS]
                                        .not_answered"
                                    :key="task.id"
                                >
                                    <v-list-item-icon>
                                        <v-icon color="warning"
                                            >mdi-checkbox-blank</v-icon
                                        >
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>{{
                                            task.name
                                        }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-tab-item>
                        </v-tabs>
                    </div>

                    <div v-if="moreInfo.criteria === EXAMS">
                        <v-tabs color="primary" fixed-tabs>
                            <v-tab>{{moreInfo.data[EXAMS].answered.length}} Contestados</v-tab>
                            <v-tab>{{moreInfo.data[EXAMS].answered.not_answered}}  No contestados</v-tab>

                            <v-tab-item>
                                <v-list-item
                                    v-for="exam in moreInfo.data[EXAMS]
                                        .answered"
                                    :key="exam.id"
                                >
                                    <v-list-item-icon>
                                        <v-icon color="success"
                                            >mdi-checkbox-blank</v-icon
                                        >
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>{{
                                            exam.name
                                        }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-tab-item>
                            <v-tab-item>
                                <v-list-item
                                    v-for="exam in moreInfo.data[EXAMS]
                                        .not_answered"
                                    :key="exam.id"
                                >
                                    <v-list-item-icon>
                                        <v-icon color="warning"
                                            >mdi-checkbox-blank</v-icon
                                        >
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>{{
                                            exam.name
                                        }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-tab-item>
                        </v-tabs>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="closeMoreInfo">
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { ATTENDANCE, EXAMS, TASKS, FINAL } from '../../plugins/criteria-types'
import { FACETOFACE } from '../../plugins/lessons-types'
export default {
    name: 'Progress',
    computed: {
        ...mapState({
            name: (state) => state.user.profile.nickname,
            lessons: (state) => state.student.lessons,
            tasks: (state) => state.student.tasks,
            exams: (state) => state.student.exams,
            course_name: (state) => state.student.info.name,
            group: (state) => state.student.group,
            criteria: (state) => {
                const icons = {}
                icons[ATTENDANCE] = 'mdi-checkbox-marked-outline'
                icons[TASKS] = 'mdi-lead-pencil'
                icons[EXAMS] = 'mdi-clipboard-text'
                icons[FINAL] = 'mdi-clipboard-text'

                const result = []
                const progress = state.student.group.progress
                const criteria = state.student.info.criteria
                const final_id = criteria.find((c) => c.name === FINAL).id
                criteria.forEach((cr) => {
                    const obj_crt = cr
                    obj_crt.icon = icons[cr.name]

                    switch (cr.name) {
                        case ATTENDANCE:
                            if (progress[cr.name] !== undefined) {
                                const total = progress[cr.name].length
                                const out_of_time = progress[cr.name].filter(
                                    (c) => c.out_of_time === true
                                )
                                const not_attendance = progress[cr.name].filter(
                                    (c) => c.no_attendance === true
                                )

                                obj_crt.completed =
                                    total -
                                    out_of_time.length -
                                    not_attendance.length
                                obj_crt.out_of_time = out_of_time.length
                                obj_crt.not_attendance = not_attendance.length

                                obj_crt.points =
                                    (obj_crt.completed * cr.value) / cr.number
                            } else {
                                obj_crt.points = 0
                                obj_crt.completed = 0
                            }
                            break

                        case TASKS:
                            if (progress[cr.name] !== undefined) {
                                obj_crt.completed = progress[cr.name].length
                                obj_crt.points =
                                    (obj_crt.completed * cr.value) / cr.number
                            } else {
                                obj_crt.points = 0
                                obj_crt.completed = 0
                            }
                            break

                        case EXAMS:
                            if (progress[cr.name] !== undefined) {
                                const has_final = progress[cr.name].find(
                                    (p) => p.id === final_id
                                )
                                obj_crt.completed = has_final
                                    ? progress[cr.name].length - 1
                                    : progress[cr.name].length
                                obj_crt.points =
                                    (progress[cr.name].reduce(
                                        (sum, e) =>
                                            has_final
                                                ? e.id === has_final.id
                                                    ? sum
                                                    : sum + e.grade
                                                : sum + e.grade,
                                        0
                                    ) *
                                        cr.value) /
                                    cr.number
                            } else {
                                obj_crt.points = 0
                                obj_crt.completed = 0
                            }
                            break

                        case FINAL:
                            if (progress[EXAMS] !== undefined) {
                                const has_final = progress[EXAMS].find(
                                    (p) => p.id === final_id
                                )
                                obj_crt.completed = has_final ? 1 : 0
                                obj_crt.points = has_final
                                    ? (has_final.grade * cr.value) / cr.number
                                    : 0
                            } else {
                                obj_crt.points = 0
                                obj_crt.completed = 0
                            }
                            break
                    }

                    result.push(obj_crt)
                })

                return result
            },
            total() {
                let total = 0
                this.criteria.forEach((cr) => (total += cr.points))
                return Math.round(total)
            },
        }),
    },
    data() {
        return {
            ATTENDANCE,
            EXAMS,
            TASKS,
            FINAL,
            FACETOFACE,
            moreInfo: {
                show: false,
                loaded: false,
                criteria: null,
                title: '',
                data: {},
                values: {}
            },
        }
    },
    methods: {
        ...mapActions({
            getLessons: 'student/fetchLessons',
            getTasks: 'student/fetchTasks',
            getExams: 'student/fetchExams',
        }),
        async showMoreInfo(criteria) {
            await this.loadMoreInfo(criteria.name)
            this.moreInfo.values = criteria
            this.moreInfo.criteria = criteria.name
            this.moreInfo.title = criteria.name
            this.moreInfo.show = true
        },
        closeMoreInfo() {
            this.moreInfo.show = false
            this.moreInfo.criteria = null
            this.moreInfo.title = ''
            this.moreInfo.values = {}
        },
        async loadMoreInfo(criteria) {
            if (criteria === this.ATTENDANCE) {
                if (!this.lessons) await this.getLessons()
                if (!this.moreInfo.data[this.ATTENDANCE]) {
                    this.moreInfo.data[this.ATTENDANCE] = {}
                    this.moreInfo.data[this.ATTENDANCE].attendances = this.group.progress[this.ATTENDANCE].filter((a) => !a.out_of_time && !a.no_attendance )
                    this.moreInfo.data[this.ATTENDANCE].not_attendances = this.group.progress[this.ATTENDANCE].filter((a) => a.no_attendance)
                    this.moreInfo.data[this.ATTENDANCE].out_of_time = this.group.progress[this.ATTENDANCE].filter((a) => a.out_of_time)
                    this.moreInfo.data[this.ATTENDANCE].attendances = this.moreInfo.data[this.ATTENDANCE].attendances.map((a) => 
                    ({
                        ...a,
                        ...this.lessons.find((l) => l.id === a.id),
                    }))
                    this.moreInfo.data[this.ATTENDANCE].not_attendances = this.moreInfo.data[this.ATTENDANCE].not_attendances.map((a) => ({
                        ...a,
                        ...this.lessons.find((l) => l.id === a.id),
                    }))
                    this.moreInfo.data[this.ATTENDANCE].out_of_time = this.moreInfo.data[this.ATTENDANCE].out_of_time.map((a) =>
                    ({
                        ...a,
                        ...this.lessons.find((l) => l.id === a.id),
                    }))
                }
            }
            if (criteria === this.TASKS) {
                if (!this.tasks) await this.getTasks()
                if (!this.moreInfo.data[this.TASKS]) {
                    this.moreInfo.data[this.TASKS] = {}
                    this.moreInfo.data[
                        this.TASKS
                    ].answered = this.group.progress[this.TASKS]
                    this.moreInfo.data[
                        this.TASKS
                    ].answered = this.moreInfo.data[this.TASKS].answered.map(
                        (a) => ({
                            ...a,
                            ...this.tasks.find((t) => t.id === a.id),
                        })
                    )

                    this.moreInfo.data[
                        this.TASKS
                    ].not_answered = this.tasks.filter(
                        (t) =>
                            !this.moreInfo.data[this.TASKS].answered.find(
                                (a) => a.id === t.id
                            )
                    )
                }
            }
            if (criteria === this.EXAMS) {
                if (!this.exams) await this.getExams()
                if (!this.moreInfo.data[this.EXAMS]) {
                    this.moreInfo.data[this.EXAMS] = {}
                    this.moreInfo.data[
                        this.EXAMS
                    ].answered = this.group.progress[this.EXAMS]
                    this.moreInfo.data[
                        this.EXAMS
                    ].answered = this.moreInfo.data[this.EXAMS].answered.map(
                        (a) => ({
                            ...a,
                            ...this.exams.find((e) => e.id === a.id),
                        })
                    )

                    this.moreInfo.data[
                        this.EXAMS
                    ].not_answered = this.exams.filter(
                        (e) =>
                            !this.moreInfo.data[this.EXAMS].answered.find(
                                (a) => a.id === e.id
                            )
                    )
                }
            }
        },
    },
}
</script>