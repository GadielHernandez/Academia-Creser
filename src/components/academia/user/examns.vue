<template>
    <div class="mx-1 main-background">
        <v-row>
            <v-col>
                <v-card class="my-1">
                    <v-card-text>
                        <v-simple-table>
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th class="text-left">Tarea</th>
                                        <th class="text-left">Descripcion</th>
                                        <th class="text-left">
                                            Fecha de entrega
                                        </th>
                                        <th class="text-left">Tiempo limite</th>
                                        <th class="text-left">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="task in tasks"
                                        :key="task.lesson"
                                        @click="dialog = true"
                                    >
                                        <td>{{ task.lesson }}</td>
                                        <td>{{ task.description }}</td>
                                        <td>
                                            {{ task.date.toLocaleString() }}
                                        </td>
                                        <td>{{ task.time }} minutos</td>
                                        <td class="font-weight-medium primary--text">{{ task.status }}</td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Titulo</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" >
                                <v-card outlined>
                                    <v-card-text>
                                        <p class="ma-0">¿Esto es una pregunta?</p>
                                        <v-textarea required auto-grow rows="1"></v-textarea>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" >
                                <v-card outlined>
                                    <v-card-text>
                                        <p class="ma-0">¿Esto es una pregunta?</p>
                                        <v-textarea required auto-grow rows="1"></v-textarea>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" >
                                <v-card outlined>
                                    <v-card-text>
                                        <p class="ma-0">¿Esto es una pregunta?</p>
                                        <v-textarea required auto-grow rows="1"></v-textarea>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" >
                                <v-card outlined>
                                    <v-card-text>
                                        <p class="ma-0">¿Esto es una pregunta?</p>
                                        <v-textarea required auto-grow rows="1"></v-textarea>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" >
                                <v-card outlined>
                                    <v-card-text>
                                        <p class="ma-0">¿Esto es una pregunta?</p>
                                        <v-textarea required auto-grow rows="1"></v-textarea>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" >
                                <v-card outlined>
                                    <v-card-text>
                                        <p class="ma-0">¿Esto es una pregunta?</p>
                                        <v-textarea required auto-grow rows="1"></v-textarea>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" @click="dialog = false"
                        >Close</v-btn
                    >
                    <v-btn color="primary" @click="dialog = false"
                        >Save</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: 'examns',
    data() {
        return {
            dialog: false,
            tasks: [
                {
                    lesson: 'Examen 1',
                    description: 'Something that describe the task',
                    date: new Date(),
                    time: 10,
                    status: 'PENDIENTE',
                },
                {
                    lesson: 'Examen 2',
                    description: 'Something that describe the task',
                    date: new Date(),
                    time: 10,
                    status: 'PENDIENTE',
                },
                {
                    lesson: 'Examen 3',
                    description: 'Something that describe the task',
                    date: new Date(),
                    time: 10,
                    status: 'PENDIENTE',
                },
                {
                    lesson: 'Examen 4',
                    description: 'Something that describe the task',
                    date: new Date(),
                    time: 10,
                    status: 'PENDIENTE',
                },
                {
                    lesson: 'Examen 5',
                    description: 'Something that describe the task',
                    date: new Date(),
                    time: 10,
                    status: 'PENDIENTE',
                },
            ],
        }
    },
}
</script>
