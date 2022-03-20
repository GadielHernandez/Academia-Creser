<template>
    <v-app-bar
        outlined
        color="white" 
        flat
        class="px-0 py-3 navbar"
        height="unset"
    >
        <slot name="title" />
        
        <v-spacer></v-spacer>

        <v-menu
            :close-on-content-click="false"
            :nudge-width="200"
            offset-y
        >
            <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon>
                    <v-avatar>
                        <v-icon>mdi-account-circle</v-icon>
                    </v-avatar>
                </v-btn>
            </template>

            <v-card>
                <v-card-text class="text-center">
                    <v-icon x-large class="py-3" color="secondary">mdi-account-circle</v-icon>
                    <p class="my-1 font-weight-bold">{{ profile.name }}</p>
                    <p class="my-1">{{ profile.email }}</p>
                </v-card-text>
                <v-list dense nav outlined>
                    <v-list-item @click="logout">
                        <v-list-item-content>
                            <v-list-item-title>Cerrar sesión</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-icon>
                            <v-icon>mdi-logout-variant</v-icon>
                        </v-list-item-icon>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-menu>
    </v-app-bar>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
    name: 'navbar',
    props: ['height'],
    computed:{
        ...mapState({ profile: state => state.user.profile })
    },
    methods: {
        ...mapActions({ doLogout: 'user/logout' }),
        async logout(){
            try {
                await this.doLogout()
                this.$router.push({ name: 'Login' })
            } catch (error) {
                console.log(error)
            }
        }
    },
}
</script>

<style scoped>
header.navbar > div{
    padding-left: 0 !important;
    padding-right: 0;
}
</style>