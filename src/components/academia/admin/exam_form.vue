<template>
    <v-card>
        <v-toolbar outlined flat>
            <span class="text-h6" v-if="exam">Editar Examen</span>
            <span class="text-h6" v-else> Nuevo Examen </span>

            <v-spacer></v-spacer>

            <v-btn icon @click="close">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card-text>
            <v-row>
                <v-col class="pb-0">
                    <p class="primary--text rounded-md ma-0 text-caption font-weight-bold">NOMBRE</p>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field
                        v-model="name"
                        solo
                        outlined
                        flat
                        hide-details
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pb-0">
                    <p class="primary--text rounded-md ma-0 text-caption font-weight-bold">DESCRIPCION</p>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field
                        v-model="description"
                        solo
                        outlined
                        flat
                        hide-details
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pb-0">
                    <p class="primary--text rounded-md ma-0 text-caption font-weight-bold">TIEMPO LIMITE</p>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field
                        v-model="limit_time"
                        type="number"
                        solo
                        outlined
                        flat
                        hide-details
                        suffix="minutos"
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pb-0">
                    <p class="primary--text rounded-md ma-0 text-caption font-weight-bold">TIEMPO DE LIBERACION</p>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field
                        v-model="available_after"
                        type="number"
                        solo
                        outlined
                        flat
                        hide-details
                        suffix="semanas"
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col class="d-flex">
                    <p class="primary--text rounded-md my-auto text-caption font-weight-bold">PREGUNTAS</p>
                </v-col>
                <v-col class="text-right">
                    <v-btn icon @click="addQuestion">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row class="mb-6">
                <v-col v-for="(question, index) in questions" :key="index" cols="12" md="4">
                    <v-card>
                        <v-card-text>
                            <p class="font-weight-bold d-flex">
                                <span class="ma-auto ml-1">Pregunta {{ index + 1 }}</span>
                                <span @click="editQuestion(index)"><v-btn icon> <v-icon>mdi-pencil</v-icon> </v-btn></span>
                                <span @click="deleteQuestion(index)"><v-btn icon> <v-icon>mdi-delete</v-icon> </v-btn></span>
                            </p>
                            <p>{{ question.question }}</p>
                            <v-text-field
                                v-for="(answer, index) in question.answers"
                                :key="index"
                                solo
                                outlined
                                flat
                                hide-details
                                dense
                                readonly
                                :value="answer"
                                class="mb-1"
                            />
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions class="buttons">
            <v-spacer></v-spacer>
            <v-btn text @click="close">
                Cancelar
            </v-btn>
            <v-btn color="primary" @click="saveChanges" :disabled="questions === [] || questions.findIndex( q => q.question.length === 0 ) > -1 || name === '' || description === '' || available_after === null || limit_time === null">
                Guardar
            </v-btn>
        </v-card-actions>
        <v-dialog v-model="question_form.open" max-width="600px">
            <v-card style="height: 100%">
                <v-card-text>
                    <p class="primary--text rounded-md ma-0 text-caption font-weight-bold pt-6">PREGUNTA</p>
                    <v-text-field
                        v-model="question_form.question"
                        solo
                        outlined
                        flat
                        hide-details
                    />
                    <v-row>
                        <v-col>
                            <p class="primary--text mb-3 rounded-md my-auto text-caption font-weight-bold">RESPUESTA CORRECTA</p>
                            <v-select
                                :items="question_form.answers.map( (ans, index) => index + 1 )"
                                v-model="question_form.correct"
                                solo
                                outlined
                                flat
                                hide-details
                                dense
                            ></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="d-flex">
                            <p class="primary--text rounded-md my-auto text-caption font-weight-bold">RESPUESTAS</p>
                        </v-col>
                        <v-col class="text-right">
                            <v-btn icon @click="addAnswer">
                                <v-icon>mdi-plus</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="text-right">
                            <v-text-field
                                v-for="(answer, index) in question_form.answers"
                                :key="index"
                                solo
                                outlined
                                flat
                                hide-details
                                dense
                                v-model="answer.ans"
                                class="mb-1"
                            />
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="closeAddQuestion">
                        Cancelar
                    </v-btn>
                    <v-btn color="primary" @click="saveQuestion" :disabled="question_form.answers.length < 2 || question_form.correct === null">
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
import { mapActions} from 'vuex'
export default {
    name: 'TaskForm',
    props: ['exam'],
    data() {
        return {
            name: '',
            description: '',
            available_after: null,
            limit_time: null,
            questions: [],
            AVAILABLE_TIME: 1000 * 60 * 60 * 24 * 7,
            question_form: {
                open: false,
                question: '',
                answers: [],
                correct: null,
                edit: null
            }
        }
    },
    methods: {
        ...mapActions({ 
            update: 'admin/updateExam',
            add: 'admin/addExam'
        }),
        addQuestion(){
            this.question_form.open = true
        },
        closeAddQuestion(){
            this.question_form.edit = null
            this.question_form.question = ''
            this.question_form.answers = []
            this.question_form.correct = null
            this.question_form.open = false
        },
        addAnswer(){
            this.question_form.answers.push({ ans: '' })
        },
        editQuestion(index){
            const question = this.questions[index]
            this.question_form.edit = index
            this.question_form.question = question.question
            this.question_form.answers = question.answers.map( q => ({ ans: q }) )
            this.question_form.correct = question.correct
            this.question_form.open = true
        },
        saveQuestion(){
            const question = {
                question: this.question_form.question,
                correct: this.question_form.correct - 1,
                answers: this.question_form.answers.map( q => q.ans)
            }
            if(this.question_form.edit === null)
                this.questions.push(question)
            else
                this.questions[this.question_form.edit] = question
            
            this.closeAddQuestion()
        },
        deleteQuestion(index){
            this.questions.splice(index, 1)
        },
        async saveChanges(){
            if(this.exam)
                this.update({
                    id: this.exam.id,
                    name: this.name,
                    description: this.description,
                    available_after: this.available_after * this.AVAILABLE_TIME,
                    limit_time: this.limit_time * 1000 * 60,
                    questions: this.questions
                })
            else
                this.add({
                    name: this.name,
                    description: this.description,
                    available_after: this.available_after * this.AVAILABLE_TIME,
                    limit_time: this.limit_time * 1000 * 60,
                    questions: this.questions
                })
            this.close()
        },
        setExam(){
            this.name = this.exam.name
            this.description = this.exam.description
            this.available_after = this.exam.available_after / this.AVAILABLE_TIME
            this.limit_time = this.exam.limit_time / (1000 * 60)
            this.questions = this.exam.questions ? this.exam.questions.map( q => q ) : []
        },
        close(){
            this.reset()
            this.$emit('close')
        },
        reset(){
            this.name = '',
            this.description = ''
            this.available_after = null
            this.limit_time = null
            this.questions = []
        }
    },
    watch: {
        exam(){
            if(this.exam)
                this.setExam()
            else
                this.reset()
        },
    },
    mounted() {
        if(this.exam)
            this.setExam()
    },
}
</script>

<style scoped>
.buttons{
    position: absolute;
    bottom: 0px;
    right: 0;
}
</style>