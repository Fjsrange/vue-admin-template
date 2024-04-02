import request from "@/utils/request";

// 获取sku列表
export const skuList = (page, limit) =>
  request({
    url: `/admin/product/list/${page}/${limit}`,
    method: "get",
  });

// 上架
export const onSale = (skuId) =>
  request({
    url: `/admin/product/onSale/${skuId}`,
    method: "get",
  });

// 下架
export const onCancel = (skuId) =>
  request({
    url: `/admin/product/cancelSale/${skuId}`,
    method: "get",
  });

// sku详情
export const getSkuById = (skuId) =>
  request({
    url: `/admin/product/getSkuById/${skuId}`,
    method: "get",
  });
