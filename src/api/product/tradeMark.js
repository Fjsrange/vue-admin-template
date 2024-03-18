// 这个模块主要获取的是品牌管理页面的数据
import request from "@/utils/request";

// 获取品牌管理列表
export const getTradeMarkList = (page, limit) =>
  request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: "get",
  });

// 添加或修改品牌
export const addOrUpdateTradeMark = (data) => {
  if (data.id) {
    // 编辑
    return request({
      url: "/admin/product/baseTrademark/update",
      data,
      method: "put",
    });
  } else {
    // 添加
    return request({
      url: "/admin/product/baseTrademark/save",
      data,
      method: "post",
    });
  }
};

// 上传图片

// 删除品牌
export const removeProduct = (id) =>
  request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: "delete",
  });
