<template>
    <v-app>
        
        <!-- <Navbar v-if="auth.currentUser"/> -->
        <sidebar />
        <v-main class="main-background">
            <!-- <navbarApps v-if="auth.currentUser" class="d-none d-md-block mb-3"/>  -->
            <v-container v-if="auth.currentUser" fluid class="px-md-16">
                <router-view></router-view>
            </v-container>
            <router-view v-else></router-view>
        </v-main>

        <!-- <v-footer class="d-md-none d-block" app v-if="auth.currentUser">
            <bottomNav/>
        </v-footer> -->
        
    </v-app>
</template>

<script>
import sidebar from './components/navigation/sidebar.vue'
import { auth } from './plugins/firebase'
export default {
    name: 'app',
    components: { sidebar },
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
.v-footer{
    bottom: 0 !important;
}
.h-100{
    height: 100%;
}
</style>
