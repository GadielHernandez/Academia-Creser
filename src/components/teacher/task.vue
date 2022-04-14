<template>
    <div class="mx-1 main-background">
        <v-row v-if="tasks == null">
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
                                mdi-clipboard-list-outline
                            </v-icon>
                            <v-select
                                v-model="tasks_selected"
                                color="primary"
                                :items="tasks"
                                item-text="name"
                                item-value="id"
                                hide-details
                                flat
                                solo
                                dense
                                label="Selecciona una tarea"
                            ></v-select>
                        </v-toolbar>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row v-if="students.length > 0 && tasks_selected">
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
                            <v-list-item-action>
                                <v-chip small label v-if="student.status === 'PENDIENTE'">
                                    PENDIENTE
                                </v-chip>
                                <v-chip small label v-if="student.status === 'ENTREGADA'" color="primary">
                                    ENTREGADA
                                </v-chip>
                                <v-chip small label v-if="student.status === 'REVISADA'" color="success">
                                    REVISADA
                                </v-chip>
                            </v-list-item-action>
                        </v-list-item>
                        <v-divider :key="index"></v-divider>
                    </template>
                </v-list>
            </v-col>
        </v-row>
        <v-dialog v-model="dialog" :fullscreen="!$vuetify.breakpoint.smAndUp" persistent max-width="850px" scrollable>
            <v-card class="rounded-0" v-if="student_selected">
                <v-toolbar dark color="primary" v-if="student_selected != null" flat>
                    <v-toolbar-title>Respuestas</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon dark @click="closeDialog">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-container v-if="actual_questions">
                        <v-row v-if="tasks_selected">
                            <v-col>
                                <v-card flat outlined color="secondary" dark>
                                    <v-card-text class="white--text">
                                        <p class="ma-1"> <span class="font-weight-black">Clase:</span> {{ tasks.find( t => t.id === tasks_selected ).name }}</p>
                                        <p class="ma-1"> <span class="font-weight-black">Alumno:</span> {{ students.find( s => s.id === student_selected ).name }}</p>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                        <v-row v-for="(question, index) in actual_questions" :key="index">
                            <v-col cols="12">
                                <v-card flat>
                                    <v-card-text class="pa-0 py-2">
                                        <p class="ma-0">
                                            {{ question.question }}
                                        </p>
                                        <v-textarea
                                            :value="actual_answers[index]"
                                            required
                                            auto-grow
                                            outlined
                                            hide-details
                                            rows="1"
                                            readonly
                                        ></v-textarea>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                        <v-row >
                            <v-col cols="12">
                                <v-card flat>
                                    <v-card-text class="pa-0">
                                        <p class="ma-0 secondary--text text-caption font-weight-bold">
                                            Retroalimentación
                                        </p>
                                        <v-textarea
                                            v-model="feedback"
                                            required
                                            auto-grow
                                            outlined
                                            hide-details
                                            rows="1"
                                            :readonly="students.find( s => s.id === student_selected ).status === 'REVISADA'"
                                        ></v-textarea>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions class="save-toolbar py-3 elevation-4">
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="save" :disabled="students.find( s => s.id === student_selected ).status === 'REVISADA'">
                        Dar Retroalimentación
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { TASKS } from '../../plugins/criteria-types'
import { mapActions, mapState } from 'vuex'
export default {
    name: 'Tasks',
    computed: {
        ...mapState({
            tasks: state => state.teacher.tasks,
            students(state){
                const result = state.teacher.course.students.map( s => ({ ...s, status: 'PENDIENTE' }) )
                
                this.student_selected
                if(this.tasks_selected == null) return result
                if(state.teacher.course.progress == {}) return result
                if(state.teacher.course.progress[TASKS] == undefined) return result
                
                const task_id = this.tasks_selected
                const progress = state.teacher.course.progress[TASKS]
                const feedbacks = state.teacher.course.teacher.tasks
                const task_feedback = feedbacks 
                    ? state.teacher.course.teacher.tasks[task_id]
                    : undefined

                if(progress[task_id] == undefined) return result

                const uploads = progress[task_id]
                
                uploads.forEach(upload => {
                    const index = result.findIndex( std => std.id == upload.user )
                    result[index].status = 'ENTREGADA'
                });
                
                if(task_feedback)
                    task_feedback.forEach(student => {
                        const index = result.findIndex( std => std.id == student )
                        result[index].status = 'REVISADA'
                    })
                
                return result
            }
        })
    },
    data() {
        return {
            dialog: null,
            tasks_selected: null,
            student_selected: null,
            feedback: null,
            actual_questions: [],
            actual_answers: []
        }
    },
    methods: {
        ...mapActions({ 
            getTasks: 'teacher/fetchTasks',
            fetchAnswersFeedback: 'teacher/fetchAnswersFeedback',
            setFeedback: 'teacher/setFeedback'
        }),
        async openDialog(id){
            const student = this.students.find( std => std.id === id )
            if(student.status === 'PENDIENTE') return
            const answers = await this.fetchAnswersFeedback({ student: id, task: this.tasks_selected })
            const this_task = this.tasks.find( t => t.id === this.tasks_selected )
            this.actual_questions = this_task.questions
            this.actual_answers = answers.responses
            this.feedback = answers.feedback
            this.student_selected = id
            this.dialog = true
        },
        closeDialog(){
            this.student_selected = null
            this.actual_questions = []
            this.actual_answers = []
            this.feedback = null
            this.dialog = false
        },
        async save(){
            console.log('SAVE')
            await this.setFeedback({
                student: this.student_selected,
                task: this.tasks_selected,
                feedback: this.feedback
            })
            this.closeDialog()
        }
    },
    mounted() {
        if(this.tasks === null || this.tasks.length === 0)
            this.getTasks()
    },
}
</script>

<style scoped>
.save-toolbar{
    z-index: 10;
}
</style>