<template>
    <div class="Tasks px-4">
        <Navbar>
            <template v-slot:title>
                <div>
                    <h2>Tareas</h2>
                </div>
            </template>
        </Navbar>
        <TasksPage />
    </div>
</template>

<script>
import Navbar from '../../components/navigation/navbar.vue'
import TasksPage from '../../components/user/tasks.vue'
export default {
    name:'Lessons',
    components: { TasksPage, Navbar }
}
</script>

<style scoped>
.Tasks{
    height: 100%;
}
</style>
