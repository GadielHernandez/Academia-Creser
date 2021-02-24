<template>
    <div>
        <v-toolbar class="px-md-16" flat>
            <v-tabs v-model="tabs" class="mx-md-1" >
                <v-tab @click="go('Home')">
                        <v-avatar
                            :color="tabs === 0 ? 'primary' : 'white'"
                            size="35"
                            class=""
                        >
                            <v-icon :class="{ 'white--text': tabs === 0 }">
                                mdi-home
                            </v-icon> 

                        </v-avatar>
                        <span class="ml-3 ma-auto">Inicio</span>
                </v-tab>
                <v-tab @click="go('Academia')">
                    <div>
                        <v-avatar
                            :color="tabs === 1 ? 'primary' : 'white'"
                            size="35"
                        >
                            <v-icon :class="{ 'white--text': tabs === 1 }" >
                                mdi-school
                            </v-icon>
                        </v-avatar>
                        <span class="ml-3 ma-auto">Academia</span>
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
            tabs: 0,
            tabs_value: ['Home', 'Academia'],
        }
    },
    methods: {
        go(name) {
            if (this.$route.name === name) return
            this.$router.push({ name: name })
        },
    },
    mounted() {
        const index = this.tabs_value.findIndex((t) => t === this.$route.name)
        if (index >= 0) this.tabs = index
    },
}
</script>

<style scoped>
.v-tab {
    text-transform: none !important;
}
</style>
