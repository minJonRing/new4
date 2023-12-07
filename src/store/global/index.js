/**
 * 
 * ** areaAll {   定义的一个全局数据
 * 
 * **** initValue   数据的初始值
 * **** option      配置项
 * **** error       重复时提示的内容
 * 
 * ** }
 * }
 */
import {
  generateState,
  generateGetters
} from './fn'
// 字典名称

// 字典集合
export const store = {
  // 地区
  bookType: {
    initValue: [],
    option: {
      url: '/api/bookType',
      base: '',
      json: 'bookTypeJson'
    },
  },
  bookTypeJson: {
    type: 'get'
  }
}

// state getters
const state = generateState(store)
const getters = generateGetters(store)
// 导出
export {
  getters,
  state
}
