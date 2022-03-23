<template>
    <div class="mx-1 main-background">
        <v-row v-if="tasks != null">
            <v-col :class="{'empty': tasks.length === 0}">
                <v-list v-if="tasks.length > 0" >
                    <v-divider></v-divider>
                    <template v-for="(task, index) in tasks" >
                        <v-list-item
                            @click="openDialog(task)"
                            class="rounded-lg py-2"
                            :key="task.id"
                        >
                            <v-list-item-avatar color="primary" tile class="rounded-lg" dark>
                                <v-icon dark>mdi-clipboard-list-outline</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ task.name }}
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ task.description }}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action class="d-none d-md-block">
                                <v-chip label small color="green"  v-if="task.feedback" dark>
                                    REVISADO
                                </v-chip>
                                <v-chip label small color="secondary"  v-else-if="task.responses">
                                    ENTREGADO
                                </v-chip>
                                <v-chip label small v-else>
                                    PENDIENTE
                                </v-chip>
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
        <v-row v-if="tasks == null" class="d-flex loading">
            <v-progress-circular
                :size="60"
                :width="7"
                color="primary"
                class="ma-auto"
                indeterminate
            ></v-progress-circular>
        </v-row>
        <v-dialog v-model="dialog" :fullscreen="!$vuetify.breakpoint.smAndUp" persistent max-width="850px" scrollable>
            <v-card class="rounded-0">
                <v-toolbar dark color="primary" v-if="selected != null" flat class="px-6">
                    <v-toolbar-title>{{ selected.name }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon dark @click="closeDialog">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="questions-container">
                    <v-container v-if="selected != null && responses != {}" class="mb-8">
                        <v-row v-if="selected.feedback">
                            <v-col cols="12" >
                                <v-card flat outlined color="secondary">
                                    <v-card-text class="white--text">
                                        <p class="ma-0 font-weight-bold">
                                            Retroalimentación
                                        </p>
                                        <p class="ma-0">
                                            {{selected.feedback}}
                                        </p>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                        <v-row v-for="(question, index) in selected.questions" :key="index">
                            <v-col cols="12">
                                <v-card flat>
                                    <v-card-text>
                                        <p class="ma-0">
                                            {{ question.question }}
                                        </p>
                                        <v-textarea
                                            v-model="responses[index]"
                                            color="primary"
                                            class="mt-4"
                                            required
                                            auto-grow
                                            outlined
                                            hide-details
                                            rows="1"
                                            :disabled="selected.responses != undefined"
                                            :readonly="ended"
                                        ></v-textarea>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions class="save-toolbar py-3 elevation-4" v-if="selected != null && !ended && selected.responses === undefined" >
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" @click="save">Guardar</v-btn>
                    <v-btn color="primary white--text" class="mx-6" @click="finish">Entregar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { TASKS } from '../../plugins/criteria-types'
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
        async openDialog(task){
            this.selected = task

            await this.$nextTick()
            const str_answ = localStorage.getItem(`TASK-${this.selected.id}`)
            if(str_answ){
                const answers = JSON.parse(str_answ)
                Object.keys(answers).forEach( index => {
                    this.responses[index] = answers[index]
                })
            }
            
            this.dialog = true
        },
        closeDialog(){
            this.selected = null
            this.dialog = false
        },
        save(){
            localStorage.removeItem(`TASK-${this.selected.id}`)
            localStorage.setItem(
                `TASK-${this.selected.id}`, 
                JSON.stringify(this.responses)
            )
        },
        async finish(){
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

            localStorage.removeItem((`TASK-${this.selected.id}`))
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
.empty{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 85vh;
}
.loading {
    min-height: 60vh;
}
.questions-container{
    max-height: 90vh;
}
.save-toolbar{
    z-index: 10;
}
</style>
