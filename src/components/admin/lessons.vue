<template>
    <div class="mx-1">
        <v-toolbar flat>
            <v-spacer></v-spacer>
            <v-btn color="primary" small @click.stop="addNew">
                Crear clase
            </v-btn>
        </v-toolbar>
        <v-row v-if="lessons != null">
            <v-col :class="{'empty': lessons.length === 0}">
                <v-list v-if="lessons.length > 0" >
                    <v-divider></v-divider>
                    <template v-for="(lesson, index) in lessons" >
                        <v-list-item
                            class="rounded-lg py-2"
                            :key="lesson.id"
                        >
                            <v-list-item-avatar color="primary" tile class="rounded-lg" dark>
                                <v-icon dark v-if="lesson.type === FACETOFACE">mdi-account-group</v-icon>
                                <v-icon dark v-if="lesson.type === ONLINE">mdi-laptop</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ lesson.name }}
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ lesson.description }}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-content>
                                <div class="d-flex">
                                    <v-tooltip top >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-chip 
                                                :color="lesson.video_id && 'secondary'" 
                                                class="ma-auto mr-1" 
                                                v-bind="attrs" 
                                                v-on="on"
                                            >
                                                <v-icon small>mdi-video</v-icon>
                                            </v-chip>
                                        </template>
                                        <span>{{lesson.video_id ? 'Video añadido' : 'Sin video'}}</span>
                                    </v-tooltip>
                                    <v-tooltip top >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-chip 
                                                color="secondary" 
                                                class="ma-auto ml-1" 
                                                v-bind="attrs" 
                                                v-on="on"
                                                
                                            >
                                                <span style="font-size: 12px; width: 20px"> {{ 
                                                    Number.isInteger(lesson.available_after / (( 1000 * 60 * 60 * 24 * 7 ))) 
                                                        ? lesson.available_after / (( 1000 * 60 * 60 * 24 * 7 )) 
                                                        : (lesson.available_after / (( 1000 * 60 * 60 * 24 * 7 ))).toFixed(1)
                                                }} </span>
                                                <v-icon small>mdi-calendar-start</v-icon>
                                            </v-chip>
                                        </template>
                                        <span>Semana de liberación</span>
                                    </v-tooltip>
                                </div>
                            </v-list-item-content>
                            <v-list-item-action class="d-none d-md-block">
                                <v-btn icon @click="edit(lesson.id)">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                        <v-divider :key="index"></v-divider>
                    </template>
                </v-list>
                <div
                    v-else
                    class="font-weight-bold blue-grey--text text-center"
                >
                    <v-icon
                        x-large
                        class="ma-auto font-weight-bold blue-grey--text"
                        >mdi-calendar-check-outline</v-icon
                    >
                    <p>No hay clases disponibles</p>
                </div>
            </v-col>
        </v-row>
        <v-dialog v-model="form_lesson.open" max-width="600px">
            <formLesson :lesson="form_lesson.lesson" @close="form_lesson.open = false"/>
        </v-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { FACETOFACE, ONLINE } from '../../plugins/lessons-types'
import formLesson from './lesson_form'
export default {
    name: 'lessons',
    computed: {
        ...mapState({
            lessons: (state) => state.admin.lessons,
        }),
    },
    components: { formLesson },
    data() {
        return {
            FACETOFACE,
            ONLINE,
            form_lesson: {
                lesson: null,
                open: false
            }
        }
    },
    methods: {
        addNew(){
            this.form_lesson.lesson = null
            this.form_lesson.open = true
        },
        edit(id){
            const lesson = this.lessons.find( l => l.id === id )
            this.form_lesson.lesson = lesson
            this.form_lesson.open = true
        }
    },
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