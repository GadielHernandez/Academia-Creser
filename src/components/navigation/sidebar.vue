<template>
    <v-navigation-drawer
        permanent
        mini-variant
        mini-variant-width="100"
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
        
        <v-divider v-if="atLeastUserIs(profile.level, TEACHER)"></v-divider>
        <v-list dense nav class="mx-3" v-if="profile">
            <v-list-item 
                v-if="atLeastUserIs(profile.level, TEACHER) && view === TEACHER"
                @click="doChangeView(USER)"    
            >
                <v-list-item-icon>
                        <v-icon>mdi-swap-horizontal-circle</v-icon>
                    </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Vista de Alumno</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item 
                v-if="atLeastUserIs(profile.level, TEACHER) && view === USER"
                @click="doChangeView(TEACHER)" 
            >
                <v-list-item-icon>
                        <v-icon>mdi-swap-horizontal-circle</v-icon>
                    </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Vista de Maestro</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>
<script>
import { USER, TEACHER, ADMIN, atLeastUserIs } from '../../plugins/user-types'
import userContent from './user/sidebar-content.vue'
import teacherContent from './teacher/sidebar-content.vue'
import { mapActions, mapState } from 'vuex'
export default {
    name:'sidebar',
    components: { 
        'sidebar-user': userContent,
        'sidebar-teacher': teacherContent
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
            USER, TEACHER, ADMIN, atLeastUserIs
        }
    },
    methods: {
        ...mapActions({
            changeView: 'view/updateView'
        }),
        doChangeView(level){
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
    height: 81%;
    display: flex;
}
</style>
