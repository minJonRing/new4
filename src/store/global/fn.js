import { ajax } from '@/api/ajax';
import { fnArrFlat, fnArrToJson } from 'tqr'
import { isArray } from 'lodash'
const ajaxOver = {}

// 字典名称
export const zdName = 'zd'

// 获取字典的方法
export const getZd = (state, attr, option = {}) => {
  const _option = {
    base: '/zd',
    key: 'value',
    value: 'code',
    children: 'children',
    ...option
  }
  const {
    base,
    url,
    json
  } = _option
  let param = state[zdName][attr];
  if (!ajaxOver[attr]) {
    ajax({
      url: `${base}${url}`,
    }).then(({
      data
    }) => {
      const { list } = data;

      if (isArray(list) && list.length) {
        const _list = fnArrFlat(list, _option)
        state[zdName][attr] = _list;
        json ? state[zdName][json] = fnArrToJson(_list) : {}
      } else {
        const list = [{
          value: null,
          label: '数据加载失败，请联系管理员'
        }]
        state[zdName][attr] = list
      }
      ajaxOver[attr] = true

    }).catch(() => { })
  }
  return param
}
// 生成state
export const generateState = (store) => {
  const states = {}
  const keys = Object.keys(store)
  for (const i in keys) {
    const key = keys[i]
    const {
      initValue,
      type
    } = store[key]
    if (type === 'get') {
      states[key] = {}
    } else {
      states[key] = initValue
    }
  }
  return states
}

// 生成getters
export const generateGetters = (store) => {
  const getters = {}
  const keys = Object.keys(store)
  for (const i in keys) {
    const key = keys[i]
    const {
      option,
      type
    } = store[key]
    if (type === 'get') {
      getters[key] = state => state[zdName][key]
    } else {
      getters[key] = state => getZd(state, key, option)
    }
  }
  return getters
}
