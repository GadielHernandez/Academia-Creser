<template>
    <div>
        <v-list nav class="menu mx-3">
            <v-list-item-group mandatory class="group" active-class="selected">
                <v-list-item @click="goTo('admin-home')">
                    <v-list-item-icon>
                        <v-icon>mdi-home</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>Inicio</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="goTo('admin-groups')">
                    <v-list-item-icon>
                        <v-icon>mdi-account-group</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>Grupos</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="goTo('admin-classes')">
                    <v-list-item-icon>
                        <v-icon>mdi-video</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>Clases</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="goTo('admin-tasks')">
                    <v-list-item-icon>
                        <v-icon>mdi-clipboard-list-outline</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>Tareas</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="goTo('admin-exams')">
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