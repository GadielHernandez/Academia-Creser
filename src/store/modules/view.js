import { goTo, INITAL_ROUTES } from '../../plugins/router-helpers'

const state = {
    actual: null,
    navbar: {
        title: null,
        subtitle: null
    }
}

const getters = {}

const actions = {
    updateView({ commit }, level){
        return new Promise((resolve) => {
            commit('SET_USER_VIEW', level)
            goTo(INITAL_ROUTES[level])
            return resolve()
        })
    }
}

const mutations = {
    SET_USER_VIEW(state, payload){
        state.actual = payload
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}