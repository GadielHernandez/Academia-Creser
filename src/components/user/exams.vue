<template>
    <div class="mx-1 main-background">
        <v-row v-if="exams !== null">
            <v-col :class="{ empty: exams.length === 0 }">
                <v-list v-if="exams.length > 0">
                    <v-divider></v-divider>
                    <template v-for="(exam, index) in exams">
                        <v-list-item
                            @click="openDialog(exam.id)"
                            class="rounded-lg py-2 no-border"
                            :key="exam.id"
                        >
                            <v-list-item-avatar
                                :color="exam.final ? 'secondary' : 'primary'"
                                tile
                                class="rounded-lg d-none d-md-block"
                                dark
                            >
                                <v-icon dark>mdi-clipboard-check</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ exam.name }}
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ exam.description }}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-content
                                class="text-center d-none d-md-block"
                            >
                                <v-list-item-title>
                                    {{ exam.time_format }}
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    Tiempo limite
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action class="text-center">
                                <v-chip
                                    :class="{ 'px-8': !exam.feedback }"
                                    label
                                    small
                                    color="primary"
                                    v-if="exam.completed"
                                    dark
                                >
                                    {{ (exam.grade * 100).toFixed(2) }}
                                </v-chip>
                                <v-chip label small v-else>
                                    PENDIENTE
                                </v-chip>
                                <v-icon
                                    v-if="exam.feedback"
                                    class="mx-1"
                                    color="success"
                                >
                                    mdi-message-bulleted
                                </v-icon>
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
                    <v-chip
                        color="primary"
                        label
                        v-if="
                            exam_countdown.interval !== null &&
                                !selected.completed
                        "
                    >
                        <v-icon left>mdi-alarm</v-icon>
                        {{ exam_countdown.string }}
                    </v-chip>
                    <v-spacer />
                </v-toolbar>
                <v-card-text class="pt-0 px-0 px-md-6">
                    <v-container style="min-height: 90vh" class="d-flex">
                        <div
                            class="ma-auto"
                            :class="{ 'card-questions': exam_active }"
                        >
                            <!-- ESTATUS DEL EXAMEN -->
                            <v-card
                                v-if="!exam_active && !selected.completed"
                                class="pa-5 text-center"
                            >
                                <v-card-text class="pa-0">
                                    <div class="my-8">
                                        <p class="text-h5 font-weight-bold">
                                            {{ selected.name }}
                                        </p>
                                    </div>
                                    <v-toolbar flat height="100">
                                        <v-row>
                                            <v-col class="py-0 px-3">
                                                <v-icon class="ma-1"
                                                    >mdi-clock-outline</v-icon
                                                >
                                                <p
                                                    class="ma-1 font-weight-bold"
                                                >
                                                    {{ selected.time_format }}
                                                </p>
                                                <p class="ma-1 text-caption">
                                                    Tiempo
                                                </p>
                                            </v-col>
                                            <v-divider
                                                class="mx-2"
                                                inset
                                                vertical
                                            ></v-divider>
                                            <v-col class="py-0 px-3">
                                                <v-icon class="ma-1"
                                                    >mdi-progress-check</v-icon
                                                >
                                                <p
                                                    class="ma-1 font-weight-bold"
                                                >
                                                    {{ valueExam }} puntos
                                                </p>
                                                <p class="ma-1 text-caption">
                                                    Puntos
                                                </p>
                                            </v-col>
                                            <v-divider
                                                class="mx-2"
                                                inset
                                                vertical
                                            ></v-divider>
                                            <v-col class="py-0 px-3">
                                                <v-icon class="ma-1"
                                                    >mdi-help-circle-outline</v-icon
                                                >
                                                <p
                                                    class="ma-1 font-weight-bold"
                                                >
                                                    {{
                                                        selected.questions
                                                            .length
                                                    }}
                                                </p>
                                                <p class="ma-1 text-caption">
                                                    Preguntas
                                                </p>
                                            </v-col>
                                        </v-row>
                                    </v-toolbar>
                                    <v-btn
                                        class="mt-6"
                                        color="secondary"
                                        v-if="!exam_active"
                                        @click="initExam"
                                        :disabled="ended && !selected.completed"
                                        block
                                    >
                                        Iniciar examen
                                    </v-btn>
                                    <v-btn
                                        @click="closeDialog"
                                        block
                                        class="mt-2"
                                    >
                                        Cerrar
                                    </v-btn>
                                </v-card-text>
                            </v-card>
                            <div v-else-if="!exam_active && selected.completed">
                                <div class="text-center mb-16 pb-6 white--text">
                                    <p class="ma-0 ">Calificación:</p>
                                    <p class="text-h2 ma-0 ">
                                        {{ (selected.grade * 100).toFixed(2) }}
                                    </p>
                                </div>
                                <v-card>
                                    <v-card-text>
                                        <v-row class="my-3 mx-0 mx-sm-4">
                                            <v-col class="pa-0">
                                                <v-list-item class="no-border">
                                                    <v-list-item-avatar>
                                                        <v-icon color="success"
                                                            >mdi-check-circle</v-icon
                                                        >
                                                    </v-list-item-avatar>
                                                    <v-list-item-content>
                                                        <v-list-item-title
                                                            class="success--text font-weight-bold"
                                                        >
                                                            {{
                                                                selected
                                                                    .questions
                                                                    .length *
                                                                    selected.grade
                                                            }}
                                                        </v-list-item-title>
                                                        <v-list-item-subtitle>
                                                            Preguntas correctas
                                                        </v-list-item-subtitle>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </v-col>
                                            <v-col class="pa-0">
                                                <v-list-item class="no-border">
                                                    <v-list-item-avatar>
                                                        <v-icon color="accent"
                                                            >mdi-close-circle</v-icon
                                                        >
                                                    </v-list-item-avatar>
                                                    <v-list-item-content>
                                                        <v-list-item-title
                                                            class="accent--text font-weight-bold"
                                                        >
                                                            {{
                                                                parseInt(
                                                                    selected
                                                                        .questions
                                                                        .length -
                                                                        selected
                                                                            .questions
                                                                            .length *
                                                                            selected.grade
                                                                )
                                                            }}
                                                        </v-list-item-title>
                                                        <v-list-item-subtitle>
                                                            Preguntas correctas
                                                        </v-list-item-subtitle>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </v-col>
                                        </v-row>
                                        <v-btn
                                            class="mt-6"
                                            block
                                            color="secondary"
                                            v-if="!exam_active"
                                            @click="initExam"
                                            :disabled="
                                                ended && selected.completed
                                            "
                                        >
                                            Revisar examen
                                        </v-btn>
                                        <v-btn
                                            @click="closeDialog"
                                            block
                                            class="mt-2"
                                        >
                                            Cerrar
                                        </v-btn>
                                    </v-card-text>
                                </v-card>
                                <v-card
                                    outlined
                                    class="text-left mt-6"
                                    v-if="selected.feedback"
                                >
                                    <v-card-text>
                                        <p class="mb-1 font-weight-bold">
                                            Retroalimentación:
                                        </p>
                                        <p class="ma-0">
                                            {{ selected.feedback }}
                                        </p>
                                    </v-card-text>
                                </v-card>
                            </div>
                            <!-- EXAMEN EN PROGRESO - PREGUNTA Y RESPUESTA -->
                            <div v-else class="text-center pa-3 px-md-16">
                                <v-toolbar flat color="primary" dark>
                                    <p class="text-h5 ma-0 ">
                                        Pregunta {{ exam.index }}
                                    </p>
                                    <v-spacer />
                                    <v-btn
                                        outlined
                                        @click="exam.resume = true"
                                        small
                                        v-if="!selected.completed"
                                    >
                                        <v-icon>
                                            mdi-list-status
                                        </v-icon>
                                    </v-btn>
                                </v-toolbar>
                                <div class="mx-3" v-if="!selected.completed">
                                    <v-progress-linear
                                        color="secondary"
                                        :value="
                                            (this.exam.answers.filter(
                                                (a) => a !== null
                                            ).length /
                                                this.exam.answers.length) *
                                                100
                                        "
                                        class="rounded-lg mb-4 mt-1 text-caption"
                                        dark
                                        height="7"
                                    >
                                    </v-progress-linear>
                                </div>
                                <div v-if="exam.questions.length > 0">
                                    <v-card class="pa-4 text-left">
                                        <v-card-text>
                                            <p class="text-body-1">
                                                {{
                                                    exam.questions[
                                                        exam.index - 1
                                                    ].question
                                                }}
                                            </p>
                                            <v-list
                                                nav
                                                :disabled="selected.completed"
                                            >
                                                <v-list-item-group
                                                    :color="
                                                        !selected.completed
                                                            ? 'secondary'
                                                            : isCorrect()
                                                    "
                                                    v-model="exam.actual_answer"
                                                    @change="setAnswer"
                                                >
                                                    <v-list-item
                                                        v-for="(answer,
                                                        index) in exam
                                                            .questions[
                                                            exam.index - 1
                                                        ].answers"
                                                        :key="index"
                                                        class="rounded-lg"
                                                        :class="{
                                                            'correct-answ':
                                                                index ===
                                                                    exam
                                                                        .questions[
                                                                        exam.index -
                                                                            1
                                                                    ].correct &&
                                                                selected.completed,
                                                        }"
                                                    >
                                                        <v-list-item-content>
                                                            <v-list-item-title>
                                                                <p
                                                                    class="ma-0 answer"
                                                                >
                                                                    {{ answer }}
                                                                </p>
                                                            </v-list-item-title>
                                                        </v-list-item-content>
                                                    </v-list-item>
                                                </v-list-item-group>
                                            </v-list>
                                            <!-- <p v-if="selected.completed && (exam.actual_answer != exam.questions[exam.index - 1].correct)" class="taxt-caption mb-1 text-center success--text">Respuesta correcta:</p>
                                            <p v-if="selected.completed && (exam.actual_answer != exam.questions[exam.index - 1].correct)" class="text-caption text-center success--text">{{ exam.questions[exam.index - 1].answers[exam.questions[exam.index - 1].correct]}}</p> -->
                                        </v-card-text>
                                    </v-card>
                                    <v-row>
                                        <v-col>
                                            <v-btn
                                                class="mt-3 px-6 mt-6 secondary--text"
                                                @click="
                                                    changeQuestion(
                                                        exam.index - 1
                                                    )
                                                "
                                                block
                                                :disabled="exam.index === 1"
                                            >
                                                Anterior
                                            </v-btn>
                                        </v-col>
                                        <v-col>
                                            <v-btn
                                                class="mt-3 px-6 mt-6"
                                                @click="
                                                    changeQuestion(
                                                        exam.index + 1
                                                    )
                                                "
                                                block
                                                color="secondary"
                                                :disabled="
                                                    exam.index ===
                                                        exam.questions.length
                                                "
                                            >
                                                Siguiente
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                    <v-btn
                                        class="mt-3 px-6 mt-6"
                                        block
                                        v-if="!exam.answers.includes(null)"
                                        @click="finishExam"
                                        color="success"
                                    >
                                        Finalizar
                                    </v-btn>
                                    <v-btn
                                        class="mt-3 px-6 mt-6"
                                        block
                                        v-else-if="selected.completed"
                                        @click="finishExam"
                                    >
                                        Cerrar
                                    </v-btn>
                                </div>
                            </div>
                        </div>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="exam.resume">
            <v-card v-if="exam.resume">
                <v-toolbar flat dense>
                    <p class="my-0 ml-3 font-weight-bold">
                        Preguntas contestadas
                    </p>
                    <v-spacer></v-spacer>
                    <v-btn small icon @click="exam.resume = false" class="mr-3">
                        <v-icon> mdi-close </v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-row>
                        <v-col
                            v-for="(question, index) in this.exam.answers"
                            :key="index"
                            cols="12"
                            sm="3"
                        >
                            <v-list-item
                                @click="changeQuestion(index + 1)"
                                class="rounded-lg"
                            >
                                <v-list-item-content>
                                    <v-list-item-title>
                                        Pregunta {{ index + 1 }}
                                    </v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-icon v-if="question === null">
                                        mdi-alert-circle
                                    </v-icon>
                                    <v-icon v-else color="success">
                                        mdi-check-circle
                                    </v-icon>
                                </v-list-item-action>
                            </v-list-item>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { EXAMS, FINAL } from '../../plugins/criteria-types'
