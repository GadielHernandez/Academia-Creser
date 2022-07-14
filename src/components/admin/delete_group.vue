<template>
    <div>
        <v-dialog v-model="open" max-width="600px">
            <v-card v-if="groupToDelete">
                <v-card-title>Eliminar grupo</v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pa-4">
                    ¿Estas seguro que quieres eliminar a
                    {{ groupToDelete.name }}
                    del grupo?, toda su informacion en el grupo sera eliminada.
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        color="primary"
                        @click="closeDeleteConfirmation"
                    >
                        Cancelar
                    </v-btn>
                    <v-btn color="primary" @click="doDeleteGroup">
                        Eliminar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="messages.open" :timeout="2000">
            {{ messages.text }}
        </v-snackbar>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    name: 'adminDeleteGroup',
    props: ['group'],
    data() {
        return {
            groupToDelete: null,
            open: false,
            messages: {
                open: false,
                text: null
            }
        }
    },
    methods: {
        ...mapActions({
            deleteGroup: 'admin/deleteGroup'
        }),
        openDeleteConfirmation(){
            this.open = true
        },
        closeDeleteConfirmation(){
            this.groupToDelete = null
            this.open = false
            this.$emit('close')
        },
        async doDeleteGroup(){
            try {
                await this.deleteGroup(this.groupToDelete)
                this.closeDeleteConfirmation()
                this.messages.text = 'Grupo eliminado'
                this.messages.open = true
            } catch (error) {
                this.closeDeleteConfirmation()
                this.messages.text = error.error
                this.messages.open = true
            }
        },
    },
    watch: {
        group(){
            if(this.group){
                this.groupToDelete = this.group
                this.openDeleteConfirmation()
            }
        }
    },
}
</script>