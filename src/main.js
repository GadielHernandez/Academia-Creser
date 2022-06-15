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
    Vue.$cookies.set('TOKEN_AUTH', 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTY1NDAyMjcxNCwiZXhwIjoxNjU0MDI2MzE0LCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1uNnBkM0BmZHYtd2ViLWFwcC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInN1YiI6ImZpcmViYXNlLWFkbWluc2RrLW42cGQzQGZkdi13ZWItYXBwLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwidWlkIjoidHdscjBTVE1iVFkxZ3ZhZHZNeGpwZXQxaWd3MSIsImNsYWltcyI6eyJleHBpcmVzSW4iOjE2NTY2MTQ3MTQwNjN9fQ.fVBKPWfaIWvdJJcB_WMzqwC2N1gFDd1z6u9e--gMs7zNsbRs8Z1TrP-tWJDEpT-6V_ibrQA8c9PgweuzUdTXvZqPW18FmokGq54kSef2_cZONwhQXHr4LdWBCTaNKTMO9n7AqUIDvh5NXdEmTRw2N0ej-PQojH_MccqNU3m4GHp-FhTrnavRJOs7-F3oz4X6dNvEs65wyYhp9ItJdZwqI21OxzASS9mhtTc99l-AViSgS6456h64ngyDI78huTEfpPXAzLzTdUDiaThjkQUpOPgJy0Uwq_5Eq1-p7aFQcDPRSTzmo5KE-m2rAhg8zV6iRM2LdcHU60Zu7Fk3OZMOMg')
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
