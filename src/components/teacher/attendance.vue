<template>
    <div class="mx-1 main-background">
        <v-col v-if="lessons == null" class="loading d-flex">
                <v-progress-circular
                    :size="60"
                    :width="7"
                    color="academia-primary"
                    class="ma-auto"
                    indeterminate
                ></v-progress-circular>
        </v-col>
        <v-row v-else>
            <v-col>
                <p class="secondary--text text-caption font-weight-bold">SELECCIONA UNA CLASE</p>
                <v-card>
                    <v-card-text>
                        <v-toolbar dense flat>
                            <v-select
                                v-model="lesson_selected"
                                color="academia-primary"
                                :items="lessons"
                                item-text="name"
                                item-value="id"
                                hide-details
                                flat
                                solo
                                dense
                                label="Clase"
                            ></v-select>
                            <v-spacer></v-spacer>
                            <v-btn color="academia-primary" dark v-if="lesson_selected" :disabled="lessons.find( l => l.id === lesson_selected).type === ONLINE" @click="save">Guardar</v-btn>
                            <v-btn color="academia-primary" disabled v-else >Guardar</v-btn>
                        </v-toolbar>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row v-if="students.length > 0 && lesson_selected">
            <v-col>
                <p class="secondary--text text-caption font-weight-bold">ALUMNOS</p>
                <v-card flat color="background">
                    <v-card-text class="px-2 py-0">
                        <v-list-item dense>
                            <v-list-item-avatar></v-list-item-avatar>
                            <v-list-item-content
                                class="text-caption font-weight-bold blue-grey--text"
                            >
                                NOMBRE
                            </v-list-item-content>
                            <v-list-item-action class="text-caption font-weight-bold blue-grey--text mr-14">
                                SELECCIONA UNA OPCION
                            </v-list-item-action>
                        </v-list-item>
                    </v-card-text>
                </v-card>
                <v-card v-for="student in students" :key="student.id">
                    <v-card-text class="pa-2 mb-2">
                        <v-list-item dense>
                            <v-list-item-avatar>
                                <v-icon>mdi-account-circle</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ student.name }}
                                </v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-chip-group>
                                    <v-chip label outlined color="success"
                                        @click="changeState(student.id, ATTENDANCE)"
                                        :class="{ 'active': attendances_ui.find( s => s.id === student.id ).attendance == ATTENDANCE }" 
                                        :disabled="lessons.find( l => l.id === lesson_selected).type === ONLINE">
                                       Asistencia
                                    </v-chip>
                                    <v-chip label outlined color="warning"
                                        @click="changeState(student.id, RETARD)"
                                        :class="{ 'active': attendances_ui.find( s => s.id === student.id ).attendance == RETARD }" 
                                        :disabled="lessons.find( l => l.id === lesson_selected).type === ONLINE">
                                       Retardo
                                    </v-chip>
                                    <v-chip label outlined color="error"
                                        @click="changeState(student.id, NO_ATTENDANCE)" 
                                        :class="{ 'active': attendances_ui.find( s => s.id === student.id ).attendance == NO_ATTENDANCE }" 
                                        :disabled="lessons.find( l => l.id === lesson_selected).type === ONLINE">
                                       Falta
                                    </v-chip>
                                </v-chip-group>
                            </v-list-item-action>
                        </v-list-item>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <div v-else-if="students.length > 0" class="no-students d-flex">
            <div class="ma-auto font-weight-bold blue-grey--text text-center">
                <v-icon x-large class="font-weight-bold blue-grey--text"
                    >mdi-clipboard-text</v-icon
                >
                <p>Selecciona una clase</p>
            </div>
        </div>
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
import { ATTENDANCE } from '../../plugins/criteria-types'
import { ONLINE } from '../../plugins/lessons-types'
import { mapState, mapActions } from 'vuex'
export default {
    name: 'Students',
    computed: {
        ...mapState({
            lessons_ready: state => state.teacher.lessons !== null,
            lessons: state => state.teacher.lessons ? state.teacher.lessons.filter( lesson => lesson.type !== ONLINE ): [],
            students: (state) =>
                state.teacher.course.students
                    ? state.teacher.course.students
                    : [],
            attendances: state => state.teacher.course.progress[ATTENDANCE],
            attendances_ui(state){
                const saved_attendances = state.teacher.course.progress[ATTENDANCE] 
                    ? state.teacher.course.progress[ATTENDANCE][this.lesson_selected]
                    : undefined
                
                const actual_values = this.attendances_actual ? this.attendances_actual : []
                const res = state.teacher.course.students.map( s => {
                    const value = { id: s.id, attendance: null }
                    if(saved_attendances){
                        let user_in_saved = saved_attendances.find( a => a.user === s.id )
                        if(user_in_saved) {
                            let user_attendance = this.ATTENDANCE
                            if(user_in_saved.out_of_time) user_attendance = this.RETARD
                            if(user_in_saved.no_attendance) user_attendance = this.NO_ATTENDANCE
                            value.attendance = user_attendance
                        }
                    }

                    const user_in_actual = actual_values.find(v => v.user === s.id)
                    if(user_in_actual)
                        value.attendance = user_in_actual.value
                    return value
                })
                return res
            }
        }),
    },
    data() {
        return {
            lesson_selected: null,
            attendances_actual: [],
            ATTENDANCE: 'ATTENDANCE',
            RETARD: 'RETARD',
            NO_ATTENDANCE: 'NO_ATTENDANCE',
            ONLINE
        }
    },
    methods: {
        ...mapActions({ 
            setAttendance: 'teacher/setAttendances',
            getLessons: 'teacher/fetchLessons' 
        }),
        changeState(user, value){
            const index = this.attendances_actual.findIndex( v => v.user === user )
            if(index >= 0) this.attendances_actual.splice(index, 1)
            this.attendances_actual.push({ user, value })
        },
        async save(){
            const values = []
            this.attendances_ui.forEach( att => {
                if(att.attendance === this.ATTENDANCE) 
                    values.push({ user: att.id })
                else if(att.attendance === this.RETARD)
                    values.push({ user: att.id, out_of_time: true })
                else if(att.attendance === this.NO_ATTENDANCE)
                    values.push({ user: att.id, no_attendance: true })
            })
            
            await this.setAttendance({ id: this.lesson_selected, data: values })
        }
    },
    watch: {
        lesson_selected(){
            this.attendances_actual = []
        }
    },
    async mounted() {
        if(!this.lessons_ready)
            await this.getLessons()
    },
}
</script>

<style scoped>
.no-students {
    height: 50vh;
}
.v-chip.v-chip--outlined.v-chip.v-chip.active.success{
    color: white !important;
    background-color: var(--v-success-base) !important;
}
.v-chip.v-chip--outlined.v-chip.v-chip.active.warning{
    color: white !important;
    background-color: var(--v-warning-base) !important;
}
.v-chip.v-chip--outlined.v-chip.v-chip.active.error{
    color: white !important;
    background-color: var(--v-error-base) !important;
}
.v-chip--disabled{
    opacity: 1 !important;
}
</style>
