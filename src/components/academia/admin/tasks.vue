<template>
    <div class="mx-1">
        <v-row>
            <v-col class="d-flex">
                <p class="primary--text rounded-md my-auto mb-0 text-caption font-weight-bold">LISTA DE TAREAS</p>
            </v-col>
            <v-col class="text-right">
                <v-btn 
                    color="primary"
                     @click.stop="addNew">
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
                                <tr v-for="t in tasks" :key="t.id">
                                    <v-list-item>
                                        <v-list-item-icon>
                                            <v-icon color="primary">mdi-file-document-outline</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>{{ t.name }}</v-list-item-title>
                                            <v-list-item-subtitle>{{ t.description }}</v-list-item-subtitle>
                                        </v-list-item-content>
                                        <v-list-item-content>
                                            <p class="ma-auto text-caption">
                                                <v-chip small label color="primary" class="mr-1">{{ Number.isInteger(t.available_after / (( 1000 * 60 * 60 * 24 * 7 ))) ? t.available_after / (( 1000 * 60 * 60 * 24 * 7 )) : (t.available_after / (( 1000 * 60 * 60 * 24 * 7 ))).toFixed(1) }} semanas</v-chip>
                                                <v-chip small label color="primary">{{ t.questions.length }} preguntas</v-chip>
                                            </p>
                                        </v-list-item-content>
                                        <v-list-item-action>
                                            <v-btn icon @click="edit(t.id)">
                                                <v-icon color="primary">mdi-pencil</v-icon>
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
        <v-dialog v-model="form_tasks.open" max-width="600px">
            <formTask :task="form_tasks.task" @close="closeForm"/>
        </v-dialog>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
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
        ...mapActions({
            getTasks: 'admin/fetchTasks',
        }),
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
    mounted() {
        this.getTasks()
    },
}
</script>