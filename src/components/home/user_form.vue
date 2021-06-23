<template>
    <v-card>
        <v-toolbar outlined flat>
            <span class="text-h6" v-if="user">Editar persona</span>
            <span class="text-h6" v-else> Nueva persona </span>

            <v-spacer></v-spacer>

            <v-btn icon @click="close">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card-text>
            <v-row>
                <v-col class="pb-0">
                    <p
                        class="secondary--text rounded-md ma-0 text-caption font-weight-bold"
                    >
                        NOMBRE
                    </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field
                        v-model="name"
                        placeholder="Nombre completo"
                        solo
                        outlined
                        flat
                        hide-details
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pb-0">
                    <p class="secondary--text rounded-md ma-0 text-caption font-weight-bold">
                        NOMBRE CORTO
                    </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field
                        v-model="nickname"
                        placeholder="Nombre con el que se saluda a la persona"
                        solo
                        outlined
                        flat
                        hide-details
                    />
                </v-col>
            </v-row>
            <v-row v-if="!user">
                <v-col class="pb-0">
                    <p class="secondary--text rounded-md ma-0 text-caption font-weight-bold">
                        EMAIL
                    </p>
                </v-col>
            </v-row>
            <v-row v-if="!user">
                <v-col>
                    <v-text-field
                        v-model="email"
                        placeholder="example@gmail.com"
                        type="email"
                        solo
                        outlined
                        flat
                        hide-details
                    />
                </v-col>
            </v-row>
            <v-row v-if="!user">
                <v-col class="pb-0">
                    <p class="secondary--text rounded-md ma-0 text-caption font-weight-bold">
                        CONTRASEÑA
                    </p>
                </v-col>
            </v-row>
            <v-row v-if="!user">
                <v-col>
                    <v-text-field
                        v-model="password"
                        solo
                        outlined
                        flat
                        hide-details
                        :type="showpass ? 'text' : 'password'"
                        :append-icon="showpass ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="showpass = !showpass"
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pb-0">
                    <p class="secondary--text rounded-md ma-0 text-caption font-weight-bold">
                        SEXO
                    </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-select
                        v-model="gender"
                        solo
                        outlined
                        flat
                        hide-details
                        :items="[{
                            text: 'Mujer',
                            value: WOMAN
                        },{
                            text: 'Hombre',
                            value: MAN
                        }]"
                    ></v-select>
                </v-col>
            </v-row>
            <v-alert type="warning" v-if="error.show">
                {{ error.value }}
            </v-alert>
            <v-row class="mt-3">
                <v-col>
                    <v-btn v-if="!user" color="primary" block :loading="saving" :disabled="name === '' || email == '' || nickname == '' || password == '' || gender == ''" @click="save">
                        Guardar
                    </v-btn>
                    <v-btn v-else color="primary" block :loading="saving" :disabled="name === '' || nickname == '' || gender == ''" @click="save">
                        Guardar
                    </v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-btn block @click="close">
                        Cancelar
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import { USER } from  '../../plugins/user-types'
import { MAN, WOMAN } from '../../plugins/gender-types'
import { mapActions } from 'vuex';
export default {
    name: 'user_form',
    props: ['user'],
    data() {
        return {
            email: '',
            name: '',
            nickname: '',
            password: '',
            gender: '',
            showpass: false,
            error: {
                show: false,
                value: ''
            },
            saving: false,
            MAN, WOMAN
        }
    },
    methods: {
        ...mapActions({
            addUser: 'admin/addUser',
            editUser: 'admin/updateUser'
        }),
        async save(){
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(!re.test(String(this.email).toLowerCase())){
                this.error.show = true
                this.error.value = 'El correo no es valido'
                return
            }
            this.saving = true
            try {
                if(this.user)
                    await this.editUser({
                        id: this.user.id,
                        name: this.name,
                        nickname: this.nickname,
                        gender: this.gender
                    })
                else    
                    await this.addUser({
                        email: this.email,
                        password: this.password,
                        name: this.name,
                        level: USER,
                        nickname: this.nickname,
                        gender: this.gender
                    })
                this.close()
            } catch (error) {
                if(error){
                    this.error.value = error.message
                    this.error.show = true
                }
            }
            this.saving = false
        },
        reset(){
            this.email = ''
            this.name = ''
            this.nickname = ''
            this.password = ''
            this.gender = ''
        },
        close() {
            this.reset()
            this.$emit('close')
        }
    },
    watch:{
        user(){
            if(this.user){
                this.email = this.user.email
                this.name = this.user.name
                this.nickname = this.user.nickname
                this.gender = this.user.gender
            }
        }
    }
}
</script>