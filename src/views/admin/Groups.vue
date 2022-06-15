<template>
    <div class="Groups px-4">
        <Navbar :height="'100px'">
            <template v-slot:title>
                <div>
                    <h2>Grupos</h2>
                </div>
            </template>
        </Navbar>
        <groupsPage v-if="groups"/>
        <div v-else-if="!groups" class="loading">
            <v-progress-circular
                :size="60"
                :width="7"
                color="primary"
                class="ma-auto"
                indeterminate
            ></v-progress-circular>
        </div>
        <div class="loading" v-else>
            <div class="ma-auto font-weight-bold blue-grey--text text-center">
                <v-icon x-large class="font-weight-bold blue-grey--text"
                    >mdi-account-group</v-icon
                >
                <p>Sin grupo asignado</p>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from '../../components/navigation/navbar.vue'
import { mapState, mapActions } from 'vuex'
import groupsPage from '../../components/admin/groups.vue'
export default {
    name:'Groups',
    components: { groupsPage, Navbar },
    computed:{
        ...mapState({
            groups: state => state.admin.groups
        })
    },
    methods: {
        ...mapActions({
            getGroups: 'admin/fetchGroups'
        }),
    },
    mounted(){
        this.getGroups()
    }
}
</script>

<style scoped>
.Groups{
    height: 100%;
}
.loading{
    height: 85vh;
    display: flex;
}
</style>
