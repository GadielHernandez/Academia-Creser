<template>
    <div class="Exams px-4">
        <Navbar :height="'100px'">
            <template v-slot:title>
                <div>
                    <h2>Tareas</h2>
                </div>
            </template>
        </Navbar>
        <tasksPage v-if="tasks"/>
        <div v-else-if="!tasks" class="loading">
            <v-progress-circular
                :size="60"
                :width="7"
                color="primary"
                class="ma-auto"
                indeterminate
            ></v-progress-circular>
        </div>
        <div class="loading" v-else>
            <div class="ma-auto font-weight-bold blue-grey--text text-center">
                <v-icon x-large class="font-weight-bold blue-grey--text"
                    >mdi-account-group</v-icon
                >
                <p>Sin grupo asignado</p>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from '../../components/navigation/navbar.vue'
import { mapState, mapActions } from 'vuex'
import tasksPage from '../../components/admin/tasks.vue'
export default {
    name:'Tasks',
    components: { tasksPage, Navbar },
    computed:{
        ...mapState({
            tasks: state => state.admin.tasks
        })
    },
    methods: {
        ...mapActions({
            getTasks: 'admin/fetchTasks'
        }),
    },
    mounted(){
        this.getTasks()
    }
}
</script>

<style scoped>
.Exams{
    height: 100%;
}
.loading{
    height: 85vh;
    display: flex;
}
</style>
