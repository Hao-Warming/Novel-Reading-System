const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // token: state => state.user.token,
  // avatar: state => state.user.avatar,
  // name: state => state.user.name,
  user: state => state.user.user,
  userList: state => state.user.userList,
  messageList: state => state.user.messageList,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
}
export default getters
