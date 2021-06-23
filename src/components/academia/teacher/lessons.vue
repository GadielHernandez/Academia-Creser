<template>
    <div class="main-background mx-1">
        <v-row>
            <v-col v-if="lessons != null" cols="12" md="9" order-md="last" class="video" :class="{ 'd-flex': !showVideo }">
                <youtube 
                    ref="video"
                    class="border"
                    :player-vars="{ modestbranding: 1, rel: 0, iv_load_policy: 3, showinfo: 0}" 
                    :width="!showVideo ? '0%' : '100%'"
                    :height="!showVideo ? '0%' : '100%'"
                ></youtube>
                <div v-if="actual_video == null" class="ma-auto font-weight-bold blue-grey--text text-center">
                    <v-icon x-large class="font-weight-bold blue-grey--text">mdi-format-list-checks</v-icon>
                    <p>Selecciona una clase</p>
                </div>
                <div v-else-if="actual_video.type === FACETOFACE && !attendances" class="ma-auto font-weight-bold blue-grey--text text-center">
                    <v-icon x-large class="font-weight-bold blue-grey--text">mdi-monitor-edit</v-icon>
                    <p>Para ver el video tome asistencia primero</p>
                </div>
                <div v-else-if="!actual_video.hasOwnProperty('video_id')" class="ma-auto font-weight-bold blue-grey--text text-center">
                    <v-icon x-large class="font-weight-bold blue-grey--text">mdi-crop-landscape</v-icon>
                    <p>No existe video asignado</p>
                </div>
            </v-col>
            <v-col v-if="lessons != null" class="h-100" cols="12" md="3">
                <v-card>
                    <v-card-text class="pa-1 menu-lessons">
                        <v-list nav>
                            <v-list-item dense>
                                <v-list-item-content class="secondary--text text-caption font-weight-bold">
                                    LISTA DE CLASES 
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item-group v-model="selected" active-class="lesson-selected">
                                <v-list-item v-for="lesson in lessons" :key="lesson.name">
                                    <v-list-item-avatar :color="'accent'">
                                        <v-icon class="white--text" v-if="lesson.type === FACETOFACE">mdi-account-group</v-icon>
                                        <v-icon class="white--text" v-else>mdi-laptop</v-icon>
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
import { ATTENDANCE } from '../../../plugins/criteria-types'
import { FACETOFACE } from '../../../plugins/lessons-types'
export default {
    name: 'Lessons',
    computed:{
        ...mapState({ 
            lessons: state => state.teacher.lessons,
            attendances(state) {
                const id = this.actual_video.id
                const attendances = state.teacher.course.progress
                if(!attendances[ATTENDANCE]) return false
                if(Object.prototype.hasOwnProperty.call(attendances[ATTENDANCE], id)) return true
                return false
            }
        }),
        showVideo(){
            if(this.actual_video == null) 
                return false
            if(!Object.prototype.hasOwnProperty.call(this.actual_video, 'video_id'))
                return false
            if(this.actual_video.type === this.FACETOFACE)
                return this.attendances
            return true
        }
    },
    data() {
        return {
            selected: null,
            actual_video: null,
            FACETOFACE
        }
    },
    methods: {
        ...mapActions({ getLessons: 'teacher/fetchLessons' })
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
    background-color: var(--v-primary-base);
    color: white !important;
}
.lesson-selected > div > div {
    color: white !important;
}
.video{
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
</style>