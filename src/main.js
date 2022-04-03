import Vue from 'vue'
import App from './App.vue'
import { auth } from './plugins/firebase'
import vuetify from './plugins/vuetify';
import router from './router'
import store from './store'
import VueYoutube from 'vue-youtube'
 
Vue.use(VueYoutube)
Vue.config.productionTip = false

let app

auth.onAuthStateChanged(async () => {
    if (!app) {
        app = new Vue({
            vuetify,
            store,
            router,
            render: (h) => h(App)
        }).$mount('#app')
    }
    
    if(auth.currentUser){
        await store.dispatch('user/fetchProfile')
        await store.dispatch('view/updateView', store.state.user.profile.level)
    }
    
})
