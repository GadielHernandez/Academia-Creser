<template>
    <div class="mx-1">
        <v-toolbar flat>
            <v-spacer></v-spacer>
            <v-btn color="primary" small @click="addNew">
                Crear grupo
            </v-btn>
        </v-toolbar>
        <v-row v-if="groups != null">
            <v-col v-for="group in groups" :key="group.id" cols="12" md="6">
                <v-card>
                    <v-list-item>
                        <v-list-item-avatar color="primary">
                            <v-icon dark>mdi-account</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ group.name }}
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                <span v-if="group.active">
                                    Activo
                                </span>
                                <span v-else>
                                    Cerrado
                                </span>
                            </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-icon color="success" v-if="group.active">
                                mdi-checkbox-blank-circle
                            </v-icon>
                            <v-icon v-else>
                                mdi-checkbox-blank-circle
                            </v-icon>
                        </v-list-item-action>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-toolbar dense flat class="text-caption">
                        <span>Duración del grupo:</span>
                        <v-spacer></v-spacer>
                        <span >
                            {{ new Date(group.starts).toLocaleString() }} 
                            <v-icon>mdi-arrow-right-thin</v-icon> 
                            {{ new Date(group.ends).toLocaleString() }}
                        </span>
                    </v-toolbar>
                    <v-divider></v-divider>
                    <v-toolbar dense flat class="text-caption">
                        <span>Alumnos registrados:</span>
                        <v-spacer></v-spacer>
                        <span v-if="group.students">
                            {{ group.students.length }}
                        </span>
                    </v-toolbar>
                    <v-divider></v-divider>
                    <v-toolbar dense flat class="text-caption">
                        <span>Maestros:</span>
                        <v-spacer></v-spacer>
                        <span v-if="group.teachers">
                            {{ group.teachers.map( t => t.name ).join(', ') }}
                        </span>
                    </v-toolbar>
                    
                    <v-card-text>
                        <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    color="secondary"
                                    block
                                    v-bind="attrs"
                                    v-on="on"
                                >
                                Configuraciones
                                </v-btn>
                            </template>
                            <v-list dense>
                                <v-list-item @click="editGroup(group.id)" :disabled="!group.active">
                                    <v-list-item-content>
                                        Editar grupo
                                    </v-list-item-content>
                                    <v-list-item-action>
                                        <v-icon>
                                            mdi-pencil
                                        </v-icon>
                                    </v-list-item-action>
                                </v-list-item>
                                <v-list-item @click="listUsers(group.id)" >
                                    <v-list-item-content>
                                        Administrar alumnos
                                    </v-list-item-content>
                                    <v-list-item-action>
                                        <v-icon>
                                            mdi-account-details
                                        </v-icon>
                                    </v-list-item-action>
                                </v-list-item>
                                <v-divider></v-divider>
                                <v-list-item >
                                    <v-list-item-content class="red--text" :disabled="!group.active">
                                        Cerrar grupo
                                    </v-list-item-content>
                                    <v-list-item-action>
                                        <v-icon color="red">
                                            mdi-close-circle-outline
                                        </v-icon>
                                    </v-list-item-action>
                                </v-list-item>
                                <v-list-item @click="openDeleteConfirmation(group)">
                                    <v-list-item-content class="red--text">
                                        Elminar grupo
                                    </v-list-item-content>
                                    <v-list-item-action>
                                        <v-icon color="red">
                                            mdi-delete
                                        </v-icon>
                                    </v-list-item-action>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row v-else class="d-flex loading">
            <v-progress-circular
                :size="60"
                :width="7"
                color="primary"
                class="ma-auto"
                indeterminate
            ></v-progress-circular>
        </v-row>

        <v-dialog v-model="form_group.open" max-width="600px">
            <formGroup :group="form_group.group" @close="closeForm"/>
        </v-dialog>

        <v-dialog v-model="list_user.open" max-width="600px">
            <listUsers :group="list_user.group" @close="closeListUsers"/>
        </v-dialog>

        <deleteGroup :group="groupToDelete" @close="groupToDelete = null"/>
    </div>
</template>

<script>
import formGroup from './group_form'
import listUsers from './users_groups'
import deleteGroup from './delete_group.vue'
import { mapState } from 'vuex'
export default {
    name:'groups',
    components: { formGroup, listUsers, deleteGroup },
    computed:{
        ...mapState({
            groups: state => state.admin.groups
        })
    },
    data() {
        return {
            form_group: {
                group: null,
                open: false
            },
            list_user: {
                group: null,
                open: false
            },
            groupToDelete: null
        }
    },
    methods: {
        addNew(){
            this.form_group.group = null
            this.form_group.open = true
        },
        listUsers(id){
            const group = this.groups.find( g => g.id === id )
            this.list_user.group = group
            this.list_user.open = true
        },
        closeListUsers(){
            this.list_user.group = null
            this.list_user.open = false
        },
        editGroup(id){
            const group = this.groups.find( g => g.id === id )
            this.form_group.group = group
            this.form_group.open = true
        },
        openDeleteConfirmation(group){
            this.groupToDelete = group
        },
        closeForm(){
            this.form_group.group = null
            this.form_group.open = false
        }
    }
}
</script>

<style scoped>
.empty{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 85vh;
}
</style>