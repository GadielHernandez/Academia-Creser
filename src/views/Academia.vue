<template>
    <div class="Academia px-4" :class="{ 'loading': !loaded, 'd-flex': !loaded }">
        <userAcademia v-if="loaded"/>
        <v-progress-circular
            v-else
            :size="60"
            :width="7"
            color="primary"
            class="ma-auto"
            indeterminate
        ></v-progress-circular>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import userAcademia from '../components/academia/user_view'
export default {
    name:'Academia',
    components: { userAcademia },
    computed:{
        ...mapState({
            loaded: state => state.academia.loaded,
            courses: state => state.user.courses
        })
    },
    methods: {
        ...mapActions({ fetchCourses: 'academia/fetchCourses' })
    },
    watch:{
        courses(){
            if(this.courses !== null) this.fetchCourses()
        }
    }
}
</script>

<style scoped>
.Academia{
    height: 100%;
}
.v-tabs{
    border-bottom: 1px solid var(--v-background-darken1) !important;
}
.v-tab{
    text-transform: none !important;
}
.loading{
    height: 85vh;
}
</style>