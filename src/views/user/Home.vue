<template>
    <div class="Academia px-4" :class="{ 'loading': !loaded, 'd-flex': !loaded }">
        <Navbar :height="'100px'">
            <template v-slot:title>
                <div>
                    <h2>Hola, {{profile.nickname}} &#x1F44B;</h2>
                    <p class="my-0 text--secondary text-caption">
                        Es un gusto verte de nuevo
                    </p>
                </div>
            </template>
        </Navbar>
        <progressPage v-if="loaded"/>
        <v-progress-circular
            v-else
            :size="60"
            :width="7"
            color="primary"
            class="ma-auto"
            indeterminate
        ></v-progress-circular>
    </div>
</template>

<script>
import Navbar from '../../components/navigation/navbar.vue'
import { USER, atLeastUserIs } from '../../plugins/user-types'
import { mapState, mapActions } from 'vuex'
import progressPage from '../../components/user/progress.vue'
export default {
    name:'Academia',
    components: { progressPage, Navbar },
    computed:{
        ...mapState({
            profile: state => state.user.profile,
            loaded: state => state.student.loaded
        })
    },
    data() {
        return {
            USER, atLeastUserIs
        }
    },
    methods: {
        ...mapActions({ 
            fetchStudentCourse: 'student/fetchCourse'
        }),
        async getData(){
            if(!this.profile)
                return
                
            await this.fetchStudentCourse()
        }
    },
    watch: {
        loaded(){
            if(this.loaded)
                this.getData()
        }
    },
    mounted() {
        this.getData()
    },
}
</script>

<style scoped>
.Academia{
    height: 100%;
}
.v-tabs{
    border-bottom: 1px solid var(--v-background-darken1) !important;
}
.v-tab{
    text-transform: none !important;
}
.loading{
    height: 85vh;
}
</style>
