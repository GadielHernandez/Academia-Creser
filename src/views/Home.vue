<template>
    <div class="Academia px-4" :class="{ 'loading': !loaded, 'd-flex': !loaded }">
        <userAcademia v-if="profile.level === USER && loaded"/>
        <teacherAcademia v-else-if="profile.level === TEACHER && loaded"/>
        <adminAcademia v-else-if="profile.level === ADMIN && loaded" />
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
import userAcademia from '../components/user_view'
import teacherAcademia from '../components/teacher_view'
import adminAcademia from '../components/admin_view'
export default {
    name:'Academia',
    components: { userAcademia, teacherAcademia, adminAcademia },
    computed:{
        ...mapState({
            profile: state => state.user.profile,
            loaded: state => state.student.loaded || state.teacher.hasCourse !== null || state.admin.info !== null
        })
    },
    data() {
        return {
            USER, TEACHER, ADMIN, atLeastUserIs
        }
    },
    methods: {
        ...mapActions({ 
            fetchUserCourseData: 'user/fetchUserCourseData',
            fetchStudentCourse: 'student/fetchCourse',
            fecthTeacherCourse: 'teacher/fetchCourse',
            fetchAdminCourse: 'admin/fetchCourse'
        }),
        async getData(){
            if(this.profile.level === USER){
                console.log(1)
                if(this.courses !== null){
                    console.log(2)
                    await this.fetchUserCourseData()
                    await this.fetchStudentCourse()
                }
            }
            else if(this.profile.level === TEACHER)
                this.fecthTeacherCourse()
            else if(this.profile.level === ADMIN)
                this.fetchAdminCourse()
        }
    },
    watch:{
        courses(){
            this.getData()
        }
    },
    mounted() {
        console.log('dsd')
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
