<template>
    <div class="Academia px-4" :class="{ 'loading': !loaded, 'd-flex': !loaded }">
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
import { USER, atLeastUserIs } from '../../plugins/user-types'
import { mapState, mapActions } from 'vuex'
import progressPage from '../../components/user/progress.vue'
export default {
    name:'Academia',
    components: { progressPage },
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
