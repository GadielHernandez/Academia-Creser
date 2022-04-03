<template>
    <div class="Exams px-4">
        <Navbar>
            <template v-slot:title>
                <div>
                    <h2>Alumnos</h2>
                </div>
            </template>
        </Navbar>
        <ExamsPage />
    </div>
</template>

<script>
import Navbar from '../../components/navigation/navbar.vue'
import ExamsPage from '../../components/teacher/exams.vue'
export default {
    name: 'Exams',
    components: { ExamsPage, Navbar },
}
</script>

<style scoped>
.Exams {
    height: 100%;
}
</style>
