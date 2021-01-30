<template>
    <div class="Academia px-4">
        <userAcademia />
    </div>
</template>

<script>
import userAcademia from '../components/academia/user_view'
export default {
    name:'Academia',
    components: { userAcademia }
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
</style>