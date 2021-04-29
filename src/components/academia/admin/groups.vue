<template>
    <div class="mx-1">
        <v-row>
            <v-col class="d-flex">
                <p class="primary--text rounded-md my-auto mb-0 text-caption font-weight-bold">LISTA DE GRUPOS</p>
            </v-col>
            <v-col class="text-right">
                <v-btn 
                    color="primary"
                    @click="addNew"
                    >
                    Añadir
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col v-for="group in groups" :key="group.id" cols="12" md="6">
                <v-card>
                    <v-card-text>
                        <v-toolbar dense flat>
                            <p class="font-weight-bold my-auto">{{ group.name }}</p>
                            <v-spacer></v-spacer>
                            <v-btn icon color="primary" @click="openAddUsers(group.id)">
                                <v-icon>mdi-account-plus</v-icon>
                            </v-btn>
                            <v-btn icon color="primary" @click="editGroup(group.id)">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-row>
                            <v-col class="pa-1">
                                <v-list-item two-line>
                                    <v-list-item-avatar tile color="primary lighten-5" class="rounded">
                                        <v-icon color="primary"> mdi-calendar-range </v-icon>
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-subtitle class="text-caption">Inicio del curso</v-list-item-subtitle>
                                        <v-list-item-title class="text-caption font-weight-medium">{{ new Date(group.starts).toLocaleString() }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-col>
                            <v-col class="pa-1">
                                <v-list-item two-line>
                                    <v-list-item-avatar tile color="primary lighten-5" class="rounded">
                                        <v-icon color="primary"> mdi-calendar-range </v-icon>
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-subtitle class="text-caption">Fin del curso</v-list-item-subtitle>
                                        <v-list-item-title class="text-caption font-weight-medium">{{ new Date(group.ends).toLocaleString() }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="pa-1">
                                <v-list-item two-line>
                                    <v-list-item-avatar tile color="primary lighten-5" class="rounded">
                                        <v-icon color="primary"> mdi-teach </v-icon>
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-subtitle class="text-caption">Maestro</v-list-item-subtitle>
                                        <v-list-item-title class="text-caption font-weight-medium" v-if="group.teacher">{{ group.teacher.name }}</v-list-item-title>
                                        <v-list-item-title class="text-caption font-weight-medium" v-else>Sin maestro</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-col>
                            <v-col class="pa-1">
                                <v-list-item two-line>
                                    <v-list-item-avatar tile color="primary lighten-5" class="rounded">
                                        <v-icon color="primary"> mdi-account-supervisor-outline </v-icon>
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-subtitle class="text-caption">Numero de alumnos</v-list-item-subtitle>
                                        <v-list-item-title class="text-caption font-weight-medium" v-if="group.students">{{ group.students.length }}</v-list-item-title>
                                        <v-list-item-title class="text-caption font-weight-medium" v-else>0</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="form_group.open" max-width="600px">
            <formGroup :group="form_group.group" @close="closeForm"/>
        </v-dialog>

        <v-dialog v-model="add_user.open" max-width="600px">
            <addUserGroup :group="add_user.group" @close="closeAddUser"/>
        </v-dialog>
    </div>
</template>

<script>
import formGroup from './group_form'
import addUserGroup from './add_user_group'
import { mapActions, mapState } from 'vuex'
export default {
    name:'groups',
    components: { formGroup, addUserGroup },
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
            add_user: {
                group: null,
                open: false
            }
        }
    },
    methods: {
        ...mapActions({
            getGroups: 'admin/fetchGroups'
        }),
        addNew(){
            this.form_group.group = null
            this.form_group.open = true
        },
        openAddUsers(id){
            const group = this.groups.find( g => g.id === id )
            this.add_user.group = group
            this.add_user.open = true
        },
        closeAddUser(){
            this.add_user.group = null
            this.add_user.open = false
        },
        editGroup(id){
            const group = this.groups.find( g => g.id === id )
            this.form_group.group = group
            this.form_group.open = true
        },
        closeForm(){
            this.form_group.group = null
            this.form_group.open = false
        }
    },
    mounted() {
        this.getGroups()
    },
}
</script>