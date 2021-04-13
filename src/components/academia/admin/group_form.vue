<template>
    <v-card>
        <v-toolbar outlined flat>
            <span class="text-h6" v-if="group">Editar grupo</span>
            <span class="text-h6" v-else> Nueva clase </span>

            <v-spacer></v-spacer>

            <v-btn icon @click="close">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card-text>
            <v-row>
                <v-col class="pb-0">
                    <p
                        class="primary--text rounded-md ma-0 text-caption font-weight-bold"
                    >
                        NOMBRE
                    </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field
                        v-model="name"
                        solo
                        outlined
                        flat
                        hide-details
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <p class="primary--text rounded-md ma-0 text-caption font-weight-bold">
                        FECHA DE INICIO
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
                    <p class="primary--text rounded-md ma-0 text-caption font-weight-bold">
                        FECHA DE FIN
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
                    <p class="primary--text rounded-md ma-0 text-caption font-weight-bold">
                        MAESTRO
                    </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pb-0">
                    <v-card outlined>
                        <v-card-text class="pb-0">
                            <v-toolbar v-if="teacher" outlined flat class="mb-3">
                                <p class="ma-0">
                                    <span class="primary--text font-weight-bold">NOMBRE: </span> {{teacher.name}}
                                </p>
                            </v-toolbar>
                            <v-text-field
                                v-model="emailTeacher"
                                placeholder="Buscar por email"
                                solo
                                outlined
                                flat
                                hide-details
                            />
                        </v-card-text>
                        <v-card-actions>
                            <v-btn text color="primary ml-3" @click="findTeacher">Buscar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-btn @click="saveChanges" color="primary" block :disabled="name === '' || starts.value == null || ends.value == null || teacher == null">
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
import { TEACHER } from '../../../plugins/user-types'
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
            teacher: null
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
            if(this.group.id)
                await this.editGroup({
                    id: this.group.id,
                    name: this.name,
                    starts: start.getTime(),
                    ends: end.getTime(),
                    teacher: {
                        name: this.teacher.name,
                        id: this.teacher.id
                    }
                })
            else
                await this.addGroup({
                    name: this.name,
                    starts: start.getTime(),
                    ends: end.getTime(),
                    teacher: {
                        name: this.teacher.name,
                        id: this.teacher.id
                    }
                })
            this.close()
        },
        async findTeacher(){
            if(!this.emailTeacher) return
            const user = await this.findUser(this.emailTeacher)
            if(user.level !== TEACHER) return
            this.teacher = user
        },
        setGroup() {
            const starts = new Date(this.group.starts)
            const ends = new Date(this.group.ends)
            starts.setHours(starts.getHours() - (starts.getTimezoneOffset() / 60) )
            ends.setHours(ends.getHours() - (ends.getTimezoneOffset() / 60) )

            this.name = this.group.name
            this.starts.value = starts.toISOString().substr(0, 10)
            this.ends.value = ends.toISOString().substr(0, 10)
            this.teacher = this.group.teacher
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
        this.setGroup()
    },
}
</script>
