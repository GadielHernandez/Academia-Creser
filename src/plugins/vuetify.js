import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#2bb20f',
                secondary: '#262c33',
                tertiary: '#ffffff',
                accent: '#997650',
                background: '#fafaf8'
            },
        },
        options: {
            customProperties: true,
        },
    },
});
