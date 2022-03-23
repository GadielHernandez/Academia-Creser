<template>
    <div class="main-background mx-1">
        <v-row>
            <v-col v-if="lessons != null" cols="12" md="8" class="video-container">
                <div class="video" :class="{ 'not-video': actual_video == null || !actual_video.hasOwnProperty('video_id') || actual_video.video_id == null}">
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
                </div>
                <div v-if="actual_video" class="d-flex description">
                    <v-row class="my-auto">
                        <v-col cols="12" md="9" sm="8">
                            <v-list-item class="px-0">
                                <v-list-item-avatar color="primary rounded-lg" >
                                    <v-icon class="white--text" v-if="actual_video.type === ONLINE">mdi-laptop</v-icon>
                                    <v-icon class="white--text" v-if="actual_video.type === FACETOFACE">mdi-account-group</v-icon>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title class="text-h6">{{ actual_video.name }}</v-list-item-title>
                                    <v-list-item-subtitle>{{ actual_video.description }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-col>
                        <v-col class="text-left text-sm-right" cols="12" md="3" sm="4">
                            <p class="mb-1">
                                <v-chip label small color="secondary">
                                    {{ actual_video.type === ONLINE ? 'CLASE ONLINE': 'CLASE PRESCENCIAL' }}
                                </v-chip>
                            </p>
                            <p class="my-0 text-caption">
                                <v-chip label small color="success" v-if="actual_video.type === FACETOFACE && completed.find( l => l.id == actual_video.id ).completed === 'ATTENDANCE'">ASISTENCIA</v-chip>
                                <v-chip label small color="warning" v-if="actual_video.type === FACETOFACE && completed.find( l => l.id == actual_video.id ).completed === 'OUT_TIME'">RETARDO</v-chip>
                                <v-chip label small color="red" v-if="actual_video.type === FACETOFACE && completed.find( l => l.id == actual_video.id ).completed === 'NO_ATTENDANCE'">FALTA</v-chip>
                                <v-chip label small v-if="actual_video.type === FACETOFACE && completed.find( l => l.id == actual_video.id ).completed === undefined">PENDIENTE</v-chip>
                                <v-chip label small color="success" v-if="actual_video.type === ONLINE && seens.find( l => l.id == actual_video.id ).seen" > VISTA </v-chip>
                                <v-chip label small v-if="actual_video.type === ONLINE && !seens.find( l => l.id == actual_video.id ).seen" > NO VISTA </v-chip>
                            </p>
                        </v-col>
                    </v-row>
                </div>
            </v-col>
            <v-col v-if="lessons != null" class="h-100" cols="12" md="4">
                <v-card>
                    <v-card-text class="pa-1 menu-lessons">
                        <v-app-bar color="white" dense flat absolute class="primary--text font-weight-bold" >
                            Clases disponibles
                            <v-spacer></v-spacer>
                            <v-menu v-model="menu_information">
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
                                                <p class="primary--text ma-0 text-caption font-weight-bold">CLASES PRESCENCIALES</p>
                                                <v-divider></v-divider>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="6">
                                                <v-list-item dense>
                                                    <v-list-item-avatar color="primary" class="icon-lesson-border-undefined icon-lesson rounded-lg" tile>
                                                        <v-icon class="white--text">mdi-account-group</v-icon>
                                                    </v-list-item-avatar>
                                                    <v-list-item-content>
                                                        <v-list-item-title>Pendiente</v-list-item-title>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-list-item dense>
                                                    <v-list-item-avatar color="primary" class="icon-lesson-border-green icon-lesson rounded-lg" tile>
                                                        <v-icon class="white--text">mdi-account-group</v-icon>
                                                    </v-list-item-avatar>
                                                    <v-list-item-content>
                                                        <v-list-item-title>Asistencia</v-list-item-title>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-list-item dense>
                                                    <v-list-item-avatar color="primary" class="icon-lesson-border-yellow icon-lesson rounded-lg" tile>
                                                        <v-icon class="white--text">mdi-account-group</v-icon>
                                                    </v-list-item-avatar>
                                                    <v-list-item-content>
                                                        <v-list-item-title>Retardo</v-list-item-title>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-list-item dense>
                                                    <v-list-item-avatar color="primary" class="icon-lesson-border-red icon-lesson rounded-lg" tile>
                                                        <v-icon class="white--text">mdi-account-group</v-icon>
                                                    </v-list-item-avatar>
                                                    <v-list-item-content>
                                                        <v-list-item-title>Falta</v-list-item-title>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col class="pb-0">
                                                <p class="primary--text ma-0 text-caption font-weight-bold">CLASES VIRTUALES</p>
                                                <v-divider></v-divider>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                <v-list-item dense>
                                                    <v-list-item-avatar color="primary" class="icon-lesson-border-undefined icon-lesson rounded-lg" tile>
                                                        <v-icon class="white--text">mdi-laptop</v-icon>
                                                    </v-list-item-avatar>
                                                    <v-list-item-content>
                                                        <v-list-item-title>Clase no vista</v-list-item-title>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </v-col>
                                            <v-col>
                                                <v-list-item dense>
                                                    <v-list-item-avatar color="primary" class="icon-lesson-border-green icon-lesson rounded-lg" tile>
                                                        <v-icon class="white--text">mdi-laptop</v-icon>
                                                    </v-list-item-avatar>
                                                    <v-list-item-content>
                                                        <v-list-item-title>Clase vista</v-list-item-title>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-menu>
                        </v-app-bar>
                        <v-divider class="mt-10"></v-divider>
                        <v-list nav>
                            <v-list-item-group v-model="selected" active-class="lesson-selected">
                                <v-list-item v-for="lesson in lessons" :key="lesson.name">
                                    <v-list-item-avatar color="primary icon-lesson rounded-lg" tile>
                                        <v-icon class="white--text icon-lesson-border-undefined" :class="{ 'icon-lesson-border-green': seens.find( l => l.id == lesson.id ).seen }" v-if="lesson.type === ONLINE">mdi-laptop</v-icon>
                                        <v-icon class="white--text icon-lesson-border-undefined"
                                         :class="{
                                             'icon-lesson-border-green': completed.find( l => l.id == lesson.id ).completed === 'ATTENDANCE',
                                             'icon-lesson-border-yellow': completed.find( l => l.id == lesson.id ).completed === 'OUT_TIME',
                                             'icon-lesson-border-red': completed.find( l => l.id == lesson.id ).completed === 'NO_ATTENDANCE'
                                        }"
                                        v-if="lesson.type === FACETOFACE">mdi-account-group</v-icon>
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-title>{{ lesson.name }}</v-list-item-title>
                                        <v-list-item-subtitle>{{ lesson.description }}</v-list-item-subtitle>
                                    </v-list-item-content>
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
import { ATTENDANCE } from '../../plugins/criteria-types'
import { ONLINE, FACETOFACE } from '../../plugins/lessons-types'
export default {
    name: 'Lessons',
    computed:{
        ...mapState({ 
            lessons: state => state.student.lessons,
            seens(state){
                const lessons = state.student.lessons.map( lesson => ({ id: lesson.id, seen: false }))
                const seens = state.student.lessons_seen
                if(seens != undefined){
                    lessons.forEach(lesson => {
                        const index = seens.findIndex( l => l === lesson.id )
                        if(index >= 0) 
                            lesson.seen = true
                    })
                }
                return lessons
            },
            completed(state){
                const completed = state.student.lessons.map( lesson => ({ id: lesson.id, completed: undefined }))
                const progress = state.student.group.progress[ATTENDANCE]
                if(progress != undefined){
                    completed.forEach(lesson => {
                        const index = progress.findIndex( p => p.id === lesson.id )
                        if(index >= 0) {
                            lesson.completed = 'ATTENDANCE'
                            if(progress[index].out_of_time) lesson.completed = 'OUT_TIME'
                            if(progress[index].no_attendance) lesson.completed = 'NO_ATTENDANCE'
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
    height:90vh;
    overflow-y: scroll;
    -ms-overflow-style: none; 
    scrollbar-width: none; 
}
.menu-lessons::-webkit-scrollbar {
    display: none;
}
.lesson-selected{
    background-color: var(--v-primary-base) !important;
    color: white !important;
}
.lesson-selected > div > div {
    color: white !important;
}
.video-container{
    min-height: 90vh;
}
.video{
    position: relative;
    height: 75vh;
    border-radius: 10px;
    overflow: hidden;
}
.not-video{
    display: flex;
    border: 1px solid rgba(0,0,0,.12);
}
.description{
    min-height: 15vh;
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
.border-icon-leeson{
    border: 2px red solid;
}
.icon-lesson{
    overflow: visible;
}
.icon-lesson-border-undefined{
    outline: 5px solid #7878787a;
}
.icon-lesson-border-green{
    outline: 5px solid #1d9f22 !important;
}
.icon-lesson-border-yellow{
    outline: 5px solid var(--v-warning-base) !important;
}
.icon-lesson-border-red{
    outline: 5px solid var(--v-error-base) !important;
}
</style>