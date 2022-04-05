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
                                {{ new Date(course.starts).toLocaleDateString()  }}
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
                <v-list>
                    <v-divider></v-divider>
                    <template v-for="(student, index) in progress.items" >
                        <v-list-item
                            class="rounded-lg py-2"
                            :key="student.id"
                        >
                            <v-list-item-avatar color="primary" tile class="rounded-lg" dark>
                                <v-icon dark>mdi-account</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ student.name }}
                                </v-list-item-title>
                                <v-list-item-subtitle class="text-caption">
                                    Nombre
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-content v-if="$vuetify.breakpoint.mdAndUp">
                                <v-list-item-title>
                                    {{ student.email }}
                                </v-list-item-title>
                                <v-list-item-subtitle class="text-caption">
                                    Correo
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-list-item-title class="font-weight-bold">
                                    <span :class="{
                                        'warning--text': student.grade <= 70,
                                        'green--text': student.grade > 70
                                    }">{{ student.grade }}</span>
                                    <v-menu
                                        open-on-hover
                                        top
                                        offset-y
                                    >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon 
                                                small
                                                v-bind="attrs"
                                                v-on="on"
                                                class="ml-1"
                                            >mdi-information-outline</v-icon>
                                        </template>

                                        <v-card>
                                            <v-card-text>
                                                <p class="mb-1 text-caption font-weight-bold">
                                                    Asistencias: {{ student.attendances }}
                                                </p>
                                                <p class="mb-1 text-caption font-weight-bold">
                                                    Retardos: {{ student.out_of_time }}
                                                </p>
                                                <p class="mb-1 text-caption font-weight-bold">
                                                    Faltas: {{ student.no_attendance }}
                                                </p>
                                                <p class="mb-1 text-caption font-weight-bold">
                                                    Tareas: {{ student.tasks }}
                                                </p>
                                                <p class="mb-1 text-caption font-weight-bold">
                                                    Examenes: {{ student.exams }}
                                                </p>
                                                <p class="mb-1 text-caption font-weight-bold">
                                                    Examen final: {{ student.final ?  student.final.grade : 'No'}}
                                                </p>
                                            </v-card-text>
                                        </v-card>
                                    </v-menu>
                                </v-list-item-title>
                                <v-list-item-subtitle class="text-caption">
                                    Calificación
                                </v-list-item-subtitle>
                            </v-list-item-action>
                        </v-list-item>
                        <v-divider :key="index"></v-divider>
                    </template>
                </v-list>
            </v-col>
        </v-row>
        <div v-else class="no-students d-flex">
            <div class="ma-auto font-weight-bold blue-grey--text text-center">
                <v-icon x-large class="font-weight-bold blue-grey--text">mdi-account-supervisor-circle</v-icon>
                <p>No hay alumnos registrados</p>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { ATTENDANCE, EXAMS, TASKS, FINAL } from '../../plugins/criteria-types'

export default {
    name: 'Students',
    computed: {
        ...mapState({
            course: state => ({
                starts: state.teacher.course.starts,
                ends: state.teacher.course.ends
            }),
            progress: (state) => {
                const students = state.teacher.course.students
                const progress = state.teacher.course.progress
                const criteria = state.teacher.course.criteria
                if(!students || !progress || !criteria) return []
                
                const attendances = progress[ATTENDANCE]
                const attendaces_obj = {}
                const attendance_values = criteria.find( c => c.name === ATTENDANCE)
                const exams = progress[EXAMS]
                const exams_obj = {}
                const exams_values = criteria.find( c => c.name === EXAMS)
                const tasks = progress[TASKS]
                const tasks_obj = {}
                const tasks_values = criteria.find( c => c.name === TASKS)
                const final_obj = {}
                const final_values = criteria.find( c => c.name === FINAL)

                if(attendances){
                    Object.keys(attendances).forEach( att => {
                        attendances[att].forEach( user => {
                            if(!attendaces_obj[user.user]) 
                                attendaces_obj[user.user] = { attendances: 0, out_of_time: 0, no_attendance:0 }
                            
                            if(user.out_of_time)
                                attendaces_obj[user.user].out_of_time += 1
                            else if(user.no_attendance)
                                attendaces_obj[user.user].no_attendance += 1
                            else
                                attendaces_obj[user.user].attendances += 1
                        })
                    })
                }
                
                if(exams){
                    const final_id = final_values ? final_values.id : null
                    Object.keys(exams).forEach( exam => {
                        if(exam === final_id) return
                        exams[exam].forEach( user => {
                            if(!exams_obj[user.user]) 
                                exams_obj[user.user] = { answered: 0, grades: [] }
                            exams_obj[user.user].answered += 1
                            exams_obj[user.user].grades.push(user.grade)
                        })
                    })
                }
                
                if(tasks){
                    Object.keys(tasks).forEach( task => {
                        tasks[task].forEach( user => {
                            if(!tasks_obj[user.user]) 
                                tasks_obj[user.user] = { completed: 0 }
                            tasks_obj[user.user].completed += 1
                        })
                    })
                }

                if(final_values){
                    exams[final_values.id].forEach( user => {
                        final_obj[user.user] = user
                    })
                }
                
                const headers = [
                    { text: 'Nombre', value: 'name' },
                    { text: 'Asistencias', value: 'attendances' },
                    { text: 'Retardos', value: 'out_of_time' },
                    { text: 'Faltas', value: 'no_attendance' },
                    { text: 'Examenes', value: 'exams' },
                    { text: 'Tareas', value: 'tasks' },
                    { text: 'Examen Final', value: 'final' },
                    { text: 'Calificación', value: 'grade' }
                ]

                const items = students.map( student => ({
                    id: student.id,
                    name: student.name,
                    email: student.email,
                    attendances: attendaces_obj[student.id] ? attendaces_obj[student.id].attendances : 0,
                    out_of_time: attendaces_obj[student.id] ? attendaces_obj[student.id].out_of_time : 0,
                    no_attendance: attendaces_obj[student.id] ? attendaces_obj[student.id].no_attendance : 0,
                    exams: exams_obj[student.id] ? exams_obj[student.id].answered : 0,
                    tasks: tasks_obj[student.id] ? tasks_obj[student.id].completed : 0,
                    final: final_obj[student.id] ? final_obj[student.id]: null,
                    grade: null
                }))

                items.forEach( student => {
                    let attendaces_grade =  student.attendances * attendance_values.value / attendance_values.number
                        
                    let exams_grade = 0
                    if(exams_obj[student.id])
                        exams_obj[student.id].grades.forEach( g =>
                            exams_grade += g * exams_values.value / exams_values.number
                        )
                    
                    let tasks_grade = student.tasks * tasks_values.value / tasks_values.number
                    
                    let final_grade = 0
                    if(student.final) 
                        final_grade = student.final.grade * final_values.value
                    
                    student.grade = (attendaces_grade + exams_grade + tasks_grade + final_grade).toFixed(2)
                })
                return {
                    headers,
                    items
                }
            }
        }),
    }
}
</script>

<style scoped>
    .no-students{
        height: 70vh;
    }
</style>