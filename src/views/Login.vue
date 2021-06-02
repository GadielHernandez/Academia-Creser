<template>
    <div class="d-flex login ma-0">
        <v-card width="350px" class="ma-auto rounded-lg">
            <v-img 
                src="@/assets/logo-circle.png" 
                height="80px"
                contain
                class="logo"
            ></v-img>
            <v-card-text class="px-9 py-6">
                <v-text-field
                    v-model="email"
                    label="Email"
                    type="email"
                    hide-details
                    outlined
                    flat
                    solo
                ></v-text-field>
                <v-text-field
                    v-model="password"
                    label="Contraseña"
                    type="password"
                    class="mt-3"
                    hide-details
                    outlined
                    flat
                    solo
                ></v-text-field>
                <v-alert dense type="error" v-if="error" class="mt-3">
                    {{error}}
                </v-alert>
                <v-btn block class="mt-12" color="primary" @click="login">
                    Login
                </v-btn>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    name: 'Login',
    data() {
        return {
            email: '',
            password: '',
            error: null
        }
    },
    methods: {
        ...mapActions({ doLogin: 'user/login' }),
        async login(){
            try {
                this.error = null
                await this.doLogin({
                    email: this.email,
                    password: this.password
                })
                this.$router.push({ name: 'Home' })
            } catch (error) {
                if(error.message)
                    this.error = error.message
            }
        }
    },
}
</script>

<style>
.login{
    height: 100%;
    width: 100%;
    background: rgb(5,188,205);
    background: linear-gradient(151deg, rgba(5,188,205,1) 27%, rgba(62,118,218,1) 94%);
}
.logo{
    margin-top: 30px;
    margin-bottom: 10px;
}
</style>