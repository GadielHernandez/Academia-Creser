<template>
    <div class="Exams px-4">
        <Navbar :height="'100px'">
            <template v-slot:title>
                <div>
                    <h2>Examenes</h2>
                </div>
            </template>
        </Navbar>
        <examsPage v-if="exams"/>
        <div v-else-if="!exams" class="loading">
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
import examsPage from '../../components/admin/exams.vue'
export default {
    name:'Exams',
    components: { examsPage, Navbar },
    computed:{
        ...mapState({
            exams: state => state.admin.exams
        })
    },
    methods: {
        ...mapActions({
            getExams: 'admin/fetchExams'
        }),
    },
    mounted(){
        this.getExams()
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
