<template>
    <div class="d-flex login ma-0">
        <div class="ma-auto" :class="{ 'center': $vuetify.breakpoint.mdAndUp }">
            <v-img 
                src="@/assets/logo.png" 
                width="100%"
                max-width="90vw"
                contain
            ></v-img>
            <v-card width="100%" class="ma-auto rounded-lg">
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
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import { auth } from '@/plugins/firebase'
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
                await auth.signInWithEmailAndPassword(this.email, this.password)

                // this.$router.push({ name: 'Home' })
            } catch (error) {
                if(error.message)
                    this.error = error.message
            }
        }
    },
    mounted() {
        console.log('mounted')
    },
}
</script>

<style scoped>
.login{
    height: 100%;
    width: 100%;
    background-image: url('~@/assets/background-login.png');
    background-color: var(--v-secondary-base);
}
.center{
    width: 350px;
}
</style>