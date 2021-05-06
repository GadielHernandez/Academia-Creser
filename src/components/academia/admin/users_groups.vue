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
            <v-card-text style="min-height: 600px;" v-if="group">
                <v-list v-if="group.students">
                    <v-list-item v-for="student in group.students" :key="student.id" dense>
                        <v-list-item-icon>
                            <v-icon>mdi-account</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>{{student.name}}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-content>
                            <v-list-item-title>{{student.email}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
        <v-dialog v-model="add_user.open" max-width="600px">
            <formAddUser :group="add_user.group" @close="closeAdd"/>
        </v-dialog>
    </div>
</template>

<script>
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
            }
        }
    },
    methods: {
        openAdd(){
            this.add_user.group = this.group
            this.add_user.open = true
        },
        closeAdd(){
            this.add_user.open = false
            this.add_user.group = null
        }
    },
}
</script>