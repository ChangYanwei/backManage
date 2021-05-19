import {request} from "./request";

export function loginRequest(loginData) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      username: loginData.username,
      password: loginData.password
    }
  })
}
