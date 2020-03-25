import request from '@/utils/request'

export function getApiGroup () {
  return request({
    url: 'http://127.0.0.1:8000/getApiGroup/',
    method: 'get',
  })
}
