import { ajax } from './ajax'

export function login(data) {
  return ajax({
    url: '/api/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return ajax({
    url: '/api/user/info',
    method: 'get',
  })
}

export function logout() {
  return ajax({
    url: '/logout',
    method: 'post'
  })
}
