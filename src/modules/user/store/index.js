
import { generateState, generateGetters } from './fn'
// 字典名称

// 字典集合
export const store = {
  // 专家专业类别
  doemZd: {
    initValue: [],
    option: {
      url: '/expertProfessional',
    },
  },
}

// state getters
const state = generateState(store)
const getters = generateGetters(store)

// 导出
export {
  getters,
  state
}
