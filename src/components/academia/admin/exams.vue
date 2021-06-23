<template>
    <div class="mx-1">
        <v-row>
            <v-col class="d-flex">
                <p class="secondary--text rounded-md my-auto mb-0 text-caption font-weight-bold">LISTA DE EXAMENES</p>
            </v-col>
            <v-col class="text-right">
                <v-btn 
                    @click="addNew"
                    color="primary">
                    Añadir
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card>
                    <v-simple-table>
                        <template v-slot:default>
                            <tbody>
                                <tr v-for="e in exams" :key="e.id">
                                    <v-list-item>
                                        <v-list-item-icon>
                                            <v-icon color="primary">mdi-file-document-outline</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>{{ e.name }} <v-chip x-small label outlined color="primary" v-if="e.final"> Examen Final </v-chip></v-list-item-title>
                                            <v-list-item-subtitle>{{ e.description }}</v-list-item-subtitle>
                                        </v-list-item-content>
                                        <v-list-item-content>
                                            <p class="ma-auto text-caption">
                                                <v-chip small label class="mr-1">{{ Number.isInteger(e.available_after / (( 1000 * 60 * 60 * 24 * 7 ))) ? e.available_after / (( 1000 * 60 * 60 * 24 * 7 )) : (e.available_after / (( 1000 * 60 * 60 * 24 * 7 ))).toFixed(1) }} semanas</v-chip>
                                                <v-chip small label class="mr-1">{{ e.questions.length }} preguntas</v-chip>
                                            </p>
                                        </v-list-item-content>
                                        <v-list-item-action>
                                            <v-btn icon @click="edit(e.id)">
                                                <v-icon >mdi-pencil</v-icon>
                                            </v-btn>
                                        </v-list-item-action>
                                    </v-list-item>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="form_exams.open" fullscreen>
            <formExam :exam="form_exams.exam" @close="closeForm"/>
        </v-dialog>
    </div>
</template>

<script>
import formExam from './exam_form'
import { mapState, mapActions } from 'vuex'
import { FINAL } from '../../../plugins/criteria-types'
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
        ...mapActions({
            getExams: 'admin/fetchExams',
        }),
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
    },
    mounted() {
        this.getExams()
    },
}
</script>