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
                <v-card flat outlined>
                    <v-card-text>
                        <v-toolbar dense flat>
                            <v-icon>
                                mdi-clipboard-check
                            </v-icon>
                            <v-select
                                v-model="exam_selected"
                                color="primary"
                                :items="exams"
                                item-text="name"
                                item-value="id"
                                hide-details
                                flat
                                solo
                                dense
                                label="Selecciona un examen"
                            ></v-select>
                        </v-toolbar>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row v-if="students.length > 0 && exam_selected">
            <v-col>
                <v-toolbar flat class="pl-0">
                    <p class="my-1 font-weight-bold ml-0">Alumnos</p>
                </v-toolbar>
                <v-list>
                    <v-divider></v-divider>
                    <template v-for="(student, index) in students">
                        <v-list-item
                            class="rounded-lg py-2"
                            :key="student.id"
                            @click="openDialog(student.id)"
                        >
                            <v-list-item-avatar color="primary" tile class="rounded-lg">
                                <v-icon dark>mdi-account-circle</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ student.name }}
                                </v-list-item-title>
                                <v-list-item-subtitle class="text-caption">
                                    Nombre
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action 
                                class="ml-0 mr-6 font-weight-medium" 
                                :class="{ 
                                    'blue-grey--text': student.grade === null,
                                    'success--text': student.grade !== null && student.grade >= 60,
                                    'warning--text': student.grade !== null && student.grade < 60
                                }">
                                <p class="ma-0"> 
                                    <span v-if="student.grade !== null">{{ (student.grade).toFixed(2) }}</span>
                                    <span class="text-caption" v-else>PENDIENTE</span>
                                    <v-icon class="ml-3" v-if="student.feedback" color="success">mdi-comment-check</v-icon> 
                                    <v-icon class="ml-3" v-else>mdi-comment-outline</v-icon>
                                </p>
                            </v-list-item-action>
                        </v-list-item>
                        <v-divider :key="index"></v-divider>
                    </template>
                </v-list>
            </v-col>
        </v-row>
        <v-dialog v-model="dialog" fullscreen persistent>
            <v-card class="rounded-0" v-if="student_selected" color="primary">
                <v-toolbar dark color="primary" flat dense>
                    <v-spacer />
                    <v-btn icon dark @click="closeDialog">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="pt-0 px-0 px-md-6">
                    <v-container style="min-height: 90vh">
                        <v-row v-if="exam_selected">
                            <v-col>
                                <v-card outlined>
                                    <v-card-text>
                                        <p class="ma-1"> <span class="font-weight-black">Examen:</span> {{ exams.find( e => e.id === exam_selected ).name }}</p>
                                        <p class="ma-1"> <span class="font-weight-black">Alumno:</span> {{ student_selected.name }}</p>
                                        <p class="ma-1"> <span class="font-weight-black">Retroalimentación:</span></p>
                                        <p class="ma-1" v-if="feedback"> {{ feedback }}</p>
                                        <v-row v-else>
                                            <v-col cols="12" md="10">
                                                <v-text-field
                                                    v-model="feedback_model" 
                                                    color="primary"
                                                    solo
                                                    outlined
                                                    flat
                                                    hide-details
                                                    dense
                                                />
                                            </v-col>
                                            <v-col cols="12" md="2">
                                                <v-btn 
                                                    @click="saveFeedback()"
                                                    color="primary">
                                                    Finalizar
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="6" v-for="(question, index) in actual_questions" :key="index">
                                <v-card style="height: 100%">
                                    <v-card-text>
                                        <p class="ma-0 py-3">
                                            {{ question.question }}
                                        </p>
                                        <v-list nav disabled>
                                            <v-list-item-group :color="actual_answers[index] === question.correct ? 'success': 'error'" v-model="actual_answers[index]">
                                                <v-list-item v-for="(answer, index) in question.answers" :key="index" dense class="answer">
                                                    <v-list-item-content>
                                                        <v-list-item-title> {{answer}} </v-list-item-title>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </v-list-item-group>
                                        </v-list>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>

        </v-dialog>
    </div>
</template>

<script>
import { EXAMS } from '../../plugins/criteria-types'
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
                const feedbacks = state.teacher.course.teacher.exams
                const exam_feedback = feedbacks 
                    ? state.teacher.course.teacher.exams[exam_id]
                    : undefined

                if(progress[exam_id] == undefined) return result

                const answereds = progress[exam_id]
                
                answereds.forEach(answered => {
                    const index = result.findIndex( std => std.id == answered.user )
                    if(index > -1)
                        result[index].grade = answered.grade * 100
                });

                if(exam_feedback)
                    exam_feedback.forEach(student => {
                        const index = result.findIndex( std => std.id == student )
                        result[index].feedback = true
                    })

                return result
            }
        })
    },
    data() {
        return {
            dialog: null,
            exam_selected: null,
            student_selected: null,
            actual_questions: [],
            actual_answers: [],
            feedback: null,
            feedback_model: null
        }
    },
    methods: {
        ...mapActions({ 
            getExams: 'teacher/fetchExams',
            fetchAnswersFeedback: 'teacher/fetchAnswersFeedbackExams',
            setFeedback: 'teacher/setFeedbackExam'
        }),
        async openDialog(id){
            this.student_selected = this.students.find( s => s.id === id)
            if(this.student_selected.grade === null) return
            const answers = await this.fetchAnswersFeedback({ student: id, exam: this.exam_selected })
            const this_exam = this.exams.find( e => e.id === this.exam_selected )
            this.actual_questions = this_exam.questions
            this.actual_answers = answers.responses
            
            this.feedback = answers.feedback
            this.dialog = true
        },
        async saveFeedback(){
            await this.setFeedback({
                exam: this.exam_selected,
                student: this.student_selected.id,
                feedback: this.feedback_model
            })

            this.feedback = this.feedback_model
        },
        closeDialog(){
            this.student_selected = null
            this.actual_questions = []
            this.actual_answers = []
            this.feedback = null
            this.feedback_model = null
            this.dialog = false
        }
    },
    async mounted() {
        if(this.exams === null || this.exams.length === 0)
            this.getExams()
    },
}
</script>

<style>
.v-list-item.answer{
    border: 1px solid var(--v-background-darken1) !important;
}
</style>