<template>
    <div>
        <v-tabs fixed-tabs v-model="tab" background-color="background">
            <v-tab>
                Informacion
            </v-tab>
            <v-tab>
                Clases
            </v-tab>
            <v-tab>
                Asistencias
            </v-tab>
            <v-tab>
                Tareas
            </v-tab>
            <v-tab>
                Examenes
            </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" v-if="hasCourse">
            <v-tab-item class="h-100 main-background">
                <info />
            </v-tab-item>
            <v-tab-item class="h-100 main-background">
                <lessons />
            </v-tab-item>
            <v-tab-item class="h-100 main-background">
                
            </v-tab-item>
            <v-tab-item class="h-100 main-background">
                
            </v-tab-item>
            <v-tab-item class="h-100 main-background">
                
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
import info from './admin/info'
import lessons from './admin/lessons'
export default {
    name: 'Academia-admin',
    components: { info, lessons },
    data() {
        return {
            tab: null,
            hasCourse: true
        }
    },
}
</script>