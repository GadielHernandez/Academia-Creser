<template>
    <v-bottom-navigation :color="colorActive" absolute app v-model="tabs">
        
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
import { mapActions, mapState } from 'vuex'
import { ADMIN } from '../../plugins/user-types'
export default {
    name: 'navbarApps',
    computed:{
        ...mapState({ level: state => state.user.profile.level }),
        colorActive(){
            const colors = ['primary', 'academia-primary']
            return colors[this.tabs]
        }
    },
    data() {
        return {
            tabs: 0,
            tabs_value: ['Home' ,'Academia'],
            courses_id: {
                Academia: 'JgoBlXYdaGKpGF5tV98x'
            },
            ADMIN
        }
    },
    methods: {
        ...mapActions({
            changeCourse: 'user/selectCourse'
        }),
        async go(name) {
            if (this.$route.name === name) return
            if (this.courses_id[name]) await this.changeCourse(this.courses_id[name])
            this.$router.push({ name: name })
        },
    },
    mounted() {
        const index = this.tabs_value.findIndex((t) => t === this.$route.name)
        if (index >= 0) this.tabs = index
    },
}
</script>