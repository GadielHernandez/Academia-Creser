<template>
    <div class="mx-1 main-background">
        <v-row v-if="progress.items.length > 0">
            <v-col>
                <v-card class="py-1">
                    <v-data-table
                        :headers="progress.headers"
                        :items="progress.items"
                        :items-per-page="20"
                    >
                        <template v-slot:item.final="{ item }">
                            {{ item.final === null ? 'No' : 'Si' }}
                        </template>
                    </v-data-table>
                </v-card>
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
import { mapState, mapActions } from 'vuex'
import { ATTENDANCE, EXAMS, TASKS, FINAL } from '../../../plugins/criteria-types'

export default {
    name: 'Students',
    computed: {
        ...mapState({
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
    },
    methods: {
        ...mapActions({ 
            getExams: 'teacher/fetchExams'
        })
    },
    async mounted() {
        this.getExams()
    },
}
</script>

<style scoped>
    .no-students{
        height: 70vh;
    }
</style>