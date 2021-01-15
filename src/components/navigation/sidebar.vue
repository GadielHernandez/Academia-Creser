<template>
    <div style="height: 100%">
        <v-list-item class="px-2 py-3 logo">
            <v-list-item-avatar>
                <v-img
                    src="@/assets/logo.png"
                ></v-img>
            </v-list-item-avatar>

            <v-list-item-title>FUENTE DE VIDA</v-list-item-title>
        </v-list-item>

        <v-list nav class="menu">
            <v-list-item-group mandatory class="group" active-class="selected">
                <v-list-item class="" dense @click="$router.push({ name: 'Home' })">
                    <v-list-item-icon>
                        <v-icon>mdi-home</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>Inicio</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item class="" dense @click="$router.push({ name: 'Academia' })">
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
.logo{
    height: 10%;
}

.menu{
    height: 80%;
    display: flex;
}
.group{
    width: 100%;
    margin: auto;
}

.selected{
    color: var(--v-primary-base)
}
</style>
