<template>
    <v-card>
        <v-toolbar outlined flat>
            <span class="text-h6" v-if="lesson">Editar clase</span>
            <span class="text-h6" v-else> Nueva clase </span>

            <v-spacer></v-spacer>

            <v-btn icon @click="close">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card-text>
            <v-row>
                <v-col class="pb-0">
                    <p class="primary--text rounded-md ma-0 text-caption font-weight-bold">NOMBRE</p>
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
                <v-col class="pb-0">
                    <p class="primary--text rounded-md ma-0 text-caption font-weight-bold">DESCRIPCION</p>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field
                        v-model="description"
                        solo
                        outlined
                        flat
                        hide-details
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pb-0">
                    <p class="primary--text rounded-md ma-0 text-caption font-weight-bold">TIPO</p>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-select
                        v-model="type"
                        :items="[{
                            text: 'Online',
                            value: ONLINE
                        },{
                            text: 'Presencial',
                            value: FACETOFACE
                        }]"
                        solo
                        outlined
                        flat
                        hide-details
                    ></v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pb-0">
                    <p class="primary--text rounded-md ma-0 text-caption font-weight-bold">TIEMPO DE LIBERACION</p>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field
                        v-model="available_after"
                        type="number"
                        solo
                        outlined
                        flat
                        hide-details
                        suffix="dias"
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pb-0">
                    <p class="primary--text rounded-md ma-0 text-caption font-weight-bold">VIDEO</p>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card outlined class="px-2">
                        <v-row v-if="!video.editing">
                            <v-col>
                                <v-row>
                                    <v-col>
                                        <p class="mx-3 primary--text rounded-md ma-0 text-caption font-weight-bold">URL</p>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col class="pt-0">
                                        <p class="mx-3 ma-0 text-caption" v-if="video.url.length > 0"> {{ video.url }} </p>
                                        <p class="mx-3 ma-0 text-caption" v-else> SIN VIDEO </p>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <v-btn @click="editVideo" color="secondary" class="mx-3">Cambiar</v-btn>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-row v-else>
                            <v-col>
                                <v-row>
                                    <v-col>
                                        <v-text-field
                                            v-model="video.edit_url"
                                            solo
                                            outlined
                                            flat
                                            hide-details
                                        />
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col class="text-rigth">
                                        <v-btn v-if="!video.valid" @click="checkUrl" color="secondary" class="mx-3">Verificar</v-btn>
                                        <v-btn v-else @click="closeEditVideo(true)" color="success"  class="mx-3">Guardar</v-btn>
                                        <v-btn @click="closeEditVideo(false)" class="mx-3">Cancelar</v-btn>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-btn @click="saveChanges" color="primary" block>
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
import { FACETOFACE, ONLINE } from '../../../plugins/lessons-types'
import { mapActions, mapState } from 'vuex'
export default {
    name: 'LessonForm',
    props: ['lesson'],
    computed: {
        ...mapState({
            lessons: (state) => state.admin.lessons,
        }),
    },
    data() {
        return {
            name: '',
            description: '',
            type: '',
            available_after: null,
            video_id: null,
            video:{
                url: '',
                editing: false,
                edit_url: '',
                valid: false,
                id: ''
            },
            FACETOFACE, ONLINE
        }
    },
    methods: {
        ...mapActions({ 
            update: 'admin/updateLesson',
            add: 'admin/addLesson'
        }),
        async saveChanges(){
            if(this.lesson)
                await this.update({
                    id: this.lesson.id,
                    name: this.name,
                    description: this.description,
                    type: this.type,
                    available_after: this.available_after * ( 1000 * 60 * 60 * 24 ),
                    video_id: this.video_id
                })
            else
                await this.add({
                    name: this.name,
                    description: this.description,
                    type: this.type,
                    available_after: this.available_after * ( 1000 * 60 * 60 * 24 ),
                    video_id: this.video_id
                })
            this.close()
        },
        setLesson(){
            this.name = this.lesson.name
            this.description = this.lesson.description
            this.type = this.lesson.type
            this.available_after = this.lesson.available_after / ( 1000 * 60 * 60 * 24 )
            if(this.lesson.video_id){
                this.video_id = this.lesson.video_id
                this.video.url = `https://www.youtube.com/watch?v=${this.lesson.video_id}`
            }
        },
        editVideo(){
            this.video.edit_url = this.video.url
            this.video.editing = true
        },
        checkUrl(){
            const id = this.$youtube.getIdFromUrl(this.video.edit_url)
            if(id){
                this.video.edit_url = `https://www.youtube.com/watch?v=${id}`
                this.video.valid = true
                this.video.id = id
            }
            
        },
        closeEditVideo(save){
            if(save){
                this.video_id = this.video.id
                this.video.url = `https://www.youtube.com/watch?v=${this.video_id}`
            } 
            this.video.edit_url = ''
            this.video.editing = false
            this.video.valid = false
            this.video.id = ''
        },
        close(){
            this.reset()
            this.$emit('close')
        },
        reset(){
            this.name = '',
            this.description = '',
            this.type = '',
            this.available_after = null,
            this.video_id = null
            this.video.url = ''
        }
    },
    watch: {
        lesson(){
            if(this.lesson)
                this.setLesson()
            else
                this.reset()
        },
    },
    mounted() {
        this.setLesson()
    },
}
</script>