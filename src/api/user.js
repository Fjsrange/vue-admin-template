// 引入axios（axios进行二次封装）
import request from "@/utils/request";

// 对外暴露登录函数
export function login(data) {
  return request({
    url: "/vue-admin-template/user/login",
    method: "post",
    data,
  });
}

// 对外暴露获取用户信息函数
export function getInfo(token) {
  return request({
    url: "/vue-admin-template/user/info",
    method: "get",
    params: { token },
  });
}

// 对外暴露推出登录的函数
export function logout() {
  return request({
    url: "/vue-admin-template/user/logout",
    method: "post",
  });
}
