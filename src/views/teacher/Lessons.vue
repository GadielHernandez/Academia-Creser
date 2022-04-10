<template>
    <div class="Lessons px-4">
        <Navbar>
            <template v-slot:title>
                <div>
                    <h2>Clases</h2>
                </div>
            </template>
        </Navbar>
        <LessonsPage />
    </div>
</template>

<script>
import Navbar from '../../components/navigation/navbar.vue'
import LessonsPage from '../../components/teacher/lessons.vue'
export default {
    name: 'Lessons',
    components: { LessonsPage, Navbar },
}
</script>

<style scoped>
.Lessons {
    height: 100%;
}
</style>
