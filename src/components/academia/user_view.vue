<template>
    <div class="academia-user">
        <p class="text-h5 font-weight-bold title">Academia</p>
        <v-tabs v-model="tab" background-color="background">
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
        <v-tabs-items v-model="tab">
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
    </div>
</template>

<script>
import Progress from './user/progress.vue'
import Lessons from './user/lessons.vue'
import Tasks from './user/tasks.vue'
import Examns from './user/examns.vue'
export default {
    name: 'Academia-user',
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
.title{
    height: 8%;
}
</style>