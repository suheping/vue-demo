
const state = {
  projId: 1,
  apiGroupId: '',
  apiId: ''
}

const mutations = {
  SET_PROJID: (state, projId) => {
    state.projId = projId
  },
  SET_APIGROUPID: (state, apiGroupId) => {
    state.apiGroupId = apiGroupId
  },
  SET_APIID: (state, apiId) => {
    state.apiId = apiId
  }
}

const actions = {
  changeProjId ({ commit }, data) {
    commit('SET_PROJID', data)
  },
  changeApiGroupId ({ commit }, data) {
    commit('SET_APIGROUPID', data)
  },
  changeApiId ({ commit }, data) {
    commit('SET_APIID', data)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
