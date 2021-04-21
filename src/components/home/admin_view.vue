<!-- eslint-disable -->
<template>
    <div class="px-4">
        <v-card light flat outlined>
            <div class="pa-5">
                <v-row>
                    <v-col cols="4" md="2" class="font-weight-bold text-center text-h2 d-flex">
                        <span class="ma-auto">&#128075</span>
                    </v-col>
                    <v-col cols="8" md="10">
                        <p class="text-h5 mb-0">¡<span class="font-weight-bold">Hola</span> {{ profile.nickname }}!</p>
                        <p class="mt-3 mb-0">Bienvenido nuevamente a la plataforma de fuente de vida, es un gusto tener de nuevo por acá</p>
                    </v-col>
                </v-row>
            </div>
        </v-card>
        <div v-if="users" class="mt-3">
            <v-row>
                <v-col>
                    <p class="primary--text text-caption font-weight-bold my-auto mb-0">LISTA DE ALUMNOS</p>
                </v-col>
                <v-col class="text-right">
                    <v-btn color="primary" @click="openForm">
                        Agregar
                    </v-btn>
                </v-col>
            </v-row>
            <v-card>
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th></th>
                                <th class="text-left">Nombre</th>
                                <th class="text-left">Nombre corto</th>
                                <th class="text-left">Correo</th>
                                <th class="text-center">Nivel</th>
                                <th></th>
                            </tr>
                        </thead>
                    <tbody>
                        <tr v-for="user in users" :key="user.id">
                            <td>
                                <v-avatar color="tertiary" size="37" v-if="user.gender === WOMAN">
                                    <v-icon dark>mdi-face-woman</v-icon>
                                </v-avatar>
                                <v-avatar color="tertiary" size="37" v-else>
                                    <v-icon dark>mdi-face</v-icon>
                                </v-avatar>
                            </td>
                            <td>{{ user.name }}</td>
                            <td>{{ user.nickname }}</td>
                            <td>{{ user.email }}</td>
                            <td v-if="user.level === ADMIN" class="text-center"> 
                                <span class="primary--text text-caption">Admin</span> 
                            </td>
                            <td v-if="user.level === TEACHER" class="text-center">
                                <span class="primary--text text-caption">Maestro</span> 
                            </td>
                            <td v-if="user.level === USER"></td>
                            <td>
                                <v-btn icon color="primary" @click="openForm(user.id)">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="before">
                        <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn icon class="mr-5" @click="next">
                        <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </div>
        <v-progress-circular
            v-else
            :size="60"
            :width="7"
            color="primary"
            class="ma-auto"
            indeterminate
        ></v-progress-circular>
        <v-dialog v-model="form_user.open" max-width="600px">
            <formUser :user="form_user.user" @close="closeForm"/>
        </v-dialog>
    </div>
</template>
<!-- eslint-enable -->

<script>
import { mapActions, mapState } from 'vuex'
import { ADMIN, USER, TEACHER } from '../../plugins/user-types'
import { WOMAN } from '../../plugins/gender-types'
import formUser from '../home/user_form'
export default {
    name: 'Home',
    components: { formUser },
    computed:{
        ...mapState({ 
            profile: state => state.user.profile
         })
    },
    data() {
        return {
            indexList: 0,
            listInits: [],
            users: [],
            form_user: {
                open: false,
                user: null
            },
            ADMIN, USER, TEACHER, WOMAN
        }
    },
    methods: {
        ...mapActions({
            getListData: 'admin/fetchListUsers'
        }),
        async before(){
            if(this.indexList === 0) return
            this.indexList--
            const users = await this.getListData(this.listInits[this.indexList])
            if(users.length === 0) return
            this.users = users
        },
        async next(){
            if(this.users.length < 20) return
            const users = await this.getListData(this.users[this.users.length - 1].email)
            if(users.length === 0) return
            this.users = users
            this.listInits.push(this.users[0].email)
            this.indexList++
        },
        openForm(user){
            if(user)
                this.form_user.user = this.users.find( u => u.id === user )
            else
                this.form_user.user = null
            
            this.form_user.open = true
        },
        async closeForm(){
            const users = await this.getListData(this.listInits[this.indexList])
            if(users.length === 0) return
            this.users = users

            this.form_user.user = null
            this.form_user.open = false
        }
    },
    async mounted() {
        this.users = await this.getListData()
        this.listInits.push(this.users[0].email)
    },
}
</script>

<style scoped>

</style>