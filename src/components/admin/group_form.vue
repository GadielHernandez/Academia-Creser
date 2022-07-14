<template>
    <v-card>
        <v-toolbar flat>
            <span class="text-h6 ml-2" v-if="group">Editar grupo</span>
            <span class="text-h6 ml-2" v-else> Nueva clase </span>

            <v-spacer></v-spacer>

            <v-btn icon @click="close">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
            <v-row>
                <v-col class="pb-0">
                    <p class="ma-0 font-weight-bold">
                        Nombre
                    </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col >
                    <v-text-field
                        v-model="name"
                        color="primary"
                        solo
                        outlined
                        flat
                        hide-details
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pb-0">
                    <p class="ma-0 font-weight-bold">
                        Fecha de inicio
                    </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-menu
                        ref="start"
                        v-model="starts.menu"
                        :close-on-content-click="false"
                        :return-value.sync="starts.value"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="starts.value"
                                append-icon="mdi-calendar-blank"
                                color="primary"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                solo
                                flat
                                outlined
                                hide-details
                            ></v-text-field>
                        </template>
                        <v-date-picker v-model="starts.value" no-title scrollable>
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="starts.menu = false">Cancel</v-btn>
                            <v-btn
                                text
                                color="primary"
                                @click="$refs.start.save(starts.value)"
                            >
                                OK
                            </v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pb-0">
                    <p class="ma-0 font-weight-bold">
                        Fecha de fin
                    </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-menu
                        ref="ends"
                        v-model="ends.menu"
                        :close-on-content-click="false"
                        :return-value.sync="ends.value"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="ends.value"
                                append-icon="mdi-calendar-blank"
                                color="primary"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                solo
                                flat
                                outlined
                                hide-details
                            ></v-text-field>
                        </template>
                        <v-date-picker v-model="ends.value" no-title scrollable>
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="ends.menu = false">Cancel</v-btn>
                            <v-btn
                                text
                                color="primary"
                                @click="$refs.ends.save(ends.value)"
                            >
                                OK
                            </v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pb-0">
                    <p class="ma-0 font-weight-bold">
                        Maestros
                    </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pb-0">
                    <v-card outlined>
                        <v-toolbar flat>
                            <v-text-field
                                v-model="emailTeacher"
                                placeholder="Agregar por email"
                                color="primary"
                                solo
                                outlined
                                flat
                                hide-details
                                dense
                            />
                            <v-spacer></v-spacer>
                             <v-btn color="secondary" @click="findTeacher">Agregar</v-btn>
                        </v-toolbar>
                        <v-divider></v-divider>
                        <v-card-text class="pa-0 pb-1">
                            <v-list v-if="teachers && teachers.length > 0">
                                <v-list-item v-for="teacher in teachers" :key="teacher.id" dense>
                                    <v-list-item-avatar color="secondary">
                                        <v-icon dark>mdi-account</v-icon>
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                        {{teacher.name}}
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="close" color="primary">
                Cancelar
            </v-btn>
            <v-btn @click="saveChanges"  color="primary"  :disabled="name === '' || starts.value == null || ends.value == null || teachers.length === 0">
                Guardar
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { TEACHER } from '../../plugins/user-types'
import { mapActions } from 'vuex'
export default {
    name: 'GroupForm',
    props: ['group'],
    computed: {},
    data() {
        return {
            name: '',
            starts: {
                menu: null,
                value: null
            },
            ends: {
                menu: null,
                value: null
            },
            emailTeacher: null,
            teachers: []
        }
    },
    methods: {
        ...mapActions({ 
            findUser: 'admin/fetchUser',
            addGroup: 'admin/addGroup',
            editGroup: 'admin/updateGroup'
        }),
        async saveChanges() {
            const start = new Date(this.starts.value)
            const end = new Date(this.ends.value)
            start.setHours(0,0,0,0)
            end.setHours(0,0,0,0)
            if(this.group && this.group.id)
                await this.editGroup({
                    id: this.group.id,
                    name: this.name,
                    starts: start.getTime(),
                    ends: end.getTime(),
                    teachers: this.teachers
                })
            else
                await this.addGroup({
                    name: this.name,
                    starts: start.getTime(),
                    ends: end.getTime(),
                    teachers: this.teachers,
                    active: true
                })
            this.close()
        },
        async findTeacher(){
            if(!this.emailTeacher) return
            const user = await this.findUser(this.emailTeacher)
            if(!user) return

            const alreadyTeacher = this.teachers.find( t => t.id === user.id )
            if(alreadyTeacher) return 

            if(user.level !== TEACHER) return
            this.teachers.push({
                id: user.id, 
                name: user.name
            })
        },
        setGroup() {
            const starts = new Date(this.group.starts)
            const ends = new Date(this.group.ends)
            starts.setHours(starts.getHours() - (starts.getTimezoneOffset() / 60) )
            ends.setHours(ends.getHours() - (ends.getTimezoneOffset() / 60) )

            this.name = this.group.name
            this.starts.value = starts.toISOString().substr(0, 10)
            this.ends.value = ends.toISOString().substr(0, 10)
            this.teachers = this.group.teachers
            this.emailTeacher = null
        },
        close() {
            this.reset()
            this.$emit('close')
        },
        reset() {
            this.name = ''
            this.starts.menu = null
            this.starts.value = null
            this.ends.menu = null
            this.ends.value = null
            this.teacher = null
            this.emailTeacher = null
        },
    },
    watch: {
        group() {
            if (this.group) this.setGroup()
            else this.reset()
        },
    },
    mounted() {
        if (this.group)
            this.setGroup()
    },
}
</script>
