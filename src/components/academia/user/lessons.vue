<template>
    <div class="main-background mx-1">
        <v-row>
            <v-col cols="12" md="9" order-md="last" class="video" :class="{ 'd-flex': actual_video == null || !actual_video.hasOwnProperty('video_id') }">
                <youtube 
                    ref="video"
                    class="border"
                    @paused="videoPaused"
                    @ended="videoEnded" 
                    :player-vars="{ modestbranding: 1, rel: 0, iv_load_policy: 3, showinfo: 0}" 
                    :width="actual_video == null || !actual_video.hasOwnProperty('video_id') ? '0%' : '100%'"
                    :height="actual_video == null  || !actual_video.hasOwnProperty('video_id') ? '0%' : '100%'"
                ></youtube>
                <div v-if="actual_video == null" class="ma-auto font-weight-bold blue-grey--text text-center">
                    <v-icon x-large class=" font-weight-bold blue-grey--text">mdi-format-list-checks</v-icon>
                    <p>Selecciona una clase</p>
                </div>
                <div v-else-if="!actual_video.hasOwnProperty('video_id')" class="ma-auto font-weight-bold blue-grey--text text-center">
                    <v-icon x-large class=" font-weight-bold blue-grey--text">mdi-crop-landscape</v-icon>
                    <p>No existe video asignado</p>
                </div>
            </v-col>
            <v-col class="h-100" cols="12" md="3">
                <v-card>
                    <v-card-text class="pa-1 menu-lessons">
                        <v-list nav>
                            <v-list-item dense>
                                <v-list-item-content class="primary--text text-caption font-weight-bold">
                                    LISTA DE CLASES 
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item-group v-model="selected" active-class="lesson-selected">
                                <v-list-item v-for="lesson in lessons" :key="lesson.name">
                                    <v-list-item-avatar :color="completed.find( l => l.id == lesson.id ).completed ? 'success' : 'primary'">
                                        <v-icon class="white--text">mdi-clipboard-text</v-icon>
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
        </v-row>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { ATTENDANCE } from '../../../plugins/criteria-types'
import { ONLINE } from '../../../plugins/lessons-types'
export default {
    name: 'Lessons',
    computed:{
        ...mapState({ 
            lessons: state => state.student.lessons,
            completed: state => {
                const completed = state.student.lessons.map( lesson => ({ id: lesson.id, completed: false }))
                const progress = state.student.group.progress[ATTENDANCE]
                if(progress != undefined){
                    completed.forEach(lesson => {
                        const index = progress.findIndex( p => p.id === lesson.id )
                        if(index >= 0) lesson.completed = true
                    });
                }
                return completed
            } 
        })
    },
    data() {
        return {
            selected: null,
            actual_video: null
        }
    },
    methods: {
        ...mapActions({ setCompleted: 'student/seCriteriaCompleted' }),
        videoEnded(){
            this.setEnd()
        },
        async videoPaused(){
            const duration = await this.$refs.video.player.getDuration()
            const played = await this.$refs.video.player.getCurrentTime()
            if( duration - played < 30 ) this.setEnd()
        },
        async setEnd(){
            const status = this.completed.find( c => c.id === this.actual_video.id )
            if(status.completed) return
            if(this.actual_video.type !== ONLINE) return
            console.log('END')
            await this.setCompleted({
                id: this.actual_video.id,
                criteria: ATTENDANCE
            })
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
    }
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