// 这个模块主要获取的是品牌管理页面的数据
import request from "@/utils/request";

// 获取品牌管理列表
export const getTradeMarkList = (page, limit) =>
  request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: "get",
  });
