import request from "@/utils/request";

// 获取图片列表
export const spuImgList = (spuId) =>
  request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: "get",
  });

// 获取销售属性
export const saleAttrList = (spuId) =>
  request({
    url: `/admin/product/spuSaleAttrList/${spuId}`,
    method: "get",
  });

// 获取平台属性接口
export const attrInfoList = (category1Id, category2Id, category3Id) =>
  request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: "get",
  });

// 保存
export const saveSpuInfo = (data) =>
  request({
    url: "/admin/product/saveSpuInfo",
    data,
    method: "post",
  });
