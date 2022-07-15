<template>
    <div class="Exams px-4">
        <Navbar :height="'100px'">
            <template v-slot:title>
                <div>
                    <h2>Clases</h2>
                </div>
            </template>
        </Navbar>
        <lessonsPage v-if="lessons"/>
        <div v-else-if="!lessons" class="loading">
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
import lessonsPage from '../../components/admin/lessons.vue'
export default {
    name:'Tasks',
    components: { lessonsPage, Navbar },
    computed:{
        ...mapState({
            lessons: state => state.admin.lessons
        })
    },
    methods: {
        ...mapActions({
            getLessons: 'admin/fetchLessons'
        }),
    },
    mounted(){
        this.getLessons()
    }
}
</script>

<style scoped>
.Exams{
    height: 100%;
}
.loading{
    height: 85vh;
    display: flex;
}
</style>
