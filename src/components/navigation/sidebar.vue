<template>
    <v-navigation-drawer
        permanent
        mini-variant-width="100"
        :mini-variant.sync="mini"
        expand-on-hover
        app
      >
        <v-list-item class="logo mx-3">
            <v-list-item-avatar>
                <span class="logo-icon">&#127891;</span>
            </v-list-item-avatar>

            <v-list-item-title class="text-h6 mt-1">Academia</v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>
        
        <sidebar-user v-if="view === USER" class="menu"/>
        <sidebar-teacher v-if="view === TEACHER" class="menu"/>
        <sidebar-admin v-if="view === ADMIN" class="menu"/>
        
        <v-divider v-if="atLeastUserIs(profile.level, TEACHER)"></v-divider>
        <v-list dense nav class="mx-3" v-if="atLeastUserIs(profile.level, TEACHER)">
            <v-list-item v-if="mini">
                <v-list-item-icon>
                    <v-icon v-if="view === USER">mdi-account-box</v-icon>
                    <v-icon v-if="view === TEACHER">mdi-clipboard-account</v-icon>
                    <v-icon v-if="view === ADMIN">mdi-shield-account</v-icon>
                </v-list-item-icon>
            </v-list-item>
            <v-list-item v-else>
                <v-list-item-content>
                    <v-list-item-title v-if="view === USER">Alumno</v-list-item-title>
                    <v-list-item-title v-if="view === TEACHER">Maestro</v-list-item-title>
                    <v-list-item-title v-if="view === ADMIN">Admin</v-list-item-title>
                    <v-list-item-subtitle>Vista actual</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                    <v-btn small depressed @click="dialogView = true">
                        Cambiar
                    </v-btn>
                </v-list-item-action>
            </v-list-item>
        </v-list>

        <v-dialog v-model="dialogView" max-width="350">
            <v-card>
                <v-toolbar
                    color="primary"
                    dark
                >
                    Cambiar vista
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialogView = false">
                        <v-icon small>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="py-6">
                    <v-card class="py-1">
                        <v-list-item>
                            <v-list-item-content>
                                Vista de Alumno
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn small depressed color="success" :disabled="view === USER" @click="doChangeView(USER)">
                                    Seleccionar
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </v-card>
                    <v-card class="mt-4 py-1">
                        <v-list-item>
                            <v-list-item-content>
                                Vista de Maestro
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn small depressed color="success" :disabled="view === TEACHER" @click="doChangeView(TEACHER)">
                                    Seleccionar
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </v-card>
                    <v-card class="mt-4 py-1" v-if="atLeastUserIs(profile.level, ADMIN)">
                        <v-list-item>
                            <v-list-item-content>
                                Vista de Admin
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn small depressed color="success" :disabled="view === ADMIN" @click="doChangeView(ADMIN)">
                                    Seleccionar
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </v-card>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-navigation-drawer>
</template>
<script>
import { USER, TEACHER, ADMIN, atLeastUserIs } from '../../plugins/user-types'
import userContent from './user/sidebar-content.vue'
import teacherContent from './teacher/sidebar-content.vue'
import adminContent from './admin/sidebar-content.vue'
import { mapActions, mapState } from 'vuex'
export default {
    name:'sidebar',
    components: { 
        'sidebar-user': userContent,
        'sidebar-teacher': teacherContent,
        'sidebar-admin': adminContent
    },
    computed:{
        ...mapState({
            view: state => state.view.actual,
            loaded: state => state.student.loaded,
            profile: state => state.user.profile
        })
    },
    data() {
        return {
            mini: null,
            dialogView: false,
            USER, TEACHER, ADMIN, atLeastUserIs
        }
    },
    methods: {
        ...mapActions({
            changeView: 'view/updateView'
        }),
        doChangeView(level){
            this.dialogView = false
            this.changeView(level)
        }
    }
}
</script>

<style scoped>
.logo{
    height: 10%;
}
.logo-icon{
    font-size: 40px;
}
.menu{
    height: 80%;
    display: flex;
}
</style>
