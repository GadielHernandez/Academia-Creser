<template>
    <div class="mx-1">
        <v-row>
            <v-col>
                <p class="secondary--text rounded-md ma-0 text-caption font-weight-bold">NOMBRE</p>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="pt-0">
                <v-card>
                    <v-card-text class="pa-3">
                        <v-text-field
                            v-if="!name_edit.editing"
                            v-model="name"
                            solo
                            flat
                            hide-details
                            readonly
                            append-icon="mdi-pencil"
                            @click:append="editName()"
                        />
                        <v-text-field
                            v-else
                            v-model="name_edit.value"
                            solo
                            flat
                            hide-details
                            append-icon="mdi-close"
                            @click:append="name_edit.editing = false"
                        />
                    </v-card-text>
                    <v-card-actions v-if="name_edit.editing">
                        <v-spacer></v-spacer>
                        <v-btn color="primary">Guardar</v-btn>
                        <v-btn @click="name_edit.editing = false">Cancelar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <p class="secondary--text rounded-md ma-0 text-caption font-weight-bold">CRITERIOS</p>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="pt-0">
                <v-card>
                    <v-card-text class="pa-3">
                        <v-simple-table>
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th class="text-left">Descripción</th>
                                        <th class="text-left">Valor Total</th>
                                        <th class="text-left">Valor por actividad</th>
                                        <th class="text-left">Total de actividades</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="cr in criteria" :key="cr.name">
                                        <td>{{ cr.name }}</td>
                                        <td>{{ cr.value }}</td>
                                        <td>{{ (cr.value/cr.number).toFixed(2) }}</td>
                                        <td>{{ cr.number }}</td>
                                    </tr>
                                    <tr>
                                        <td>Nota Final</td>
                                        <td>100</td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'info',
    computed:{
        ...mapState({
            name: state => state.admin.info ? state.admin.info.name : null,
            criteria: state => state.admin.info ? state.admin.info.criteria : []
        })
    },
    data() {
        return {
            name_edit: {
                value: '',
                editing: false
            }
        }
    },
    methods: {
        editName(){
            this.name_edit.value = this.name
            this.name_edit.editing = true
        }
    },
}
</script>