<template>
    <div class="mx-1">
        <v-toolbar flat>
            <v-spacer></v-spacer>
            <v-btn color="primary" small @click.stop="addNew">
                Crear tarea
            </v-btn>
        </v-toolbar>
        <v-row v-if="tasks != null">
            <v-col :class="{'empty': tasks.length === 0}">
                <v-list v-if="tasks.length > 0" >
                    <v-divider></v-divider>
                    <template v-for="(task, index) in tasks" >
                        <v-list-item
                            class="rounded-lg py-2"
                            :key="task.id"
                        >
                            <v-list-item-avatar color="primary" tile class="rounded-lg">
                                <v-icon dark>mdi-file-document-outline</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ task.name }}
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ task.description }}
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
                                                <span style="font-size: 12px; width: 15px">{{ task.questions.length }}</span>
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
                                                v-bind="attrs" 
                                                v-on="on"
                                                
                                            >
                                                <span style="font-size: 12px; width: 20px"> {{ 
                                                    Number.isInteger(task.available_after / (( 1000 * 60 * 60 * 24 * 7 ))) 
                                                        ? task.available_after / (( 1000 * 60 * 60 * 24 * 7 )) 
                                                        : (task.available_after / (( 1000 * 60 * 60 * 24 * 7 ))).toFixed(1)
                                                }} </span>
                                                <v-icon small>mdi-calendar-start</v-icon>
                                            </v-chip>
                                        </template>
                                        <span>Semana de liberación</span>
                                    </v-tooltip>
                                </div>
                            </v-list-item-content>
                            <v-list-item-action class="d-none d-md-block">
                                <v-btn icon @click="edit(task.id)">
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
        <v-dialog v-model="form_tasks.open" max-width="600px">
            <formTask :task="form_tasks.task" @close="closeForm"/>
        </v-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import formTask from './task_form'
export default {
    name: 'Tasks',
    components: { formTask },
    computed: {
        ...mapState({
            tasks: (state) => state.admin.tasks,
        }),
    },
    data() {
        return {
            form_tasks: {
                task: null,
                open: false
            }
        }
    },
    methods: {
        addNew(){
            this.form_tasks.task = null
            this.form_tasks.open = true
        },
        edit(id){
            const task = this.tasks.find( t => t.id === id )
            this.form_tasks.task = task
            this.form_tasks.open = true
        },
        closeForm(){
            this.form_tasks.task = null
            this.form_tasks.open = false
        }
    },
}
</script>