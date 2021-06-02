import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#176cb0',
                secondary: '#11b9c9',
                tertiary: '#3f51b5',
                accent: '#f12b53',
                background: '#eee'
            },
        },
        options: {
            customProperties: true,
        },
    },
});
