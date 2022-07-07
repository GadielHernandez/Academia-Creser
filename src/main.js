import Vue from 'vue'
import App from './App.vue'
import { auth } from './plugins/firebase'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import VueYoutube from 'vue-youtube'
import VueCookies from 'vue-cookies'

Vue.use(VueCookies)
Vue.use(VueYoutube)
Vue.config.productionTip = false

let app

auth.onAuthStateChanged(async () => {
    if (!app) {
        app = new Vue({
            vuetify,
            store,
            router,
            render: (h) => h(App),
        }).$mount('#app')
    }
    // Vue.$cookies.set('TOKEN_AUTH', 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTY1NzIyNjUxNiwiZXhwIjoxNjU3MjMwMTE2LCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1uNnBkM0BmZHYtd2ViLWFwcC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInN1YiI6ImZpcmViYXNlLWFkbWluc2RrLW42cGQzQGZkdi13ZWItYXBwLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwidWlkIjoicEtUQ2hibXNPWll6UDlIQ0dRNHlzclhXZEJxMiIsImNsYWltcyI6eyJleHBpcmVzSW4iOjE2NTk4MTg1MTY5MDl9fQ.L1fJNbxQT_x2c1d0wsCR7MisA4B8TSA3FE8p2ToPe7H1f6D7FgpAQmXEE59Or68bc68Vbi-oyFMz3uMsXQfqrKbxQ7KR19-WF950eTpOUQVQ5rCMCiwIepUKaiBHWz0ZJm30BVwU9S0HTq4fWPlOo90lRCI1CLIUL6WaJRtxpqswLj5_MeVGMhrc4a5srWnDYqwMfcIWKqiipvPFRyNzB5VLvxwqiyitwovDS6D_q-_mn_zFi5fPBX0xq_0SgG0X7Sh3GSJQ8zDIxe6L3ksomwYFnNqH_KeFwivfxIIPte5u40_GxjM_7cxGG-Te8O8D3KachRNADu_Axrmf9PJuFA')
    if (auth.currentUser) {
        await store.dispatch('user/fetchProfile')
        await store.dispatch('view/updateView', store.state.user.profile.level)
    } else {
        const tokenAuth = Vue.$cookies.get('TOKEN_AUTH')
        if (!tokenAuth)
            location.href = 'https://creser.fuentedevida.com.mx/login?redirect=academia'

        const result = await store.dispatch('user/login', tokenAuth)
        if (result.error)
            location.href = 'https://creser.fuentedevida.com.mx/login?redirect=academia'
    }
})
