<template>
    <div class="Students px-4">
        <Navbar>
            <template v-slot:title>
                <div>
                    <h2>Alumnos</h2>
                </div>
            </template>
        </Navbar>
        <StudentsPage />
    </div>
</template>

<script>
import Navbar from '../../components/navigation/navbar.vue'
import StudentsPage from '../../components/teacher/students.vue'
export default {
    name: 'Students',
    components: { StudentsPage, Navbar },
}
</script>

<style scoped>
.Students {
    height: 100%;
}
</style>
