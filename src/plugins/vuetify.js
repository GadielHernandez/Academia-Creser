import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#3e76da',
                secondary: '#05bccd',
                accent: '#782ee7',
                background: '#F0F2F4'
            },
        },
        options: {
            customProperties: true,
        },
    },
});
