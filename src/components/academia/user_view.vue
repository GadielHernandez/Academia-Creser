<template>
    <div class="academia-user">
        <v-tabs fixed-tabs v-model="tab" background-color="background" v-if="active" color="academia-primary">
            <v-tab >
                Progreso
            </v-tab>
            <v-tab>
                Clases
            </v-tab>
            <v-tab>
                Tareas
            </v-tab>
            <v-tab>
                Examenes
            </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" v-if="active">
            <v-tab-item class="h-100 main-background">
                <Progress/>
            </v-tab-item>
            <v-tab-item class="h-100 main-background">
                <Lessons/>
            </v-tab-item>
            <v-tab-item class="h-100 main-background">
                <Tasks/>
            </v-tab-item>
            <v-tab-item class="h-100 main-background">
                <Examns/>
            </v-tab-item>
        </v-tabs-items>
        <div v-else-if="starts !== null && ends !== null" class="inactive d-flex">
            <div class="ma-auto font-weight-bold blue-grey--text text-center">
                <v-icon x-large class="font-weight-bold blue-grey--text mb-1">mdi-calendar-range</v-icon>
                <p class="mb-1">Aun no inicia el curso</p>
                <p>{{ new Date(starts).toLocaleDateString() }} - {{ new Date(ends).toLocaleDateString() }}</p>
            </div>
        </div>
        <div v-else class="inactive d-flex">
            <div class="ma-auto font-weight-bold blue-grey--text text-center">
                <v-icon x-large class="font-weight-bold blue-grey--text mb-1">mdi-calendar-range</v-icon>
                <p class="mb-1">No tiene un curso asignado</p>
            </div>
        </div>
    </div>
</template>

<script>
import Progress from './user/progress.vue'
import Lessons from './user/lessons.vue'
import Tasks from './user/tasks.vue'
import Examns from './user/examns.vue'
import { mapState } from 'vuex'
export default {
    name: 'Academia-user',
    computed: { 
        ...mapState({ 
            active: state => state.student.group.active,
            starts: state => state.student.group.starts, 
            ends: state => state.student.group.ends 
        }) 
    },
    components: { Progress, Lessons, Tasks, Examns },
    data() {
        return {
            tab: null
        }
    },
}
</script>

<style>
.academia-user{
    height: 100%;
}
.v-slide-group__prev{
    display: none !important;
}
.inactive{
    height: 80vh;
}
</style>