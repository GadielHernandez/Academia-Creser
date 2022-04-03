<template>
    <div class="Attendance px-4">
        <Navbar>
            <template v-slot:title>
                <div>
                    <h2>Alumnos</h2>
                </div>
            </template>
        </Navbar>
        <AttendancePage />
    </div>
</template>

<script>
import Navbar from '../../components/navigation/navbar.vue'
import AttendancePage from '../../components/teacher/attendance.vue'
export default {
    name: 'Attendance',
    components: { AttendancePage, Navbar },
}
</script>

<style scoped>
.Attendance {
    height: 100%;
}
</style>
