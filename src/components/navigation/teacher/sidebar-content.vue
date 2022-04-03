<template>
    <div>
        <v-list nav class="menu mx-3">
            <v-list-item-group mandatory class="group" active-class="selected">
                <v-list-item @click="goTo('teacher-home')">
                    <v-list-item-icon>
                        <v-icon>mdi-account-multiple</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>Alumnos</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="goTo('teacher-lessons')">
                    <v-list-item-icon>
                        <v-icon>mdi-video</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>Clases</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="goTo('teacher-attendance')">
                    <v-list-item-icon>
                        <v-icon>mdi-list-status</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>Asistencias</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="goTo('teacher-tasks')">
                    <v-list-item-icon>
                        <v-icon>mdi-clipboard-list-outline</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>Tareas</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="goTo('teacher-exams')">
                    <v-list-item-icon>
                        <v-icon>mdi-clipboard-check</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>Examenes</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </div>
</template>

<script>
export default {
    name: 'sidebar-student',
    methods: {
        goTo(routeName){
            if(this.$route.name === routeName)
                return
            
            this.$router.push({ name: routeName })
        }
    }
}
</script>

<style scoped>
.menu{
    width: 100%;
    display: flex;
}
.group{
    width: 100%;
    margin: auto;
}
.selected{
    color: var(--v-primary-base) !important
}
</style>