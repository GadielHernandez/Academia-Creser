<template>
    <v-app>
        
        <Navbar v-if="auth.currentUser"/>

        <!-- <v-navigation-drawer
            v-if="auth.currentUser"
            mini-variant
            expand-on-hover
            permanent 
            app
        >
            <sidebar/>
        </v-navigation-drawer> -->

        <v-main class="main-background">
            <navbarApps v-if="auth.currentUser" class="d-none d-md-block"/> 
            <v-container v-if="auth.currentUser" fluid class="px-md-16">
                <router-view></router-view>
            </v-container>
            <router-view v-else></router-view>
        </v-main>

        <v-footer app>
            <bottomNav class="d-md-none d-flex"/>
        </v-footer>
        
    </v-app>
</template>

<script>
import Navbar from './components/navigation/navbar.vue'
import navbarApps from './components/navigation/navbarApps.vue'
import bottomNav from './components/navigation/bottomNav.vue'
import { auth } from './plugins/firebase'
export default {
    name: 'app',
    components: { Navbar, navbarApps, bottomNav },
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
.v-card{
    border-radius: 15px !important;
}
</style>
