<template>
    <div class="mx-1 main-background">
        <v-row v-if="tasks != null">
            <v-col>
                <v-card class="my-1">
                    <v-card-text>
                        <v-simple-table v-if="tasks.length > 0">
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th class="text-left">Tarea</th>
                                        <th class="text-left">Descripcion</th>
                                        <th class="text-center">
                                            Fecha de liberacion
                                        </th>
                                        <th class="text-center">Estado</th>
                                        <th class="text-center">
                                            Retroalimentacion
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="(task, index) in tasks"
                                        :key="index"
                                        @click="openDialog(task)"
                                    >
                                        <td>{{ task.name }}</td>
                                        <td>{{ task.description }}</td>
                                        <td class="text-center">{{ new Date( task.course_start + task.available_after).toLocaleString()}}</td>
                                        <td class="text-center font-weight-medium success--text" v-if="task.responses">
                                            ENTREGADO
                                        </td>
                                        <td class="text-center font-weight-medium blue-grey--text" v-else>
                                            PENDIENTE
                                        </td>
                                        <td class="text-center">
                                            <v-icon color="success" v-if="task.feedback">mdi-check-bold</v-icon>
                                        </td>
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
                            <p>No hay tareas disponibles</p>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row v-if="tasks == null" class="d-flex loading">
            <v-progress-circular
                :size="60"
                :width="7"
                color="primary"
                class="ma-auto"
                indeterminate
            ></v-progress-circular>
        </v-row>
        <v-dialog v-model="dialog" fullscreen persistent>
            <v-card class="rounded-0">
                <v-toolbar dark color="academia-primary" v-if="selected != null" flat>
                    <v-toolbar-title>{{ selected.name }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon dark @click="closeDialog">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-container v-if="selected != null && responses != {}" class="mb-8">
                        <v-row v-for="(question, index) in selected.questions" :key="index">
                            <v-col cols="12">
                                <v-card flat>
                                    <v-card-text>
                                        <p class="ma-0">
                                            {{ question.question }}
                                        </p>
                                        <v-textarea
                                            v-model="responses[index]"
                                            color="academia-primary"
                                            required
                                            auto-grow
                                            outlined
                                            hide-details
                                            rows="1"
                                            :disabled="selected.responses != undefined"
                                        ></v-textarea>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                        <v-row v-if="selected.feedback">
                            <v-col cols="12" class="mb-16">
                                <v-card flat>
                                    <v-card-text>
                                        <p class="ma-0 academia-primary--text text-caption font-weight-bold">
                                            Retroalimentación
                                        </p>
                                        <v-textarea
                                            :value="selected.feedback"
                                            color="academia-primary"
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
                    </v-container>
                </v-card-text>
                <v-card-actions class="save-toolbar mt-6" v-if="selected != null">
                    <v-spacer></v-spacer>
                    <v-btn color="academia-primary white--text" class="mx-6" @click="save" :disabled="selected.responses != undefined  || ended">Entregar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { TASKS } from '../../../plugins/criteria-types'
export default {
    name: 'tasks',
    computed: {
        ...mapState({
            ended: state => state.student.group.ended,
            tasks(state){
                this.selected
                return state.student.tasks
            }
        }),
    },
    data() {
        return {
            dialog: null,
            dialogFeedback: null,
            selected: null,
            responses: {}
        }
    },
    methods: {
        ...mapActions({ 
            getTasks: 'student/fetchTasks',
            saveTask: 'student/uploadTask',
            setCompleted: 'student/setCriteriaCompleted'
        }),
        openDialog(task){
            this.selected = task
            this.dialog = true
        },
        closeDialog(){
            this.selected = null
            this.dialog = false
        },
        async save(){
            let completed = true
            for (let index in this.responses) {
                if (Object.prototype.hasOwnProperty.call(this.responses, index)) {
                    if(this.responses[index] === null || this.responses[index] === ""){
                        completed = false
                        break
                    }
                }
            }

            if(!completed) return

            try{
                await this.saveTask({
                    id: this.selected.id,
                    responses: this.responses
                })
                await this.setCompleted({
                    id: this.selected.id,
                    criteria: TASKS
                })
            }catch(e){
                console.log(e)
            }

            this.closeDialog()
        }
    },
    watch:{
        selected(){
            if(this.selected != null){ 
                this.selected.questions.forEach( (task, index) => 
                    this.responses[index] = null
                )
                if(this.selected.responses){
                    this.responses = this.selected.responses
                }
            }
            else
                this.responses = {}
        }
    },
    async mounted() {
        if(this.tasks === null)
            await this.getTasks()
    },
}
</script>

<style scoped>
.loading {
    min-height: 60vh;
}
.save-toolbar{
    position: absolute;
    bottom: 10px;
    right: 10px;
}
</style>
