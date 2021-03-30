<template>
    <div class="h-100 main-background mx-1">
        <v-row>
            <v-col class="py-3 pb-md-6 pt-md-3" cols="12" md="6" order-md="last">
                <v-card :class="{ 'h-100': $vuetify.breakpoint.md || $vuetify.breakpoint.lg || $vuetify.breakpoint.xl }">
                    <div class="d-flex" style="height: 50%">
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
                    <v-row style="height: 50%">
                        <v-col cols="12" class="py-0">
                            <p class="ml-5 my-0 primary--text text-caption font-weight-bold">
                                PUNTOS ACUMULADOS
                            </p>
                        </v-col>
                        <v-col cols="12">
                            <v-list-item dense v-for="cr in criteria" :key="cr.name">
                                <v-list-item-avatar class="primary">
                                    <v-icon dark>{{ cr.icon }}</v-icon>
                                </v-list-item-avatar>

                                <v-list-item-content>
                                    <v-list-item-title>{{ cr.name }}</v-list-item-title>
                                    <v-list-item-subtitle>
                                        <span v-if="cr.name === ATTENDANCE">{{ cr.completed - cr.out_of_time }} obtenidas , {{ cr.out_of_time }} retardos</span>
                                        <span v-else-if="cr.name === EXAMS">{{ cr.completed }} realizados</span>
                                        <span v-if="cr.name === TASKS">{{ cr.completed }} realizadas</span>
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
                                    <v-list-item-avatar tile color="primary lighten-5" class="rounded">
                                        <v-icon color="primary"> mdi-chart-donut </v-icon>
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
                                    <v-list-item-avatar tile color="tertiary lighten-5" class="rounded">
                                        <v-icon color="tertiary"> mdi-teach </v-icon>
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
                                    <v-list-item-avatar tile color="secondary lighten-4" class="rounded">
                                        <v-icon color="secondary darken-1"> mdi-calendar-range </v-icon>
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
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { ATTENDANCE, EXAMS, TASKS } from '../../../plugins/criteria-types'
export default {
    name: 'Progress',
    computed:{
        ...mapState({ 
            course_name: state => state.student.info.name,
            group: state => state.student.group,
            criteria: state => {
                const icons = {}
                icons[ATTENDANCE] = 'mdi-checkbox-marked-outline'
                icons[TASKS] = 'mdi-lead-pencil'
                icons[EXAMS] = 'mdi-clipboard-text'

                const result = []
                const progress = state.student.group.progress
                const criteria = state.student.info.criteria
                criteria.forEach(cr => {
                    const obj_crt = cr
                    obj_crt.icon = icons[cr.name]
                    
                    switch (cr.name) {
                        case ATTENDANCE:
                            if(progress[cr.name] !== undefined){
                                obj_crt.completed = progress[cr.name].length
                                const out_of_time = progress[cr.name].filter( c => c.out_of_time === true)
                                obj_crt.out_of_time = out_of_time.length
                                obj_crt.points = (obj_crt.completed - (out_of_time.length / 2)) * cr.value / cr.number
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
                                obj_crt.completed = progress[cr.name].length
                                obj_crt.points = progress[cr.name].reduce( (sum, t) => sum + t.grade, 0 ) * cr.value / cr.number
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
            ATTENDANCE, EXAMS, TASKS
        }
    },
}
</script>