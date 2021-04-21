<template>
    <div>
        <adminView v-if="isAdmin"/>
        <userView v-else/>
    </div>
</template>

<script>
import userView from '../components/home/user_view'
import adminView from '../components/home/admin_view'
import { ADMIN } from '../plugins/user-types'
import { mapState } from 'vuex'

export default {
    name: 'Home',
    components: { userView, adminView },
    computed:{
        ...mapState({
            isAdmin: state => state.user.profile.level ? 
                state.user.profile.level === ADMIN :
                false
        })
    }
    
}
</script>

<style scoped>
.home{
    height: 100%;
    width: 100%;
}
</style>
