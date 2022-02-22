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
    </v-navigation-drawer>
</template>
<script>
import { USER, TEACHER, ADMIN, atLeastUserIs } from '../../plugins/user-types'
import userContent from './user/sidebar-content.vue'
import { mapState } from 'vuex'
export default {
    name:'sidebar',
    components: { 
        'sidebar-user': userContent
    },
    computed:{
        ...mapState({
            view: state => state.view.actual,
            loaded: state => state.student.loaded 
        })
    },
    data() {
        return {
            USER, TEACHER, ADMIN, atLeastUserIs
        }
    },
    methods: {
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
