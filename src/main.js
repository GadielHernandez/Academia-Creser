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
    // Vue.$cookies.set('TOKEN_AUTH', 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTY1NzIyNjcwMiwiZXhwIjoxNjU3MjMwMzAyLCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1uNnBkM0BmZHYtd2ViLWFwcC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInN1YiI6ImZpcmViYXNlLWFkbWluc2RrLW42cGQzQGZkdi13ZWItYXBwLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwidWlkIjoidHdscjBTVE1iVFkxZ3ZhZHZNeGpwZXQxaWd3MSIsImNsYWltcyI6eyJleHBpcmVzSW4iOjE2NTk4MTg3MDI0ODd9fQ.G4TmgRTsCwP6K8pDogHEOQn4bJhHouBhDs5846-IPiwPPZxVPqbm8zmIXuc5io35Et0Yz_pJO0NCGxH5KJqUa1gDB88r2gtwLavlgZPHZGL2HJM7bKOe1woSf7JEglBS1d_Ax8UN6dWRLqGFyKGV1EYoQzlu6W8YjbVHqWTE2cOwIJCeYgGRmy4GolL4dWmYL49QXvyUt1uZgSRU3KzkpWJWVfrTX5v4-H6qB_Xuue4FyH3x_Ui2cQS_YZXZDRedmO9UKdPX9VGsaKGtJtywDhVhD8dgqxTlJ4iLlUkhXvCbscXQFef-_y0Wbew1pDKISUd0Sk6SNDwHxTCxjeUd-w')
    if (auth.currentUser) {
        await store.dispatch('user/fetchProfile')
        await store.dispatch('view/updateView', store.state.user.profile.level)
    } else {
        const tokenAuth = Vue.$cookies.get('TOKEN_AUTH')
        if (!tokenAuth)
            location.href = 'https://creser.fuentedevida.com.mx/logout'

        const result = await store.dispatch('user/login', tokenAuth)
        if (result.error)
            location.href = 'https://creser.fuentedevida.com.mx/logout'
    }
})
