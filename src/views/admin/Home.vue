<template>
    <div class="Home px-4">
        <Navbar :height="'100px'">
            <template v-slot:title>
                <div>
                    <h2>Hola, {{profile.nickname}} &#x1F44B;</h2>
                    <p class="my-0 text--secondary text-caption">
                        Es un gusto verte de nuevo
                    </p>
                </div>
            </template>
        </Navbar>
        <infoPage v-if="loaded"/>
        <div v-else-if="!loaded" class="loading">
            <v-progress-circular
                :size="60"
                :width="7"
                color="primary"
                class="ma-auto"
                indeterminate
            ></v-progress-circular>
        </div>
        <div class="loading" v-else>
            <div class="ma-auto font-weight-bold blue-grey--text text-center">
                <v-icon x-large class="font-weight-bold blue-grey--text"
                    >mdi-account-group</v-icon
                >
                <p>Sin grupo asignado</p>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from '../../components/navigation/navbar.vue'
import { USER, atLeastUserIs } from '../../plugins/user-types'
import { mapState, mapActions } from 'vuex'
import infoPage from '../../components/admin/info.vue'
export default {
    name:'Academia',
    components: { infoPage, Navbar },
    computed:{
        ...mapState({
            profile: state => state.user.profile,
            info: state => state.admin.info,
            loaded: state => state.admin.info !== null
        })
    },
    data() {
        return {
            USER, atLeastUserIs
        }
    },
    methods: {
        ...mapActions({ 
            fetchCourse: 'admin/fetchCourse'
        }),
        async getData(){
            if(this.info)
                return
            
            await this.fetchCourse()
        }
    },
    watch: {
        loaded(){
            if(this.loaded)
                this.getData()
        }
    },
    mounted() {
        this.getData()
    },
}
</script>

<style scoped>
.Home{
    height: 100%;
}
.loading{
    height: 85vh;
    display: flex;
}
</style>
