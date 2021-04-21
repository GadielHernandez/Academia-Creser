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
                            <v-icon :class="{ 'white--text': tabs === 0 }" v-if="level === ADMIN">
                                mdi-account
                            </v-icon> 
                            <v-icon :class="{ 'white--text': tabs === 0 }" v-else>
                                mdi-home
                            </v-icon> 

                        </v-avatar>
                        <span class="ml-3 ma-auto" v-if="level === ADMIN">Personas</span>
                        <span class="ml-3 ma-auto" v-else>Inicio</span>
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
import { mapState } from 'vuex'
import { ADMIN } from '../../plugins/user-types'
export default {
    name: 'navbarApps',
    computed:{
        ...mapState({ level: state => state.user.profile.level })
    },
    data() {
        return {
            tabs: 0,
            tabs_value: ['Home' ,'Academia'],
            ADMIN
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
