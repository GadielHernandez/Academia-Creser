<template>
    <div class="Tasks px-4">
        <Navbar>
            <template v-slot:title>
                <div>
                    <h2>Alumnos</h2>
                </div>
            </template>
        </Navbar>
        <TasksPage />
    </div>
</template>

<script>
import Navbar from '../../components/navigation/navbar.vue'
import TasksPage from '../../components/teacher/task.vue'
export default {
    name: 'Tasks',
    components: { TasksPage, Navbar },
}
</script>

<style scoped>
.Tasks {
    height: 100%;
}
</style>
