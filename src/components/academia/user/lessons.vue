<template>
    <div class="main-background mx-1">
        <v-row>
            <v-col v-if="lessons != null" cols="12" md="9" order-md="last" class="video" :class="{ 'd-flex': actual_video == null || !actual_video.hasOwnProperty('video_id') || actual_video.video_id == null}">
                <youtube 
                    ref="video"
                    class="border"
                    @paused="videoPaused"
                    @ended="videoEnded" 
                    :player-vars="{ modestbranding: 1, rel: 0, iv_load_policy: 3, showinfo: 0}" 
                    :width="actual_video == null || !actual_video.hasOwnProperty('video_id') || actual_video.video_id == null ? '0%' : '100%'"
                    :height="actual_video == null  || !actual_video.hasOwnProperty('video_id') || actual_video.video_id == null ? '0%' : '100%'"
                ></youtube>
                <div v-if="actual_video == null" class="ma-auto font-weight-bold blue-grey--text text-center">
                    <v-icon x-large class=" font-weight-bold blue-grey--text">mdi-format-list-checks</v-icon>
                    <p>Selecciona una clase</p>
                </div>
                <div v-else-if="actual_video.video_id == null" class="ma-auto font-weight-bold blue-grey--text text-center">
                    <v-icon x-large class=" font-weight-bold blue-grey--text">mdi-crop-landscape</v-icon>
                    <p>No existe video asignado</p>
                </div>
                <transition name="fade">
                    <v-btn fab dark x-large color="success" class="icon-completed" v-if="show_complete">
                        <v-icon dark>mdi-check</v-icon>
                    </v-btn>
                </transition>
            </v-col>
            <v-col v-if="lessons != null" class="h-100" cols="12" md="3">
                <v-card>
                    <v-card-text class="pa-1 menu-lessons">
                        <v-list nav>
                            <v-list-item dense>
                                <v-list-item-content class="academia-primary--text text-caption font-weight-bold">
                                    LISTA DE CLASES 
                                </v-list-item-content>
                                <div class="text-right d-flex">
                                    <v-menu
                                        v-model="menu_information"
                                    >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn
                                                icon
                                                v-bind="attrs"
                                                v-on="on"
                                            >
                                                <v-icon>mdi-information</v-icon>
                                            </v-btn>
                                        </template>

                                        <v-card class="rounded">
                                            <v-card-text>
                                                <v-row>
                                                    <v-col class="pb-0">
                                                        <p class="academia-primary--text ma-0 text-caption font-weight-bold">Iconos</p>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col>
                                                        <v-list-item dense>
                                                            <v-list-item-avatar color="academia-primary">
                                                                <v-icon class="white--text">mdi-laptop</v-icon>
                                                            </v-list-item-avatar>
                                                            <v-list-item-content>
                                                                <v-list-item-title>Clase virtual</v-list-item-title>
                                                            </v-list-item-content>
                                                        </v-list-item>
                                                    </v-col>
                                                    <v-col>
                                                        <v-list-item dense>
                                                            <v-list-item-avatar color="academia-primary">
                                                                <v-icon class="white--text">mdi-account-group</v-icon>
                                                            </v-list-item-avatar>
                                                            <v-list-item-content>
                                                                <v-list-item-title>Clase Prescencial</v-list-item-title>
                                                            </v-list-item-content>
                                                        </v-list-item>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col class="pb-0">
                                                        <p class="academia-primary--text ma-0 text-caption font-weight-bold">Vista de videos</p>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col>
                                                        <v-list-item dense>
                                                            <v-list-item-avatar color="blue-grey">
                                                                <v-icon class="white--text">mdi-laptop</v-icon>
                                                            </v-list-item-avatar>
                                                            <v-list-item-content>
                                                                <v-list-item-title>Clase no vista</v-list-item-title>
                                                            </v-list-item-content>
                                                        </v-list-item>
                                                    </v-col>
                                                    <v-col>
                                                        <v-list-item dense>
                                                            <v-list-item-avatar color="success">
                                                                <v-icon class="white--text">mdi-laptop</v-icon>
                                                            </v-list-item-avatar>
                                                            <v-list-item-content>
                                                                <v-list-item-title>Clase vista</v-list-item-title>
                                                            </v-list-item-content>
                                                        </v-list-item>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col>
                                                        <p class="academia-primary--text ma-0 text-caption font-weight-bold">Asistencias</p>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col class="py-1">
                                                        <v-list-item dense>
                                                            <v-icon color="blue-grey">mdi-checkbox-blank</v-icon>
                                                            <v-list-item-content>
                                                                <v-list-item-title class="ml-6">Sin valor</v-list-item-title>
                                                            </v-list-item-content>
                                                        </v-list-item>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col class="py-1">
                                                        <v-list-item dense>
                                                            <v-icon color="red">mdi-checkbox-blank</v-icon>
                                                            <v-list-item-content>
                                                                <v-list-item-title class="ml-6">Falta</v-list-item-title>
                                                            </v-list-item-content>
                                                        </v-list-item>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col class="py-1">
                                                        <v-list-item dense>
                                                            <v-icon color="warning">mdi-checkbox-blank</v-icon>
                                                            <v-list-item-content>
                                                                <v-list-item-title class="ml-6">Retardo</v-list-item-title>
                                                            </v-list-item-content>
                                                        </v-list-item>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col class="py-1">
                                                        <v-list-item dense>
                                                            <v-icon color="success">mdi-checkbox-blank</v-icon>
                                                            <v-list-item-content>
                                                                <v-list-item-title class="ml-6">Asistencia</v-list-item-title>
                                                            </v-list-item-content>
                                                        </v-list-item>
                                                    </v-col>
                                                </v-row>
                                            </v-card-text>
                                        </v-card>
                                    </v-menu>
                                </div>
                            </v-list-item>
                            <v-list-item-group v-model="selected" active-class="lesson-selected">
                                <v-list-item v-for="lesson in lessons" :key="lesson.name">
                                    <v-list-item-avatar :color="seens.find( l => l.id == lesson.id ).seens">
                                        <v-icon class="white--text" v-if="lesson.type === ONLINE">mdi-laptop</v-icon>
                                        <v-icon class="white--text" v-if="lesson.type === FACETOFACE">mdi-account-group</v-icon>
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-title>{{ lesson.name }}</v-list-item-title>
                                        <v-list-item-subtitle>{{ lesson.description }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-list-item-action>
                                        <v-btn icon v-if="lesson.type === FACETOFACE">
                                            <v-icon :color="completed.find( l => l.id == lesson.id ).completed">mdi-checkbox-blank</v-icon>
                                        </v-btn>
                                    </v-list-item-action>
                                </v-list-item>
                            </v-list-item-group>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col v-if="lessons == null" class="loading d-flex">
                <v-progress-circular
                    :size="60"
                    :width="7"
                    color="primary"
                    class="ma-auto"
                    indeterminate
                ></v-progress-circular>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { ATTENDANCE } from '../../../plugins/criteria-types'
import { ONLINE, FACETOFACE } from '../../../plugins/lessons-types'
export default {
    name: 'Lessons',
    computed:{
        ...mapState({ 
            lessons: state => state.student.lessons,
            seens(state){
                const lessons = state.student.lessons.map( lesson => ({ id: lesson.id, seens: 'blue-grey' }))
                const seens = state.student.lessons_seen
                if(seens != undefined){
                    lessons.forEach(lesson => {
                        const index = seens.findIndex( l => l === lesson.id )
                        if(index >= 0) 
                            lesson.seens = 'success'
                    })
                }
                return lessons
            },
            completed(state){
                const completed = state.student.lessons.map( lesson => ({ id: lesson.id, completed: 'blue-grey' }))
                const progress = state.student.group.progress[ATTENDANCE]
                if(progress != undefined){
                    completed.forEach(lesson => {
                        const index = progress.findIndex( p => p.id === lesson.id )
                        if(index >= 0) {
                            lesson.completed = 'success'
                            if(progress[index].out_of_time) lesson.completed = 'warning'
                            if(progress[index].no_attendance) lesson.completed = 'red'
                        }
                    });
                }
                return completed
            },
        })
    },
    data() {
        return {
            selected: null,
            actual_video: null,
            show_complete: false,
            menu_information: false,
            ONLINE, FACETOFACE
        }
    },
    methods: {
        ...mapActions({ 
            setCompleted: 'student/setCriteriaCompleted',
            getLessons: 'student/fetchLessons',
            setSeen: 'student/uploadSeenLesson'
        }),
        videoEnded(){
            this.setEnd()
        },
        async videoPaused(){
            const duration = await this.$refs.video.player.getDuration()
            const played = await this.$refs.video.player.getCurrentTime()
            if( duration - played < 30 ) this.setEnd()
        },
        async setEnd(){
            console.log('END')
            const is_seen = this.seens.find( l => l.id === this.actual_video.id )
            if(is_seen.seens !== 'success') {
                await this.setSeen(this.actual_video.id)
                this.show_complete = true
                setTimeout( () => this.show_complete = false, 3000)
            }
        }
    },
    watch:{
        actual_video(){
            if(this.actual_video === null) return
            if(this.actual_video.video_id)
                this.$refs.video.player.cueVideoById({
                    'videoId': this.actual_video.video_id,
                    'startSeconds': 0,
                    'suggestedQuality': 'large'
                })
        },
        selected(){
            this.$refs.video.player.pauseVideo()
            if(this.selected !== undefined)
                this.actual_video = this.lessons[this.selected]
            else{
                this.ready = false
                this.actual_video = null
            }  
        }
    },
    async mounted() {
        await this.getLessons()
    },
}
</script>

<style>
.menu-lessons{
    height:70vh;
    overflow-y: scroll;
    -ms-overflow-style: none; 
    scrollbar-width: none; 
}
.menu-lessons::-webkit-scrollbar {
    display: none;
}
.lesson-selected{
    background-color: var(--v-academia-primary-base) !important;
    color: white !important;
}
.lesson-selected > div > div {
    color: white !important;
}
.video{
    position: relative;
    min-height: 50vh;
    border-radius: 10px;
    overflow: hidden;
}
.hide-video{
    visibility: hidden;
}
iframe{
    border-radius: 15px;
}
.loading{
    min-height: 60vh;
}
.icon-completed{
    z-index: 1000;
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    top: 43%;
    text-align: center;
}
</style>