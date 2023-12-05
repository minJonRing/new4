import request from '@/utils/request'

export function ajax(option) {
  const { type } = option
  const _option = {
    method: type || 'get',
    responseType: 'json',
    ...option
  }
  const {
    method,
    data
  } = _option
  if (['get', 'delete'].includes(method)) {
    _option.params = data
  }

  return request(_option)
}
