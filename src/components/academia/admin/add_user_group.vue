<template>
    <div>
        <v-card>
            <div class="py-4 px-4">
                <p class="primary--text text-caption font-weight-bold">BUSCAR ALUMNOS POR EMAIL</p>
                <v-row>
                    <v-col cols="9" md="10">
                        <v-text-field
                            v-model="email"
                            placeholder="email"
                            hide-details
                            solo
                        />
                    </v-col>
                    <v-col cols="3" md="2">
                        <v-btn block color="primary" style="height: 100%" @click="findUser">
                            <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </div>
            <v-divider></v-divider>
            <v-card-text style="min-height: 100px;">
                <v-list v-if="user && !not_found">
                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon>mdi-account</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>{{user.name}}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-content>
                            <v-list-item-title>{{user.email}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <div class="text-center py-6" v-if="not_found">
                    <v-icon>mdi-at</v-icon>
                    <p class="ma-0">Correo no registrado</p>
                </div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="px-4">
                <v-spacer></v-spacer>
                <v-btn @click="close">Cancelar</v-btn>
                <v-btn color="primary" :disabled="!user" :loading="saving" @click="save">Guardar</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
import { USER } from '../../../plugins/user-types'
import { mapActions } from 'vuex'
export default {
    name: 'addUserGroup',
    props: ['group'],
    data() {
        return {
            email: null,
            user: null,
            not_found: false,
            saving: false
        }
    },
    methods: {
        ...mapActions({
            fetchUser: 'admin/fetchUser',
            addUserGroup: 'admin/addUserGroup'
        }),
        async findUser(){
            try {
                const user = await this.fetchUser(this.email)
                if(user === null)
                    this.not_found = true
                else if(user.level !== USER)
                    this.not_found = true
                else{
                    this.not_found = false
                    this.user = user
                }
            } catch (error) {
                console.log(error)
            }
        },
        async save(){
            if(this.group.students){
                const exist = this.group.students.find( student => student.id === this.user.id)
                if(exist) return
            }
            this.saving = true
            await this.addUserGroup({
                group: this.group.id,
                user: {
                    email: this.user.email,
                    id: this.user.id,
                    name: this.user.name
                }
            })
            this.saving = false
            this.close()
        },
        close(){
            this.email = null
            this.user = null
            this.$emit('close')
        }
    },
}
</script>