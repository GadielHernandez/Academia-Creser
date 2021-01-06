<template>
    <div>
        <v-list-item class="px-2 py-3">
            <v-list-item-avatar>
                <v-img
                    src="@/assets/logo.png"
                ></v-img>
            </v-list-item-avatar>

            <v-list-item-title class="white--text">FUENTE DE VIDA</v-list-item-title>
        </v-list-item>

        <v-list dark nav>
            <v-list-item-group mandatory active-class="selected">
                <v-list-item dense @click="$router.push({ name: 'Home' })">
                    <v-list-item-icon>
                        <v-icon>mdi-home</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>Inicio</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item dense @click="$router.push({ name: 'Academia' })">
                    <v-list-item-icon>
                        <v-icon>mdi-school</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>Academia</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </div>
</template>

<style scoped>
.v-list-item{
    color: white !important;
}
.selected{
    
    background-color: var(--v-secondary-base)
}
</style>
