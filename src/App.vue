<template>
    <v-app>
        <div v-if="view === null" class="loading_view">
            <v-progress-circular
                :size="70"
                :width="7"
                color="primary"
                indeterminate
            >
                <v-img src="@/assets/icon.png" />
            </v-progress-circular>

        </div>
        <sidebar v-if="view !== null && user"/>
        <v-main class="main-background" v-if="view !== null">
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
import { mapState } from 'vuex'
import sidebar from './components/navigation/sidebar.vue'
import { auth } from './plugins/firebase'
export default {
    name: 'app',
    components: { sidebar },
    computed: {
        ...mapState({
            view: (state) => state.view.actual,
            user: () => auth.currentUser
        })
    },
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
    background-color: white;
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
.loading_view{
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
}
.center-vertical{
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>