export default {
    name: 'examns',
    computed: {
        ...mapState({
            ended: (state) => state.student.group.ended,
            exams(state) {
                this.dialog
                const final_exam = state.student.info.criteria.find(
                    (c) => c.name === FINAL
                )
                const exams = state.student.exams
                    ? state.student.exams.map((e) =>
                          e.id === final_exam.id
                              ? {
                                    ...e,
                                    completed: false,
                                    grade: 0,
                                    final: true,
                                }
                              : {
                                    ...e,
                                    completed: false,
                                    grade: 0,
                                    final: false,
                                }
                      )
                    : []
                const progress = state.student.group.progress[EXAMS]
                if (progress)
                    progress.forEach((exam) => {
                        const index = exams.findIndex((e) => e.id === exam.id)
                        if (index >= 0) {
                            exams[index].completed = true
                            exams[index].grade = exam.grade
                        }
                    })

                return exams
            },
            valueExam: (state) => {
                const exam_info = state.student.info.criteria.find(
                    (c) => c.name === EXAMS
                )
                return exam_info.value / exam_info.number
            },
        }),
    },
    data() {
        return {
            dialog: false,
            selected: null,
            exam_active: false,
            exam_countdown: {
                string: '00:00:00',
                seconds: 0,
                interval: null,
            },
            exam: {
                questions: [],
                answers: [],
                index: 1,
                actual_answer: undefined,
                resume: false,
            },
        }
    },
    methods: {
        ...mapActions({
            getExams: 'student/fetchExams',
            setCompleted: 'student/setCriteriaCompleted',
            uploadResponse: 'student/uploadExam',
        }),
        openDialog(id) {
            this.selected = this.exams.find((e) => e.id === id)
            this.dialog = true
        },
        closeDialog() {
            if (this.exam_active && !this.selected.completed) this.finishExam()

            this.exam.answers = []
            this.exam.questions = []
            this.exam.index = 1
            this.exam_active = false
            this.exam.actual_answer = undefined

            this.selected = null
            this.dialog = false
        },
        initExam() {
            this.exam.questions = this.selected.questions
            this.exam.answers = new Array(this.exam.questions.length).fill(null)
            if (!this.selected.completed) {
                this.exam_countdown.seconds = this.selected.limit_time / 1000
                this.calculateCountDown()
                this.exam_countdown.interval = setInterval(
                    this.calculateCountDown,
                    1000
                )
            }

            this.checkAnswer()

            this.exam_active = true
        },
        async finishExam() {
            if (this.selected.completed) return this.closeDialog()
            if (!this.exam_active) return

            clearInterval(this.exam_countdown.interval)
            this.exam_countdown.interval = null

            const responses = this.exam.answers
            let result = this.exam.answers.reduce(
                (sum, answer, currentIndex) => {
                    if (
                        this.selected.questions[currentIndex].correct === answer
                    )
                        sum += 1
                    return sum
                },
                0
            )
            result = result / this.selected.questions.length

            const id = this.selected.id
            await this.setCompleted({
                id,
                criteria: EXAMS,
                options: { grade: result },
            })
            await this.uploadResponse({ id, responses })
            this.exam_active = false
            this.closeDialog()
        },
        setAnswer() {
            this.exam.answers[this.exam.index - 1] = isNaN(
                this.exam.actual_answer
            )
                ? null
                : this.exam.actual_answer
        },
        async changeQuestion(index) {
            if (index > this.exam.answers.length) return
            this.exam.resume = false
            this.exam.actual_answer = this.exam.answers[index - 1]
            this.exam.index = index
            this.checkAnswer()
            await this.$nextTick()
        },
        checkAnswer() {
            if (this.selected.completed)
                this.exam.actual_answer = this.selected.responses[
                    this.exam.index - 1
                ]
        },
        isCorrect() {
            if (
                this.exam.actual_answer ===
                this.selected.questions[this.exam.index - 1].correct
            )
                return 'success'
            else return 'red'
        },
        calculateCountDown() {
            if (this.exam_countdown.seconds === 0) return this.finishExam()
            let hour = parseInt(this.exam_countdown.seconds / (60 * 60))
            let minutes = parseInt(
                (this.exam_countdown.seconds - hour * (60 * 60)) / 60
            )
            let seconds =
                this.exam_countdown.seconds - hour * (60 * 60) - minutes * 60

            if (hour < 10) hour = '0' + hour
            if (minutes < 10) minutes = '0' + minutes
            if (seconds < 10) seconds = '0' + seconds

            this.exam_countdown.string = `${hour}:${minutes}:${seconds}`
            this.exam_countdown.seconds -= 1
        },
    },
    created() {
        window.addEventListener('beforeunload', this.finishExam)
    },
    async mounted() {
        await this.getExams()
    },
    destroyed() {
        window.removeEventListener('beforeunload', this.finishExam)
    },
}
</script>

<style scoped>
.card-questions {
    width: 90%;
}
.v-list-item {
    border: 1px solid var(--v-background-darken1);
}
.answer {
    white-space: normal;
}
.save-toolbar {
    position: absolute;
    bottom: 10px;
    right: 10px;
}
.border-table {
    border-left: 3px solid var(--v-primary-base);
}
.grade {
    width: fit-content;
    margin: auto;
}
.correct-answ {
    color: var(--v-primary-success) !important;
    background-color: var(--v-success-lighten5) !important;
}
.no-border {
    border: 0 !important;
}
.empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 85vh;
}
</style>
