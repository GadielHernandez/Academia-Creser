<template>
    <div class="h-100">
        <v-row>
            <v-col class="h-100" cols="12" md="4">
                <v-card min-height="100%" class="d-flex">
                    <v-card-text class="ma-auto">
                        <p class="ml-3 primary--text font-weight-bold">
                            Información
                        </p>
                        <p class="ml-3 font-weight-bold text-h6"> 
                            Curso de discipulado
                        </p>
                        <p class="ml-3 ma-0">
                            <span>Inicio: </span> 30/1/2021
                        </p>
                        <p class="ml-3 ma-0">
                            <span>Fin: </span> 30/1/2021
                        </p>
                        <p class="ml-3 ma-0"> 
                            <span>Maestro: </span> Luis Ordonez
                        </p>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col class="h-100" cols="12" md="8">
                <v-card min-height="100%">
                    <v-card-text>
                        <v-row>
                            <v-col class="text-center mt-3 ma-md-0 pa-0 d-flex" cols="12" md="4">
                                <v-progress-circular
                                    :rotate="-90"
                                    :size="130"
                                    :width="18"
                                    :value="50"
                                    color="amber"
                                    class="ma-auto"
                                >
                                    <p class="ma-0 font-weight-black amber--text text-h5"> 50</p>
                                </v-progress-circular>
                            </v-col>
                            <v-col class="pa-0" cols="12" md="8">
                                <v-list-item dense>
                                    <v-list-item-avatar class="primary">
                                        <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                                    </v-list-item-avatar>

                                    <v-list-item-content>
                                        <v-list-item-title>Asistencias</v-list-item-title>
                                        <v-list-item-subtitle>25 obtenidas</v-list-item-subtitle>
                                    </v-list-item-content>

                                    <v-list-item-action>
                                        <p class="ma-0 font-weight-black primary--text text-h6"> 25 pts</p>
                                    </v-list-item-action>
                                </v-list-item>
                                <v-list-item dense>
                                    <v-list-item-avatar class="secondary">
                                        <v-icon dark>mdi-lead-pencil</v-icon>
                                    </v-list-item-avatar>

                                    <v-list-item-content>
                                        <v-list-item-title>Tareas</v-list-item-title>
                                        <v-list-item-subtitle>2 realizadas</v-list-item-subtitle>
                                    </v-list-item-content>

                                    <v-list-item-action>
                                        <p class="ma-0 font-weight-black secondary--text text-h6"> 25 pts</p>
                                    </v-list-item-action>
                                </v-list-item>
                                <v-list-item dense>
                                    <v-list-item-avatar class="tertiary">
                                        <v-icon dark>mdi-clipboard-text</v-icon>
                                    </v-list-item-avatar>

                                    <v-list-item-content>
                                        <v-list-item-title>Parciales</v-list-item-title>
                                        <v-list-item-subtitle>3 realizadas</v-list-item-subtitle>
                                    </v-list-item-content>

                                    <v-list-item-action>
                                        <p class="ma-0 font-weight-black tertiary--text text-h6"> 25 pts</p>
                                    </v-list-item-action>
                                </v-list-item>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card outlined>
                    <v-card-text>
                        <p class="ml-3 primary--text font-weight-bold">
                            Tabla de punteo
                        </p>
                        <v-simple-table fixed-header>
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
                                    <tr>
                                        <td>Asistencias</td>
                                        <td>30</td>
                                        <td>1.2</td>
                                        <td>25</td>
                                    </tr>
                                    <tr>
                                        <td>Tareas</td>
                                        <td>30</td>
                                        <td>1.8</td>
                                        <td>17</td>
                                    </tr>
                                    <tr>
                                        <td>Parciales</td>
                                        <td>40</td>
                                        <td>10</td>
                                        <td>4</td>
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
