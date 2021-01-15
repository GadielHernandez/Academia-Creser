import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#118ec9',
                secondary: '#11b9c9',
                tertiary: '#3f51b5',
                accent: '#f12b53',
                background: '#F0F2F4'
            },
        },
        options: {
            customProperties: true,
        },
    },
});
