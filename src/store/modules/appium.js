const state = {
  projId: 1,
  apiGroupId: 1,
  apiGroupName: '',
  apiId: '',
  apiList: '',
  isApiCreate: '',
  cApiData: ''
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
  },
  SET_APIGROUPNAME: (state, apiGroupName) => {
    state.apiGroupName = apiGroupName
  },
  SET_APILIST: (state, apiList) => {
    state.apiList = apiList
  },
  SET_ISAPICREATE: (state, isApiCreate) => {
    state.isApiCreate = isApiCreate
  },
  SET_CAPIDATA: (state, cApiData) => {
    state.cApiData = cApiData
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
  changeApiGroupName ({ commit }, data) {
    commit('SET_APIGROUPNAME', data)
  },
  changeApiList ({ commit }, data) {
    commit('SET_APILIST', data)
  },
  changeIsApiCreate ({ commit }, data) {
    commit('SET_ISAPICREATE', data)
  },
  changeCApiData ({ commit }, data) {
    commit('SET_CAPIDATA', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
