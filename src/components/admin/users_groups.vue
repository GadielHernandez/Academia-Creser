<template>
    <div>
        <v-card>
            <v-toolbar flat>
                <p class="text-h6 ma-0">Lista de alumnos</p>
                <v-spacer></v-spacer>
                <v-btn icon @click="openAdd" color="primary">
                    <v-icon>mdi-account-plus</v-icon>
                </v-btn>
                <v-btn icon @click="$emit('close')">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text style="min-height: 600px;" v-if="group" class="pt-0">
                <v-list v-if="group.students">
                    <template v-for="student in group.students">
                        <v-list-item  :key="student.id" dense>
                            <v-list-item-content>
                                <v-list-item-title>{{student.name}}</v-list-item-title>
                                <v-list-item-subtitle>{{student.email}}</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon @click="openDeleteConfirmation(student)">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                        <v-divider :key="student.email"></v-divider>
                    </template>
                </v-list>
            </v-card-text>
        </v-card>
        <v-dialog v-model="add_user.open" max-width="600px">
            <formAddUser :group="add_user.group" @close="closeAdd"/>
        </v-dialog>
        <v-dialog v-model="delete_user.open" max-width="600px">
            <v-card v-if="delete_user.user">
                <v-card-title>Remover usuario</v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pa-4">
                    ¿Estas seguro que quieres eliminar a {{ delete_user.user.name }} 
                    del grupo?, toda su informacion en el grupo sera eliminada. 
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="closeDeleteConfirmation">
                        Cancelar
                    </v-btn>
                    <v-btn color="primary" @click="deleteUser">
                        Eliminar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import formAddUser from './add_user_group'
export default {
    name:'userList',
    props: ['group'],
    components: { formAddUser },
    data() {
        return {
            add_user: {
                open: false,
                group: null
            },
            delete_user: {
                user: null,
                open: false
            }
        }
    },
    methods: {
        ...mapActions({
            deleteUserGruop: 'admin/deleteUserGroup'
        }),
        openAdd(){
            this.add_user.group = this.group
            this.add_user.open = true
        },
        closeAdd(){
            this.add_user.open = false
            this.add_user.group = null
        },
        openDeleteConfirmation(user){
            this.delete_user.user = user
            this.delete_user.open = true
        },
        closeDeleteConfirmation(){
            this.delete_user.user = null
            this.delete_user.open = false
        },
        async deleteUser(){
            await this.deleteUserGruop({
                group: this.group.id,
                user: this.delete_user.user
            })
            this.closeDeleteConfirmation()
        }
    },
}
</script>