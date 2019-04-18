export default ({ store }) => {
  const user = localStorage.getItem('userid');
  store.commit('auth/setUser', user);
};
