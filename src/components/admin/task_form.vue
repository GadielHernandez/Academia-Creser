<template>
    <v-card>
        <v-toolbar outlined flat>
            <span class="text-h6" v-if="task">Editar tarea</span>
            <span class="text-h6" v-else> Nueva tarea </span>

            <v-spacer></v-spacer>

            <v-btn icon @click="close">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card-text>
            <v-row>
                <v-col class="pb-0">
                    <p class="ma-0 font-weight-bold">
                        Nombre
                    </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field
                        v-model="name"
                        color="primary"
                        solo
                        outlined
                        flat
                        hide-details
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pb-0">
                    <p class="ma-0 font-weight-bold">
                        Descripción
                    </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field
                        v-model="description"
                        color="primary"
                        solo
                        outlined
                        flat
                        hide-details
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pb-0">
                    <p class="ma-0 font-weight-bold">
                        Tiempo de liberación
                    </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field
                        v-model="available_after"
                        color="primary"
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
                <v-col class="pb-0">
                    <p class="ma-0 font-weight-bold">
                        Preguntas
                    </p>
                </v-col>
                <v-col class="text-right">
                    <v-btn icon @click="addQuestion" color="primary">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-textarea 
                        v-for="(question, index) in questions" 
                        color="primary"
                        v-model="question.question"
                        :key="index" 
                        rows="2"
                        solo
                        :label="'Pregunta ' + index"
                        append-icon="mdi-delete"
                        @click:append="deleteQuestion(index)"
                    ></v-textarea>
                </v-col>
            </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="close" color="primary">
                Cancelar
            </v-btn>
            <v-btn @click="saveChanges"  color="primary"  :disabled="questions === [] || questions.findIndex( q => q.question.length === 0 ) > -1 || name === '' || description === '' || available_after === null">
                Guardar
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { mapActions} from 'vuex'
export default {
    name: 'TaskForm',
    props: ['task'],
    data() {
        return {
            name: '',
            description: '',
            available_after: null,
            questions: [],
            AVAILABLE_TIME: 1000 * 60 * 60 * 24 * 7
        }
    },
    methods: {
        ...mapActions({ 
            update: 'admin/updateTask',
            add: 'admin/addTask'
        }),
        addQuestion(){
            this.questions.push({
                question: '',
                type: 'text'
            })
        },
        deleteQuestion(index){
            this.questions.splice(index, 1)
        },
        async saveChanges(){
            if(this.task)
                await this.update({
                    id: this.task.id,
                    name: this.name,
                    description: this.description,
                    available_after: this.available_after * this.AVAILABLE_TIME,
                    questions: this.questions
                })
            else
                await this.add({
                    name: this.name,
                    description: this.description,
                    available_after: this.available_after * this.AVAILABLE_TIME,
                    questions: this.questions
                })
            this.close()
        },
        setTask(){
            this.name = this.task.name
            this.description = this.task.description
            this.available_after = this.task.available_after / this.AVAILABLE_TIME
            this.questions = this.task.questions ? this.task.questions : []
        },
        close(){
            this.reset()
            this.$emit('close')
        },
        reset(){
            this.name = '',
            this.description = ''
            this.available_after = null
            this.questions = []
        }
    },
    watch: {
        task(){
            if(this.task)
                this.setTask()
            else
                this.reset()
        },
    },
    mounted() {
        if(this.task)
            this.setTask()
    },
}
</script>