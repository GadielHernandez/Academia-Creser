<!-- eslint-disable -->
<template>
    <div class="home px-4">
        <v-card light>
            <div class="pa-5 secondary--text">
                <v-row>
                    <v-col cols="4" md="2" class="font-weight-bold text-center text-h2 d-flex">
                        <span class="ma-auto">&#128075</span>
                    </v-col>
                    <v-col cols="8" md="10">
                        <p class="text-h5 mb-0">¡<span class="font-weight-bold">Hola</span> {{ profile.nickname }}!</p>
                        <p class="mt-3 mb-0">Bienvenido nuevamente a la plataforma de fuente de vida, es un gusto tener de nuevo por acá</p>
                    </v-col>
                </v-row>
            </div>
        </v-card>
        <v-row>
            <v-col class="secondary--text font-weight-bold">
                Academia
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card>
                    <v-card-text>
                        <v-list-item two-line>
                            <v-list-item-avatar>
                                <v-icon> mdi-chart-donut </v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>Avance</v-list-item-title>
                                <v-list-item-subtitle>Revisa tu avance</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                    <v-btn icon @click="goToAcademia">
                                        <v-icon>mdi-chevron-right</v-icon>
                                    </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col>
                <v-card>
                    <v-card-text>
                        <v-list-item two-line>
                            <v-list-item-avatar>
                                <v-icon> mdi-calendar-check-outline </v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>Tareas</v-list-item-title>
                                <v-list-item-subtitle>No olvides completar tus tareas</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon @click="goToAcademia">
                                    <v-icon>mdi-chevron-right</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col>
                <v-card>
                    <v-card-text>
                        <v-list-item two-line>
                            <v-list-item-avatar>
                                <v-icon> mdi-video </v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>Clases</v-list-item-title>
                                <v-list-item-subtitle>Recuerda ver todas tus clases</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon @click="goToAcademia">
                                    <v-icon>mdi-chevron-right</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>
<!-- eslint-enable -->

<script>
import { mapState } from 'vuex'

export default {
    name: 'userHome',
    computed:{
        ...mapState({ profile: state => state.user.profile })
    },
    methods: {
        goToAcademia(){
            this.$router.push({ name: 'Academia' })
        }
    },
}
</script>

<style scoped>
.home{
    height: 100%;
    width: 100%;
}
</style>
