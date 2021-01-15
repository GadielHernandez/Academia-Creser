<template>
    <v-app>
        <v-app-bar
            v-if="auth.currentUser"
            color="white" 
            flat
            app
        >
            <v-spacer></v-spacer>
            <navbar />
        </v-app-bar>

        <v-navigation-drawer
            v-if="auth.currentUser"
            
            mini-variant
            expand-on-hover
            permanent 
            app
        >
            <sidebar/>
        </v-navigation-drawer>

        <v-main>
            <v-container v-if="auth.currentUser" fluid>
                <router-view></router-view>
            </v-container>
            <router-view v-else></router-view>
        </v-main>
    </v-app>
</template>

<script>
import navbar from './components/navigation/navbar'
import sidebar from './components/navigation/sidebar'
import { auth } from './plugins/firebase'
export default {
    name: 'app',
    components: { sidebar, navbar },
    data() {
        return {
            mini: true,
            auth
        }
    },
}
</script>

<style>
html, body, .container{
    height: 100%;
    width: 100%;
}
</style>
