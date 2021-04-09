<template>
    <div class="mx-1">
        <v-row>
            <v-col class="text-right">
                <v-btn 
                    color="primary"
                     @click.stop="addNew">
                    Añadir
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card>
                    <v-simple-table>
                        <template v-slot:default>
                            <tbody>
                                <tr v-for="l in lessons" :key="l.id">
                                    <v-list-item>
                                        <v-list-item-icon>
                                            <v-icon v-if="l.type === FACETOFACE" color="primary">mdi-account-group</v-icon>
                                            <v-icon v-if="l.type === ONLINE" color="primary">mdi-laptop</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>{{ l.name }}</v-list-item-title>
                                            <v-list-item-subtitle>{{ l.description }}</v-list-item-subtitle>
                                        </v-list-item-content>
                                        <v-list-item-content>
                                            <p class="ma-auto text-caption">
                                                <v-chip small label color="primary" class="mr-1">{{ l.available_after / (( 1000 * 60 * 60 * 24 )) }} dias</v-chip>
                                                <v-chip small label v-if="l.video_id" color="primary">Video</v-chip>
                                                <v-chip small label v-else color="primary" outlined>Sin video</v-chip>
                                            </p>
                                        </v-list-item-content>
                                        <v-list-item-action>
                                            <v-btn icon @click="edit(l.id)">
                                                <v-icon color="primary">mdi-pencil</v-icon>
                                            </v-btn>
                                        </v-list-item-action>
                                    </v-list-item>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="form_lesson.open" max-width="600px">
            <formLesson :lesson="form_lesson.lesson" @close="form_lesson.open = false"/>
        </v-dialog>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { FACETOFACE, ONLINE } from '../../../plugins/lessons-types'
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
        ...mapActions({
            getLessons: 'admin/fetchLessons',
        }),
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
    mounted() {
        this.getLessons()
    },
}
</script>
