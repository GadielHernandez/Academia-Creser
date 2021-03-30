<template>
    <div class="mx-1 main-background">
        <v-row v-if="exams !== null">
            <v-col>
                <v-card class="my-1">
                    <v-card-text>
                        <v-simple-table v-if="exams.length > 0">
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th class="text-left">Tarea</th>
                                        <th class="text-left">Descripcion</th>
                                        <th class="text-center">Fecha de liberación</th>
                                        <th class="text-center">Tiempo limite</th>
                                        <th class="text-center">Calificación</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="exam in exams"
                                        :key="exam.id"
                                        @click="openDialog(exam.id)"
                                    >
                                        <td>{{ exam.name }}</td>
                                        <td>{{ exam.description }}</td>
                                        <td class="text-center">
                                            {{ new Date( exam.course_start + exam.available_after).toLocaleString() }}
                                        </td>
                                        <td class="text-center"> {{ exam.time_format }} </td>
                                        <td class="text-center font-weight-medium success--text" v-if="exam.completed">{{exam.grade * 100}}</td>
                                        <td class="text-center font-weight-medium blue-grey--text" v-else>PENDIENTE</td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                        <div
                            v-else
                            class="py-10 font-weight-bold blue-grey--text text-center"
                        >
                            <v-icon
                                x-large
                                class=" font-weight-bold blue-grey--text"
                                >mdi-calendar-check-outline</v-icon
                            >
                            <p>No hay examenes disponibles</p>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row v-else class="d-flex loading">
            <v-progress-circular
                :size="60"
                :width="7"
                color="primary"
                class="ma-auto"
                indeterminate
            ></v-progress-circular>
        </v-row>
        <v-dialog v-model="dialog" fullscreen persistent>

            <v-card class="rounded-0" v-if="selected !== null" color="primary">
                <v-toolbar dark color="primary" flat dense>
                    <v-spacer />
                        <v-chip color="primary" label v-if="exam_countdown.interval !== null && !selected.completed">
                            <v-icon left>mdi-alarm</v-icon>
                            {{ exam_countdown.string }}
                        </v-chip>
                    <v-spacer />
                    <v-btn icon dark @click="closeDialog">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="pt-0 px-0 px-md-6">
                    <v-container style="min-height: 90vh" class="d-flex">
                        <div class="ma-auto text-center" :class="{ 'card-questions': exam_active }">
                            <!-- ESTATUS DEL EXAMEN -->
                            <v-card v-if="!exam_active" class="pa-5">
                                <v-card-text class="text-center pa-0" v-if="!selected.completed">
                                    <p class="text-h5 mb-2 mt-8">{{selected.name}}</p>
                                    <p class="mb-8">{{selected.description}}</p>
                                    <v-toolbar flat>
                                        <v-row>
                                            <v-col class="pa-0">
                                                <p class="ma-1 font-weight-bold">{{ selected.time_format }}</p>
                                                <p class="ma-1 text-caption">Tiempo limite</p>
                                            </v-col>
                                            <v-divider
                                                class="mx-2"
                                                inset
                                                vertical
                                            ></v-divider>
                                            <v-col class="pa-0">
                                                <p class="ma-1 font-weight-bold">{{ valueExam }} puntos</p>
                                                <p class="ma-1 text-caption">Valor del examen</p>
                                            </v-col>
                                            <v-divider
                                                class="mx-2"
                                                inset
                                                vertical
                                            ></v-divider>
                                            <v-col class="pa-0">
                                                <p class="ma-1 font-weight-bold">{{selected.questions.length}}</p>
                                                <p class="ma-1 text-caption">Total de preguntas</p>
                                            </v-col>
                                        </v-row>
                                    </v-toolbar>
                                </v-card-text>
                                <v-card-text v-else class="text-center">
                                    <v-progress-circular
                                        :size="150"
                                        :width="13"
                                        :value="selected.grade * 100"
                                        color="secondary"
                                        class="mb-6"
                                    >
                                    <span class="text-h4">{{ selected.grade * 100 }}</span>
                                    </v-progress-circular>
                                    <v-row>
                                        <v-col class="pa-0">
                                            <p class="ma-1 font-weight-bold success--text">{{selected.questions.length * selected.grade}}</p>
                                            <p class="ma-1 text-caption">Respuestas correctas</p>
                                        </v-col>
                                        <v-divider
                                            class="mx-2"
                                            inset
                                            vertical
                                        ></v-divider>
                                        <v-col class="pa-0">
                                            <p class="ma-1 font-weight-bold red--text">{{parseInt(selected.questions.length - (selected.questions.length * selected.grade)) }}</p>
                                            <p class="ma-1 text-caption">Respuestas incorrectas</p>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                            <!-- EXAMEN EN PROGRESO - PREGUNTA Y RESPUESTA -->
                            <div v-else class="text-center pa-3 px-md-16">
                                <v-pagination
                                    ref="pagination"
                                    v-model="exam.index"
                                    :length="exam.answers.length"
                                    :total-visible="10"
                                    circle
                                    class="mb-4"
                                    @input="changeQuestion"
                                ></v-pagination>
                                <div class="text-left" v-if="exam.questions.length > 0">
                                    <v-card class="pa-4">
                                        <v-card-text>
                                            <p class="subtitle-1 font-weight-bold">Pregunta {{ exam.index }}</p>
                                            <p class="text-body-1">{{ exam.questions[exam.index - 1].question }}</p>
                                            <v-list nav :disabled="selected.completed">
                                                <v-list-item-group :color="!selected.completed ? 'primary' : isCorrect() " v-model="exam.actual_answer" @change="setAnswer">
                                                    <v-list-item v-for="(answer, index) in exam.questions[exam.index - 1].answers" :key="index">
                                                        <v-list-item-content>
                                                            <v-list-item-title> {{answer}} </v-list-item-title>
                                                        </v-list-item-content>
                                                    </v-list-item>
                                                </v-list-item-group>
                                            </v-list>
                                            <p v-if="selected.completed && (exam.actual_answer != exam.questions[exam.index - 1].correct)" class="taxt-caption mb-1 text-center success--text">Respuesta correcta:</p>
                                            <p v-if="selected.completed && (exam.actual_answer != exam.questions[exam.index - 1].correct)" class="text-caption text-center success--text">{{ exam.questions[exam.index - 1].answers[exam.questions[exam.index - 1].correct]}}</p>
                                        </v-card-text>
                                    </v-card>
                                    <v-btn class="mt-3 px-6 mt-6" block v-if="exam.answers.includes(null)" @click="changeQuestion(exam.index + 1)" :disabled="exam.actual_answer === undefined">
                                        Siguiente
                                    </v-btn>
                                    <v-btn class="mt-3 px-6 mt-6" block v-else @click="finishExam">
                                        Finalizar
                                    </v-btn>
                                </div>
                            </div>
                            <v-btn class="mt-6 px-6" v-if="!exam_active" @click="initExam">
                                <span v-if="selected.completed">Revisar examen</span>
                                <span v-else>Iniciar examen</span>
                            </v-btn>
                        </div>
                    </v-container>
                </v-card-text>
            </v-card>

        </v-dialog>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { EXAMS } from '../../../plugins/criteria-types'
