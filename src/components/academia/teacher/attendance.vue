<template>
    <div class="mx-1 main-background">
        <v-row v-if="students.length > 0">
            <v-col>
                <v-card flat color="background">
                    <v-card-text class="px-2 py-0">
                        <v-list-item dense>
                            <v-list-item-avatar></v-list-item-avatar>
                            <v-list-item-content
                                class="text-caption font-weight-bold blue-grey--text"
                            >
                                NOMBRE
                            </v-list-item-content>
                            <v-list-item-action class="text-caption font-weight-bold blue-grey--text mr-14">
                                SELECCIONA UNA OPCION
                            </v-list-item-action>
                        </v-list-item>
                    </v-card-text>
                </v-card>
                <v-card v-for="student in students" :key="student.id">
                    <v-card-text class="pa-2 mb-2">
                        <v-list-item dense>
                            <v-list-item-avatar>
                                <v-icon>mdi-account-circle</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ student.name }}
                                </v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-chip-group >
                                    <v-chip label outlined color="success">
                                       Asistencia
                                    </v-chip>
                                    <v-chip label outlined color="warning">
                                       Retardo
                                    </v-chip>
                                    <v-chip label outlined color="error">
                                       Inasistencia
                                    </v-chip>
                                </v-chip-group>
                            </v-list-item-action>
                        </v-list-item>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <div v-else class="no-students d-flex">
            <div class="ma-auto font-weight-bold blue-grey--text text-center">
                <v-icon x-large class="font-weight-bold blue-grey--text"
                    >mdi-account-supervisor-circle</v-icon
                >
                <p>No hay alumnos registrados</p>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'Students',
    computed: {
        ...mapState({
            students: (state) =>
                state.teacher.course.students
                    ? state.teacher.course.students
                    : [],
        }),
    },
}
</script>

<style scoped>
.no-students {
    height: 70vh;
}
.v-chip.v-chip--outlined.v-chip.v-chip.v-chip--active.success{
    color: white !important;
    background-color: var(--v-success-base) !important;
}
.v-chip.v-chip--outlined.v-chip.v-chip.v-chip--active.warning{
    color: white !important;
    background-color: var(--v-warning-base) !important;
}
.v-chip.v-chip--outlined.v-chip.v-chip.v-chip--active.error{
    color: white !important;
    background-color: var(--v-error-base) !important;
}
</style>
