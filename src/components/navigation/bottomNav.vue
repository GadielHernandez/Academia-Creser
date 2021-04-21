<template>
    <v-bottom-navigation color="primary" absolute app :value="tabs">
        
        <v-btn @click="go('Home')">
            <span>Inicio</span>

            <v-icon>mdi-home</v-icon>
        </v-btn>

        <v-btn @click="go('Academia')">
            <span>Academia</span>

            <v-icon>mdi-school</v-icon>
        </v-btn>
    </v-bottom-navigation>
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