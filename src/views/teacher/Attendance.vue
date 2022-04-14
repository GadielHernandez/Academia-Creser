<template>
    <div class="Attendance px-4">
        <Navbar>
            <template v-slot:title>
                <div>
                    <h2>Asistencias</h2>
                </div>
            </template>
        </Navbar>
        <AttendancePage v-if="ready"/>
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
import AttendancePage from '../../components/teacher/attendance.vue'
import { mapState } from 'vuex'
export default {
    name: 'Attendance',
    components: { AttendancePage, Navbar },
    computed: {
        ...mapState({
            ready: state => state.teacher.hasCourse
        })
    },
}
</script>

<style scoped>
.Attendance {
    height: 100%;
}
.loading{
    height: 85vh;
    display: flex;
}
</style>
