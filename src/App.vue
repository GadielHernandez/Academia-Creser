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
            <navbarApps v-if="auth.currentUser"/> 
            <v-container v-if="auth.currentUser" fluid class="px-md-16">
                <router-view></router-view>
            </v-container>
            <router-view v-else></router-view>
        </v-main>
    </v-app>
</template>

<script>
import Navbar from './components/navigation/navbar.vue'
import navbarApps from './components/navigation/navbarApps.vue'
// import sidebar from './components/navigation/sidebar'
import { auth } from './plugins/firebase'
export default {
    name: 'app',
    components: { Navbar, navbarApps },
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
