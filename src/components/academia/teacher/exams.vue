<template>
    <div class="mx-1 main-background">
        <v-row v-if="exams == null">
            <v-col class="loading d-flex">
                <v-progress-circular
                    :size="60"
                    :width="7"
                    color="primary"
                    class="ma-auto"
                    indeterminate
                ></v-progress-circular>
            </v-col>
        </v-row>
        <v-row v-else>
            <v-col>
                <p class="primary--text text-caption font-weight-bold">SELECCIONA UN EXAMEN</p>
                <v-card>
                    <v-card-text>
                        <v-toolbar dense flat>
                            <v-select
                                v-model="exam_selected"
                                :items="exams"
                                item-text="name"
                                item-value="id"
                                hide-details
                                flat
                                solo
                                dense
                                label="Examenes"
                            ></v-select>
                        </v-toolbar>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row v-if="students.length > 0 && exam_selected">
            <v-col>
                <p class="primary--text text-caption font-weight-bold">ALUMNOS</p>
                <v-card flat color="background">
                    <v-card-text class="px-2 py-0">
                        <v-list-item dense>
                            <v-list-item-avatar></v-list-item-avatar>
                            <v-list-item-content
                                class="text-caption font-weight-bold blue-grey--text"
                            >
                                NOMBRE
                            </v-list-item-content>
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
                            <v-list-item-action 
                                class="ml-0 mr-6 font-weight-medium" 
                                :class="{ 
                                    'blue-grey--text': student.grade === null,
                                    'success--text': student.grade !== null && student.grade >= 60,
                                    'warning--text': student.grade !== null && student.grade < 60
                                }">
                                <span v-if="student.grade === null">PENDIENTE</span>
                                <span v-else>{{ student.grade }}</span>
                            </v-list-item-action>
                        </v-list-item>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { EXAMS } from '../../../plugins/criteria-types'
import { mapActions, mapState } from 'vuex'
export default {
    name: 'Tasks',
    computed: {
        ...mapState({
            exams: state => state.teacher.exams,
            students(state){
                const result = state.teacher.course.students.map( s => ({ ...s, grade: null }) )
                
                this.student_selected
                if(this.exam_selected == null) return result
                if(state.teacher.course.progress == {}) return result
                if(state.teacher.course.progress[EXAMS] == undefined) return result
                
                const exam_id = this.exam_selected
                const progress = state.teacher.course.progress[EXAMS]

                if(progress[exam_id] == undefined) return result

                const answereds = progress[exam_id]
                
                answereds.forEach(answered => {
                    const index = result.findIndex( std => std.id == answered.user )
                    result[index].grade = answered.grade * 100
                });

                return result
            }
        })
    },
    data() {
        return {
            dialog: null,
            exam_selected: null,
            student_selected: null
        }
    },
    methods: {
        ...mapActions({ 
            getExams: 'teacher/fetchExams'
        })
    },
    async mounted() {
        if(this.exams === null)
            this.getExams()
    },
}
</script>