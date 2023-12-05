import { state as globalState } from '../global/index'
const state = {
  ...globalState,
}
export default {
  namespaced: true,
  state,
}
