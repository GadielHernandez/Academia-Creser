<template>
    <div class="mx-1">
        <v-toolbar flat>
            <v-spacer></v-spacer>
            <v-btn color="primary" small @click.stop="addNew">
                Crear Examen
            </v-btn>
        </v-toolbar>
        <v-row v-if="exams != null">
            <v-col :class="{'empty': exams.length === 0}">
                <v-list v-if="exams.length > 0" >
                    <v-divider></v-divider>
                    <template v-for="(exam, index) in exams" >
                        <v-list-item
                            class="rounded-lg py-2"
                            :key="exam.id"
                        >
                            <v-list-item-avatar color="primary" tile class="rounded-lg">
                                <v-icon dark>mdi-file-document-outline</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ exam.name }}
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ exam.description }}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-content>
                                <div class="d-flex">
                                    <v-tooltip top >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-chip 
                                                color="secondary" 
                                                class="ma-auto mr-1" 
                                                v-bind="attrs" 
                                                v-on="on"
                                            >   
                                                <span style="font-size: 12px; width: 22px">{{ exam.questions.length }}</span>
                                                <v-icon small>mdi-help-circle</v-icon>
                                            </v-chip>
                                        </template>
                                        <span>Numero de preguntas</span>
                                    </v-tooltip>
                                    <v-tooltip top >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-chip 
                                                color="secondary" 
                                                class="ma-auto ml-1"
                                                :class="{ 'mx-1': exam.final }" 
                                                v-bind="attrs" 
                                                v-on="on"
                                                
                                            >
                                                <span style="font-size: 12px; width: 20px"> {{ 
                                                    Number.isInteger(exam.available_after / (( 1000 * 60 * 60 * 24 * 7 ))) 
                                                        ? exam.available_after / (( 1000 * 60 * 60 * 24 * 7 )) 
                                                        : (exam.available_after / (( 1000 * 60 * 60 * 24 * 7 ))).toFixed(1)
                                                }} </span>
                                                <v-icon small>mdi-calendar-start</v-icon>
                                            </v-chip>
                                        </template>
                                        <span>Semana de liberación</span>
                                    </v-tooltip>
                                    <v-tooltip top v-if="exam.final">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-chip 
                                                color="secondary" 
                                                class="ma-auto ml-1" 
                                                v-bind="attrs" 
                                                v-on="on"
                                                
                                            >
                                                <span style="font-size: 12px">Examen final</span>
                                            </v-chip>
                                        </template>
                                        <span>Exámen final</span>
                                    </v-tooltip>
                                </div>
                            </v-list-item-content>
                            <v-list-item-action class="d-none d-md-block">
                                <v-btn icon @click="edit(exam.id)">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                        <v-divider :key="index"></v-divider>
                    </template>
                </v-list>
                <div
                    v-else
                    class="font-weight-bold blue-grey--text text-center"
                >
                    <v-icon
                        x-large
                        class="ma-auto font-weight-bold blue-grey--text"
                        >mdi-calendar-check-outline</v-icon
                    >
                    <p>No hay tareas disponibles</p>
                </div>
            </v-col>
        </v-row>
        <v-dialog v-model="form_exams.open" fullscreen scrollable>
            <formExam :exam="form_exams.exam" @close="closeForm"/>
        </v-dialog>
    </div>
</template>

<script>
import formExam from './exam_form'
import { mapState } from 'vuex'
import { FINAL } from '../../plugins/criteria-types'
export default {
    name: 'Tasks',
    components: { formExam },
    computed: {
        ...mapState({
            finalExam: state => state.admin.info.criteria.find( c => c.name === FINAL ),
            exams(state){
                if(state.admin.exams)
                    return state.admin.exams.map( e => 
                        this.finalExam.id === e.id ? ({ ...e, final: true }) : ({ ...e, final: false })
                    )
                else 
                    return []
            } 
        }),
    },
    data() {
        return {
            form_exams: {
                exam: null,
                open: false
            }
        }
    },
    methods: {
        addNew(){
            this.form_exams.exam = null
            this.form_exams.open = true
        },
        edit(id){
            const exam = this.exams.find( t => t.id === id )
            this.form_exams.exam = exam
            this.form_exams.open = true
        },
        closeForm(){
            this.form_exams.exam = null
            this.form_exams.open = false
        }
    }
}
</script>