export default {
    name: 'examns',
    computed:{
        ...mapState({ 
            exams(state) {
                this.dialog
                const exams = state.student.exams
                    ? state.student.exams.map( e => ({ ...e, completed: false, grade: 0 }))
                    : []
                const progress = state.student.group.progress[EXAMS]
                if(progress)
                    progress.forEach(exam => {
                        const index = exams.findIndex( e => e.id === exam.id )
                        if(index >= 0) {
                            exams[index].completed = true
                            exams[index].grade = exam.grade
                        }
                    });

                return exams
            },
            valueExam: state => {
                const exam_info = state.student.info.criteria.find( c => c.name === EXAMS )
                return exam_info.value / exam_info.number
            }
         })
    },
    data() {
        return {
            dialog: false,
            selected: null,
            exam_active: false,
            exam_countdown: {
                string: '00:00:00',
                seconds: 0,
                interval: null
            },
            exam: {
                questions: [],
                answers: [],
                index: 1,
                actual_answer: undefined
            }
        }
    },
    methods: {
        ...mapActions({
            getExams: 'student/fetchExams',
            setCompleted: 'student/setCriteriaCompleted',
            uploadResponse: 'student/uploadExam'
        }),
        openDialog(id){
            this.selected = this.exams.find( e => e.id === id )
            this.dialog = true
        },
        closeDialog(){
            if(this.exam_active && !this.selected.completed) this.finishExam()

            this.exam.answers = []
            this.exam.questions = []
            this.exam.index = 1
            this.exam_active = false
            this.exam.actual_answer = undefined

            this.selected = null
            this.dialog = false
        },
        initExam(){
            this.exam.questions = this.selected.questions
            this.exam.answers = new Array(this.exam.questions.length).fill(null)
            if(!this.selected.completed){
                this.exam_countdown.seconds = this.selected.limit_time / 1000
                this.calculateCountDown()
                this.exam_countdown.interval = setInterval(this.calculateCountDown, 1000)
            }

            this.checkAnswer()
            
            this.exam_active = true
        },
        async finishExam(){
            if(this.selected.completed) return this.closeDialog()

            clearInterval(this.exam_countdown.interval)
            this.exam_countdown.interval = null

            let result = this.exam.answers.reduce((sum, answer, currentIndex) => {
                if(this.selected.questions[currentIndex].correct === answer)
                    sum += 1
                return sum
            }, 0)
            result = result / this.selected.questions.length
            
            await this.setCompleted({ id: this.selected.id, criteria: EXAMS, options: { grade: result } })
            await this.uploadResponse({ id: this.selected.id, responses: this.exam.answers })
            this.exam_active = false
            this.closeDialog()
        },
        setAnswer(){
            this.exam.answers[this.exam.index - 1] = this.exam.actual_answer
            this.checkProgress()
        },
        async changeQuestion(index){
            if(index > this.exam.answers.length) return
            this.exam.actual_answer = this.exam.answers[index - 1]
            this.exam.index = index
            this.checkAnswer()
            await this.$nextTick()
            this.checkProgress()
        },
        checkProgress(){
            this.$refs.pagination.$el.getElementsByClassName('v-pagination__item').forEach((btn, index) => {
                if(this.exam.answers[index] !== null)
                    btn.classList.add('success')
                else
                    btn.classList.remove('success')
            })
        },
        checkAnswer(){
            if(this.selected.completed)
                this.exam.actual_answer = this.selected.responses[this.exam.index - 1]
        },
        isCorrect(){
            if(this.exam.actual_answer === this.selected.questions[this.exam.index - 1].correct)
                return 'success' 
            else 
                return 'red'
        },
        calculateCountDown(){
            if(this.exam_countdown.seconds === 0) return this.finishExam()
            let hour = parseInt(this.exam_countdown.seconds / (60 * 60))
            let minutes = parseInt( ( this.exam_countdown.seconds - hour * ( 60 * 60) ) /  60) 
            let seconds = this.exam_countdown.seconds - (hour * ( 60 * 60)) - (minutes * 60) 
                    
            if (hour < 10) hour   = '0' + hour
            if (minutes < 10) minutes = '0' + minutes
            if (seconds < 10) seconds = '0' + seconds

            this.exam_countdown.string = `${hour}:${minutes}:${seconds}`
            this.exam_countdown.seconds -= 1
        }
    },
    async mounted() {
        await this.getExams()
    },
}
</script>

<style scoped>
.card-questions{
    width: 90%;
}
.v-list-item{
    border: 1px solid var(--v-background-darken1);
}
.save-toolbar{
    position: absolute;
    bottom: 10px;
    right: 10px;
}
</style>
