import request from '@/utils/request'


export function getApiGroup (projid) {
  return request({
    url: 'http://127.0.0.1:8000/getApiGroup/' + projid + '/',
    method: 'get',
  })
}

export function updateApiGroup (projid, data) {
  return request({
    url: 'http://127.0.0.1:8000/updateApiGroup/' + projid + '/',
    method: 'post',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'  //如果写成contentType会报错
    },
    data: JSON.stringify(data)
  })
}

export function getApi (projid, apiGroupId) {
  return request({
    url: 'http://127.0.0.1:8000/getApi/' + projid + '/' + apiGroupId + '/',
    method: 'get',
  })
}

export function updateApis (data) {
  return request({
    url: 'http://127.0.0.1:8000/updateApi/',
    method: 'post',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'  //如果写成contentType会报错
    },
    data: JSON.stringify(data)
  })
}

export function addApi (data) {
  return request({
    url: 'http://127.0.0.1:8000/addApi/',
    method: 'post',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'  //如果写成contentType会报错
    },
    data: JSON.stringify(data)
  })
}