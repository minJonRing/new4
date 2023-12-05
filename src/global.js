import store from './store'

const global = {
  loading: false
}
Object.defineProperty(global, 'loading', {
  set: function (value) {
    store.dispatch('app/setLoading', value)
  },
  get: function () {
    return store.getters.loading
  }
})

export default global