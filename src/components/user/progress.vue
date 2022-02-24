<template>
    <div class="h-100 main-background mx-1">
        <v-row>
            <v-col class="py-3 pb-md-6 pt-md-3" cols="12" md="6" order-md="last">
                <v-card :class="{ 'h-100': $vuetify.breakpoint.md || $vuetify.breakpoint.lg || $vuetify.breakpoint.xl }">
                    <div class="d-flex" style="height: 48%">
                        <v-progress-circular
                            :rotate="-90"
                            :size="135"
                            :width="15"
                            :value="total"
                            :color="total > 50 ? 'green': 'orange'"
                            class="mx-auto my-6 my-md-auto"
                        >
                            <p class="ma-0 text-h4" >{{ total }}</p>
                        </v-progress-circular>
                    </div>
                    <v-row style="height: 52%">
                        <v-col cols="12" class="py-0">
                            <p class="ml-5 my-0 primary--text text-caption font-weight-bold">
                                PUNTOS ACUMULADOS
                            </p>
                        </v-col>
                        <v-col cols="12">
                            <v-list-item dense v-for="cr in criteria" :key="cr.name" @click="showMoreInfo(cr.name)">
                                <v-list-item-avatar class="primary">
                                    <v-icon dark>{{ cr.icon }}</v-icon>
                                </v-list-item-avatar>

                                <v-list-item-content>
                                    <v-list-item-title>{{ cr.name }}</v-list-item-title>
                                    <v-list-item-subtitle>
                                        <span v-if="cr.name === ATTENDANCE">{{ cr.completed }} obtenidas , {{ cr.out_of_time }} retardos, {{ cr.not_attendance }} faltas</span>
                                        <span v-else-if="cr.name === EXAMS">{{ cr.completed }} realizados</span>
                                        <span v-if="cr.name === TASKS">{{ cr.completed }} realizadas</span>
                                        <span v-if="cr.name === FINAL">{{ cr.completed > 0 ? 'Contestado': 'No contestado' }}</span>
                                    </v-list-item-subtitle>
                                </v-list-item-content>

                                <v-list-item-action>
                                    <p class="ma-0 font-weight-black primary--text text-h6"> {{ (cr.points).toFixed(2) }} pts</p>
                                </v-list-item-action>
                            </v-list-item>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
            <v-col cols="12" md="6" class="pb-16 pb-md-3">
                <v-row >
                    <v-col class="pa-0">
                        <p class="ml-3 my-0 primary--text text-caption font-weight-bold">
                            INFORMACIÓN
                        </p>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-card class="py-2">
                                <v-list-item two-line>
                                    <v-list-item-avatar tile color="secondary" class="rounded">
                                        <v-icon color="white"> mdi-account-group </v-icon>
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-subtitle class="text-caption">Grupo:</v-list-item-subtitle>
                                        <v-list-item-title class="text-caption font-weight-medium">{{ group.name }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                        </v-card>
                    </v-col>
                    <v-col>
                        <v-card class="py-2">
                                <v-list-item two-line>
                                    <v-list-item-avatar tile color="secondary" class="rounded">
                                        <v-icon color="white"> mdi-human-male-board </v-icon>
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-subtitle class="text-caption ">Maestro:</v-list-item-subtitle>
                                        <v-list-item-title class="text-caption font-weight-medium">{{ group.teacher.name }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                        </v-card>
                    </v-col>
                    <v-col>
                        <v-card class="py-2">
                                <v-list-item two-line>
                                    <v-list-item-avatar tile color="secondary" class="rounded">
                                        <v-icon color="white"> mdi-calendar-range </v-icon>
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-subtitle class="text-caption ">Duracion</v-list-item-subtitle>
                                        <v-list-item-title class="text-caption font-weight-medium">{{ new Date(group.starts).toLocaleDateString() }} - {{ new Date(group.ends).toLocaleDateString() }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <p class="ml-3 primary--text text-caption font-weight-bold">
                            CRITERIOS DE EVALUACIÓN
                        </p>
                        <v-card>
                            <v-card-text>
                                <v-simple-table fixed-header>
                                    <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th class="text-left">Descripción</th>
                                                <th class="text-left">Valor Total</th>
                                                <th class="text-left">Valor por actividad</th>
                                                <th class="text-left">Total de actividades</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="cr in criteria" :key="cr.name">
                                                <td>{{ cr.name }}</td>
                                                <td>{{ cr.value }}</td>
                                                <td>{{ (cr.value/cr.number).toFixed(2) }}</td>
                                                <td>{{ cr.number }}</td>
                                            </tr>
                                            <tr>
                                                <td>Nota Final</td>
                                                <td>100</td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-dialog v-model="moreInfo.show" max-width="600" scrollable>
            <v-card>
                <v-card-title class="text-h6">
                    {{ moreInfo.title }}
                </v-card-title>
                <v-card-text style="height: 400px;">
                    
                    <div v-if="moreInfo.criteria === ATTENDANCE">
                        <v-tabs color="primary">
                            <v-tab>Asistencias</v-tab>
                            <v-tab>Retardos</v-tab>
                            <v-tab>Faltas</v-tab>

                            <v-tab-item >
                                <v-list-item v-for="attendance in moreInfo.data[ATTENDANCE].attendances" :key="attendance.id">
                                    <v-list-item-icon>
                                        <v-icon color="success">mdi-checkbox-blank</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>{{ attendance.name }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-tab-item>
                            <v-tab-item >
                                <v-list-item v-for="attendance in moreInfo.data[ATTENDANCE].out_of_time" :key="attendance.id">
                                    <v-list-item-icon>
                                        <v-icon color="warning">mdi-checkbox-blank</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>{{ attendance.name }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-tab-item>
                            <v-tab-item >
                                <v-list-item v-for="attendance in moreInfo.data[ATTENDANCE].not_attendances" :key="attendance.id">
                                    <v-list-item-icon>
                                        <v-icon color="red">mdi-checkbox-blank</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>{{ attendance.name }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-tab-item>
                        </v-tabs>
                    </div>

                    <div v-if="moreInfo.criteria === TASKS">
                        <v-tabs color="primary">
                            <v-tab>Contestadas</v-tab>
                            <v-tab>No contestadas</v-tab>

                            <v-tab-item >
                                <v-list-item v-for="task in moreInfo.data[TASKS].answered" :key="task.id">
                                    <v-list-item-icon>
                                        <v-icon color="success">mdi-checkbox-blank</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>{{ task.name }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-tab-item>
                            <v-tab-item >
                                <v-list-item v-for="task in moreInfo.data[TASKS].not_answered" :key="task.id">
                                    <v-list-item-icon>
                                        <v-icon color="warning">mdi-checkbox-blank</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>{{ task.name }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-tab-item>
                        </v-tabs>
                    </div>

                    <div v-if="moreInfo.criteria === EXAMS">
                        <v-tabs color="primary">
                            <v-tab>ContestadOs</v-tab>
                            <v-tab>No contestadOs</v-tab>

                            <v-tab-item >
                                <v-list-item v-for="exam in moreInfo.data[EXAMS].answered" :key="exam.id">
                                    <v-list-item-icon>
                                        <v-icon color="success">mdi-checkbox-blank</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>{{ exam.name }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-tab-item>
                            <v-tab-item >
                                <v-list-item v-for="exam in moreInfo.data[EXAMS].not_answered" :key="exam.id">
                                    <v-list-item-icon>
                                        <v-icon color="warning">mdi-checkbox-blank</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>{{ exam.name }}</v-list-item-title>
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
    computed:{
        ...mapState({ 
            lessons: state => state.student.lessons,
            tasks: state => state.student.tasks,
            exams: state => state.student.exams,
            course_name: state => state.student.info.name,
            group: state => state.student.group,
            criteria: state => {
                const icons = {}
                icons[ATTENDANCE] = 'mdi-checkbox-marked-outline'
                icons[TASKS] = 'mdi-lead-pencil'
                icons[EXAMS] = 'mdi-clipboard-text'
                icons[FINAL] = 'mdi-clipboard-text'

                const result = []
                const progress = state.student.group.progress
                const criteria = state.student.info.criteria
                const final_id = criteria.find( c => c.name === FINAL ).id
                criteria.forEach(cr => {
                    const obj_crt = cr
                    obj_crt.icon = icons[cr.name]
                    
                    switch (cr.name) {
                        case ATTENDANCE:
                            if(progress[cr.name] !== undefined){
                                const total  = progress[cr.name].length
                                const out_of_time = progress[cr.name].filter( c => c.out_of_time === true)
                                const not_attendance = progress[cr.name].filter( c => c.no_attendance === true )
                                
                                obj_crt.completed = total - out_of_time.length - not_attendance.length
                                obj_crt.out_of_time = out_of_time.length
                                obj_crt.not_attendance = not_attendance.length
                                
                                obj_crt.points =  obj_crt.completed * cr.value / cr.number 
                            }
                            else{
                                obj_crt.points = 0
                                obj_crt.completed = 0
                            }
                            break;
                    
                        case TASKS:
                            if(progress[cr.name] !== undefined){
                                obj_crt.completed = progress[cr.name].length
                                obj_crt.points = obj_crt.completed * cr.value / cr.number
                            }
                            else{
                                obj_crt.points = 0
                                obj_crt.completed = 0
                            }
                            break;
                        
                        case EXAMS:
                            if(progress[cr.name] !== undefined){
                                const has_final = progress[cr.name].find( p => p.id === final_id )
                                obj_crt.completed = has_final ? progress[cr.name].length - 1 : progress[cr.name].length
                                obj_crt.points = progress[cr.name].reduce( (sum, e) => has_final ? e.id === has_final.id ? sum : sum + e.grade : sum + e.grade , 0 ) * cr.value / cr.number
                            }
                            else{
                                obj_crt.points = 0
                                obj_crt.completed = 0
                            }
                            break;
                        
                        case FINAL:
                            if(progress[EXAMS] !== undefined){
                                const has_final = progress[EXAMS].find( p => p.id === final_id )
                                obj_crt.completed = has_final ? 1 : 0
                                obj_crt.points = has_final ? has_final.grade * cr.value / cr.number : 0
                            }
                            else{
                                obj_crt.points = 0
                                obj_crt.completed = 0
                            }
                            break;
                    }
                    

                    result.push(obj_crt)
                });

                return result
            },
            total() {
                let total = 0
                this.criteria.forEach(cr => total += cr.points );
                return Math.round(total)
            }
        })
    },
    data() {
        return {
            ATTENDANCE, EXAMS, TASKS, FINAL, FACETOFACE,
            moreInfo: {
                show: false,
                loaded: false,
                criteria: null,
                title: '',
                data: {} 
            }
        }
    },
    methods: {
        ...mapActions({
            getLessons: 'student/fetchLessons',
            getTasks: 'student/fetchTasks',
            getExams: 'student/fetchExams'
        }),
        async showMoreInfo(criteria){
            await this.loadMoreInfo(criteria)
            this.moreInfo.criteria = criteria
            this.moreInfo.title = criteria
            this.moreInfo.show = true
        },
        closeMoreInfo(){
            this.moreInfo.show = false
            this.moreInfo.criteria = null
            this.moreInfo.title = ''
        },
        async loadMoreInfo(criteria){
            if(criteria === this.ATTENDANCE){
                if(!this.lessons)
                    await this.getLessons()
                if(!this.moreInfo.data[this.ATTENDANCE]){
                    this.moreInfo.data[this.ATTENDANCE] = {}
                    this.moreInfo.data[this.ATTENDANCE].attendances = this.group.progress[this.ATTENDANCE].filter( a => !a.out_of_time && !a.no_attendance )
                    this.moreInfo.data[this.ATTENDANCE].not_attendances = this.group.progress[this.ATTENDANCE].filter( a => a.no_attendance )
                    this.moreInfo.data[this.ATTENDANCE].out_of_time = this.group.progress[this.ATTENDANCE].filter( a => a.out_of_time )
                    
                    this.moreInfo.data[this.ATTENDANCE].attendances = this.moreInfo.data[this.ATTENDANCE].attendances.map( a => ({ ...a, ...this.lessons.find( l => l.id === a.id) }) )
                    this.moreInfo.data[this.ATTENDANCE].not_attendances = this.moreInfo.data[this.ATTENDANCE].not_attendances.map( a => ({ ...a, ...this.lessons.find( l => l.id === a.id) }) )
                    this.moreInfo.data[this.ATTENDANCE].out_of_time = this.moreInfo.data[this.ATTENDANCE].out_of_time.map( a => ({ ...a, ...this.lessons.find( l => l.id === a.id) }) )
                }
            }
            if(criteria === this.TASKS){
                if(!this.tasks)
                    await this.getTasks()
                if(!this.moreInfo.data[this.TASKS]){
                    this.moreInfo.data[this.TASKS] = {}
                    this.moreInfo.data[this.TASKS].answered = this.group.progress[this.TASKS]
                    this.moreInfo.data[this.TASKS].answered = this.moreInfo.data[this.TASKS].answered.map( a => ({ ...a, ...this.tasks.find( t => t.id === a.id) }) )

                    this.moreInfo.data[this.TASKS].not_answered = this.tasks.filter( t => !this.moreInfo.data[this.TASKS].answered.find( a => a.id === t.id ) )
                }
            }
            if(criteria === this.EXAMS){
                if(!this.exams)
                    await this.getExams()
                if(!this.moreInfo.data[this.EXAMS]){
                    this.moreInfo.data[this.EXAMS] = {}
                    this.moreInfo.data[this.EXAMS].answered = this.group.progress[this.EXAMS]
                    this.moreInfo.data[this.EXAMS].answered = this.moreInfo.data[this.EXAMS].answered.map( a => ({ ...a, ...this.exams.find( e => e.id === a.id) }) )

                    this.moreInfo.data[this.EXAMS].not_answered = this.exams.filter( e => !this.moreInfo.data[this.EXAMS].answered.find( a => a.id === e.id ) )
                }
            }
        }

    },
}
</script>