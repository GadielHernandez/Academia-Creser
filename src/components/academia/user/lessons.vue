<template>
    <div class="main-background mx-1">
        <v-row>
            <v-col cols="12" md="9" order-md="last">
                <youtube :video-id="'lVJ98KAdQQI'" :player-vars="{ modestbranding: 1, rel: 0, iv_load_policy: 3, showinfo: 0}" width="100%" height="100%"></youtube>
            </v-col>
            <v-col class="h-100" cols="12" md="3">
                <v-card>
                    <v-card-text class="pa-1 menu-lessons">
                        <v-list nav>
                            <v-list-item-group>
                                <v-list-item v-for="item in data" :key="item.name">
                                    <v-list-item-avatar color="primary">
                                        <v-icon class="white--text">mdi-clipboard-text</v-icon>
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-title>{{ item.name }}</v-list-item-title>
                                        <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list-item-group>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    name: 'Lessons',
    data() {
        return {
            data: [{
                name: 'Clase 1',
                description: 'Descripcion de la clase'
            },{
                name: 'Clase 2',
                description: 'Descripcion de la clase'
            },{
                name: 'Clase 3',
                description: 'Descripcion de la clase'
            },{
                name: 'Clase 4',
                description: 'Descripcion de la clase'
            },{
                name: 'Clase 6',
                description: 'Descripcion de la clase'
            },{
                name: 'Clase 7',
                description: 'Descripcion de la clase'
            },{
                name: 'Clase 8',
                description: 'Descripcion de la clase'
            },{
                name: 'Clase 9',
                description: 'Descripcion de la clase'
            },{
                name: 'Clase 10',
                description: 'Descripcion de la clase'
            },{
                name: 'Clase 11',
                description: 'Descripcion de la clase'
            },{
                name: 'Clase 12',
                description: 'Descripcion de la clase'
            },{
                name: 'Clase 13',
                description: 'Descripcion de la clase'
            }]
        }
    },
    methods: {
        playing() {
            console.log('we are watching!!!')
        }
    }
}
</script>

<style scoped>
.menu-lessons{
    height:70vh;
    overflow-y: scroll;
    -ms-overflow-style: none; 
    scrollbar-width: none; 
}
.menu-lessons::-webkit-scrollbar {
    display: none;
}
</style>