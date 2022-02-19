<template>
    <div class="Academia px-4" :class="{ 'loading': !loaded, 'd-flex': !loaded }">
        <v-card v-if="loaded" flat color="academia-primary" dark>
            <!-- eslint-disable -->
            <v-img
                max-height="130px"
                src="@/assets/banner_academia.png"
            >
                <div class="pa-3">
                    <v-row>
                        <v-col cols="12 text-center">
                            <p class="text-h3 text-center ma-0">&#127891</p>
                            <p class="text-h4 text-center mb-0 font-weight-bold">
                                Academia
                            </p>
                            <!-- <p class="mt-3 mb-0">Bienvenido nuevamente a la plataforma de fuente de vida, es un gusto tener de nuevo por acá</p> -->
                        </v-col>
                    </v-row>
                </div>
            </v-img>
            <!-- eslint-enable -->
        </v-card>
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