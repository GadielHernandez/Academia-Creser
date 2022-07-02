<template>
    <div class="mx-1">
        <p class="ml-0 my-3 primary--text font-weight-bold">Secciones</p>
        <v-row>
            <v-col>
                <v-hover v-slot="{ hover }">
                    <v-card 
                        flat 
                        :color="hover ? 'secondary' : 'background'" 
                        outlined 
                        @click="$router.push({ name: 'admin-groups' })"
                    >
                        <v-card-text class="d-flex">
                            <v-list-item dense>
                                <v-list-item-avatar>
                                    <v-icon :dark="hover">mdi-account-group</v-icon>
                                </v-list-item-avatar>
                                <v-list-item-content :class="{ 'white--text': hover }">
                                    Grupos
                                </v-list-item-content>
                            </v-list-item>
                        </v-card-text>
                    </v-card>
                </v-hover>
            </v-col>
            <v-col>
                <v-hover v-slot="{ hover }">
                    <v-card 
                        flat 
                        :color="hover ? 'secondary' : 'background'" 
                        outlined 
                        @click="$router.push({ name: 'admin-classes' })"
                    >
                        <v-card-text class="d-flex">
                            <v-list-item dense>
                                <v-list-item-avatar>
                                    <v-icon :dark="hover">mdi-video</v-icon>
                                </v-list-item-avatar>
                                <v-list-item-content :class="{ 'white--text': hover }">
                                    Clases
                                </v-list-item-content>
                            </v-list-item>
                        </v-card-text>
                    </v-card>
                </v-hover>
            </v-col>
            <v-col>
                <v-hover v-slot="{ hover }">
                    <v-card 
                        flat 
                        :color="hover ? 'secondary' : 'background'" 
                        outlined 
                        @click="$router.push({ name: 'admin-tasks' })"
                    >
                        <v-card-text class="d-flex">
                            <v-list-item dense>
                                <v-list-item-avatar>
                                    <v-icon :dark="hover">mdi-clipboard-list-outline</v-icon>
                                </v-list-item-avatar>
                                <v-list-item-content :class="{ 'white--text': hover }">
                                    Tareas
                                </v-list-item-content>
                            </v-list-item>
                        </v-card-text>
                    </v-card>
                </v-hover>
            </v-col>
            <v-col>
                <v-hover v-slot="{ hover }">
                    <v-card 
                        flat 
                        :color="hover ? 'secondary' : 'background'" 
                        outlined 
                        @click="$router.push({ name: 'admin-exams' })"
                    >
                        <v-card-text class="d-flex">
                            <v-list-item dense>
                                <v-list-item-avatar>
                                    <v-icon :dark="hover">mdi-clipboard-check</v-icon>
                                </v-list-item-avatar>
                                <v-list-item-content :class="{ 'white--text': hover }">
                                    Examenes
                                </v-list-item-content>
                            </v-list-item>
                        </v-card-text>
                    </v-card>
                </v-hover>
            </v-col>
        </v-row>
        <p class="ml-0 my-3 primary--text font-weight-bold">Criterios de evaluación</p>
        <v-row v-if="criteria.length > 0">
            <v-col>
                <v-list>
                    <v-divider></v-divider>
                    <template v-for="(cr, index) in criteria" >
                        <v-list-item
                            class="rounded-lg py-2"
                            :key="cr.name"
                        >
                            <v-list-item-avatar color="primary" tile class="rounded-lg" dark>
                                <v-icon dark>mdi-check-circle</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-subtitle>
                                    Nombre
                                </v-list-item-subtitle>
                                <v-list-item-title class="font-weight-medium">
                                    {{ cr.name }}
                                </v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-content>
                                <v-list-item-subtitle>
                                    Numero de items
                                </v-list-item-subtitle>
                                <v-list-item-title class="font-weight-medium">
                                    {{ cr.number }}
                                </v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-content>
                                <v-list-item-subtitle>
                                    Valor por item
                                </v-list-item-subtitle>
                                <v-list-item-title class="font-weight-medium">
                                    {{ (cr.value/cr.number).toFixed(2)}}
                                </v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-content>
                                <v-list-item-subtitle>
                                    Valor total
                                </v-list-item-subtitle>
                                <v-list-item-title class="font-weight-medium">
                                    {{ cr.value }}
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider :key="index"></v-divider>
                    </template>
                </v-list>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'info',
    computed:{
        ...mapState({
            criteria: state => state.admin.info ? state.admin.info.criteria : []
        })
    }
}
</script>