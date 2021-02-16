<template>
    <div class="Academia px-4" :class="{ 'loading': !loaded, 'd-flex': !loaded }">
        <userAcademia v-if="profile.level === USER && loaded"/>
        <teacherAcademia v-else-if="profile.level === TEACHER && loaded"/>
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
import { USER, TEACHER, ADMIN, atLeastUserIs } from '../plugins/user-types'
import { mapState, mapActions } from 'vuex'
import userAcademia from '../components/academia/user_view'
import teacherAcademia from '../components/academia/teacher_view'
export default {
    name:'Academia',
    components: { userAcademia, teacherAcademia },
    computed:{
        ...mapState({
            profile: state => state.user.profile,
            loaded: state => state.student.loaded || state.teacher.hasCourse !== null,
            courses: state => state.user.courses
        })
    },
    data() {
        return {
            USER, TEACHER, ADMIN, atLeastUserIs
        }
    },
    methods: {
        ...mapActions({ 
            fetchStudentCourses: 'student/fetchCourses',
            fecthTeacherCourse: 'teacher/fetchCourse'
        }),
        getData(){
            if(this.profile.level === USER){
                if(this.courses !== null) 
                    this.fetchStudentCourses()
            }
            else if(this.profile.level === TEACHER)
                this.fecthTeacherCourse()
        }
    },
    watch:{
        courses(){
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