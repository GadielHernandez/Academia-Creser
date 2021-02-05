<template>
    <v-app>
        <v-app-bar
            v-if="auth.currentUser"
            color="background" 
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

        <v-main class="main-background">
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
html, body {
    height: 100%;
    width: 100%;
}
.main-background{
    background-color: var(--v-background-base);
}
/* .v-window__container, .h-100 {
    min-height: 100%  !important;
} */
</style>
