<template>
    <div class="academia-user">
        <v-tabs v-model="tab" v-if="hasCourse" background-color="background">
            <v-tab >
                Alumnos
            </v-tab>
            <v-tab >
                Clases
            </v-tab>
            <v-tab >
                Asistencias
            </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" v-if="hasCourse">
            <v-tab-item class="h-100 main-background">
                <Students/>
            </v-tab-item>
            <v-tab-item class="h-100 main-background">
                <Lessons/>
            </v-tab-item>
            <v-tab-item class="h-100 main-background">
                <Attendance/>
            </v-tab-item>
        </v-tabs-items>
        <div v-else class="no-course d-flex">
            <div class="ma-auto font-weight-bold blue-grey--text text-center">
                <v-icon x-large class="font-weight-bold blue-grey--text">mdi-google-classroom</v-icon>
                <p>No hay un curso asignado</p>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import Students from './teacher/students.vue'
import Lessons from './teacher/lessons.vue'
import Attendance from './teacher/attendance.vue'
export default {
    name: 'Academia-user',
    components: { Students , Lessons, Attendance },
    computed:{
        ...mapState({
            hasCourse: state => state.teacher.hasCourse
        })
    },
    data() {
        return {
            tab: null
        }
    },
}
</script>

<style scoped>
    .no-course{
        height: 80vh;
    }
</style>