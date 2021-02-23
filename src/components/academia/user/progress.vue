<template>
    <div class="h-100 main-background mx-1">
        <v-row>
            <v-col cols="12" md="4">
                <v-card min-height="100%" class="d-flex">
                    <v-card-text class="ma-auto">
                        <p class="ml-3 primary--text text-caption font-weight-bold">
                            INFORMACIÓN
                        </p>
                        <p class="ml-3 font-weight-bold text-h6"> 
                            {{ course_name }}
                        </p>
                        <p class="ml-3 ma-0">
                            <span>Inicio: </span> {{ new Date(group.starts).toLocaleDateString() }}
                        </p>
                        <p class="ml-3 ma-0">
                            <span>Fin: </span> {{ new Date(group.ends).toLocaleDateString() }}
                        </p>
                        <p class="ml-3 ma-0"> 
                            <span>Maestro: </span> {{ group.teacher.name }}
                        </p>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col class="h-100" cols="12" md="8">
                <v-card min-height="100%">
                    <v-card-text>
                        <v-row>
                            <v-col class="text-center mb-3 ma-md-0 pa-0 d-flex" cols="12" md="4">
                                <v-progress-circular
                                    :rotate="-90"
                                    :size="130"
                                    :width="18"
                                    :value="total"
                                    :color="total > 50 ? 'green': 'amber'"
                                    class="ma-auto"
                                >
                                    <p class="ma-0 font-weight-black text-h5" >{{ total }}</p>
                                </v-progress-circular>
                            </v-col>
                            <v-col class="pa-0" cols="12" md="8">
                                <v-list-item dense v-for="cr in criteria" :key="cr.name">
                                    <v-list-item-avatar class="primary">
                                        <v-icon dark>{{ cr.icon }}</v-icon>
                                    </v-list-item-avatar>

                                    <v-list-item-content>
                                        <v-list-item-title>{{ cr.name }}</v-list-item-title>
                                        <v-list-item-subtitle>{{ cr.completed }} obtenidas</v-list-item-subtitle>
                                    </v-list-item-content>

                                    <v-list-item-action>
                                        <p class="ma-0 font-weight-black primary--text text-h6"> {{ (cr.completed * cr.value / cr.number).toFixed(2) }} pts</p>
                                    </v-list-item-action>
                                </v-list-item>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card >
                    <v-card-text>
                        <p class="ml-3 primary--text text-caption font-weight-bold">
                            TABLA DE PUNTEO
                        </p>
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
                    
                    if(progress[cr.name] !== undefined){
                        obj_crt.completed = progress[cr.name].length
                        const out_of_time = progress[cr.name].filter( c => c.out_of_time === true)
                        obj_crt.completed = obj_crt.completed - parseInt(out_of_time.length / 2)
                    }
                    else
                        obj_crt.completed = 0

                    result.push(obj_crt)
                });

                return result
            },
            total() {
                let total = 0
                this.criteria.forEach(cr => 
                        total += cr.completed * cr.value / cr.number
                );
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