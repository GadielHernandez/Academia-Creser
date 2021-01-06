<template>
    <div>
        <v-menu
            :close-on-content-click="false"
            :nudge-width="200"
            offset-y
        >
            <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon>
                    <v-icon>mdi-account-circle</v-icon>
                </v-btn>
            </template>

            <v-card>
                <v-list dense nav>
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
    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    name: 'navbar',
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