const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  projId: state => state.appium.projId,
  apiGroupId: state => state.appium.apiGroupId,
  apiId: state => state.appium.apiId,
  apiGroupName: state => state.appium.apiGroupName,
  apiList: state => state.appium.apiList,
  isApiCreate: state => state.appium.isApiCreate,
  isApiEdit: state => state.appium.isApiEdit,
  cApiData: state => state.appium.cApiData
}
export default getters
