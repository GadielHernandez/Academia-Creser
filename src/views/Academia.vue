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
import userAcademia from '../components/academia/user_view'
import teacherAcademia from '../components/academia/teacher_view'
import adminAcademia from '../components/academia/admin_view'
export default {
    name:'Academia',
    components: { userAcademia, teacherAcademia, adminAcademia },
    computed:{
        ...mapState({
            profile: state => state.user.profile,
            loaded: state => state.student.loaded || state.teacher.hasCourse !== null || state.admin.info !== null,
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
            fecthTeacherCourse: 'teacher/fetchCourse',
            fetchAdminCourse: 'admin/fetchCourse'
        }),
        getData(){
            if(this.profile.level === USER){
                if(this.courses !== null) 
                    this.fetchStudentCourses()
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