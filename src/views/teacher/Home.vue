<template>
    <div class="Students px-4">
        <Navbar>
            <template v-slot:title>
                <div>
                    <h2>Hola, {{profile.nickname}} &#x1F44B;</h2>
                    <p class="my-0 text--secondary text-caption">
                        Es un gusto verte de nuevo
                    </p>
                </div>
            </template>
        </Navbar>
        <StudentsPage v-if="ready"/>
        <div v-else-if="ready === null" class="loading">
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
import { mapActions, mapState } from 'vuex'
import Navbar from '../../components/navigation/navbar.vue'
import StudentsPage from '../../components/teacher/students.vue'
export default {
    name: 'Students',
    components: { StudentsPage, Navbar },
    computed: {
        ...mapState({
            ready: state => state.teacher.hasCourse,
            profile: state => state.user.profile
        })
    },
    methods: {
        ...mapActions({ 
            fetchtCourse: 'teacher/fetchCourse'
        }),
        async getData(){
            if(this.ready)
                return
                
            await this.fetchtCourse()
        }
    },
    mounted() {
        this.getData()
    },
}
</script>

<style scoped>
.Students {
    height: 100%;
}
.loading{
    height: 85vh;
    display: flex;
}
</style>
