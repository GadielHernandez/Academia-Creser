<template>
    <div class="Exams px-4">
        <Navbar>
            <template v-slot:title>
                <div>
                    <h2>Examenes</h2>
                </div>
            </template>
        </Navbar>
        <ExamsPage v-if="ready"/>
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
import Navbar from '../../components/navigation/navbar.vue'
import ExamsPage from '../../components/teacher/exams.vue'
import { mapState } from 'vuex'
export default {
    name: 'Exams',
    components: { ExamsPage, Navbar },
    computed: {
        ...mapState({
            ready: state => state.teacher.hasCourse
        })
    },
}
</script>

<style scoped>
.Exams {
    height: 100%;
}
.loading{
    height: 85vh;
    display: flex;
}
</style>
