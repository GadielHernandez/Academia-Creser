<template>
    <div>
        <v-toolbar class="px-md-16" flat>
            <v-tabs v-model="tabs" class="mx-md-1">
                <v-tab>
                    <div>
                        <v-avatar :color="tabs === 0 ? 'primary': 'white'" size="35" class="mt-2 mb-0">
                            <v-icon :class="{ 'white--text': tabs === 0 }">mdi-home</v-icon>
                        </v-avatar>
                        <p class="mb-2 mt-1">Inicio</p>
                    </div>
                </v-tab>
                <v-tab>
                    <div>
                        <v-avatar :color="tabs === 1 ? 'primary': 'white'" size="35" class="mt-2 mb-0">
                            <v-icon :class="{ 'white--text': tabs === 1 }">mdi-school</v-icon>
                        </v-avatar>
                        <p class="mb-2 mt-1">Academia</p>
                    </div>
                </v-tab>
            </v-tabs>
        </v-toolbar>
    </div>
</template>

<script>
export default {
    name: 'navbarApps',
    data() {
        return {
            tabs: 0
        }
    },
}
</script>

<style scoped>
.v-tab{
    text-transform: none !important;
}
</style>