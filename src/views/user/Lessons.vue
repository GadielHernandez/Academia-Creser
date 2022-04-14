<template>
    <div class="Lessons px-4">
        <Navbar >
            <template v-slot:title>
                <div>
                    <h2>Clases</h2>
                </div>
            </template>
        </Navbar>
        <ClassesPage v-if="loaded && group.id"/>
        <div v-else-if="!loaded" class="loading">
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
import ClassesPage from '../../components/user/lessons.vue'
import { mapState } from 'vuex'
export default {
    name:'Lessons',
    components: { ClassesPage, Navbar },
    computed:{
        ...mapState({
            loaded: state => state.student.loaded,
            group: state => state.student.group
        })
    },
}
</script>

<style scoped>
.Lessons{
    height: 100%;
}
.loading{
    height: 85vh;
    display: flex;
}
</style>
