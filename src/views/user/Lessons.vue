<template>
    <div class="Lessons px-4">
        <Navbar >
            <template v-slot:title>
                <div>
                    <h2>Clases</h2>
                </div>
            </template>
        </Navbar>
        <ClassesPage />
    </div>
</template>

<script>
import Navbar from '../../components/navigation/navbar.vue'
import ClassesPage from '../../components/user/lessons.vue'
export default {
    name:'Lessons',
    components: { ClassesPage, Navbar }
}
</script>

<style scoped>
.Lessons{
    height: 100%;
}
</style>
