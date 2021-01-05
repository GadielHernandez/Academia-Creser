<template>
    <div class="d-flex container login">
        <v-card width="350px" class="ma-auto rounded-lg">
            <v-img 
                src="@/assets/logo.png" 
                height="100px"
                contain
                class="mt-6"
            ></v-img>
            <v-card-text class="px-9 py-6">
                <v-text-field
                    label="Email"
                    type="email"
                    hide-details
                    outlined
                    flat
                    solo
                ></v-text-field>
                <v-text-field
                    label="Contraseña"
                    type="password"
                    class="mt-3"
                    hide-details
                    outlined
                    flat
                    solo
                ></v-text-field>
                <v-btn block class="mt-12" color="primary">
                    Login
                </v-btn>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
export default {
    name: 'Login'
}
</script>

<style>
.login{
    background: rgb(5,188,205);
    background: linear-gradient(151deg, rgba(5,188,205,1) 27%, rgba(62,118,218,1) 94%);
}
</style>