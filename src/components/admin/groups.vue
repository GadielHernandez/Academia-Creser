<template>
    <div class="mx-1">
        <v-row>
            <v-col class="d-flex">
                <p class="secondary--text rounded-md my-auto mb-0 text-caption font-weight-bold">LISTA DE GRUPOS</p>
            </v-col>
            <v-col class="text-right">
                <v-btn 
                    dark
                    color="academia-primary"
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
                            <v-btn icon @click="listUsers(group.id)">
                                <v-icon>mdi-account-details</v-icon>
                            </v-btn>
                            <v-btn icon @click="editGroup(group.id)">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-row>
                            <v-col class="pa-1">
                                <v-list-item two-line>
                                    <v-list-item-avatar tile color="academia-secondary" class="rounded">
                                        <v-icon color="white"> mdi-calendar-range </v-icon>
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-subtitle class="text-caption">Inicio del curso</v-list-item-subtitle>
                                        <v-list-item-title class="text-caption font-weight-medium">{{ new Date(group.starts).toLocaleString() }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-col>
                            <v-col class="pa-1">
                                <v-list-item two-line>
                                    <v-list-item-avatar tile color="academia-secondary" class="rounded">
                                        <v-icon color="white"> mdi-calendar-range </v-icon>
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
                                    <v-list-item-avatar tile color="academia-secondary" class="rounded">
                                        <v-icon color="white"> mdi-teach </v-icon>
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
                                    <v-list-item-avatar tile color="academia-secondary" class="rounded">
                                        <v-icon color="white"> mdi-account-supervisor-outline </v-icon>
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

        <v-dialog v-model="list_user.open" max-width="600px">
            <listUsers :group="list_user.group" @close="closeListUsers"/>
        </v-dialog>
    </div>
</template>

<script>
import formGroup from './group_form'
import listUsers from './users_groups'
import { mapActions, mapState } from 'vuex'
export default {
    name:'groups',
    components: { formGroup, listUsers },
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